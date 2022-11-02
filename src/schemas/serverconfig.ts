

import { Schema, model } from "mongoose";
import { ServerConfig } from "../interfaces/ServerConfig";
import { Print } from "../utils/Print";

const configSchema = new Schema({
    _id: Schema.Types.ObjectId,
    guildId:String,
    outputChannelId: String,
    commandPrefix: String,
    autoJoin: Boolean,
})

const configmodel = model("Config", configSchema, "configs");

export default configmodel;

export const getConfigByGuildId = (id:string): ServerConfig | null =>{

    configmodel.findOne({guildId:id}, (err: any, config: ServerConfig) =>{
        if(err) Print("server doesnt yet have config or db down");
        return config
    })
    return null;
}