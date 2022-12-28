import { Guild, User } from "discord.js";
import {
  completeQuest,
  getActiveQuestsForUser,
  getServerAdminName,
} from "../Database/Mongoose";

export const CheckForActiveQuests = async (
  msg: string,
  user: User,
  guild: Guild
): Promise<void> => {
  const quests = await getActiveQuestsForUser(user, guild);
  /*
  for (const quest of quests) {
    switch (quest.questName) {
      case "The Lost Chad":
        if (msg.toLowerCase().includes("gigachad")) {
          completeQuest(user, guild, quest);
        }
        break;
      case "Give 'em the love":
        if (msg.toLowerCase().includes(":heart:")) {
          completeQuest(user, guild, quest);
        }
        break;
      case "Jörmy is hungry":
        if (msg.toLowerCase().includes("jörmy")) {
          if (msg.toLowerCase().includes(":hamburger:")) {
            completeQuest(user, guild, quest);
          }
        }
        break;

      case "Say hi to server admin":
        if (msg.toLowerCase().includes("hail")) {
          if (msg.toLowerCase().includes(await getServerAdminName(guild))) {
            completeQuest(user, guild, quest);
          }
        }

        break;
      default:
        break;
    }
  }
  */
};
