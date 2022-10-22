import {
  CommandInteraction,
  Client,
  ApplicationCommandType,
  ApplicationCommandOptionData,
  ApplicationCommandOptionType,
  ChannelType,
} from "discord.js";
import fs from "fs"
import { Print } from "../utils/Print";
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
    const guildId: string | undefined = interaction.guild?.id;
    const channelId: string | undefined = interaction.options.data[0].channel?.id;

    if(guildId && channelId){
      global.mainTextChannels.set(guildId, channelId);
    }
    
    JSON.stringify(Object.fromEntries(global.mainTextChannels));
    var data = JSON.stringify(Object.fromEntries(global.mainTextChannels));

    fs.writeFile('./data.json', data, function (err: any) {
      if (err) {
        Print('There was an error saving textChannels');
        return;
      }
    });
    
    const content = 'Added textchannel '+ interaction?.options?.data[0]?.channel?.name + ' as default outputchannel for server : ' + interaction.guild?.name;
    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
