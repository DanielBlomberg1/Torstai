import { Client, InternalDiscordGatewayAdapterCreator } from "discord.js";
import { getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import { Print } from "../utils/Print";

export default (client: Client): void => {
  client.on("voiceStateUpdate", (oldState, newState) => {
    let c = getVoiceConnection(newState.guild.id);

    // if bot not in voice and somebody joins voice
    if (!c) {
      let size = 0;
      let curId = "";
      let curName = "";

      // join channel with most users
      newState.guild.channels.cache.forEach((c) => {
        if (c.isVoiceBased() && c.joinable && c.members.size > size) {
          size = c.members.size;
          curId = c.id;
          curName = c.name;
        }
      });
      if (curId != "") {
        joinVoiceChannel({
          channelId: curId,
          guildId: newState.guild.id as string,
          adapterCreator: newState.guild
            ?.voiceAdapterCreator as InternalDiscordGatewayAdapterCreator,
          selfDeaf: false,
        });
        Print(
          "Joined voicechannel " +
            curName +
            " on server " +
            newState.guild.name +
            "because it has a size of " +
            size
        );
        c = getVoiceConnection(newState.guild.id);
      }
    }
    if (!c) {
      return;
    }

    const oldSz: number = oldState.channel?.members.size as number;
    const newSz: number = newState.channel?.members.size as number;
    let oldBots: number = 0;
    let newBotz: number = 0;

    let isBotOnOldChannel = false;

    oldState.channel?.members.forEach((e) => {
      if (e.id === process.env.BOT_ID) {
        isBotOnOldChannel = true;
      }
      if (e.user.bot) {
        oldBots++;
      }
    });

    let isBotOnNewChannel = false;

    newState.channel?.members.forEach((e) => {
      if (e.id === process.env.BOT_ID) {
        isBotOnNewChannel = true;
      }
      if (e.user.bot) {
        newBotz++;
      }
    });

    // console.log("oldchannel:" + (isBotOnOldChannel && oldSz < 2) , "newchannel:" + (isBotOnNewChannel && newSz < 2))
    // console.log("oldsize: " + oldSz, "newsize: " + newSz);

    if (oldState.channel != newState.channel) {
      if (
        (isBotOnOldChannel && oldSz < 2) ||
        (isBotOnNewChannel && newSz < 2)
      ) {
        c.destroy();
        Print("nobody here... disconnecting...");
      } else if (
        (isBotOnOldChannel && oldSz === oldBots) ||
        (isBotOnNewChannel && newSz === newBotz)
      ) {
        c.destroy();
        Print("Only bots here... disconnecting...");
      }
    }
  });
};
