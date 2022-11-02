import { Guild, User } from "discord.js";
import configmodel from "./schemas/serverconfig";
import usersmodel from "./schemas/usersmodel";
import { OffenceType } from "./schemas/usersmodel.types";

const putOptions = { upsert: true, new: true, setDefaultsOnInsert: true };

export const fetchPrefix = async function (id: string) {
  let config = await configmodel.findOne({ guildId: id });
  if (config) {
    return config.commandPrefix;
  }
  return null;
};

export const fetchAutoJoin = async function (id: string) {
  let config = await configmodel.findOne({ guildId: id });
  if (config) {
    return config.autoJoin;
  }

  return null;
};

export const fetchTextChannel = async function (id: string) {
  let config = await configmodel.findOne({ guildId: id });
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
  let update = {
    guildId: gId,
    outputChannelId: channelId,
    commandPrefix: prefix,
    autoJoin: join,
  };
  let model = await configmodel.findOneAndUpdate(
    { guildId: gId },
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
  let oneUser = await usersmodel.findOne({
    guildId: guild.id,
    userId: user.id,
  });
  if (oneUser && oneUser.karma) {
    // ignore for now
    let newOffences = [...oneUser.Offences];

    newOffences.push({
      offenceType: off.offenceType,
      offenceDescription: off.offenceDescription,
      commitedOn: off.commitedOn,
      karmaChange: karmagained,
    });

    let update = {
      karma: oneUser.karma + karmagained,
      Offences: [...newOffences],
    };
    let model = await usersmodel.findOneAndUpdate(
      { guildId: guild.id, userId: user.id },
      update,
      putOptions
    );
    model?.save();
  } else {
    let update = {
      guildId: guild.id,
      userId: user.id,
      karma: 1500 + karmagained,
      Offences: [
        {
          offenceType: off.offenceType,
          offenceDescription: off.offenceDescription,
          commitedOn: off.commitedOn,
          karmaChange: karmagained,
        },
      ],
    };
    let model = await usersmodel.findOneAndUpdate(
      { guildId: guild.id, userId: user.id },
      update,
      putOptions
    );
    model?.save();
  }
};

export const fetchStadings = async function (guild: Guild) {
  const allUsers = await usersmodel.find({ guildId: guild.id });
  let userlist: { userId: string; karma: number }[] = [];

  allUsers.forEach((u) => {
    if (u.userId && u.karma) {
      userlist.push({ userId: u.userId, karma: u.karma });
    }
  });
  return userlist;
};

export const fetchOffencesForUser = async function (guild: Guild, user: User) {
  const theUser = await usersmodel.findOne({
    guildId: guild.id,
    userId: user.id,
  });

  return theUser?.Offences;
};
