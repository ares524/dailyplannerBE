const { GraphQLID, GraphQLList } = require("graphql");
const { TodoItemType } = require("../schema/types");
const TodoItem = require("../models/todoItem");
const getUserId = require("../utils/getUserId");

module.exports = {
  todoItems: {
    type: new GraphQLList(TodoItemType),
    args: {
      todoId: { type: GraphQLID },
    },
    async resolve(_, args, req) {
      const userId = getUserId(req);
      return TodoItem.find({ todoId: args.todoId, userId });
    },
  },
  todoItem: {
    type: TodoItemType,
    args: {
      id: { type: GraphQLID },
    },
    async resolve(_, args, req) {
      const userId = getUserId(req);
      const todoItem = await TodoItem.findById(args.id);
      if (!todoItem) {
        return {
          error: "Not Found!",
        };
      } else {
        if (String(todoItem.userId) !== String(userId)) {
          return {
            error: "Not yours!",
          };
        } else {
          return todoItem;
        }
      }
    },
  },
};
