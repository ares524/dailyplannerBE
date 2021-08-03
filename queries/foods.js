const { GraphQLList, GraphQLID, GraphQLString } = require("graphql");
const { FoodType } = require("../schema/types");
const Food = require("../models/food");
const getUserId = require("../utils/getUserId");

module.exports = {
  food: {
    type: FoodType,
    args: {
      id: { type: GraphQLID },
    },
    async resolve(_, args, req) {
      const userId = getUserId(req);
      const food = await Food.findById(args.id);
      if (!food) {
        return {
          error: "Not Found!",
        };
      } else {
        if (String(food.userId) !== String(userId)) {
          return {
            error: "Not yours!",
          };
        } else {
          return food;
        }
      }
    },
  },

  meals: {
    type: new GraphQLList(FoodType),
    args: {},
    async resolve(_, args, req) {
      const userId = getUserId(req);
      const meals = await Food.find({ userId });
      return meals;
    },
    // type: FoodType,
    // args: {
    //   id: { type: GraphQLID },
    // },
    // async resolve(_, args, req) {
    //   console.log(args.id);
    //   const userId = getUserId(req);
    //   const meals = await Food.find();
    //   console.log(meals);
    //   // const meals = await Food.findById(args.id);
    //   if (!meals) {
    //     return {
    //       error: "Not Found!",
    //     };
    //   } else {
    //     if (String(meals.userId) !== String(userId)) {
    //       return {
    //         error: "Not yours!",
    //       };
    //     } else {
    //       return meals;
    //     }
    //   }
    // },
  },
};
