import { fetchOffencesForUser } from "./../Database/Mongoose";
import {
  CommandInteraction,
  Client,
  ApplicationCommandType,
  ApplicationCommandOptionType,
  User,
  PermissionFlagsBits,
} from "discord.js";
import { Command } from "../interfaces/Command";

export const CriminalRecord: Command = {
  name: "criminalrecord",
  description: "fetch servers behaviour report",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: PermissionFlagsBits.BanMembers,
  options: [
    {
      name: "user",
      type: ApplicationCommandOptionType.User,
      description: "The user whose criminal record to investigate",
      required: true,
    },
  ],
  run: async (client: Client, interaction: CommandInteraction) => {
    let content = "failed";
    const user = interaction.options.get("user")?.user as User;

    if (interaction.guild) {
      const offenceList = await fetchOffencesForUser(interaction.guild, user);
      content = user.username + " : Criminal Record 👮\n";
      const latestfive = offenceList?.slice(0,5);

      if (latestfive) {
        latestfive.forEach((u) => {
          content += (u.offenceType == 0 ? "oral: " : "written: ") + "```" +
            u.offenceDescription +
            " | " +
            u.karmaChange +
            "```\n";
        });
        content += "Showing latest 5 cases";
        
      }else{
        content += "Squaaky clean 😎";
      }
    }

    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
