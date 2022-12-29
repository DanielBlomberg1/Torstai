import { getQuestRewardBasedOnRarity } from "./../utils/questlists";
import { CommandInteraction, Client, ApplicationCommandType } from "discord.js";
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

      const dQ = (await quests).filter(
        (quest: { questType: QuestType }) => quest.questType === QuestType.DAILY
      )[0];
      const wQ = (await quests).filter(
        (quest: { questType: QuestType }) =>
          quest.questType === QuestType.WEEKLY
      )[0];

      // generate completion string currnetCompletionSteps/completionSteps
      // if completionSteps is 0, then we don't want to show the completion string
      let completionStringDaily = "0/0";
      if (dQ.optionalAttributes?.completionSteps !== undefined) {
        completionStringDaily =
          dQ.optionalAttributes.currentCompletionSteps +
          "/" +
          dQ.optionalAttributes.completionSteps;
      }

      let completionStringWeekly = "0/0";
      if (wQ.optionalAttributes?.completionSteps !== undefined) {
        completionStringWeekly =
          wQ.optionalAttributes.currentCompletionSteps +
          "/" +
          wQ.optionalAttributes.completionSteps;
      }

      // printout for daily quest
      content = "Quests for " + user.username + ":```\n";
      content += "Daily quest: " + dQ.questName + " ";
      content += dQ.questStatus === QuestStatus.COMPLETED ? "✔️" : "❌";
      content += completionStringDaily === "0/0" ? "" : completionStringDaily;
      content += "\n \t quest description: " + dQ.description;
      content += "\n \t quest rarity: " + dQ.questRarity;
      content +=
        "\n \t quest reward: " +
        getQuestRewardBasedOnRarity(dQ.questRarity, dQ.questType) +
        " \n";

      // same for weekly quest
      content += "Weekly quest: " + wQ.questName + " ";
      content += wQ.questStatus === QuestStatus.COMPLETED ? "✔️ " : "❌ ";
      content += completionStringWeekly === "0/0" ? "" : completionStringWeekly;
      content += "\n \t quest description: " + wQ.description;
      content += "\n \t quest rarity: " + wQ.questRarity;
      content +=
        "\n \t quest reward: " +
        getQuestRewardBasedOnRarity(wQ.questRarity, wQ.questType) +
        " \n";
      content += "```";
    }

    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
