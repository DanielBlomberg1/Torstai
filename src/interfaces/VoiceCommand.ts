import { VoiceConnection } from "@discordjs/voice";
import { Client, Snowflake } from "discord.js";

export interface VoiceCommand {
  runCommand: (
    client: Client,
    word: string,
    recordable: Set<Snowflake>,
    voiceConnection: VoiceConnection | undefined
  ) => void;
}
