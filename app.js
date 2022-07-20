const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const authApi = require("./router/api/auth");

const app = express();

app.get("/", (req, res) => {
  res.send("Express running");
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/auth/", authApi);
module.exports = app;
