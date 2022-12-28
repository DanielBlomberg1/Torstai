import { getQuestRewardBasedOnRarity } from "./../utils/questlists";
import {
  CommandInteraction,
  Client,
  ApplicationCommandType,
  User,
} from "discord.js";
import { QuestStatus, QuestType } from "../Database/schemas/questmodel.types";
import { getWeeklyAndDailyQuestsForUser } from "../Database/Mongoose";
import { Command } from "../interfaces/Command";

export const Quest: Command = {
  name: "quest",
  description: "get daily and weekly quests",
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: CommandInteraction) => {
    let content = "failed";
    const user = interaction.user;

    // ask the api for quests and display them to the user in a nice way in content variable
    if (interaction.guild) {
      const quests = getWeeklyAndDailyQuestsForUser(user, interaction.guild);

      const dailyQuest = (await quests).filter(
        (quest) => quest.questType === QuestType.DAILY
      )[0];
      const weeklyQuest = (await quests).filter(
        (quest) => quest.questType === QuestType.WEEKLY
      )[0];

      content = "Quests for " + user.username + ":```\n";
      content +=
        "Daily quest: " +
        dailyQuest.questName +
        " " +
        (dailyQuest.questStatus === QuestStatus.COMPLETED ? "✔️" : "❌") +
        "\n \t quest description: " +
        dailyQuest.description +
        "\n \t quest rarity: " +
        dailyQuest.questRarity +
        "\n \t quest reward: " +
        getQuestRewardBasedOnRarity(
          dailyQuest.questRarity,
          dailyQuest.questType
        ) +
        " \n";

      content +=
        "Weekly quest: " +
        weeklyQuest.questName +
        " " +
        (weeklyQuest.questStatus === QuestStatus.COMPLETED ? "✔️" : "❌") +
        "\n \t quest description: " +
        weeklyQuest.description +
        "\n \t quest rarity: " +
        weeklyQuest.questRarity +
        "\n \t quest reward: " +
        getQuestRewardBasedOnRarity(
          weeklyQuest.questRarity,
          weeklyQuest.questType
        ) +
        " \n";
      content += "```";
    }

    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
