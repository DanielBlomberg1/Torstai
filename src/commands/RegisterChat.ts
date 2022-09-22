import {
  CommandInteraction,
  Client,
  ApplicationCommandType,
  ApplicationCommandOptionData,
  ApplicationCommandOptionType,
  ChannelType,
} from "discord.js";
import fs from "fs";
import { getVoiceConnection } from "@discordjs/voice";
import { Command } from "../Command";

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
  run: async (client: Client, interaction: CommandInteraction) => {
    /*
    fs.writeFile(
      "./chatchannels.txt",
      interaction.options.data[0]?.channel?.id as string,
      (err) => {
        if (err) throw err;
        console.log("The file has been saved!");
      }
    );
    */
    globalThis.mainTextChannel = interaction?.options?.data[0]?.channel?.id ?? "";

    const content = "success";
    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
