const express = require("express");

const userApi = require("./router/api/user");

const app = express();

app.get("/", (req, res) => {
  res.send("Express running");
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/user/", userApi);
module.exports = app;
