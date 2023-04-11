require("dotenv").config();
const express = require("express");
const { Users } = require("../userModel/User.model");
const app = express.Router();

//<==================================> Creating Users <==========================================>
app.post("/", async (req, res) => {
  const { name, email, bio } = req.body;

  if (!name || !email)
    return res.status(403).send({ message: "Please enter Details" });

  let exsistUser;
  try {
    exsistUser = await Users.findOne({ email });
  } catch (err) {
    return console.log("=====>>>>", err);
  }

  if (exsistUser) {
    return res.status(400).json({ message: "User already exit!" });
  }

  const user = new Users({
    name,
    email,
    bio,
  });

  try {
    await user.save();
  } catch (error) {
    if (error.name === "ValidationError") {
      let errors = {};

      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });

      return res.status(400).send(errors);
    }
    res.status(500).send("Something went wrong");
  }

  return res.status(201).json(user);
});

// <============================> Retrieve a user by id. <=======================================>

app.get("/:id", async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "User not Found" });
    }
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server Error" });
  }
});

//<========================== Update a user's name or bio by id <====================================>

app.put("/:id", async (req, res) => {
  const userID = req.params.id;
  try {
    const updateUser = await Users.findByIdAndUpdate(userID, req.body);
    res.status(200).send({ message: "Put Request Success" });
  } catch (err) {
    res.status(500).send({ message: "Something went wrong" });
    console.log(err);
  }
});

// <=================================== Delete a user by id. <======================================>

app.delete("/:id", async (req, res) => {
  const userID = req.params.id;
  try {
    await Users.findByIdAndDelete(userID);
    res.status(200).send({ message: "Deleted Successfull" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
});

// <============================ Retrieve the total number of users. <================================>

app.get("/analytics/users", async (req, res) => {
  try {
    const allUser = await Users.find();
    res.send({ total_users: allUser.length });
    // res.send(allUser);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
});

// Get All User

app.get("/all/getall", async (req, res) => {
  try {
    const allUser = await Users.find();
    res.status(200).send(allUser);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
});

module.exports = app;
