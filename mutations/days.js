const qraphql = require("graphql");
const getUserId = require("../utils/getUserId");
const { DateScalarType } = require("../schema/types");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInputObjectType,
} = qraphql;

const Day = require("../models/day");

const AddOrderResponseType = new GraphQLObjectType({
  name: "AddOrderResponseType",
  fields: () => ({
    userId: { type: GraphQLID },
    gratefulFor: { type: GraphQLString },
    createdAt: {
      type: DateScalarType,
    },
  }),
});

const UpdateSheetResponseType = new GraphQLObjectType({
  name: "UpdateSheetResponseType",
  fields: () => ({
    id: { type: GraphQLID },
    userId: { type: GraphQLID },
    day: { type: GraphQLString },
    gratefulFor: { type: GraphQLString },
    createdAt: {
      type: DateScalarType,
    },
  }),
});

const CheckOrCreateResponseType = new GraphQLObjectType({
  name: "CheckOrCreateResponseType",
  fields: () => ({
    id: { type: GraphQLID },
  }),
});

const ReadingInputType = new GraphQLInputObjectType({
  name: "ReadingInputType",
  fields: () => ({
    title: { type: GraphQLString },
    start: { type: GraphQLInt },
    end: { type: GraphQLInt },
  }),
});

const AccountabilityInputType = new GraphQLInputObjectType({
  name: "AccountabilityInputType",
  fields: () => ({
    done: { type: GraphQLString },
    todo: { type: GraphQLString },
  }),
});

module.exports = {
  addDay: {
    type: AddOrderResponseType,
    args: {
      gratefulFor: { type: GraphQLString },
    },

    async resolve(_, args) {
      try {
        const { gratefulFor } = args;
        const userId = getUserId(req);
        const now = new Date();
        const day = {
          userId,
          gratefulFor,
          createdAt: now,
        };

        const newDay = new Day(day);
        await newDay.save();

        return day;
      } catch (e) {
        console.log(e);
      }
    },
  },
  updateSheet: {
    type: UpdateSheetResponseType,
    args: {
      id: { type: GraphQLID },
      gratefulFor: { type: GraphQLString },
      affirmation: { type: GraphQLString },
      callSos: { type: GraphQLString },
      research: { type: GraphQLString },
      reading: { type: ReadingInputType },
      accountability: { type: AccountabilityInputType },
      awake: { type: GraphQLString },
      asleep: { type: GraphQLString },
    },

    async resolve(_, args, req) {
      try {
        const { id, ...data } = args;
        const userId = getUserId(req);
        const sheet = await Day.findById(id);
        if (!sheet) {
          return {
            error: "Not Found",
          };
        }
        if (String(sheet.userId) !== String(userId)) {
          return {
            error: "Not Yours!",
          };
        }
        const result = await Day.updateOne({ _id: id }, { $set: { ...data } });
        return {
          id: result.nModified ? id : null,
        };
      } catch (e) {
        console.log(e);
      }
    },
  },
  checkOrCreateSheet: {
    type: CheckOrCreateResponseType,
    args: {
      day: { type: GraphQLString },
    },
    async resolve(_, args, req) {
      try {
        const { day } = args;
        const userId = getUserId(req);
        const existingSheet = await Day.findOne({ userId, day });
        if (existingSheet) {
          return {
            id: existingSheet._id,
          };
        } else {
          const now = new Date();
          const sheet = {
            userId,
            day,
            createdAt: now,
          };
          const newSheet = new Day(sheet);
          const result = await newSheet.save();
          return {
            id: result._id,
          };
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
};
