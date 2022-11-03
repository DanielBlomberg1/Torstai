import {
  fetchOffencesForUser,
  fetchOffencesForUserBeforeDate,
} from "./../Database/Mongoose";
import {
  CommandInteraction,
  Client,
  ApplicationCommandType,
  ApplicationCommandOptionType,
  User,
  PermissionFlagsBits,
} from "discord.js";
import { Command } from "../interfaces/Command";

export const CrimesBefore: Command = {
  name: "crimesbefore",
  description: "fetch number of crimes user has commited since certain date",
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
      name: "hours",
      type: ApplicationCommandOptionType.Integer,
      description: "Number of Hours to Check",
      required: true,
    },
  ],
  run: async (client: Client, interaction: CommandInteraction) => {
    let content = "failed";
    const user = interaction.options.get("user")?.user as User;
    const hours = interaction.options.get("hours")?.value as number;

    if (interaction.guild) {
      let date = new Date();

      date.setHours(date.getHours() - (hours < 10 ? hours : 10));

      const offenceList = await fetchOffencesForUserBeforeDate(
        interaction.guild,
        user,
        date
      );
      content =
        user.username + " : Crimes since " + date.getUTCDate() + " 👮\n";
      const amount = offenceList?.length ? offenceList?.length : 0;

      if (amount > 0 && offenceList) {
        content = "The user has committed " + amount + "x crimes🙄\n```";
        
        offenceList.forEach((u) => {
          content +=
            u.offenceDescription +
            " | " +
            u.karmaChange +
            "\n";
        });
        content += "```";
      } else {
        content = "No Crimes😍";
      }
    }

    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
