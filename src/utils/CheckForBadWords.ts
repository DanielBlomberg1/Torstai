import { putOffence } from "./../Database/Mongoose";
import { Guild, User } from "discord.js";
import { en } from "./en";
import { fi } from "./fi";
import {
  OffenceEnum,
  OffenceType,
} from "../Database/schemas/offencesmodel.types";
import { Print } from "./Print";

export default async (
  msg: string,
  author: User,
  guild: Guild,
  offenceType: OffenceEnum
) => {
  let total = 0;

  msg.split(/\s+/).forEach((word: string) => {
    total += checkWords(word);
  });

  if (total < 0) {
    const commitedAt = new Date();
    let karmaPenalty = 0;
    const offenceString = msg;

    if (offenceType === 0) {
      karmaPenalty = total;
    } else {
      karmaPenalty = total / 2;
    }

    Print(offenceString);
    const offence: OffenceType = {
      commitedOn: commitedAt,
      karmaChange: karmaPenalty,
      newKarma: 1500,
      offenceType: offenceType,
      offenceDescription: offenceString,
    };

    await putOffence(guild, author, offence, karmaPenalty);
  }
};

const severity = (n: number) => {
  switch (n) {
    case 1:
      return -20;
    case 2:
      return -40;
    case 3:
      return -70;
    case 4:
      return -120;
    case 5:
      return -600;
    default:
      return -50;
  }
};

function checkWords(word: string): number {
  let total = 0;
  const lowercase = word.toLowerCase();

  for (const [key, value] of Object.entries(en)) {
    if (lowercase === key) {
      total += severity(value);
    }
  }
  for (const [key, value] of Object.entries(fi)) {
    if (lowercase === key) {
      total += severity(value);
    }
  }

  return total;
}
