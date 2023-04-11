const express = require("express");
const { Users } = require("../userModel/User.model");
const { PostModel } = require("../userModel/Post.model");
const app = express.Router();
require("dotenv").config();

//<=======================> Get Total Post In Numbers <===============================>

app.get("/posts", async (req, res) => {
  try {
    let data = await PostModel.find();
    res.status(200).send({ total: data.length });
  } catch (err) {
    res.status(400).send({ message: "Somthing went wrong" });
  }
});

//<=======================> Get Top 5 liked Post <===============================>

app.get("/posts/top-liked", async (req, res) => {
  try {
    let data = await PostModel.find();
    let top = data.sort((a, b) => b.likes - a.likes).filter((el, i) => i < 5);
    res.status(200).send(top);
  } catch (err) {
    res.status(400).send({ message: "Somthing went wrong" });
  }
});

module.exports = app;
