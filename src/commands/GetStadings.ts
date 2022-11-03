import { CommandInteraction, Client, ApplicationCommandType } from "discord.js";
import { Command } from "../interfaces/Command";
import { fetchStandings } from "../Database/Mongoose";

export const GetStandings: Command = {
  name: "getstandings",
  description: "fetch servers behaviour report",
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: CommandInteraction) => {
    let content = "success";

    if (interaction.guild) {
      const userlist = await fetchStandings(interaction.guild);
      content = interaction.guild.name + " : Karma Leaderboard \n```";

      userlist.forEach((u) => {
        let nick = interaction.guild?.members.cache.get(u.userId)?.displayName;
        content += nick + " | " + u.karma + "\n";
      });
      content += "```";
    }

    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
