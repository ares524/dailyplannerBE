const qraphql = require("graphql");
const getUserId = require("../utils/getUserId");

const {
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLBoolean,
  GraphQLInputObjectType,
} = qraphql;

const Day = require("../models/day");
const Thought = require("../models/thought");
const ThoughtItem = require("../models/thoughtitem");
const {
  ThoughtType,
  ThoughtItemType,
  ThoughtItemActionType,
  DeleteResponseType,
} = require("../schema/types");

const ThoughtActionInputType = new GraphQLInputObjectType({
  name: "ThoughtActionInputType",
  fields: () => ({
    _id: { type: GraphQLString },
    text: { type: GraphQLString },
    completed: { type: GraphQLBoolean },
  }),
});

module.exports = {
  createThoughtItem: {
    type: ThoughtType,
    args: {
      id: { type: GraphQLID },
      title: { type: GraphQLString },
      actions: { type: new GraphQLList(ThoughtActionInputType) },
      type: { type: GraphQLString },
    },

    async resolve(_, args, req) {
      try {
        const { id, type, title, actions } = args;
        const userId = getUserId(req);
        let thought;
        if (id) {
          /* Add a new thought_item to an existing thought of a daily sheet */
          thought = await Thought.findById(id);
          if (!thought) {
            return {
              error: "Not Found",
            };
          }
          if (String(thought.userId) !== String(userId)) {
            return {
              error: "Not yours",
            };
          }
          const thoughtItem = {
            thoughtId: id,
            title,
            actions: actions.map((action) => ({
              text: action.text,
              completed: action.completed,
            })),
            completed:
              actions.length && !actions.some((action) => !action.completed),
            createdAt: new Date(),
          };
          const newThoughtItem = new ThoughtItem(thoughtItem);
          const newThoughtItemRes = await newThoughtItem.save();
          thought.items.push(newThoughtItemRes._id);
          return await thought.save();
        } else {
          /* Create thought block for the daily sheet then add a new thought_item */
          /* Create thought block for the daily sheet */
          thought = {
            userId,
            type,
            items: [],
            createdAt: new Date(),
          };
          const newThought = new Thought(thought);
          const thoughtResult = await newThought.save();
          // const sheet = await Day.findById(sheetId);
          // sheet.thoughts = sheet.thoughts || {};
          // sheet.thoughts[type] = thoughtResult._id;
          // await sheet.save();
          /* Create thought_item and add it to the thoughts block */
          const thoughtItem = {
            thoughtId: thoughtResult._id,
            title,
            actions: actions.map((action) => ({
              text: action.text,
              completed: action.completed,
            })),
            completed:
              actions.length && !actions.some((action) => !action.completed),
            createdAt: new Date(),
          };
          const newThoughtItem = new ThoughtItem(thoughtItem);
          const newThoughtItemRes = await newThoughtItem.save();
          await Thought.updateOne(
            { _id: thoughtResult._id },
            { $push: { items: newThoughtItemRes._id } }
          );
          return await Thought.findById(thoughtResult._id);
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
  updateThoughtItem: {
    type: ThoughtItemType,
    args: {
      id: { type: GraphQLID },
      title: { type: GraphQLString },
      actions: { type: new GraphQLList(ThoughtActionInputType) },
    },

    async resolve(_, args, req) {
      try {
        const { id, ...data } = args;
        let thoughtItem = await ThoughtItem.findById(id);
        if (!thoughtItem) {
          return {
            error: "Not Found!",
          };
        }
        const thoughtItemDetails = {
          title: data.title,
          actions: data.actions.map((action) => ({
            text: action.text,
            completed: action.completed,
          })),
          completed:
            data.actions.length &&
            !data.actions.some((action) => !action.completed),
        };
        await ThoughtItem.updateOne({ _id: id }, { $set: thoughtItemDetails });
        return await ThoughtItem.findById(id);
      } catch (e) {
        console.log(e);
      }
    },
  },
  deleteThoughtItem: {
    type: DeleteResponseType,
    args: {
      id: { type: GraphQLID },
    },

    async resolve(_, args, req) {
      try {
        const { id } = args;
        let thoughtItem = await ThoughtItem.findById(id);
        if (!thoughtItem) {
          return {
            error: "Not Found!",
          };
        }
        await ThoughtItem.findOneAndDelete({ _id: id });
        await Thought.updateOne(
          { _id: thoughtItem.thoughtId },
          { $pull: { items: { _id: id } } }
        );
        await Thought.findOneAndDelete({ _id: thoughtItem.thoughtId });
        return {
          result: true,
        };
      } catch (e) {
        console.log(e);
      }
    },
  },
  toggleThoughtItemCompleted: {
    type: DeleteResponseType,
    args: {
      id: { type: GraphQLID },
    },

    async resolve(_, args, req) {
      try {
        const { id } = args;
        let thoughtItem = await ThoughtItem.findById(id);
        if (!thoughtItem) {
          return {
            error: "Not Found!",
          };
        }
        await ThoughtItem.updateOne(
          { _id: id },
          { $set: { completed: !thoughtItem.completed } }
        );
        return {
          result: true,
        };
      } catch (e) {
        console.log(e);
      }
    },
  },
};
