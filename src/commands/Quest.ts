import {
  CommandInteraction,
  Client,
  ApplicationCommandType,
  User,
} from "discord.js";
import { getQuestsForUser } from "src/Database/Mongoose";
import { Command } from "../interfaces/Command";

export const Quest: Command = {
  name: "quest",
  description: "get daily and weekly quests",
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: CommandInteraction) => {
    let content = "failed";
    const user = interaction.options.get("user")?.user as User;

    // ask the api for quests and display them to the user in a nice way in content variable
    if (interaction.guild) {
        getQuestsForUser(user);
        content = "Quests for " + user.username + ":\n";
        content += "Daily quest: " + "quest description" + "\n";
        content += "Weekly quest: " + "quest description" + "\n";
    }

    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};

