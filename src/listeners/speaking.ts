import { VoiceMessage } from "discord-speech-recognition";
import { Client, TextChannel } from "discord.js";

let commandPrefix = ":D"


export default (client: Client): void => {
  client.on("speech", async (msg: VoiceMessage) => {
    // If bot didn't recognize speech, content will be empty
    if (!msg.content) return;

    // do some loop here idk its been too long
    if (msg.content.startsWith("Soita")) {
      let whatToPlay = msg.content.replace("Soita", commandPrefix + " play");
      let channel = client.channels.cache.get(globalThis.mainTextChannel) as TextChannel;

      if (typeof channel !== "undefined") {
        channel.send(whatToPlay);
      } else {
        console.log(
          "error please register channel first with /register command"
        );
      }
      msg.author.send("error please register channel first with /register command");
    }else if(msg.content.startsWith("Skippaa")){
        let whatToPlay = msg.content.replace("Skippaa", commandPrefix + " skip");
        let channel = client.channels.cache.get(globalThis.mainTextChannel) as TextChannel;
        if (typeof channel !== "undefined") {
            channel.send(whatToPlay);
          } else {
            console.log(
              "error please register channel first with /register command"
            );
          }
          msg.author.send("error please register channel first with /register command");
    }

    //implement jail for badwords

    console.log(msg.content);
  });
};
