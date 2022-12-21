import { Schema, model } from "mongoose";

const users = new Schema({
  userId: String,
  username: String,
  role: {type: String, default: "karhu"},
});

const usersmodel = model("Users", users, "users");

export default usersmodel;
