const { GraphQLID } = require("graphql");
const { TodoType } = require("../schema/types");
const Todo = require("../models/todo");
const getUserId = require("../utils/getUserId");

module.exports = {
  todo: {
    type: TodoType,
    args: {
      id: { type: GraphQLID },
    },
    async resolve(_, args, req) {
      const userId = getUserId(req);
      const todo = await Todo.findById(args.id);
      if (!todo) {
        return {
          error: "Not Found!",
        };
      } else {
        if (String(todo.userId) !== String(userId)) {
          return {
            error: "Not yours!",
          };
        } else {
          return todo;
        }
      }
    },
  },
};
