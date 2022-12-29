import { fetchOffencesForUser } from "../Database/Mongoose";
import {
  CommandInteraction,
  Client,
  ApplicationCommandType,
  ApplicationCommandOptionType,
  User,
  PermissionFlagsBits,
} from "discord.js";
import { Command } from "../interfaces/Command";

export const Crimes: Command = {
  name: "crimes",
  description: "fetch number of crimes user has commited since certain date",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: PermissionFlagsBits.AddReactions,
  options: [
    {
      name: "user",
      type: ApplicationCommandOptionType.User,
      description: "The user whose criminal record to investigate",
      required: true,
    },
    {
      name: "amount",
      type: ApplicationCommandOptionType.Integer,
      description: "amount of crimes to fetch",
      required: false,
    },
  ],
  run: async (client: Client, interaction: CommandInteraction) => {
    let content = "failed";
    const user = interaction.options.get("user")?.user as User;
    const amount = interaction.options.get("amount")?.value as number;

    if (interaction.guild) {
      const date = new Date();

      const offenceList = await fetchOffencesForUser(interaction.guild, user);

      content =
        user.username + " : Crimes since " + date.getUTCDate() + " 👮\n";
      const amount = offenceList?.length ? offenceList?.length : 0;

      if (amount > 0 && offenceList) {
        content = "The user has committed " + amount + "x crimes🙄\n```";

        offenceList.forEach((u) => {
          if (content.length < 1500) {
            content +=
              user.username +
              ": " +
              u.offenceDescription +
              " | " +
              u.karmaChange +
              "\n";
          }
        });
        content += "```";
        if (content.length > 1500) {
          content += "and more...";
        }
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
