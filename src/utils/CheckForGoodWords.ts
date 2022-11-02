import { Guild, User } from "discord.js";
import { putOffence } from "../Database/Mongoose";
import { OffenceEnum, OffenceType } from "../Database/schemas/usersmodel.types";
import { Print } from "./Print";

export default async (msg: string, author: User, guild: Guild) => {
  let offenceCommited = false;
  msg.split(/\s+/).forEach((word: string) => {
    if (checkWords(word)) {
      offenceCommited = true;
    }
  });

  if (offenceCommited) {
    const commitedAt = new Date();
    const offenceString =
      "Detected good deed in a message of type: Ping by user " +
      author.username +
      " the message content was: " +
      msg;
    const karmaBonus = Math.floor(Math.random() * 5);

    Print(offenceString);
    const offence: OffenceType = {
      commitedOn: commitedAt,
      karmaChange: karmaBonus,
      offenceType: OffenceEnum.other,
      offenceDescription: commitedAt.toUTCString() + " " + offenceString,
    };

    await putOffence(guild, author, offence, karmaBonus);
  }
};

const checkWords = (word: string) => {
  return word.includes("@");
};
