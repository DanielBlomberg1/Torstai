import { Client, ClientOptions, GatewayIntentBits, Channel, Guild, TextChannel } from "discord.js";
import ready from "./listeners/ready";
import interaction from "./listeners/interaction";
import dotenv from "dotenv";
import voiceState from "./listeners/voiceState";
import speaking from "./listeners/speaking";
import { addSpeechEvent } from "discord-speech-recognition";

dotenv.config();

const token = process.env.BOT_TOKEN;

let listOfDefaultChatChannels = new Map<Guild, TextChannel>();

console.log("----------------------");
console.log("-- Torstai Starting --");
console.log("----------------------");

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
addSpeechEvent(client, {lang: "fi-FI"});
speaking(client, listOfDefaultChatChannels);

client.login(token);
