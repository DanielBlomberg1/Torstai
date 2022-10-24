import { Client, GatewayIntentBits } from "discord.js";
import { addSpeechEvent } from "discord-speech-recognition";
import dotenv from "dotenv";

// listeners
import ready from "./listeners/ready";
import interaction from "./listeners/interaction";
import voiceState from "./listeners/voiceState";
import speech from "./listeners/speech";

// other stuff
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
speech(client);

client.login(token);
