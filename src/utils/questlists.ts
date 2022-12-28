import { Quest, QuestRarity, questType } from "src/Database/schemas/questmodel.types";

const generateRarity = (): QuestRarity => {
    const rarity = Math.floor(Math.random() * 100);
    if (rarity < 50) {
        return QuestRarity.Common;
    } else if (rarity < 75) {
        return QuestRarity.Uncommon;
    } else if (rarity < 90) {
        return QuestRarity.Rare;
    } else if (rarity < 98) {
        return QuestRarity.Epic;
    } else {
        return QuestRarity.Legendary;
    }   
}


export const allQuests: Quest[] = [
    {
        name: "The lost Chad",
        questRarity: generateRarity(),
        questType: questType.Daily,    
        description: "A Chad has gone missing in the server. Find the chad.",
        generatedOn: new Date(),
        completed: false,
    } as Quest,
    {
        name: "Give 'em the love",
        questRarity: generateRarity(),
        questType: questType.Daily,
        description: "Server has been lacking love. Give the server some love.",
        generatedOn: new Date(),
        completed: false,
    } as Quest,
    {
        name: "",
        questRarity: generateRarity(),
        questType: questType.Daily,
        description: "",
        generatedOn: new Date(),
        completed: false,
    } as Quest,
    {
        name: "",
        questRarity: generateRarity(),
        questType: questType.Daily,
        description: "",
        generatedOn: new Date(),
        completed: false,
    } as Quest,

]

const dailyQuests: Quest[] = allQuests.filter(quest => quest.questType === questType.Daily);
const weeklyQuests: Quest[] = allQuests.filter(quest => quest.questType === questType.Weekly);

export const generateDailyQuest = (): Quest => {
    const randomIndex = Math.floor(Math.random() * dailyQuests.length);
    return dailyQuests[randomIndex];
}
export const generateWeeklyQuest = (): Quest => {
    const randomIndex = Math.floor(Math.random() * weeklyQuests.length);
    return weeklyQuests[randomIndex];
}
