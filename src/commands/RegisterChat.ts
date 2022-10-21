import {
  CommandInteraction,
  Client,
  ApplicationCommandType,
  ApplicationCommandOptionData,
  ApplicationCommandOptionType,
  ChannelType,
} from "discord.js";
import { Command } from "../interfaces/Command";

export const RegisterChannel: Command = {
  name: "register",
  description: "registers voicechannel to be used as the primary one",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "channel",
      description: "textchannel to send messages to:",
      required: true,
      type: ApplicationCommandOptionType.Channel,
      channel_types: [ChannelType.GuildText],
    } as ApplicationCommandOptionData,
  ],
  run: async (_client: Client, interaction: CommandInteraction) => {

    globalThis.mainTextChannel = interaction?.options?.data[0]?.channel?.id ?? "";

    const content = "success";
    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
