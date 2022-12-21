import { Schema, model } from "mongoose";
import { GuildData, AuthLevel } from "./guilds.types";

const guildSchema = new Schema({
  guildId: String,
  name: String,
  iconURL: String,
  users: [
    {
      userId: String,
      tag: String,
      username: String,
      nickname: String,
      avatarURL: String,
      bot: Boolean,
      active: Boolean,
      authLevel: { type: String, enum: AuthLevel, default: AuthLevel.KARHU },
    },
  ],
});

const guildModel = model<GuildData>("Guilds", guildSchema, "guilds");

export default guildModel;
