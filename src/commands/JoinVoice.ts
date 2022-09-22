import { CommandInteraction, Client, ApplicationCommandType, ChannelType, ApplicationCommandOptionData, ApplicationCommandOptionType, VoiceChannel, InternalDiscordGatewayAdapterCreator } from "discord.js";
import { getVoiceConnection, joinVoiceChannel, VoiceConnectionStatus } from "@discordjs/voice";
import { Command } from "../Command";

export const JoinVC: Command = {
    name: "joinvc",
    description: "Moves the bot to your voice channel",
    type: ApplicationCommandType.ChatInput,
    options:[
        {
            name: "channel",
            description: "The channel to join",
            type: ApplicationCommandOptionType.Channel,
            required: true,
            channel_types: [ChannelType.GuildVoice],
        } as ApplicationCommandOptionData
    ],
    run: async (client: Client, interaction: CommandInteraction) => {
        const channel = interaction.options.data[0];

        joinVoiceChannel(
            {
                channelId: String(channel?.channel?.id),
                guildId: interaction.guild?.id as string,
                adapterCreator: interaction.guild?.voiceAdapterCreator as InternalDiscordGatewayAdapterCreator,
            }
        )

        const connection = getVoiceConnection(interaction?.guild?.id as string);
        connection?.on('speaking' as VoiceConnectionStatus, async (user : any, speaking : any)=>{
            console.log("speaking");
        })
        
        const content = "Joined voice channel!";

        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
};