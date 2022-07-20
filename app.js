const express = require("express");
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();

const authApi = require("./router/api/auth");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Express running");
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/auth/", authApi);
module.exports = app;
