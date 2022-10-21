import { CommandInteraction, Client, ApplicationCommandType } from "discord.js";
import { Command } from "../interfaces/Command";

export const Test: Command = {
    name: "test",
    description: "Returns a test printout",
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: CommandInteraction) => {
        const content = "Hello there!";

        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
};