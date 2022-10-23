import { VoiceMessage } from "discord-speech-recognition";
import { Client, Guild, TextChannel } from "discord.js";
import { PlaySoundEffect } from "../audio/SoundEffectPlayer";
import { Print } from "../utils/Print";

const audioclips = ["pallit", "väärä savu", "among us", "drift", "imen sun", "kakka", "skype", "windows", "hyvä fiilis", "McDonald's"];

export const getPrefix = (g: Guild) => {
  return (global.mainTextChannels.get(g.id)?.commandPrefix as string) || ":D";
};

const tryToSend = (channel: TextChannel, msg: string, author: VoiceMessage) => {
  if (typeof channel !== "undefined") {
    channel.send(msg);
  } else {
    Print(
      "On server: " +
        author.guild.name +
        " : error writing to text channel please register channel first with /register command"
    );
    author.author.send(
      "On server: " +
        author.guild.name +
        " : error please register channel first with /register command"
    );
  }
};

const runCommand = (
  client: Client,
  word: string,
  getsReplacedBy: string,
  msg: VoiceMessage
) => {
  if (msg.content?.toLowerCase().startsWith(word.toLowerCase())) {
    let whatWrite = msg.content?.replace(
      word,
      getPrefix(msg.guild) + " " + getsReplacedBy
    );
    const chatChannel = global.mainTextChannels.get(msg.guild.id)
      ?.outputChannelId as string;

    if (chatChannel) {
      let channel = client.channels.cache.get(chatChannel) as TextChannel;
      tryToSend(channel, whatWrite, msg);
    }
  }
};
const runCommandSimple = (
  client: Client,
  word: string,
  printsCommand: string,
  msg: VoiceMessage
) => {
  if (msg.content?.toLowerCase().startsWith(word.toLowerCase())) {
    let whatWrite = getPrefix(msg.guild) + " " + printsCommand;

    const chatChannel = global.mainTextChannels.get(msg.guild.id)
      ?.outputChannelId as string;

    if (chatChannel) {
      let channel = client.channels.cache.get(chatChannel) as TextChannel;
      tryToSend(channel, whatWrite, msg);
    }
  }
};

const audioCommands = (msg: VoiceMessage) =>{
  audioclips.forEach((clip : string)=>{
    if(msg.content?.toLowerCase().includes(clip)){
      PlaySoundEffect(msg.guild, "./public/" + clip+".mp3");
    }
  });
}

export default (client: Client): void => {
  client.on("speech", async (msg: VoiceMessage) => {
    // If bot didn't recognize speech, content will be empty
    if (!msg.content) return;

    // do some loop here idk its been too long
    runCommand(client, "Soita", "play", msg);
    runCommandSimple(client, "Banaani on", "skip", msg);
    runCommandSimple(client, "Skippaa", "skip", msg);
    runCommandSimple(client, "tyhjennä", "clear", msg);

    audioCommands(msg);

    timeBasedCommands(msg);

    //implement jail for badwords

    Print(msg.author.username + ": " + msg.content);
  });
};


const timeBasedCommands = (msg: VoiceMessage) => {
  const d = new Date();

  if(d.getHours() === 3 && d.getMinutes() === 0){
    // TODO add some 3am sound effects maybe
  }
}

