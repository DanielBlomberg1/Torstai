import dotenv from "dotenv";

dotenv.config({ path: __dirname + "/../.env" });

import { Client, GatewayIntentBits } from "discord.js";
import { addSpeechEvent } from "discord-speech-recognition";

// listeners
import ready from "./listeners/ready";
import interaction from "./listeners/interaction";
import voiceState from "./listeners/voiceState";
import speech from "./listeners/speech";
import onMessage from "./listeners/onMessage";
import onGuildUpdate from "./listeners/onGuildUpdate";

// db
import { connect } from "mongoose";
import { installIfNotInstalled } from "./utils/ytdlp";

const token = process.env.BOT_TOKEN;
const dbToken = process.env.DB_TOKEN as string;

console.log("----------------------");
console.log("-- Torstai Starting --");
console.log("----------------------\n");

const client = new Client({
  intents: [
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});

ready(client);
interaction(client);
voiceState(client);
addSpeechEvent(client, { lang: "fi-FI", profanityFilter: false });
speech(client);
onMessage(client);
onGuildUpdate(client);

client.login(token);
// connect to database
(async () => {
  await connect(dbToken).catch(console.error);
  installIfNotInstalled();
})();
