import { Schema, model } from "mongoose";

const users = new Schema({
    _id: Schema.Types.ObjectId,
    guildId:String,
    userId:String,
    karma:Number,
    Offences: [
        {
            offenceType: Number,
            offenceDescription: String,
            commitedOn: Date,
            karmaChange: Number
        }
    ]
})

const usersmodel = model("User", users, "users");

export default usersmodel;
