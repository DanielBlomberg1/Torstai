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
    completedOn?: Date;
    questStatus: QuestStatus;
}

export enum QuestStatus {
    ACTIVE,
    COMPLETED,
    FAILED
}


export enum QuestType{
    DAILY,
    WEEKLY
}

export enum QuestRarity{
    COMMON,
    UNCOMMON,
    RARE,
    EPIC,
    LEGENDARY
}

export interface IQuestDocument extends IQuestData, Document {}
export type IQuestModel = Model<IQuestDocument>;
