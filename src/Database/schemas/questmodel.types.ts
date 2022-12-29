import mongoose, { Model } from "mongoose";

export interface IQuestData {
  guildId: string;
  userId: string;
  quests: Quest[];
}

export interface Quest {
  questId: mongoose.Types.ObjectId;
  questName: string;
  description: string;
  questRarity: QuestRarity;
  questType: QuestType;
  generatedOn: Date;
  questStatus: QuestStatus;
  optionalAttributes?:{
    target?: [String],
    completionSteps?: Number,
    currentCompletionSteps?: Number,
  }
}

export enum QuestStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum QuestType {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
}

export enum QuestRarity {
  COMMON = "COMMON",
  UNCOMMON = "UNCOMMON",
  RARE = "RARE",
  EPIC = "EPIC",
  LEGENDARY = "LEGENDARY",
}

export interface IQuestDocument extends IQuestData, Document {}
export type IQuestModel = Model<IQuestDocument>;
