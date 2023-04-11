const express = require("express");
const { Users } = require("../userModel/User.model");
const { PostModel } = require("../userModel/Post.model");
const app = express.Router();
require("dotenv").config();

// <==================================== Create a new post. <========================================>

app.post("/", async (req, res) => {
  const { user_id, content, likes, name } = req.body;
  let userExit;
  try {
    userExit = await Users.findById(user_id);
    if (!userExit) {
      res.status(404).send({ message: "User not found" });
    }

    // Create new Post
    const post = new PostModel({ user_id, content, likes, name });
    await post.save();

    res.status(201).send(post);
  } catch (err) {
    if (err.name === "ValidationError") {
      let errors = {};

      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
      });

      return res.status(400).send(errors);
    }
    res.status(500).send({ message: "Something went wrong" });
    console.log(err);
  }
});

// <==================================== Retrieve a post by id. <====================================>

app.get("/:id", async (req, res) => {
  const postID = req.params.id;

  try {
    const postIdExit = await PostModel.findById(postID);
    if (!postIdExit) {
      return res.status(404).send({ message: "Post not found" });
    }

    res.status(200).send(postIdExit);
  } catch (err) {
    res.status(400).send({ message: "Something went wrong" });
  }
});

// <================================= Retrieve a post by id and update <=======================================>

app.put("/:id", async (req, res) => {
  const postID = req.params.id;
  try {
    const updatePost = await PostModel.findByIdAndUpdate(postID, req.body);
    res.status(200).send({ message: "Update Successfull" });
  } catch (err) {
    res.status(500).send({ message: "Something went wrong" });
    console.log(err);
  }
});

// <===================================== Delete a post by id. <=======================================>

app.delete("/:id", async (req, res) => {
  const postID = req.params.id;
  try {
    await PostModel.findByIdAndDelete(postID);
    res.status(200).send({ message: "Post Deleted Successfull" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
});

// <=====================================  get All post <=======================================>

app.get("/all/getall", async (req, res) => {
  try {
    const allPost = await PostModel.find();
    res.status(200).send(allPost);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
});

// <=====================================  Like post <=======================================>

app.put("/:id/like", async (req, res) => {
  const postID = req.params.id;
  try {
    let newLike = await PostModel.findOneAndUpdate(
      { _id: postID },
      { $inc: { likes: 1 } },
      { new: true }
    );
    res.send(newLike);
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: "Something went wrong" });
  }
});

// <=====================================  Unlike post <=======================================>

app.put("/:id/unlike", async (req, res) => {
  const postID = req.params.id;

  // Here i am checking if the like is 0 then you cannot dislike
  try {
    let data = await PostModel.findById(postID);
    if (data.likes == 0) {
      res.send({ message: "You cannot Dislike" });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Something went wrong" });
  }

  // if not 0 then you can dislike
  try {
    let newLike = await PostModel.findOneAndUpdate(
      { _id: postID },
      { $inc: { likes: -1 } },
      { new: true }
    );
    res.send(newLike);
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: "Something went wrong" });
  }
});
module.exports = app;
