import { Client, Message } from "discord.js";
import CheckForGoodWords from "../utils/CheckForGoodWords";
import { OffenceEnum } from "../Database/schemas/offencesmodel.types";
import CheckForBadWords from "../utils/CheckForBadWords";
import { CheckForActiveQuests } from "../utils/CheckForActiveQuests";
import { Print } from "../utils/Print";

// this is not working for whatever reason
export default (client: Client): void => {
  client.on("messageCreate", async (msg: Message) => {
    if (msg.guild) {
      CheckForBadWords(
        msg.content.toLowerCase(),
        msg.author,
        msg.guild,
        OffenceEnum.written
      );

      CheckForGoodWords(msg.content, msg.author, msg.guild);

      if(!msg.author.bot){
        CheckForActiveQuests(msg.content, msg.author, msg.guild);
      }

      if(msg.content.length > 0){Print(msg.author.username +  ": " + msg.content);}
    }
  });
};
