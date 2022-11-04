import { Guild, User } from "discord.js";
import configmodel from "./schemas/serverconfig";
import usersmodel from "./schemas/usersmodel";
import { OffenceType } from "./schemas/usersmodel.types";

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

export const putOffence = async function (
  guild: Guild,
  user: User,
  off: OffenceType,
  karmagained: number
) {
  const oneUser = await usersmodel.findOne({
    guildId: guild.id,
    userId: user.id,
  });
  if (oneUser && oneUser.karma) {
    // ignore for now
    const newOffences = [...oneUser.Offences];

    newOffences.push({
      offenceType: off.offenceType,
      offenceDescription: off.offenceDescription,
      commitedOn: off.commitedOn,
      karmaChange: karmagained,
    });

    const update = {
      karma: oneUser.karma + karmagained,
      Offences: [...newOffences],
    };
    const model = await usersmodel.findOneAndUpdate(
      { guildId: guild.id, userId: user.id },
      update,
      putOptions
    );
    model?.save();
  } else {
    const update = {
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
    const model = await usersmodel.findOneAndUpdate(
      { guildId: guild.id, userId: user.id },
      update,
      putOptions
    );
    model?.save();
  }
};

export const fetchStandings = async function (guild: Guild) {
  const allUsers = await usersmodel.find({ guildId: guild.id });
  const userlist: { userId: string; karma: number }[] = [];

  allUsers.forEach((u: { userId: string; karma: number }) => {
    if (u.userId && u.karma) {
      userlist.push({ userId: u.userId, karma: u.karma });
    }
  });

  if (userlist) {
    userlist.sort((a, b) => a.karma - b.karma);
  }

  return userlist;
};

export const fetchOffencesForUser = async function (guild: Guild, user: User) {
  const theUser = await usersmodel.findOne({
    guildId: guild.id,
    userId: user.id,
  });

  const offs: OffenceType[] | undefined = theUser?.Offences.filter(
    (offence: OffenceType) => offence.offenceType != 2
  );

  if (offs) {
    offs.sort((a: OffenceType, b: OffenceType) => {
      return b.commitedOn.getTime() - a.commitedOn.getTime();
    });
  }

  return offs;
};

export const fetchOffencesForUserBeforeDate = async function (
  guild: Guild,
  user: User,
  date: Date
) {
  let offs = await fetchOffencesForUser(guild, user);
  if (offs) {
    offs.filter((o: OffenceType) => {
      o.commitedOn.getTime() < date.getTime();
    });
  }

  return offs;
};
