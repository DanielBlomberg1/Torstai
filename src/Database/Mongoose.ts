import { Guild, User } from "discord.js";
import configmodel from "./schemas/serverconfig";
import offencesmodel from "./schemas/offencesmodel";
import {
  IOffences,
  IOffencesModel,
  OffenceType,
  YearlyOffences,
  WeeklyOffences,
} from "./schemas/offencesmodel.types";

import { getCurrentWeek, getCurrentYear } from "../utils/dateUtils";
import { Print } from "../utils/Print";

const putOptions = { upsert: true, new: true, setDefaultsOnInsert: true };

export const fetchPrefix = async function (id: string) {
  const config = await configmodel.findOne({ guildId: id });
  if (config) {
    return config.commandPrefix;
  }
  return null;
};

export const fetchAutoJoin = async function (id: string) {
  const config = await configmodel.findOne({ guildId: id });
  if (config) {
    return config.autoJoin;
  }

  return null;
};

export const fetchTextChannel = async function (id: string) {
  const config = await configmodel.findOne({ guildId: id });
  if (config) {
    return config.outputChannelId;
  }

  return null;
};

export const putConfiguration = async function (
  gId: string,
  channelId: string,
  prefix: string,
  join: boolean
) {
  const update = {
    guildId: gId,
    outputChannelId: channelId,
    commandPrefix: prefix,
    autoJoin: join,
  };
  const model = await configmodel.findOneAndUpdate(
    { guildId: gId },
    update,
    putOptions
  );
  model?.save();
};

const updateForNewYear = async function (
  guild: Guild,
  user: User,
  off: OffenceType,
  karmagained: number,
  oneUser: IOffences,
  week: number,
  year: number
) {
  const newOffence: OffenceType = {
    offenceType: off.offenceType,
    offenceDescription: off.offenceDescription,
    commitedOn: off.commitedOn,
    newKarma: 1500 + karmagained,
    karmaChange: karmagained,
  };

  const newYearly: YearlyOffences = {
    year: year,
    yearlyKarma: 1500 + karmagained,
    weeklyData: [
      {
        weekNumber: week,
        weeklyKarma: 1500 + karmagained,
        Offences: [newOffence],
      },
    ],
  };

  const update = {
    yearlyOffences: [newYearly, ...oneUser.yearlyOffences],
  };

  const model = await offencesmodel.findOneAndUpdate(
    { guildId: guild.id, userId: user.id },
    update,
    putOptions
  );
  model?.save();
};

const updateForNewWeek = async function (
  guild: Guild,
  user: User,
  off: OffenceType,
  karmagained: number,
  oneUser: IOffences,
  week: number,
  year: number,
  yearly: YearlyOffences
) {
  const newOffence: OffenceType = {
    offenceType: off.offenceType,
    offenceDescription: off.offenceDescription,
    commitedOn: off.commitedOn,
    newKarma: 1500 + karmagained,
    karmaChange: karmagained,
  };

  let newYearly: YearlyOffences = yearly;
  newYearly.weeklyData.push({
    weekNumber: week,
    weeklyKarma: 1500 + karmagained,
    Offences: [newOffence],
  });

  newYearly.yearlyKarma += karmagained;

  const update = {
    yearlyOffences: [
      newYearly,
      ...oneUser.yearlyOffences.filter((y: any) => y.year !== year),
    ],
  };

  const model = await offencesmodel.findOneAndUpdate(
    { guildId: guild.id, userId: user.id },
    update,
    putOptions
  );
  model?.save();
};

const updateForExistingWeek = async function (
  guild: Guild,
  user: User,
  off: OffenceType,
  karmagained: number,
  oneUser: IOffences,
  week: number,
  year: number,
  weekly: WeeklyOffences,
  yearly: YearlyOffences
) {
  const newOffence: OffenceType = {
    offenceType: off.offenceType,
    offenceDescription: off.offenceDescription,
    commitedOn: off.commitedOn,
    newKarma: weekly.weeklyKarma + karmagained,
    karmaChange: karmagained,
  };

  let newYearly: YearlyOffences = yearly;

  [...newYearly.weeklyData.filter((w) => w.weekNumber === week)].push({
    weekNumber: week,
    weeklyKarma: weekly.weeklyKarma + karmagained,
    Offences: [...weekly.Offences, newOffence],
  });
  newYearly.yearlyKarma += karmagained;
  newYearly.year = year;

  const update = {
    yearlyOffences: [
      newYearly,
      ...oneUser.yearlyOffences.filter((y: any) => y.year !== year),
    ],
  };

  const model = await offencesmodel.findOneAndUpdate(
    { guildId: guild.id, userId: user.id },
    update,
    putOptions
  );
  model?.save();
};

const updateExistingOffences = async function (
  guild: Guild,
  user: User,
  off: OffenceType,
  karmagained: number,
  oneUser: IOffences
) {
  // ignore for now
  const week = getCurrentWeek();
  console.log(week);
  const year = getCurrentYear();

  const yearly: YearlyOffences | undefined = oneUser.yearlyOffences.filter(
    (y) => y.year === year
  )[0] || undefined;

  if (!yearly) {
    // no data for this year
    updateForNewYear(guild, user, off, karmagained, oneUser, week, year);
    return;
  }

  let weekly: WeeklyOffences | undefined = yearly?.weeklyData.filter(
    (w) => w.weekNumber === week
  )[0];

  if (!weekly) {
    // no data for this week
    updateForNewWeek(
      guild,
      user,
      off,
      karmagained,
      oneUser,
      week,
      year,
      yearly
    );
    return;
  }

  // update for existing week
  updateForExistingWeek(
    guild,
    user,
    off,
    karmagained,
    oneUser,
    week,
    year,
    weekly,
    yearly
  );
};

const createNewOffenceUser = async function (
  guild: Guild,
  user: User,
  off: OffenceType,
  karmagained: number
) {
  const week = getCurrentWeek();
  const update: IOffences = {
    guildId: guild.id,
    userId: user.id,
    yearlyOffences: [
      {
        year: getCurrentYear(),
        yearlyKarma: 1500 + karmagained,
        weeklyData: [
          {
            weekNumber: week,
            weeklyKarma: 1500 + karmagained,
            Offences: [
              {
                offenceType: off.offenceType,
                offenceDescription: off.offenceDescription,
                commitedOn: off.commitedOn,
                newKarma: 1500 + karmagained,
                karmaChange: karmagained,
              },
            ],
          },
        ],
      },
    ],
  };
  const model = await offencesmodel.findOneAndUpdate(
    { guildId: guild.id, userId: user.id },
    update,
    putOptions
  );
  model?.save();
};

export const putOffence = async function (
  guild: Guild,
  user: User,
  off: OffenceType,
  karmagained: number
) {
  const oneUser: IOffences | null = await offencesmodel.findOne({
    guildId: guild.id,
    userId: user.id,
  });

  Print("tried to put offence");

  if (oneUser && oneUser.yearlyOffences.length > 0) {
    Print("tried to put update existing offence");
    updateExistingOffences(guild, user, off, karmagained, oneUser);
  } else {
    Print("tried to put create new offence");
    createNewOffenceUser(guild, user, off, karmagained);
  }
};

// returns current weeks standings
export const fetchStandings = async function (guild: Guild) {
  const allUsers = await offencesmodel.find({ guildId: guild.id });
  const userlist: { userId: string; karma: number }[] = [];

  const week = getCurrentWeek();
  const year = getCurrentYear();

  allUsers.forEach((u: any) => {
    if (u.userId && u.yearlyOffences.length > 0) {
      const thisWeek = u.yearlyOffences
        .filter((y: YearlyOffences) => y.year === year)[0]
        .weeklyData.filter((w: WeeklyOffences) => w.weekNumber === week)[0];
      if (thisWeek)
        userlist.push({ userId: u.userId, karma: thisWeek.weeklyKarma });
    }
  });

  if (userlist) {
    userlist.sort((a, b) => b.karma - a.karma);
  }

  return userlist;
};

export const fetchOffencesForUser = async function (guild: Guild, user: User) {
  const theUser: IOffencesModel | null = await offencesmodel.findOne({
    guildId: guild.id,
    userId: user.id,
  });

  return undefined;

  /*
  const week = getCurrentWeek();
  const year = getCurrentYear();


  if (offs) {
    offs.sort((a: OffenceType, b: OffenceType) => {
      return b.commitedOn.getTime() - a.commitedOn.getTime();
    });
  }

  return offs;
  */
};

export const fetchOffencesForUserBeforeDate = async function (
  guild: Guild,
  user: User,
  date: Date
) {
  const offs = await fetchOffencesForUser(guild, user);
  /*
  if (offs) {
    offs.filter((o: OffenceType) => {
      o.commitedOn.getTime() < date.getTime();
    });
  }
  */

  return offs;
};

export const fetchGoodDeeds = async function () {
  const usersArray = await offencesmodel.find({});

  const offs: OffenceType[] = [];
  /*
  usersArray.forEach((u: { Offences: OffenceType[] }) => {
    u.Offences.forEach((o: OffenceType) => {
      if (o.offenceType == 2) {
        offs?.push(o);
      }
    });
  });
  */

  return offs;
};
