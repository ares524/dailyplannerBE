const express = require("express");
const graphqlHTTP = require("express-graphql");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path')
require("dotenv").config();

const schema = require("./schema");

const app = express();

app.use(cors());

mongoose.connect(process.env.MONGO_URL);
mongoose.connection.once("open", () => {
  console.log("connected to database");
});

app.use(
  "/graphql",
  cors(),
  graphqlHTTP({
    schema,
    graphiql: process.env.GRAPHIQL && process.env.GRAPHIQL === "enabled",
  })
);

app.use("/ping", cors(), (_, res) => {
  res.send(true);
});

app.listen(process.env.PORT, function () {
  console.log(`Listening on port.. ${process.env.PORT}`);
});
