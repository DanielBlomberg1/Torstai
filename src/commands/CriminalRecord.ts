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
    {
      name: "amount",
      type: ApplicationCommandOptionType.Number,
      description: "amount of offences to get",
      required: false,
    },
  ],

  run: async (client: Client, interaction: CommandInteraction) => {
    let content = "failed";
    const user = interaction.options.get("user")?.user as User;
    const amount = (interaction.options.get("amount")?.value as number) || 5;

    if (interaction.guild) {
      const offenceList = await fetchOffencesForUser(interaction.guild, user);
      content = user.username + " : Criminal Record 👮\n```";
      const latestfive = offenceList?.slice(
        0,
        amount <= offenceList.length ? amount : offenceList.length
      );

      if (latestfive) {
        latestfive.forEach((u) => {
          if (content.length < 1500) {
            content +=
              user.username +
              ": " +
              u.offenceDescription +
              " | " +
              u.karmaChange +
              " | " +
              (u.offenceType === 0 ? "oral" : "written") +
              "\n";
          }
        });
        content += "```Showing latest " + amount + " cases";
      } else {
        content += "Squaaky clean 😎";
      }
    }

    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
