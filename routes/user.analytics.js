const express = require("express");
const { Users } = require("../userModel/User.model");
const { PostModel } = require("../userModel/Post.model");
const app = express.Router();
require("dotenv").config();

//<=======================> Get Total Users In Numbers <===============================>

app.get("/users", async (req, res) => {
  try {
    let data = await Users.find();
    res.status(200).send({ total: data.length });
  } catch (err) {
    res.status(400).send({ message: "Somthing went wrong" });
  }
});

//<=======================> Get Top 5 Active Users <===============================>

app.get("/users/top-active", async (req, res) => {
  try {
    let total_post = await PostModel.find(); // Here i am getting all post from the Data Base

    let User_IDS = await total_post?.map((el) => el.user_id); // Here i am storing only user_id in a array

    //From User_IDS array i'm creating a object where user id is key and how many times
    // user id repeated make them value
    const userIdObjects = await User_IDS.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});

    // Getting Top 5 Active users ID Object;

    const top5activeID = await Object.entries(userIdObjects)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    // Getting Top 5 Active users ID only;

    let activeUsers = await Object.keys(top5activeID);

    // Getting all users

    const totalUsers = await Users.find();

    // loop in active user and inside that loop i am doing filter
    const TopActiveUsers = [];
    for (let i = 0; i < activeUsers.length; i++) {
      let user = totalUsers.filter((el) => el._id == activeUsers[i]);
      TopActiveUsers.push(user[0]);
    }

    res.status(200).send(TopActiveUsers);
  } catch (err) {
    res.status(400).send({ message: "Something went wrong" });
  }
});

module.exports = app;
