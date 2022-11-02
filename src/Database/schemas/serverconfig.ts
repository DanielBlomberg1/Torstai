import { Schema, model } from "mongoose";

const configSchema = new Schema({
    _id: Schema.Types.ObjectId,
    guildId:String,
    outputChannelId: String,
    commandPrefix: String,
    autoJoin: Boolean,
})

const configmodel = model("Config", configSchema, "configs");

export default configmodel;

