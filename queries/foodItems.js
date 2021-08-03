// const { GraphQLID, GraphQLList } = require("graphql");
// const { FoodItemType } = require("../schema/types");
// const FoodItem = require("../models/foodItem");
// const getUserId = require("../utils/getUserId");

// module.exports = {
//   foodItems: {
//     type: new GraphQLList(FoodItemType),
//     args: {
//       foodId: { type: GraphQLID },
//     },
//     async resolve(_, args, req) {
//       const userId = getUserId(req);
//       return FoodItem.find({ foodId: args.foodId, userId });
//     },
//   },
//   foodItem: {
//     type: FoodItemType,
//     args: {
//       id: { type: GraphQLID },
//     },
//     async resolve(_, args, req) {
//       const userId = getUserId(req);
//       const foodItem = await FoodItem.findById(args.id);
//       if (!foodItem) {
//         return {
//           error: "Not Found!",
//         };
//       } else {
//         if (String(foodItem.userId) !== String(userId)) {
//           return {
//             error: "Not yours!",
//           };
//         } else {
//           return foodItem;
//         }
//       }
//     },
//   },
// };
