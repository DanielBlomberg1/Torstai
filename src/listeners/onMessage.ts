import { Client, Message } from "discord.js";
import CheckForGoodWords from "../utils/CheckForGoodWords";
import { OffenceEnum } from "../Database/schemas/offencesmodel.types";
import CheckForBadWords from "../utils/CheckForBadWords";
import { Print } from "../utils/Print";
import { getFirstMessage, removeFirstMessage } from "../utils/messageQueue";
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, getVoiceConnection } from "@discordjs/voice";

import * as googleTTS from 'google-tts-api';


let audioQueue: any[] = [];

export default (client: Client): void => {
  client.on("messageCreate", async (msg: Message) => {
    if (msg.guild) {
        // if message is a reply to my message
        if(msg.reference?.messageId === (getFirstMessage() || "0")){
          const connection = getVoiceConnection(msg.guild.id);

          const player = createAudioPlayer();
        
          player.on(AudioPlayerStatus.Idle, () => {
            audioQueue.shift();
            if (audioQueue.length > 0) {
              player.play(audioQueue[0]);
            }
          });
        
          if (connection) {
            connection.subscribe(player);
          }
          
          let content = msg.content;
          if (content.length > 200) {
            content = content.substring(0, 200);
          }

          // Generate TTS url
          const url = googleTTS.getAudioUrl(content, {
            lang: 'fi',
            slow: false,
            host: 'https://translate.google.com',
          });
        
          const resource = createAudioResource(url);
          audioQueue.push(resource);
          if (audioQueue.length === 1) {
            player.play(resource);
          }

          removeFirstMessage();
        }
      
      CheckForBadWords(
        msg.content.toLowerCase(),
        msg.author,
        msg.guild,
        OffenceEnum.written
      );

      CheckForGoodWords(msg.content, msg.author, msg.guild);

      if (msg.content.length > 0) {
        Print(msg.author.username + ": " + msg.content);
      }
    }
  });
};
