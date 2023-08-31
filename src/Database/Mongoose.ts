
import { Guild, GuildMember, PartialGuildMember, User } from "discord.js";
import configmodel from "./schemas/serverconfig";
import offencesmodel from "./schemas/offencesmodel";
import guildModel from "./schemas/guilds";
import {
  IOffences,
  OffenceType,
  YearlyOffences,
  WeeklyOffences,
} from "./schemas/offencesmodel.types";

import {
  getCurrentWeek,
  getCurrentYear,
} from "../utils/dateUtils";
import {
  AuthLevel,
  GuildData,
  MemberData as MemberData,
} from "./schemas/guilds.types";

import { Print } from "../utils/Print";

export const putOptions = {
  upsert: true,
  new: true,
  setDefaultsOnInsert: true,
};

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

// Inserts new guild to database if it doesn't exist
export const putGuild = async function (guild: Guild | null) {
  if (!guild) return;

  if ((await guildModel.find({ guildId: guild.id }).count()) === 0) {
    const guildData = await getGuildData(guild);

    await guildModel.insertMany(guildData);

    Print("Added new guild " + guild.name + " to database");
  } else {
    Print(
      "Tried adding guild " + guild.name + " to database, but it already exists"
    );
  }
};

export const addGuildMember = async function (member: GuildMember) {
  const memberData = getMemberData(member);

  await guildModel.updateOne(
    { guildId: member.guild.id },
    { $push: { users: memberData } }
  );

  Print("Added new guild member " + member.user.username + " to the database");
};

export const removeGuildMember = async function (
  member: GuildMember | PartialGuildMember
) {
  const query = { guildId: member.guild.id, "users.userId": member.id };
  const update = {
    active: false,
    authLevel: AuthLevel.NONE,
  };

  await guildModel.updateOne(query, {
    $set: {
      "users.$.active": update.active,
      "users.$.authLevel": update.authLevel,
    },
  });

  Print(
    "Deactivated guild member: " + member.user.username + "  from database"
  );
};

export const updateGuildMember = async function (member: GuildMember) {
  const query = { guildId: member.guild.id, "users.userId": member.id };
  const update = {
    id: member.id,
    tag: member.user.tag,
    username: member.user.username,
    nickname: member.nickname || member.user.username,
    avatarURL:
      member.user.avatarURL() ||
      "https://cdn.discordapp.com/embed/avatars/0.png",
    bot: member.user.bot,
  };

  await guildModel.updateOne(query, {
    $set: {
      "users.$.id": update.id,
      "users.$.tag": update.tag,
      "users.$.username": update.username,
      "users.$.nickname": update.nickname,
      "users.$.avatarURL": update.avatarURL,
      "users.$.bot": update.bot,
    },
  });

  Print("Updated user " + member.user.username);
};

export const updateGuildData = async function (guild: Guild) {
  Print("Updating guild " + guild.name);

  const update = {
    guildId: guild.id,
    name: guild.name,
    iconURL: guild.iconURL() || "",
  };

  const model = await guildModel.findOneAndUpdate(
    { guildId: guild.id },
    update,
    putOptions
  );

  model?.save();
};

const getGuildData = async function (guild: Guild): Promise<GuildData> {
  const members = await guild.members.fetch();

  const memberData: MemberData[] = [];

  members.forEach((member) => {
    memberData.push(getMemberData(member));
  });

  const guildData: GuildData = {
    guildId: guild.id,
    name: guild.name,
    iconURL:
      guild.iconURL() || "https://cdn.discordapp.com/embed/avatars/0.png",
    users: memberData,
  };

  return guildData;
};

const getMemberData = function (member: GuildMember): MemberData {
  const userData: MemberData = {
    userId: member.id,
    tag: member.user.tag,
    username: member.user.username,
    nickname: member.nickname || member.user.username,
    avatarURL:
      member.user.avatarURL() ||
      "https://cdn.discordapp.com/embed/avatars/0.png",
    bot: member.user.bot,
    active: true,
    authLevel: AuthLevel.KARHU,
  };

  return userData;
};

const updateForNewYear = async function (
  guild: Guild,
  user: User,
  off: OffenceType,
  karmagained: number,
  offender: IOffences,
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
    yearlyOffences: [newYearly, ...offender.yearlyOffences],
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
  offender: IOffences,
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

  const newYearly: YearlyOffences = yearly;
  newYearly.weeklyData.push({
    weekNumber: week,
    weeklyKarma: 1500 + karmagained,
    Offences: [newOffence],
  });

  newYearly.yearlyKarma += karmagained;

  const update = {
    yearlyOffences: [
      newYearly,
      ...offender.yearlyOffences.filter((y: YearlyOffences) => y.year !== year),
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
  offender: IOffences,
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

  const newYearly: YearlyOffences = yearly;

  newYearly.weeklyData
    .filter((w) => w.weekNumber === week)[0]
    .Offences.push(newOffence);

  newYearly.weeklyData.filter((w) => w.weekNumber === week)[0].weeklyKarma +=
    karmagained;
  newYearly.yearlyKarma += karmagained;
  newYearly.year = year;

  const update = {
    yearlyOffences: [
      newYearly,
      ...offender.yearlyOffences.filter((y: YearlyOffences) => y.year !== year),
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
  offender: IOffences
) {
  const week = getCurrentWeek();
  const year = getCurrentYear();

  const yearly: YearlyOffences | undefined =
    offender.yearlyOffences.filter((y) => y.year === year)[0] || undefined;

  if (!yearly) {
    // no data for this year
    updateForNewYear(guild, user, off, karmagained, offender, week, year);
    return;
  }

  const weekly: WeeklyOffences | undefined = yearly?.weeklyData.filter(
    (w) => w.weekNumber === week
  )[0];

  if (!weekly) {
    // no data for this week
    updateForNewWeek(
      guild,
      user,
      off,
      karmagained,
      offender,
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
    offender,
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
  const offender: IOffences | null = await offencesmodel.findOne({
    guildId: guild.id,
    userId: user.id,
  });

  if (offender && offender.yearlyOffences.length > 0) {
    updateExistingOffences(guild, user, off, karmagained, offender);
  } else {
    createNewOffenceUser(guild, user, off, karmagained);
  }
};

// returns current weeks standings
export const fetchStandings = async function (guild: Guild) {
  const week = getCurrentWeek();
  const year = getCurrentYear();

  return fetchStandingsForGivenWeek(guild, week, year);
};

export const fetchStandingsForGivenWeek = async function (
  guild: Guild,
  week: number,
  year: number
) {
  const allUsers = await offencesmodel.find({ guildId: guild.id });
  const userlist: { userId: string; karma: number }[] = [];

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
  const theUser: IOffences | null = await offencesmodel.findOne({
    guildId: guild.id,
    userId: user.id,
  });

  const week = getCurrentWeek();
  const year = getCurrentYear();

  let offs: OffenceType[] = [];

  if (theUser) {
    const thisWeek = theUser.yearlyOffences
      .filter((y: YearlyOffences) => y.year === year)[0]
      .weeklyData.filter((w: WeeklyOffences) => w.weekNumber === week)[0];
    offs = thisWeek.Offences;
  }

  offs = offs.filter((o: OffenceType) => o.offenceType != 2);

  if (offs) {
    offs.sort((a: OffenceType, b: OffenceType) => {
      return b.commitedOn.getTime() - a.commitedOn.getTime();
    });
  }

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

export const getServerAdminName = async function (guild: Guild) {
  return (await guild.fetchOwner()).user.username;
};
