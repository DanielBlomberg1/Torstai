import { Client, GatewayIntentBits } from "discord.js";
import ready from "./listeners/ready";
import interaction from "./listeners/interaction";
import dotenv from "dotenv";
import voiceState from "./listeners/voiceState";
import speaking from "./listeners/speaking";
import { addSpeechEvent } from "discord-speech-recognition";
import { LoadData } from "./utils/LoadData";
import { ServerConfig } from "./interfaces/ServerConfig";

dotenv.config();

const token = process.env.BOT_TOKEN;

// TODO make array and save locally somewhere
declare global {
  var mainTextChannels: Map<string, ServerConfig>;
}

globalThis.mainTextChannels = LoadData();

console.log("----------------------");
console.log("-- Torstai Starting --");
console.log("----------------------\n");

const client = new Client({
  intents: [
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
  ],
});

ready(client);
interaction(client);
voiceState(client);
addSpeechEvent(client, { lang: "fi-FI", profanityFilter: false });
speaking(client);

client.login(token);
