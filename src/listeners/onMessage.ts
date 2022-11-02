import { Client, Message } from "discord.js";
import { OffenceType } from "../interfaces/User";
import CheckForBadWords from "../utils/CheckForBadWords";

// this is not working for whatever reason
export default (client: Client): void => {
    client.on("messageCreate", (msg: Message) => {
        CheckForBadWords(msg.content.toLowerCase(), msg.author, OffenceType.written);
    });
}