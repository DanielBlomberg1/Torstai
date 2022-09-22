import { VoiceMessage } from "discord-speech-recognition";
import { Client, TextChannel } from "discord.js";

let commandPrefix = ":D"


const runCommand = (client : Client, word : string, sentence : string, getsReplacedBy : string, author : VoiceMessage) => {
  if(sentence.toLowerCase().startsWith(word.toLowerCase())){
    let whatWrite = sentence.replace(word, commandPrefix + " " + getsReplacedBy);
    let channel = client.channels.cache.get(globalThis.mainTextChannel) as TextChannel;

    if (typeof channel !== "undefined") {
      channel.send(whatWrite);
    } else {
      console.log(
        "error please register channel first with /register command"
      );
      author.author.send("error please register channel first with /register command");
    }
  }
}


export default (client: Client): void => {
  client.on("speech", async (msg: VoiceMessage) => {
    // If bot didn't recognize speech, content will be empty
    if (!msg.content) return;
  
    // do some loop here idk its been too long
    runCommand(client, "Soita", msg.content, "play", msg);
    runCommand(client, "Banaani", msg.content, "skip", msg);
    runCommand(client, "Skippaa", msg.content, "skip", msg);
    runCommand(client, "tyhjennä", msg.content, "clear", msg);

    //implement jail for badwords

    console.log(msg.content);
  });
};
