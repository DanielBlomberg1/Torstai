import { Client, Message } from "discord.js";

// this is not working for whatever reason
export default (client: Client): void => {
    client.on("messageCreate", (msg: Message) => {
        //Print(msg.content + bool ? " true":" false");
    });
}