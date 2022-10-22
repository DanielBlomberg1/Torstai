import { VoiceMessage } from "discord-speech-recognition";
import { Client, TextChannel } from "discord.js";
import { Print } from "../utils/Print";

let commandPrefix = ":D";

const tryToSend = (channel: TextChannel,msg : string, author: VoiceMessage) => {
  if (typeof channel !== "undefined") {
    channel.send(msg);
  } else {
    Print("On server: " + author.guild.name + " : error writing to text channel please register channel first with /register command");
    author.author.send(
      "On server: " + author.guild.name + " : error please register channel first with /register command"
    );
  }
}

const runCommand = (
  client: Client,
  word: string,
  getsReplacedBy: string,
  msg: VoiceMessage
) => {
  if (msg.content?.toLowerCase().startsWith(word.toLowerCase())) {
    let whatWrite = msg.content?.replace(
      word,
      commandPrefix + " " + getsReplacedBy
    );
    const chatChannel = global.mainTextChannels.get(msg.guild.id) as string;

    if(chatChannel){
      let channel = client.channels.cache.get(
        chatChannel
      ) as TextChannel;
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
    let whatWrite = commandPrefix + " " + printsCommand;

    const chatChannel = global.mainTextChannels.get(msg.guild.id) as string;

    if(chatChannel){
      let channel = client.channels.cache.get(
        chatChannel
      ) as TextChannel;
      tryToSend(channel, whatWrite, msg);
    }  
  }
};

export default (client: Client): void => {
  client.on("speech", async (msg: VoiceMessage) => {
    // If bot didn't recognize speech, content will be empty
    if (!msg.content) return;

    // do some loop here idk its been too long
    runCommand(client, "Soita", "play", msg);
    runCommandSimple(client, "Banaani on", "skip", msg);
    runCommandSimple(client, "Skippaa", "skip", msg);
    runCommandSimple(client, "tyhjennä", "clear", msg);

    //implement jail for badwords

    Print(msg.author.username + ": " + msg.content);
  });
};
