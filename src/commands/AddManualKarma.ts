import { OffenceEnum, OffenceType } from './../Database/schemas/usersmodel.types';
import { putOffence } from "./../Database/Mongoose";
import {
  CommandInteraction,
  Client,
  ApplicationCommandType,
  ApplicationCommandOptionType,
  User,
  PermissionFlagsBits,
} from "discord.js";
import { Command } from "../interfaces/Command";

export const AddmanualKarma: Command = {
  name: "addkarma",
  description: "fetch number of crimes user has commited since certain date",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: PermissionFlagsBits.Administrator,
  options: [
    {
      name: "user",
      type: ApplicationCommandOptionType.User,
      description: "The user for whom to add karma",
      required: true,
    },
    {
      name: "karma-amount",
      type: ApplicationCommandOptionType.Integer,
      description: "amount of karma to add",
      required: true,
    },
  ],
  run: async (client: Client, interaction: CommandInteraction) => {
    let content = "failed";
    const user = interaction.options.get("user")?.user as User;
    const karmaAmount = interaction.options.get("karma-amount")?.value as number;

    if (interaction.guild && karmaAmount && user) {
      const date = new Date();

      const offence: OffenceType = {
        commitedOn: date,
        karmaChange: karmaAmount,
        offenceType: OffenceEnum.other,
        offenceDescription: date.toUTCString() + " " + "added karma by admin",
      };


      putOffence(interaction.guild, user, offence , karmaAmount);
      content = "added karma to " + user.username + " by " + karmaAmount;
    }

    await interaction.followUp({
      ephemeral: true,
      content,
      });

    }   
};
