const { GraphQLList, GraphQLID, GraphQLString } = require("graphql");
const { ExpenseType } = require("../schema/types");
const Expense = require("../models/expense");
const getUserId = require("../utils/getUserId");

module.exports = {
  expenses: {
    type: new GraphQLList(ExpenseType),
    args: {},
    async resolve(_, args, req) {
      const userId = getUserId(req);
      return Expense.find({ userId }).sort({ createdAt: -1 });
    },
  },
};
