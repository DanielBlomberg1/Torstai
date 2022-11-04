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
      if (userlist) {
        userlist.forEach((u) => {
          const nick = interaction.guild?.members.cache.get(
            u.userId
          )?.user.username;
          content += nick + " | " + u.karma + "\n";
        });
      } else {
        content += "No users have committed crimes";
      }

      content += "```";
    }

    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
