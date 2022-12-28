import { Schema, model } from "mongoose";
import { IQuestData, QuestRarity } from "./questmodel.types";

const questSchema = new Schema({
  guildId: String,
  userId: String,
  quests: [
    {
      name: String,
      description: String,
      questRarity: QuestRarity,
      questType: String,
      generatedOn: Date,
      completedOn: Date,
      completed: Boolean,
    },
  ],
});

const questmodel = model<IQuestData>("Quest", questSchema, "quests");

export default questmodel;
