import { Client, ClientOptions, IntentsBitField } from "discord.js";
import ready from "./listeners/ready";
import interaction from "./listeners/interaction";
import dotenv from 'dotenv';
import voiceState from "./listeners/voiceState";
import speaking from "./listeners/speaking";

dotenv.config();

const token = process.env.BOT_TOKEN;

console.log("----------------------");
console.log("-- Torstai Starting --")
console.log("----------------------");

const client = new Client({
    intents: [3243773]
});

ready(client);
interaction(client);
voiceState(client);
speaking(client)

client.login(token);