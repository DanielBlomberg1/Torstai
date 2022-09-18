import { Client, ClientOptions } from "discord.js";
import ready from "./listeners/ready";
import interaction from "./listeners/interaction";
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.BOT_TOKEN;

console.log("----------------------");
console.log("-- Torstai Starting --")
console.log("----------------------");

const client = new Client({
    intents: []
});

ready(client);
interaction(client);

client.login(token);