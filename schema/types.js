const qraphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLScalarType,
  GraphQLList,
  GraphQLBoolean,
  GraphQLFloat,
} = qraphql;

const Todo = require("../models/todo");
const TodoItem = require("../models/todoItem");
const Thought = require("../models/thought");
const ThoughtItem = require("../models/thoughtitem");
const Food = require("../models/food");
const FoodItem = require("../models/foodItem");

const DateScalarType = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  parseValue(value) {
    return new Date(value); // value from the client
  },
  serialize(value) {
    return value.getTime(); // value sent to the client
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return parseInt(ast.value, 10); // ast value is always in string format
    }
    return null;
  },
});

const ReadingType = new GraphQLObjectType({
  name: "ReadingType",
  fields: () => ({
    title: { type: GraphQLString },
    start: { type: GraphQLInt },
    end: { type: GraphQLInt },
  }),
});

const AccountabilityType = new GraphQLObjectType({
  name: "AccountabilityType",
  fields: () => ({
    done: { type: GraphQLString },
    todo: { type: GraphQLString },
  }),
});

const UserType = new GraphQLObjectType({
  name: "UserType",
  fields: () => ({
    _id: { type: GraphQLString },
    email: { type: GraphQLString },
    role: { type: GraphQLString },
  }),
});

const TodoItemActionType = new GraphQLObjectType({
  name: "TodoItemActionType",
  fields: () => ({
    _id: { type: GraphQLString },
    text: { type: GraphQLString },
    completed: { type: GraphQLBoolean },
  }),
});

const TodoItemType = new GraphQLObjectType({
  name: "TodoItemType",
  fields: () => ({
    _id: { type: GraphQLString },
    title: { type: GraphQLString },
    actions: { type: new GraphQLList(TodoItemActionType) },
    completed: { type: GraphQLBoolean },
  }),
});

const TodoType = new GraphQLObjectType({
  name: "TodoType",
  fields: () => ({
    _id: { type: GraphQLString },
    userId: { type: GraphQLString },
    sheetId: { type: GraphQLString },
    items: {
      type: new GraphQLList(TodoItemType),
      resolve(parent, _) {
        return TodoItem.find({ todoId: parent._id });
      },
    },
    type: { type: GraphQLString },
    startTime: { type: GraphQLString },
    endTime: { type: GraphQLString },
  }),
});

const TodosType = new GraphQLObjectType({
  name: "TodosType",
  fields: () => ({
    today: {
      type: TodoType,
      resolve(parent, _) {
        return Todo.findById(parent.today);
      },
    },
    tomorrow: {
      type: TodoType,
      resolve(parent, _) {
        return Todo.findById(parent.tomorrow);
      },
    },
    work: {
      type: TodoType,
      resolve(parent, _) {
        return Todo.findById(parent.work);
      },
    },
    art: {
      type: TodoType,
      resolve(parent, _) {
        return Todo.findById(parent.art);
      },
    },
  }),
});

const ThoughtItemActionType = new GraphQLObjectType({
  name: "ThoughtItemActionType",
  fields: () => ({
    _id: { type: GraphQLString },
    text: { type: GraphQLString },
    completed: { type: GraphQLBoolean },
  }),
});

const ThoughtItemType = new GraphQLObjectType({
  name: "ThoughtItemType",
  fields: () => ({
    _id: { type: GraphQLString },
    title: { type: GraphQLString },
    actions: { type: new GraphQLList(ThoughtItemActionType) },
    completed: { type: GraphQLBoolean },
  }),
});

const ThoughtType = new GraphQLObjectType({
  name: "ThoughtType",
  fields: () => ({
    _id: { type: GraphQLString },
    userId: { type: GraphQLString },
    sheetId: { type: GraphQLString },
    items: {
      type: new GraphQLList(ThoughtItemType),
      resolve(parent, _) {
        return ThoughtItem.find({ thoughtId: parent._id });
      },
    },
    type: { type: GraphQLString },
    startTime: { type: GraphQLString },
    endTime: { type: GraphQLString },
  }),
});

const ThoughtsType = new GraphQLObjectType({
  name: "ThoughtsType",
  fields: () => ({
    today: {
      type: ThoughtType,
      resolve(parent, _) {
        return Thought.findById(parent.today);
      },
    },
    tomorrow: {
      type: ThoughtType,
      resolve(parent, _) {
        return Thought.findById(parent.tomorrow);
      },
    },
    work: {
      type: ThoughtType,
      resolve(parent, _) {
        return Thought.findById(parent.work);
      },
    },
    art: {
      type: ThoughtType,
      resolve(parent, _) {
        return Thought.findById(parent.art);
      },
    },
  }),
});

const SheetType = new GraphQLObjectType({
  name: "SheetType",
  fields: () => ({
    _id: { type: GraphQLID },
    userId: { type: GraphQLID },
    day: { type: GraphQLString },
    gratefulFor: { type: GraphQLString },
    affirmation: { type: GraphQLString },
    callSos: { type: GraphQLString },
    research: { type: GraphQLString },
    reading: { type: ReadingType },
    accountability: { type: AccountabilityType },
    awake: { type: GraphQLString },
    asleep: { type: GraphQLString },
    todos: { type: TodosType },
  }),
});

const ExpenseType = new GraphQLObjectType({
  name: "ExpenseType",
  fields: () => ({
    _id: { type: GraphQLID },
    userId: { type: GraphQLID },
    amount: { type: GraphQLFloat },
    description: { type: GraphQLString },
    type: { type: GraphQLString },
    createdDate: { type: DateScalarType },
  }),
});

// const JournalType = new GraphQLObjectType({
//   name: "JournalType",
//   fields: () => ({
//     _id: { type: GraphQLString },
//     userId: { type: GraphQLString },
//     items: {
//       type: new GraphQLList(ThoughtItemType),
//       resolve(parent, _) {
//         return ThoughtItem.find({ thoughtId: parent._id });
//       },
//     },
//     type: { type: GraphQLString },
//     startTime: { type: GraphQLString },
//     endTime: { type: GraphQLString },
//   }),
// });

const DeleteResponseType = new GraphQLObjectType({
  name: "DeleteResponseType",
  fields: () => ({
    result: { type: GraphQLBoolean },
  }),
});

// const FoodItemActionType = new GraphQLObjectType({
//   name: "FoodItemActionType",
//   fields: () => ({
//     _id: { type: GraphQLString },
//     derivationDescription: { type: GraphQLString },
//     nutrientName: { type: GraphQLString },
//     unitName: { type: GraphQLString },
//     value: { type: GraphQLFloat },
//     completed: { type: GraphQLBoolean },
//   }),
// });

// const FoodItemType = new GraphQLObjectType({
//   name: "FoodItemType",
//   fields: () => ({
//     _id: { type: GraphQLString },
//     foodCategory: { type: GraphQLString },
//     description: { type: GraphQLString },
//     ingredients: { type: GraphQLString },
//     actions: { type: new GraphQLList(FoodItemActionType) },
//     completed: { type: GraphQLBoolean },
//   }),
// });

// const FoodType = new GraphQLObjectType({
//   name: "FoodType",
//   fields: () => ({
//     _id: { type: GraphQLString },
//     userId: { type: GraphQLString },
//     items: {
//       type: new GraphQLList(FoodItemType),
//       resolve(parent, _) {
//         return FoodItem.find({ foodId: parent._id });
//       },
//     },
//     type: { type: GraphQLString },
//     day: { type: GraphQLString },
//     startTime: { type: GraphQLString },
//     endTime: { type: GraphQLString },
//   }),
// });

// const FoodsType = new GraphQLObjectType({
//   name: "FoodsType",
//   fields: () => ({
//     breakfast: {
//       type: FoodType,
//       resolve(parent, _) {
//         return Food.findById(parent.breakfast);
//       },
//     },
//     dinner: {
//       type: FoodType,
//       resolve(parent, _) {
//         return Food.findById(parent.dinner);
//       },
//     },
//     lunch: {
//       type: FoodType,
//       resolve(parent, _) {
//         return Food.findById(parent.lunch);
//       },
//     },
//     snack: {
//       type: FoodType,
//       resolve(parent, _) {
//         return Food.findById(parent.snack);
//       },
//     },
//   }),
// });

const FoodType = new GraphQLObjectType({
  name: "FoodType",
  fields: () => ({
    _id: { type: GraphQLString },
    userId: { type: GraphQLString },
    foodCategory: { type: GraphQLString },
    description: { type: GraphQLString },
    foodNutrients: {
      type: new GraphQLList(FoodNutritionType),
    },
    completed: { type: GraphQLBoolean },
    type: { type: GraphQLString },
    day: { type: GraphQLString },
    startTime: { type: GraphQLString },
    endTime: { type: GraphQLString },
  }),
});

const FoodNutritionType = new GraphQLObjectType({
  name: "FoodNutritionType",
  fields: () => ({
    nutrientName: { type: GraphQLString },
    unitName: { type: GraphQLString },
    value: { type: GraphQLFloat },
  }),
});

module.exports = {
  ReadingType,
  SheetType,
  UserType,
  DateScalarType,
  TodoType,
  TodoItemType,
  TodoItemActionType,
  ThoughtType,
  ThoughtItemType,
  ThoughtItemActionType,
  ExpenseType,
  DeleteResponseType,
  FoodType,
  FoodNutritionType,
  // FoodItemType,
  // FoodItemActionType,
  // JournalType,
};
