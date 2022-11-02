import {
  CommandInteraction,
  Client,
  ApplicationCommandType,
  ApplicationCommandOptionData,
  ApplicationCommandOptionType,
  ChannelType,
} from "discord.js";
import { Print } from "../utils/Print";
import { Command } from "../interfaces/Command";
import { putConfiguration } from "../Database/Mongoose";

export const Configure: Command = {
  name: "configure",
  description: "configure bots server config",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "channel",
      description: "textchannel to send messages to:",
      required: true,
      type: ApplicationCommandOptionType.Channel,
      channel_types: [ChannelType.GuildText],
    },
    {
      name: "commandprefix",
      description: "Command Prefix for your primary bot",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "autojoin",
      description: "Whether you want the bot to follow people",
      required: true,
      type: ApplicationCommandOptionType.Boolean,
    },
  ] as ApplicationCommandOptionData[],
  run: async (_client: Client, interaction: CommandInteraction) => {
    const guildId: string | undefined = interaction.guild?.id;
    const channelId: string | undefined =
      interaction.options.data[0].channel?.id;
    const commandPrefix = interaction.options.get("commandprefix");
    const boolean = interaction.options.get("autojoin")?.value;

    // save into mongo
    if (guildId && channelId) {
      await putConfiguration(guildId, channelId, commandPrefix?.value as string, boolean as boolean)
    }
    const content =
      "Added textchannel " +
      interaction?.options?.data[0]?.channel?.name +
      " as default outputchannel for server : " +
      interaction.guild?.name +
      "\n" +
      "and added the default music bot prefix " +
      commandPrefix?.value;

    Print(interaction.member?.user.username + ": " + content);

    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
