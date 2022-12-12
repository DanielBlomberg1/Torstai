import { CommandInteraction, Client, ApplicationCommandType } from "discord.js";
import { Command } from "../interfaces/Command";
import { fetchStandings } from "../Database/Mongoose";
import { getCurrentWeek } from "src/utils/dateUtils";

export const GetStandings: Command = {
  name: "getstandings",
  description: "fetch servers behaviour report",
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: CommandInteraction) => {
    let content = "success";
    const week = getCurrentWeek();

    if (interaction.guild) {
      const userlist = await fetchStandings(interaction.guild);
      content = interaction.guild.name + " : Karma Leaderboard : Week : " + week + "\n";
      if (userlist.length > 0) {
        content += "```";
        userlist.forEach((u) => {
          const nick = interaction.guild?.members.cache.get(u.userId)?.user
            .username;
          content += nick + " | " + u.karma + "\n";
        });
        content += "```";
      } else {
        content += "No users have committed crimes";
      }
    }

    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
