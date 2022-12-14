import { Schema, model } from "mongoose";

const users = new Schema({
  userId: String,
  username: String,
});

const usersmodel = model("Users", users);

export default usersmodel;
