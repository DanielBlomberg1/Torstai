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
import { LeaderBoards } from "./interfaces/LeaderBoard";


dotenv.config();

const token = process.env.BOT_TOKEN;

declare global {
  //where string == guildID
  var serverConfig: Map<string, ServerConfig>;
  var leaderBoards: Map<string, LeaderBoards>
}

globalThis.serverConfig = LoadData();

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
