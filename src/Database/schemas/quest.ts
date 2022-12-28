import { Schema, model } from "mongoose";
import { IQuestData } from "./questmodel.types";

const questSchema = new Schema({
  guildId: String,
  userId: String,
  quests: [
    {
      questId: Schema.Types.ObjectId,
      questName: String,
      description: String,
      questRarity: String,
      questType: String,
      generatedOn: Date,
      completedOn: Date,
      questStatus: String,
    },
  ],
});

const questmodel = model<IQuestData>("Quest", questSchema, "quests");

export default questmodel;
