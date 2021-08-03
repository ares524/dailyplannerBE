const { GraphQLID } = require("graphql");
const { ThoughtType } = require("../schema/types");
const Thought = require("../models/thought");
const getUserId = require("../utils/getUserId");

module.exports = {
  thought: {
    type: ThoughtType,
    args: {
      id: { type: GraphQLID },
    },
    async resolve(_, args, req) {
      const userId = getUserId(req);
      const thought = await Thought.findById(args.id);
      if (!thought) {
        return {
          error: "Not Found!",
        };
      } else {
        if (String(thought.userId) !== String(userId)) {
          return {
            error: "Not yours!",
          };
        } else {
          return thought;
        }
      }
    },
  },
};
