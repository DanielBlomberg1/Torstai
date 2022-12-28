import { Client, Message } from "discord.js";
import CheckForGoodWords from "../utils/CheckForGoodWords";
import { OffenceEnum } from "../Database/schemas/offencesmodel.types";
import CheckForBadWords from "../utils/CheckForBadWords";
import { completeQuest, getActiveQuestsForUser } from "../Database/Mongoose";

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
      const quests = await getActiveQuestsForUser(msg.author, msg.guild);
      for(const quest of quests){
        switch(quest.questName){
          case "The Lost Chad":
            if(msg.content.toLowerCase().includes("gigachad")){
              completeQuest(msg.author, msg.guild, quest);
            }
            break;
          case "Give 'em the love":
            if(msg.content.toLowerCase().includes(":heart:")){
              completeQuest(msg.author, msg.guild, quest);
            }
            break;
          case "Jörmy is hungry":
            if(msg.content.toLowerCase().includes("jörmy")){
              if(msg.content.toLowerCase().includes(":hamburger:")){
              completeQuest(msg.author, msg.guild, quest);
              }
            }
            break;
            default:
              break;

        }
      }


      console.log(msg.content);
    }
  });
};
