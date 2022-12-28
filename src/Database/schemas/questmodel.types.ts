import { Model } from "mongoose";

export interface IQuestData {
    guildId: string;
    userId: string;
    quests: Quest[];
}

export interface Quest {
    name: string;
    description: string;
    questRarity: QuestRarity;
    questType: questType;
    generatedOn: Date;
    completedOn?: Date;
    completed: boolean;
}


export enum questType{
    Daily,
    Weekly
}

export enum QuestRarity{
    Common,
    Uncommon,
    Rare,
    Epic,
    Legendary
}

export interface IQuestDocument extends IQuestData, Document {}
export type IQuestModel = Model<IQuestDocument>;
