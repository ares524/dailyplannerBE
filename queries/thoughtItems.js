const { GraphQLID, GraphQLList } = require("graphql");
const { ThoughtItemType } = require("../schema/types");
const ThoughtItem = require("../models/thoughtitem");
const getUserId = require("../utils/getUserId");

module.exports = {
  thoughtItems: {
    type: new GraphQLList(ThoughtItemType),
    args: {
      thoughtId: { type: GraphQLID },
    },
    async resolve(_, args, req) {
      const userId = getUserId(req);
      return ThoughtItem.find({ thoughtId: args.thoughtId, userId });
    },
  },
  thoughtItem: {
    type: ThoughtItemType,
    args: {
      id: { type: GraphQLID },
    },
    async resolve(_, args, req) {
      const userId = getUserId(req);
      const thoughtItem = await ThoughtItem.findById(args.id);
      if (!thoughtItem) {
        return {
          error: "Not Found!",
        };
      } else {
        if (String(thoughtItem.userId) !== String(userId)) {
          return {
            error: "Not yours!",
          };
        } else {
          return thoughtItem;
        }
      }
    },
  },
};
