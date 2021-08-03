const qraphql = require("graphql");
const getUserId = require("../utils/getUserId");

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
  GraphQLFloat,
} = qraphql;

const Expense = require("../models/expense");
const { ExpenseType } = require("../schema/types");

const DeleteExpenseResponseType = new GraphQLObjectType({
  name: "DeleteExpenseResponseType",
  fields: () => ({
    result: { type: GraphQLBoolean },
  }),
});

module.exports = {
  createExpense: {
    type: ExpenseType,
    args: {
      amount: { type: GraphQLFloat },
      description: { type: GraphQLString },
      type: { type: GraphQLString },
    },
    async resolve(_, args, req) {
      try {
        const { amount, description, type } = args;
        const userId = getUserId(req);
        const expense = {
          amount,
          description,
          type,
          userId,
          createdAt: new Date(),
        };
        const newExpense = new Expense(expense);
        const newExpenseRes = await newExpense.save();
        return await Expense.findById(newExpenseRes._id);
      } catch (e) {
        console.log(e);
      }
    },
  },
  updateExpense: {
    type: ExpenseType,
    args: {
      id: { type: GraphQLID },
      amount: { type: GraphQLFloat },
      description: { type: GraphQLString },
    },
    async resolve(_, args, req) {
      try {
        const { id, ...data } = args;
        const userId = getUserId(req);
        const expense = await Expense.findById(id);
        if (!expense) {
          console.log("errro 1");
          return {
            error: "Not Found!",
          };
        }
        if (String(expense.userId) !== String(userId)) {
          console.log("errro 2");
          return {
            error: "Not yours",
          };
        }
        await Expense.updateOne({ _id: id }, { $set: { ...data } });
        return await Expense.findById(expense._id);
      } catch (e) {
        console.log(e);
      }
    },
  },
  deleteExpense: {
    type: DeleteExpenseResponseType,
    args: {
      id: { type: GraphQLID },
    },

    async resolve(_, args, req) {
      try {
        const { id } = args;
        const userId = getUserId(req);
        let expense = await Expense.findById(id);
        if (!expense) {
          return {
            error: "Not Found!",
          };
        }
        if (String(expense.userId) !== String(userId)) {
          return {
            error: "Not yours",
          };
        }
        await Expense.findByIdAndRemove(id);
        return {
          result: true,
        };
      } catch (e) {
        console.log(e);
      }
    },
  },
};
