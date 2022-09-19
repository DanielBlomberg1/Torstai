import { CommandInteraction, Client, ApplicationCommandType } from "discord.js";
import { getVoiceConnection } from "@discordjs/voice";
import { Command } from "../Command";

export const Disconnect: Command = {
    name: "disconnect",
    description: "disconnect bot from its current voicechannel",
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: CommandInteraction) => {
        const channel = interaction.options.data[0];

        // voiceconnection.disconnect doesnt work need to use .destory lols
        getVoiceConnection(interaction.guild?.id as string)?.destroy();
        const content = "disconnected!";

        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
};