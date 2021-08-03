const qraphql = require("graphql");
const getUserId = require("../utils/getUserId");

const { GraphQLString, GraphQLID } = qraphql;

const Todo = require("../models/todo");
const { TodoType } = require("../schema/types");

module.exports = {
  updateTodoOptions: {
    /** startTime, endTime */ type: TodoType,
    args: {
      id: { type: GraphQLID },
      startTime: { type: GraphQLString },
      endTime: { type: GraphQLString },
    },

    async resolve(_, args, req) {
      try {
        const { id, ...data } = args;
        const userId = getUserId(req);
        let todo = await Todo.findById(id);
        if (!todo) {
          return {
            error: "Not Found!",
          };
        }
        if (String(todo.userId) !== String(userId)) {
          return {
            error: "Not yours",
          };
        }
        await Todo.updateOne({ _id: id }, { $set: { ...data } });
        return await Todo.findById(id);
      } catch (e) {
        console.log(e);
      }
    },
  },
};
