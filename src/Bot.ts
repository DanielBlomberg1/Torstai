import { Client, GatewayIntentBits } from "discord.js";
import { addSpeechEvent } from "discord-speech-recognition";
import dotenv from "dotenv";

// listeners
import ready from "./listeners/ready";
import interaction from "./listeners/interaction";
import voiceState from "./listeners/voiceState";
import speech from "./listeners/speech";
import onMessage from "./listeners/onMessage";

// db
import { connect } from "mongoose";

dotenv.config();

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
  ],
});

ready(client);
interaction(client);
voiceState(client);
addSpeechEvent(client, { lang: "fi-FI", profanityFilter: false });
speech(client);
onMessage(client);

client.login(token);
// connect to database
(async () => {
  await connect(dbToken).catch(console.error);
})();
