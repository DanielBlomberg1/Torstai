import { Guild, User } from "discord.js";
import {
  completeQuest,
  getActiveQuestsForUser,
  getServerAdminName,
  partialCompleteQuest,
} from "../Database/Mongoose";

export const CheckForActiveQuests = async (
  msg: string,
  user: User,
  guild: Guild
): Promise<void> => {
  const quests = await getActiveQuestsForUser(user, guild);

  for (const quest of quests) {
    switch (quest.questName) {
      case "The Lost Chad":
        if (msg.toLowerCase().includes("gigachad")) {
          completeQuest(user, guild, quest);
        }
        break;
      case "Give 'em the love":
        if (msg.toLowerCase().includes("❤️")) {
          completeQuest(user, guild, quest);
        }
        break;
      case "Jörmy is hungry":
        if (msg.toLowerCase().includes("jörmy")) {
          if (msg.toLowerCase().includes("🍔")) {
            completeQuest(user, guild, quest);
          }
        }
        break;
      case "Say hi to server admin":
        if (msg.toLowerCase().includes("hail")) {
          const serverAdminName = (
            await getServerAdminName(guild)
          ).toLowerCase();
          if (msg.toLowerCase().includes(serverAdminName)) {
            completeQuest(user, guild, quest);
          }
        }

        break;
      case "It's Elementary":
        if (msg.toLowerCase().includes("9")) {
          completeQuest(user, guild, quest);
        }
        break;
      case "Impossible Quest":
        if (msg.toLowerCase().includes("jesss hyvä fiilis perjantaai")) {
          completeQuest(user, guild, quest);
        }
        break;
      case "Intergral Solutions":
        if (msg.toLowerCase().includes("1/2*sqrt(pi/2)")) {
          completeQuest(user, guild, quest);
        }
        break;
      case "Firecapped":
        if (msg.toLowerCase().includes("missä firecape?")) {
          partialCompleteQuest(user, guild, quest);
        }
        break;
      default:
        break;
    }
  }
};
