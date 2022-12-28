import {
  CommandInteraction,
  Client,
  ApplicationCommandType,
  User,
} from "discord.js";
import { QuestType } from "../Database/schemas/questmodel.types";
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

      const dailyQuest = (await quests).filter((quest) => quest.questType === QuestType.DAILY)[0];
      const weeklyQuest = (await quests).filter((quest) => quest.questType === QuestType.WEEKLY)[0];

        content = "Quests for " + user.username + ":```\n";
        content += "Daily quest: " + dailyQuest.questName + "\n \t quest description: " + dailyQuest.description + " \n";
        content += "Weekly quest: " + weeklyQuest.questName +"\n \t quest description: " + weeklyQuest.description +" \n";
        content += "```";
    }

    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};

