import { VoiceMessage } from "discord-speech-recognition";
import { Client, Guild, TextChannel } from "discord.js";
import fs from "fs";

export default (client: Client): void => {
  client.on("speech", async (msg: VoiceMessage) => {
    // If bot didn't recognize speech, content will be empty
    if (!msg.content) return;


    if (msg.content.startsWith("Soita")) {
      let whatToPlay = msg.content.replace("Soita", ":D play");
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
