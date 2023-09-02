import { fetchAutoJoin } from "./../Database/Mongoose";
import { Client, VoiceChannel, VoiceState } from "discord.js";
import {
  DiscordGatewayAdapterCreator,
  getVoiceConnection,
  joinVoiceChannel,
  VoiceConnection,
} from "@discordjs/voice";
import { Print } from "../utils/Print";
import fs from "fs";
import { PlayerStopPlaying } from "../audio/SoundEffectPlayer";

const tempFile3AM = "./public/output.mp3";

const selfDestruct = (c: VoiceConnection) => {
  c.destroy();
  Print("Only bots here... disconnecting...");
  PlayerStopPlaying();

  if (fs.existsSync(tempFile3AM)) {
    console.log("DELETING FILE OUTPUT.mp3...");

    setTimeout(() => {
      fs.unlinkSync(tempFile3AM);
      console.log("SUCCESSFULLY DELETED FILE OUTPUT.mp3");
    }, 5000);
  }
};

const isBotOnChannel = (c: VoiceChannel, botId:string)=>{
  let isBotOnChannel = false;
  let bots = 0;
  c?.members.forEach((e) => {
    if (e.id === botId) {
      isBotOnChannel = true;
    }
    if (e.user.bot) {
      bots++;
    }
  });
  return [isBotOnChannel, bots];
}

const disconnectCheck = (
  c: VoiceConnection,
  oldState: VoiceState,
  newState: VoiceState,
  botId: string
) => {
  const oldSz: number = oldState.channel?.members.size as number;
  const newSz: number = newState.channel?.members.size as number;

  const [isBotOnOldChannel, oldBots] = isBotOnChannel(oldState.channel as VoiceChannel, botId);
  const [isBotOnNewChannel, newBotz] = isBotOnChannel(newState.channel as VoiceChannel, botId);

  if (oldState.channel != newState.channel) {
    if ((isBotOnOldChannel && oldSz < 2) || (isBotOnNewChannel && newSz < 2)) {
      selfDestruct(c);
    } else if (
      (isBotOnOldChannel && oldSz === oldBots) ||
      (isBotOnNewChannel && newSz === newBotz)
    ) {
      selfDestruct(c);
    }
  }
};

export default (client: Client): void => {
  client.on("voiceStateUpdate", async (oldState, newState) => {
    const botId = client.user?.id as string;
    let c = getVoiceConnection(newState.guild.id);
    const autoJoin = await fetchAutoJoin(newState.guild.id);

    // if bot not in voice and somebody joins voice
    if (c === undefined && autoJoin) {
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
      if (curId === "") {
        return;
      }
      joinVoiceChannel({
        channelId: curId,
        guildId: newState.guild.id as string,
        adapterCreator: newState.guild
          ?.voiceAdapterCreator as DiscordGatewayAdapterCreator,
        selfDeaf: false,
      });
      Print(
        "Joined voicechannel " +
          curName +
          " on server " +
          newState.guild.name +
          " because it has a size of " +
          size
      );
      c = getVoiceConnection(newState.guild.id);
    }
    if(c === undefined) {
      return;
    }
    disconnectCheck(c, oldState, newState, botId);
  });
};
