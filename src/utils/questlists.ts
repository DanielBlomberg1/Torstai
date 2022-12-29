import mongoose from "mongoose";
import {
  Quest,
  QuestRarity,
  QuestStatus,
  QuestType,
} from "../Database/schemas/questmodel.types";

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
};

// write new quests here implement elsewhere
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
    questName: "It's Elementary",
    questRarity: generateRarity(),
    questType: QuestType.DAILY,
    description: "calculate 6/2(1+2)",
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
    questName: "Impossible Quest",
    questRarity: generateRarity(),
    questType: QuestType.WEEKLY,
    description: "LOL XD try again next week",
    generatedOn: new Date(),
    questStatus: QuestStatus.ACTIVE,
  } as Quest,
  {
    questId: new mongoose.Types.ObjectId(),
    questName: "Firecapped",
    questRarity: generateRarity(),
    questType: QuestType.WEEKLY,
    description: "Tell other members to go get firecape in runescape",
    generatedOn: new Date(),
    questStatus: QuestStatus.ACTIVE,
    optionalAttributes: {
      completionSteps: 5,
      currentCompletionSteps: 0,
    },
  } as Quest,
  {
    questId: new mongoose.Types.ObjectId(),
    questName: "Intergral Solutions",
    questRarity: generateRarity(),
    questType: QuestType.WEEKLY,
    description: "Calculate the integral of sin(x^2) from 0 to infinity",
    generatedOn: new Date(),
    questStatus: QuestStatus.ACTIVE,
  } as Quest,
];

const dailyQuests: Quest[] = allQuests.filter(
  (quest) => quest.questType === QuestType.DAILY
);
const weeklyQuests: Quest[] = allQuests.filter(
  (quest) => quest.questType === QuestType.WEEKLY
);

export const generateDailyQuest = (): Quest => {
  const randomIndex = Math.floor(Math.random() * dailyQuests.length);
  return dailyQuests[randomIndex];
};
export const generateWeeklyQuest = (): Quest => {
  const randomIndex = Math.floor(Math.random() * weeklyQuests.length);
  return weeklyQuests[randomIndex];
};

export const getQuestRewardBasedOnRarity = (
  questRarity: QuestRarity,
  questType: QuestType
): number => {
  const x = questType === QuestType.DAILY ? 0 : 3;
  switch (questRarity) {
    case QuestRarity.COMMON:
      return 100 + x * 100;
    case QuestRarity.UNCOMMON:
      return 250 + x * 250;
    case QuestRarity.RARE:
      return 500 + x * 500;
    case QuestRarity.EPIC:
      return 750 + (x / 3) * 1250;
    case QuestRarity.LEGENDARY:
      return 1000 + (x / 3) * 2500;
    default:
      return 0;
  }
};
