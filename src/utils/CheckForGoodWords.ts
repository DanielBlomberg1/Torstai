import { Guild, User } from "discord.js";
import { putOffence } from "../Database/Mongoose";
import { OffenceEnum, OffenceType } from "../Database/schemas/usersmodel.types";
import { fiGood } from "./fi";
import { Print } from "./Print";

export default async (msg: string, author: User, guild: Guild) => {
  const total = checkWords(msg);

  if (total > 0) {
    const commitedAt = new Date();
    const offenceString =
      "Detected good deed in a message of type:  " +
      author.username +
      " the message content was: " +
      msg;

    const karmaBonus = Math.floor(Math.random() * 5) + total;

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

const severity = (n: number) => {
  switch(n){
    case 1:
      return 10;
    case 2:
      return 20
    case 3:
      return 30;
    case 4:
      return 40
    case 5:
      return 50
    default:
      return 0
  }
}

const checkWords = (word: string) => {
  let total = 0;

  const lowercase = word.toLowerCase();
  if(lowercase.includes("@")){
    total += 1;
  }

  for (const [key, value] of Object.entries(fiGood)){
    if(lowercase.includes(key)){
      total += severity(value);
    }
  }

  return total;
};
