import mongoose from "mongoose";
import { Quest, QuestRarity, QuestStatus, QuestType } from "../Database/schemas/questmodel.types";

const generateRarity = (): QuestRarity => {
    const rarity = Math.floor(Math.random() * 100);
    if (rarity < 50) {
        return QuestRarity.COMMON;
    } else if (rarity < 75) {
        return QuestRarity.UNCOMMON;
    } else if (rarity < 90) {
        return QuestRarity.RARE;
    } else if (rarity < 98) {
        return QuestRarity.EPIC;
    } else {
        return QuestRarity.LEGENDARY;
    }   
}


export const allQuests: Quest[] = [
    {
        questId: new mongoose.Types.ObjectId(),
        questName: "The Lost Chad",
        questRarity: generateRarity(),
        questType: QuestType.DAILY,    
        description: "A Chad has gone missing in the server. Find the chad.",
        generatedOn: new Date(),
        questStatus: QuestStatus.ACTIVE,
    } as Quest,
    {
        questId: new mongoose.Types.ObjectId(),
        questName: "Give 'em the love",
        questRarity: generateRarity(),
        questType: QuestType.DAILY,
        description: "Server has been lacking love. Give the server some love.",
        generatedOn: new Date(),
        questStatus: QuestStatus.ACTIVE,
    } as Quest,
    {
        questId: new mongoose.Types.ObjectId(),
        questName: "Jörmy is hungry",
        questRarity: generateRarity(),
        questType: QuestType.DAILY,
        description: "Feed jörmy a blindchannel burger. He is hungry.",
        generatedOn: new Date(),
        questStatus: QuestStatus.ACTIVE,
    } as Quest,
    {
        questId: new mongoose.Types.ObjectId(),
        questName: "I am a memeeemer :D",
        questRarity: generateRarity(),
        questType: QuestType.DAILY,
        description: "The servers meme quota is low. Make a meme. FAAAST! also, make it good enough to get upvoted.",
        generatedOn: new Date(),
        questStatus: QuestStatus.ACTIVE,
    } as Quest,
    {
        questId: new mongoose.Types.ObjectId(),
        questName: "Say hi to server admin",
        questRarity: generateRarity(),
        questType: QuestType.DAILY,
        description: "Server admin is lonely. Say hi to him. in German if you can.",
        generatedOn: new Date(),
        questStatus: QuestStatus.ACTIVE,
    } as Quest,
    {
        questId: new mongoose.Types.ObjectId(),
        questName: "This is impossible to do :D",
        questRarity: generateRarity(),
        questType: QuestType.WEEKLY,
        description: "LOL XD",
        generatedOn: new Date(),
        questStatus: QuestStatus.ACTIVE,
    } as Quest,
]

const dailyQuests: Quest[] = allQuests.filter(quest => quest.questType === QuestType.DAILY);
const weeklyQuests: Quest[] = allQuests.filter(quest => quest.questType === QuestType.WEEKLY);

export const generateDailyQuest = (): Quest => {
    const randomIndex = Math.floor(Math.random() * dailyQuests.length);
    return dailyQuests[randomIndex];
}
export const generateWeeklyQuest = (): Quest => {
    const randomIndex = Math.floor(Math.random() * weeklyQuests.length);
    return weeklyQuests[randomIndex];
}


export const getQuestRewardBasedOnRarity = (questRarity: QuestRarity, questType: QuestType): number => {
    let x = questType === QuestType.DAILY ? 1 : 2;
    switch (questRarity) {
        case QuestRarity.COMMON:
            return 200 * x;
        case QuestRarity.UNCOMMON:
            return 300 * x;
        case QuestRarity.RARE:
            return 500 * x;
        case QuestRarity.EPIC:
            return 1000 * x;
        case QuestRarity.LEGENDARY:
            return 2000 * x;
        default:
            return 0;
    }
}