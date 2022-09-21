import { getVoiceConnection } from "@discordjs/voice";
import { CommandInteraction, Client, Interaction } from "discord.js";
import { Commands } from "../Commands";

const recordable = new Set<string>();

export default (client: Client): void => {
    client.on("interactionCreate", async (interaction: Interaction, ) => {
        if (interaction.isCommand() || interaction.isUserContextMenuCommand()) {
            await handleSlashCommand(client, interaction);
        }
    });
};

const handleSlashCommand = async (client: Client, interaction: CommandInteraction): Promise<void> => {
    const slashCommand = Commands.find(c => c.name === interaction.commandName);

    if (!slashCommand) {
        interaction.followUp({ content: "An error has occurred" });
        return;
    }

    await interaction.deferReply();

    slashCommand.run(client, interaction, recordable, getVoiceConnection(interaction?.guildId as string));
};