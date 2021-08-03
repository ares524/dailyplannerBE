const { GraphQLList, GraphQLID, GraphQLString } = require("graphql");
const { ThoughtType } = require("../schema/types");
const Thoughts = require("../models/thought");
const getUserId = require("../utils/getUserId");

module.exports = {
  journals: {
    type: new GraphQLList(ThoughtType),
    args: {},
    async resolve(_, args, req) {
      const userId = getUserId(req);
      const thoughts = await Thoughts.find({ userId }).sort({ createdAt: -1 });
      return thoughts;
    },
  },
};
