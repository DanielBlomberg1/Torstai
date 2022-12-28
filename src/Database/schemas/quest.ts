import { Schema, model } from "mongoose";
import { IQuestData, QuestRarity, QuestStatus, QuestType } from "./questmodel.types";

const questSchema = new Schema({
  guildId: String,
  userId: String,
  quests: [
    {
      questName: String,
      description: String,
      questRarity: Number,
      questType: Number,
      generatedOn: Date,
      completedOn: Date,
      questStatus: Number,
    },
  ],
});

const questmodel = model<IQuestData>("Quest", questSchema, "quests");

export default questmodel;
