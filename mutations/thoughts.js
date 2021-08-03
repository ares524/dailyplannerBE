const qraphql = require("graphql");
const getUserId = require("../utils/getUserId");

const { GraphQLString, GraphQLID } = qraphql;

const Thought = require("../models/thought");
const { ThoughtType } = require("../schema/types");

module.exports = {
  updateThoughtOptions: {
    /** startTime, endTime */ type: ThoughtType,
    args: {
      id: { type: GraphQLID },
      startTime: { type: GraphQLString },
      endTime: { type: GraphQLString },
    },

    async resolve(_, args, req) {
      try {
        const { id, ...data } = args;
        const userId = getUserId(req);
        let thought = await Thought.findById(id);
        if (!thought) {
          return {
            error: "Not Found!",
          };
        }
        if (String(thought.userId) !== String(userId)) {
          return {
            error: "Not yours",
          };
        }
        await Thought.updateOne({ _id: id }, { $set: { ...data } });
        return await Thought.findById(id);
      } catch (e) {
        console.log(e);
      }
    },
  },
  getAllThoughts: {
    type: ThoughtType,
    args: {
      id: { type: GraphQLID },
    },

    async resolve(_, args, req) {
      try {
        const { id } = args;
        const userId = getUserId(req);
        let thoughts = await Thought.find({ userId: userId }).sort({
          createdAt: -1,
        });
        if (!thoughts) {
          return {
            error: "Not Found!",
          };
        }
        return thoughts;
      } catch (e) {
        console.log(e);
      }
    },
  },
};
