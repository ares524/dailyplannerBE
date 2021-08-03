const qraphql = require("graphql");
const getUserId = require("../utils/getUserId");

const {
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLBoolean,
  GraphQLInputObjectType,
} = qraphql;

const Day = require("../models/day");
const Todo = require("../models/todo");
const TodoItem = require("../models/todoItem");
const {
  TodoType,
  TodoItemType,
  TodoItemActionType,
  DeleteResponseType,
} = require("../schema/types");

const TodoActionInputType = new GraphQLInputObjectType({
  name: "TodoActionInputType",
  fields: () => ({
    _id: { type: GraphQLString },
    text: { type: GraphQLString },
    completed: { type: GraphQLBoolean },
  }),
});

module.exports = {
  createTodoItem: {
    type: TodoType,
    args: {
      id: { type: GraphQLID },
      sheetId: { type: GraphQLID },
      title: { type: GraphQLString },
      actions: { type: new GraphQLList(TodoActionInputType) },
      type: { type: GraphQLString },
    },

    async resolve(_, args, req) {
      try {
        const { id, sheetId, type, title, actions } = args;
        const userId = getUserId(req);
        let todo;
        if (id) {
          /* Add a new todo_item to an existing todo of a daily sheet */
          todo = await Todo.findById(id);
          if (!todo) {
            return {
              error: "Not Found",
            };
          }
          if (String(todo.userId) !== String(userId)) {
            return {
              error: "Not yours",
            };
          }
          const todoItem = {
            todoId: id,
            title,
            actions: actions.map((action) => ({
              text: action.text,
              completed: action.completed,
            })),
            completed:
              actions.length && !actions.some((action) => !action.completed),
            createdAt: new Date(),
          };
          const newTodoItem = new TodoItem(todoItem);
          const newTodoItemRes = await newTodoItem.save();
          todo.items.push(newTodoItemRes._id);
          return await todo.save();
        } else {
          /* Create Todo block for the daily sheet then add a new todo_item */
          /* Create Todo block for the daily sheet */
          todo = {
            userId,
            sheetId,
            type,
            items: [],
            createdAt: new Date(),
          };
          const newTodo = new Todo(todo);
          const todoResult = await newTodo.save();
          const sheet = await Day.findById(sheetId);
          sheet.todos = sheet.todos || {};
          sheet.todos[type] = todoResult._id;
          await sheet.save();
          /* Create todo_item and add it to the todos block */
          const todoItem = {
            todoId: todoResult._id,
            title,
            actions: actions.map((action) => ({
              text: action.text,
              completed: action.completed,
            })),
            completed:
              actions.length && !actions.some((action) => !action.completed),
            createdAt: new Date(),
          };
          const newTodoItem = new TodoItem(todoItem);
          const newTodoItemRes = await newTodoItem.save();
          await Todo.updateOne(
            { _id: todoResult._id },
            { $push: { items: newTodoItemRes._id } }
          );
          return await Todo.findById(todoResult._id);
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
  updateTodoItem: {
    type: TodoItemType,
    args: {
      id: { type: GraphQLID },
      title: { type: GraphQLString },
      actions: { type: new GraphQLList(TodoActionInputType) },
    },

    async resolve(_, args, req) {
      try {
        const { id, ...data } = args;
        let todoItem = await TodoItem.findById(id);
        if (!todoItem) {
          return {
            error: "Not Found!",
          };
        }
        const todoItemDetails = {
          title: data.title,
          actions: data.actions.map((action) => ({
            text: action.text,
            completed: action.completed,
          })),
          completed:
            data.actions.length &&
            !data.actions.some((action) => !action.completed),
        };
        await TodoItem.updateOne({ _id: id }, { $set: todoItemDetails });
        return await TodoItem.findById(id);
      } catch (e) {
        console.log(e);
      }
    },
  },
  deleteTodoItem: {
    type: DeleteResponseType,
    args: {
      id: { type: GraphQLID },
    },

    async resolve(_, args, req) {
      try {
        const { id } = args;
        let todoItem = await TodoItem.findById(id);
        if (!todoItem) {
          return {
            error: "Not Found!",
          };
        }
        await TodoItem.findOneAndDelete({ _id: id });
        await Todo.updateOne(
          { _id: todoItem.todoId },
          { $pull: { items: { _id: id } } }
        );
        return {
          result: true,
        };
      } catch (e) {
        console.log(e);
      }
    },
  },
  toggleTodoItemCompleted: {
    type: DeleteResponseType,
    args: {
      id: { type: GraphQLID },
    },

    async resolve(_, args, req) {
      try {
        const { id } = args;
        let todoItem = await TodoItem.findById(id);
        if (!todoItem) {
          return {
            error: "Not Found!",
          };
        }
        await TodoItem.updateOne(
          { _id: id },
          { $set: { completed: !todoItem.completed } }
        );
        return {
          result: true,
        };
      } catch (e) {
        console.log(e);
      }
    },
  },
};
