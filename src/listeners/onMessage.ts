import { Client, Message } from "discord.js";
import CheckForGoodWords from "../utils/CheckForGoodWords";
import { OffenceEnum } from "../Database/schemas/offencesmodel.types";
import CheckForBadWords from "../utils/CheckForBadWords";
import { Print } from "../utils/Print";


export default (client: Client): void => {
  client.on("messageCreate", async (msg: Message) => {
    if (msg.guild) {
        // if message is a reply to my message

      CheckForBadWords(
        msg.content.toLowerCase(),
        msg.author,
        msg.guild,
        OffenceEnum.written
      );

      CheckForGoodWords(msg.content, msg.author, msg.guild);

      if (msg.content.length > 0) {
        Print(msg.author.username + ": " + msg.content);
      }
    }
  });
};
