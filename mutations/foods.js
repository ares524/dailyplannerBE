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

const Food = require("../models/food");
const { FoodType } = require("../schema/types");

const DeleteFoodResponseType = new GraphQLObjectType({
  name: "DeleteFoodResponseType",
  fields: () => ({
    result: { type: GraphQLBoolean },
  }),
});

const FoodActionInputType = new GraphQLInputObjectType({
  name: "FoodActionInputType",
  fields: () => ({
    nutrientName: { type: GraphQLString },
    unitName: { type: GraphQLString },
    value: { type: GraphQLFloat },
  }),
});

module.exports = {
  createFood: {
    type: FoodType,
    args: {
      foodCategory: { type: GraphQLString },
      description: { type: GraphQLString },
      foodNutrients: {
        type: new GraphQLList(FoodActionInputType),
      },
      type: { type: GraphQLString },
      day: { type: GraphQLString },
      startTime: { type: GraphQLString },
      endTime: { type: GraphQLString },
    },
    async resolve(_, args, req) {
      try {
        const { foodCategory, description, foodNutrients, type, day } = args;
        const userId = getUserId(req);
        const food = {
          foodCategory,
          description,
          type,
          userId,
          foodNutrients,
          day,
          completed: false,
          createdAt: new Date(),
        };
        const newFood = new Food(food);
        const newFoodRes = await newFood.save();
        return await Food.findById(newFoodRes._id);
        // return await Food.find();
      } catch (e) {
        console.log(e);
      }
    },
  },
  deleteFood: {
    type: DeleteFoodResponseType,
    args: {
      id: { type: GraphQLID },
    },

    async resolve(_, args, req) {
      try {
        const { id } = args;
        const userId = getUserId(req);
        let food = await Food.findById(id);
        if (!food) {
          return {
            error: "Not Found!",
          };
        }
        if (String(food.userId) !== String(userId)) {
          return {
            error: "Not yours",
          };
        }
        await Food.findByIdAndRemove(id);
        return {
          result: true,
        };
      } catch (e) {
        console.log(e);
      }
    },
  },
  updateFood: {
    type: DeleteFoodResponseType,
    args: {
      id: { type: GraphQLID },
    },

    async resolve(_, args, req) {
      try {
        const { id } = args;
        const userId = getUserId(req);
        let food = await Food.findById(id);
        if (!food) {
          return {
            error: "Not Found!",
          };
        }
        if (String(food.userId) !== String(userId)) {
          return {
            error: "Not yours",
          };
        }
        await Food.updateOne(
          { _id: id },
          { $set: { completed: !food.completed } }
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

// const qraphql = require("graphql");
// const getUserId = require("../utils/getUserId");

// const { GraphQLString, GraphQLID } = qraphql;

// const Food = require("../models/food");
// const { FoodType } = require("../schema/types");

// module.exports = {
//   updateFoodOptions: {
//     /** startTime, endTime */ type: FoodType,
//     args: {
//       id: { type: GraphQLID },
//       startTime: { type: GraphQLString },
//       endTime: { type: GraphQLString },
//     },

//     async resolve(_, args, req) {
//       try {
//         const { id, ...data } = args;
//         const userId = getUserId(req);
//         let food = await Food.findById(id);
//         if (!food) {
//           return {
//             error: "Not Found!",
//           };
//         }
//         if (String(food.userId) !== String(userId)) {
//           return {
//             error: "Not yours",
//           };
//         }
//         await Food.updateOne({ _id: id }, { $set: { ...data } });
//         return await Food.findById(id);
//       } catch (e) {
//         console.log(e);
//       }
//     },
//   },
//   getAllFoods: {
//     type: FoodType,
//     args: {
//       id: { type: GraphQLID },
//     },

//     async resolve(_, args, req) {
//       try {
//         const { id } = args;
//         const userId = getUserId(req);
//         let foods = await Food.find({ userId: userId }).sort({
//           createdAt: -1,
//         });
//         if (!foods) {
//           return {
//             error: "Not Found!",
//           };
//         }
//         return foods;
//       } catch (e) {
//         console.log(e);
//       }
//     },
//   },
// };
