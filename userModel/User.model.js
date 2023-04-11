const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserID",
    },
    name: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isLength(value, { min: 0, max: 50 })) {
          throw Error("Length of the name should be between 0-50 words");
        }
      },
    },
    email: {
      type: String,
      required: [true, "Email is a required field"],
      trim: true,
      lowercase: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Please enter a valid E-mail!");
        }
      },
    },
    bio: {
      type: String,
      validate(value) {
        if (!validator.isLength(value, { min: 0, max: 400 })) {
          throw Error("Length of the bio should be between 0-400 words");
        }
      },
    },
  },
  {
    versionKey: false,
    timestamps: {
      created_at: "created_at", // Use `created_at` to store the created date
      updated_at: "updated_at", // and `updated_at` to store the last updated date
    },
  }
);

const Users = mongoose.model("users", userSchema);

module.exports = { Users };
