import { Client, InternalDiscordGatewayAdapterCreator } from "discord.js";
import { getVoiceConnection, joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import { Print } from "../utils/Print";
import fs from "fs";
import { PlayerStopPlaying } from "../audio/SoundEffectPlayer";

const tempFile3AM = "./public/output.mp3";

const selfDestruct = (c : VoiceConnection) =>{
  c.destroy();
  Print("Only bots here... disconnecting...");
  PlayerStopPlaying();

  if(fs.existsSync(tempFile3AM)){
    
      console.log("DELETING FILE OUTPUT.mp3...");

      setTimeout(() =>{
        fs.unlinkSync(tempFile3AM);
        console.log("SUCCESSFULLY DELETED FILE OUTPUT.mp3");
      }, 5000);
  }
  
}


export default (client: Client): void => {
  client.on("voiceStateUpdate", (oldState, newState) => {
    const botId = client.user?.id as string;
    let c = getVoiceConnection(newState.guild.id);
    const boolean = globalThis.mainTextChannels.get(newState.guild.id)?.autoJoin || true;

    // if bot not in voice and somebody joins voice
    if (!c && boolean) {
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
            " because it has a size of " +
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
      if (e.id === botId) {
        isBotOnOldChannel = true;
      }
      if (e.user.bot) {
        oldBots++;
      }
    });

    let isBotOnNewChannel = false;

    newState.channel?.members.forEach((e) => {
      if (e.id === botId) {
        isBotOnNewChannel = true;
      }
      if (e.user.bot) {
        newBotz++;
      }
    });

    if (oldState.channel != newState.channel) {
      if (
        (isBotOnOldChannel && oldSz < 2) ||
        (isBotOnNewChannel && newSz < 2)
      ) {
        selfDestruct(c);
      } else if (
        (isBotOnOldChannel && oldSz === oldBots) ||
        (isBotOnNewChannel && newSz === newBotz)
      ) {
        selfDestruct(c);
      }
    }
  });
};
