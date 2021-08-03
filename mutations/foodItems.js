// const qraphql = require("graphql");
// const getUserId = require("../utils/getUserId");

// const {
//   GraphQLString,
//   GraphQLID,
//   GraphQLList,
//   GraphQLBoolean,
//   GraphQLInputObjectType,
//   GraphQLFloat,
// } = qraphql;

// const Day = require("../models/day");
// const Food = require("../models/food");
// const FoodItem = require("../models/foodItem");
// const {
//   FoodType,
//   FoodItemType,
//   FoodItemActionType,
//   DeleteResponseType,
// } = require("../schema/types");

// const FoodActionInputType = new GraphQLInputObjectType({
//   name: "FoodActionInputType",
//   fields: () => ({
//     _id: { type: GraphQLString },
//     derivationDescription: { type: GraphQLString },
//     nutrientName: { type: GraphQLString },
//     unitName: { type: GraphQLString },
//     value: { type: GraphQLFloat },
//     completed: { type: GraphQLBoolean },
//   }),
// });

// module.exports = {
//   createFoodItem: {
//     type: FoodType,
//     args: {
//       id: { type: GraphQLID },
//       foodCategory: { type: GraphQLString },
//       description: { type: GraphQLString },
//       actions: { type: new GraphQLList(FoodActionInputType) },
//       type: { type: GraphQLString },
//     },

//     async resolve(_, args, req) {
//       try {
//         const { id, foodCategory, type, description, actions } = args;
//         const userId = getUserId(req);
//         let food;
//         if (id) {
//           /* Add a new food_item to an existing food of a daily sheet */
//           food = await Food.findById(id);
//           if (!food) {
//             return {
//               error: "Not Found",
//             };
//           }
//           if (String(food.userId) !== String(userId)) {
//             return {
//               error: "Not yours",
//             };
//           }
//           const foodItem = {
//             foodId: id,
//             foodCategory,
//             description,
//             actions: actions.map((action) => ({
//               derivationDescription: action.derivationDescription,
//               nutrientName: action.nutrientName,
//               unitName: action.unitName,
//               value: action.value,
//               completed: action.completed,
//             })),
//             completed:
//               actions.length && !actions.some((action) => !action.completed),
//             createdAt: new Date(),
//           };
//           const newFoodItem = new FoodItem(foodItem);
//           const newFoodItemRes = await newFoodItem.save();
//           food.items.push(newFoodItemRes._id);
//           return await food.save();
//         } else {
//           /* Create Food block for the daily sheet then add a new food_item */
//           /* Create Food block for the daily sheet */
//           food = {
//             userId,
//             type,
//             day,
//             items: [],
//             createdAt: new Date(),
//           };
//           const newFood = new Food(food);
//           const foodResult = await newFood.save();
//           /* Create food_item and add it to the foods block */
//           const foodItem = {
//             foodId: foodResult._id,
//             foodCategory,
//             description,
//             actions: actions.map((action) => ({
//               derivationDescription: action.derivationDescription,
//               nutrientName: action.nutrientName,
//               unitName: action.unitName,
//               value: action.value,
//               completed: action.completed,
//             })),
//             completed:
//               actions.length && !actions.some((action) => !action.completed),
//             createdAt: new Date(),
//           };
//           const newFoodItem = new FoodItem(foodItem);
//           const newFoodItemRes = await newFoodItem.save();
//           await Food.updateOne(
//             { _id: foodResult._id },
//             { $push: { items: newFoodItemRes._id } }
//           );
//           return await Food.findById(foodResult._id);
//         }
//       } catch (e) {
//         console.log(e);
//       }
//     },
//   },
//   updateFoodItem: {
//     type: FoodItemType,
//     args: {
//       id: { type: GraphQLID },
//       foodCategory: { type: GraphQLString },
//       description: { type: GraphQLString },
//       actions: { type: new GraphQLList(FoodActionInputType) },
//       type: { type: GraphQLString },
//     },

//     async resolve(_, args, req) {
//       try {
//         const { id, ...data } = args;
//         let foodItem = await FoodItem.findById(id);
//         if (!foodItem) {
//           return {
//             error: "Not Found!",
//           };
//         }
//         const foodItemDetails = {
//           title: data.title,
//           actions: data.actions.map((action) => ({
//             derivationDescription: action.derivationDescription,
//             nutrientName: action.nutrientName,
//             unitName: action.unitName,
//             value: action.value,
//             completed: action.completed,
//           })),
//           completed:
//             data.actions.length &&
//             !data.actions.some((action) => !action.completed),
//         };
//         await FoodItem.updateOne({ _id: id }, { $set: foodItemDetails });
//         return await FoodItem.findById(id);
//       } catch (e) {
//         console.log(e);
//       }
//     },
//   },
//   deleteFoodItem: {
//     type: DeleteResponseType,
//     args: {
//       id: { type: GraphQLID },
//     },

//     async resolve(_, args, req) {
//       try {
//         const { id } = args;
//         let foodItem = await FoodItem.findById(id);
//         if (!foodItem) {
//           return {
//             error: "Not Found!",
//           };
//         }
//         await FoodItem.findOneAndDelete({ _id: id });
//         await Food.updateOne(
//           { _id: foodItem.foodId },
//           { $pull: { items: { _id: id } } }
//         );
//         return {
//           result: true,
//         };
//       } catch (e) {
//         console.log(e);
//       }
//     },
//   },
//   toggleFoodItemCompleted: {
//     type: DeleteResponseType,
//     args: {
//       id: { type: GraphQLID },
//     },

//     async resolve(_, args, req) {
//       try {
//         const { id } = args;
//         let foodItem = await FoodItem.findById(id);
//         if (!foodItem) {
//           return {
//             error: "Not Found!",
//           };
//         }
//         await FoodItem.updateOne(
//           { _id: id },
//           { $set: { completed: !foodItem.completed } }
//         );
//         return {
//           result: true,
//         };
//       } catch (e) {
//         console.log(e);
//       }
//     },
//   },
// };
