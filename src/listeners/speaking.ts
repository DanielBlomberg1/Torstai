import { VoiceMessage } from "discord-speech-recognition";
import { Client, TextChannel } from "discord.js";

let commandPrefix = ":D";

const tryToSend = (channel: TextChannel,msg : string, author: VoiceMessage) => {
  if (typeof channel !== "undefined") {
    channel.send(msg);
  } else {
    console.log("error please register channel first with /register command");
    author.author.send(
      "error please register channel first with /register command"
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
    let channel = client.channels.cache.get(
      globalThis.mainTextChannel
    ) as TextChannel;
    tryToSend(channel, whatWrite, msg);
    
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
    let channel = client.channels.cache.get(
      globalThis.mainTextChannel
    ) as TextChannel;
    tryToSend(channel, whatWrite, msg);
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

    console.log(msg.content);
  });
};
