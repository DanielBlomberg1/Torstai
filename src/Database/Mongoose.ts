import {
  generateDailyQuest,
  generateWeeklyQuest,
  getQuestRewardBasedOnRarity,
} from "./../utils/questlists";
import { Guild, GuildMember, PartialGuildMember, User } from "discord.js";
import configmodel from "./schemas/serverconfig";
import offencesmodel from "./schemas/offencesmodel";
import guildModel from "./schemas/guilds";
import {
  IOffences,
  OffenceType,
  YearlyOffences,
  WeeklyOffences,
  OffenceEnum,
} from "./schemas/offencesmodel.types";

import { getCurrentWeek, getCurrentYear } from "../utils/dateUtils";
import {
  AuthLevel,
  GuildData,
  MemberData as MemberData,
} from "./schemas/guilds.types";
import questmodel from "./schemas/quest";
import {
  IQuestDocument,
  Quest,
  QuestStatus,
  QuestType,
} from "./schemas/questmodel.types";
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

    console.log("Added new guild to database");
  } else {
    console.log("Guild already exists in database");
  }
};

export const addGuildMember = async function (member: GuildMember) {
  const memberData = getMemberData(member);

  await guildModel.updateOne(
    { guildId: member.guild.id },
    { $push: { users: memberData } }
  );

  console.log("Added new guild member to database");
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

  console.log("Deactivated guild member from database");
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

  console.log("Updated user " + member.user.username);
};

export const updateGuildData = async function (guild: Guild) {
  console.log("Updating guild " + guild.name);

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
      ...offender.yearlyOffences.filter((y: any) => y.year !== year),
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
      ...offender.yearlyOffences.filter((y: any) => y.year !== year),
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

const CheckIfQuestOfThisTypeWasCompletedAlready= async function(quests: Quest[], questType: QuestType){
  const time = new Date();
  time.setDate(0 - (questType === QuestType.WEEKLY ? 7 : 1 ))

  const ActiveCompletedQuests = quests.filter(
    (q) =>
      q.questType ===  questType &&
      q.questStatus === QuestStatus.COMPLETED
  );
  let userHasDoneQuestThisWeek = false;
  
  ActiveCompletedQuests.forEach((quest: Quest) => {
    if (quest.generatedOn.getDate() === time.getDate()) {
      userHasDoneQuestThisWeek = true;
    }
  });
  return userHasDoneQuestThisWeek;
}

export const getQuestsForUser = async function (user: User, guild: Guild) {
  const usersquests: IQuestDocument[] = await questmodel.find({
    userId: user.id,
    guildId: guild.id,
  });

  // generate new guest if user doesnt have one active already
  // if users active quest is completed add good deed
  // if users quest is a daily one and it was generated yesterday, generate a new one
  // if users quest is a weekly one and it was generated last week, generate a new one

  const quests = usersquests[0]?.quests || [];

  const today = new Date();
  const yesterday = new Date(today);
  const weekAgo = new Date(today);

  yesterday.setDate(yesterday.getDate() - 1);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const activeQuests = quests.filter(
    (q) => q.questStatus === QuestStatus.ACTIVE
  );
  const dailyQuest = activeQuests.filter((q) => q.questType == QuestType.DAILY);
  const weeklyQuest = activeQuests.filter(
    (q) => q.questType == QuestType.WEEKLY
  );

  const newQuests: Quest[] = [];

  if (activeQuests.length == 0) {
    // no active quests, generate one

    if(!CheckIfQuestOfThisTypeWasCompletedAlready(quests, QuestType.DAILY)){
      const quest = generateDailyQuest();
      newQuests.push(quest);
      Print("user: " + user.username + " now has a new quest " + quest.questName);
    }
    if(!CheckIfQuestOfThisTypeWasCompletedAlready(quests, QuestType.WEEKLY)){
      const quest = generateWeeklyQuest();
      newQuests.push(quest);
      Print("user: " + user.username + " now has a new quest " + quest.questName);
    }
  } else {
    // check if active quests are completed
    if (dailyQuest.length > 0) {
      dailyQuest.forEach((q) => {
        if (q.generatedOn.getDate() < yesterday.getDate()) {
          Print(
            "user: " +
              user.username +
              "failed daily quest, generating new one..."
          );

          q.questStatus = QuestStatus.FAILED;
          // daily quest was generated yesterday, generate a new one
          const quest = generateDailyQuest();

          Print(
            "user: " + user.username + " now has a new quest " + quest.questName
          );

          newQuests.push(quest);
        }
      });
    } else {
      const userHasDoneDailyQuestToday = await CheckIfQuestOfThisTypeWasCompletedAlready(quests, QuestType.DAILY);
      if (!userHasDoneDailyQuestToday) {
        Print(
          "user: " +
            user.username +
            "completed daily quest, generating new one..."
        );

        const quest = generateDailyQuest();

        Print(
          "user: " + user.username + " now has a new quest " + quest.questName
        );

        newQuests.push(quest);
      }
    }
    if (weeklyQuest.length > 0) {
      weeklyQuest.forEach((q) => {
        if (q.generatedOn.getDate() < weekAgo.getDate()) {
          Print(
            "user: " +
              user.username +
              "failed weekly quest, generating new one..."
          );
          q.questStatus = QuestStatus.FAILED;
          // weekly quest was generated weekago, generate a new one
          const quest = generateWeeklyQuest();
          Print(
            "user: " + user.username + " now has a new quest " + quest.questName
          );
          newQuests.push(quest);
        }
      });
    } else {
      const userHasDoneQuestThisWeek = CheckIfQuestOfThisTypeWasCompletedAlready(quests, QuestType.WEEKLY);
      if (!userHasDoneQuestThisWeek) {
        Print(
          "user: " +
            user.username +
            "completed weekly quest, generating new one..."
        );

        const quest = generateWeeklyQuest();

        Print(
          "user: " + user.username + " now has a new quest " + quest.questName
        );

        newQuests.push(quest);
      }
    }
  }

  const update = {
    quests: [...quests, ...newQuests],
  };

  if (update.quests.length > quests.length) {
    console.log(update.quests);

    const model = await questmodel.findOneAndUpdate(
      { userId: user.id, guildId: guild.id },
      update,
      putOptions
    );

    model?.save();
  }

  return update.quests;
};

export const getActiveQuestsForUser = async function (
  user: User,
  guild: Guild
) {
  const quests = await getQuestsForUser(user, guild);
  return quests.filter((q) => q.questStatus === QuestStatus.ACTIVE);
};

export const getWeeklyAndDailyQuestsForUser = async function (
  user: User,
  guild: Guild
) {
  const today = new Date();
  const weekago = new Date();

  weekago.setDate(weekago.getDate() - 7);

  const quests = await getQuestsForUser(user, guild);
  return quests.filter(
    (q) =>
      (q.questType === QuestType.DAILY &&
        today.getDate() === q.generatedOn.getDate()) ||
      (q.questType === QuestType.WEEKLY &&
        weekago.getDate() < q.generatedOn.getDate())
  );
};

export const getServerAdminName = async function (guild: Guild) {
  return (await guild.fetchOwner()).user.username;
};

export const completeQuest = async function (
  user: User,
  guild: Guild,
  quest: Quest
) {
  console.log("trying to complete quest: " + quest.questName);
  const query = {
    guildId: guild.id,
    userId: user.id,
    "quests.questId": quest.questId,
  };

  await questmodel.updateOne(query, {
    $set: {
      "quests.$.questStatus": QuestStatus.COMPLETED,
    },
  });

  const offence: OffenceType = {
    offenceType: OffenceEnum.quest,
    offenceDescription:
      quest.questName + " " + quest.questRarity + " completed",
    commitedOn: new Date(),
    karmaChange: 1500,
    newKarma: 0,
  };

  await putOffence(
    guild,
    user,
    offence,
    getQuestRewardBasedOnRarity(quest.questRarity, quest.questType)
  );

  getQuestsForUser(user, guild);
};

export const partialCompleteQuest = async function (
  user: User,
  guild: Guild,
  quest: Quest
) {
  console.log("trying to partial complete quest");
  const query = {
    guildId: guild.id,
    userId: user.id,
    "quests.questId": quest.questId,
  };

  if (
    !(
      quest.optionalAttributes !== undefined &&
      quest.optionalAttributes.completionSteps !== undefined &&
      quest.optionalAttributes.currentCompletionSteps !== undefined
    )
  ) {
    return;
  }

  if (
    quest?.optionalAttributes?.completionSteps <=
    quest?.optionalAttributes?.currentCompletionSteps
  ) {
    completeQuest(user, guild, quest);
  } else {
    await questmodel.updateOne(query, {
      $inc: {
        "quests.$.optionalAttributes.currentCompletionSteps": 1,
      },
    });
  }
};
