import { VoiceConnection } from '@discordjs/voice';
import { CommandInteraction, ChatInputApplicationCommandData, Client, Snowflake } from "discord.js";

export interface Command extends ChatInputApplicationCommandData {
    run: (client: Client, interaction: CommandInteraction, recordable: Set<Snowflake>, voiceConnection: VoiceConnection | undefined ) => void;
}