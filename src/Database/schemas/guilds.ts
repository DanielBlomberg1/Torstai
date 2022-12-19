import { Schema, model } from "mongoose";
import { GuildData } from "./guilds.types";

const guildSchema = new Schema({
  id: String,
  name: String,
  iconURL: String,
  users: [
    {
      id: String,
      tag: String,
      username: String,
      nickname: String,
      avatarURL: String,
      bot: Boolean,
    },
  ],
});

const guildModel = model<GuildData>("Guilds", guildSchema, "guilds");

export default guildModel;
