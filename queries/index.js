const qraphql = require("graphql");
const UserQueries = require("./users");
const DayQueries = require("./days");
const TodoQueries = require("./todos");
const TodoItemQueries = require("./todoItems");
const ExpenseQueries = require("./expenses");
const JournalQueries = require("./journals");
const ThoughtQueries = require("./thoughts");
const ThoughtItemQueries = require("./thoughtItems");
const FoodQueries = require("./foods");
const FoodItemQueries = require("./foodItems");
const { GraphQLObjectType } = qraphql;

module.exports = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    ...UserQueries,
    ...DayQueries,
    ...TodoQueries,
    ...TodoItemQueries,
    ...ExpenseQueries,
    ...JournalQueries,
    ...ThoughtQueries,
    ...ThoughtItemQueries,
    ...FoodQueries,
    ...FoodItemQueries,
  },
});
