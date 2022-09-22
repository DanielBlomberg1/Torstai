import { VoiceMessage } from "discord-speech-recognition";
import { Client, Guild, TextChannel } from "discord.js";

export default (client: Client): void => {
  client.on("speech", (msg : VoiceMessage, listOfDefaultChatChannels : Map<Guild, TextChannel>) => {
    // If bot didn't recognize speech, content will be empty
    if (!msg.content) return;

    if(msg.content.startsWith("Soita")){
        let whatToPlay = msg.content.replace("Soita", ":D play")
        let channel = listOfDefaultChatChannels.get(msg.guild);
        if(channel){
            channel.send(whatToPlay);
        }else{
            console.log("error please register channel first with /register command");
        }
        msg.author.send(whatToPlay);
    }
    //implement jail for badwords


    console.log(msg.content);
  });
};
