import { fetchPrefix, fetchTextChannel } from "./../Database/Mongoose";
import { VoiceMessage } from "discord-speech-recognition";
import { Client, Guild, TextChannel, User } from "discord.js";

import { PlaySoundEffect, player } from "../audio/SoundEffectPlayer";

import { Print } from "../utils/Print";
import { audioclips } from "../utils/audioclips";
import CheckForBadWords from "../utils/CheckForBadWords";
import { OffenceEnum } from "../Database/schemas/offencesmodel.types";
import CheckForGoodWords from "../utils/CheckForGoodWords";
import {
  AudioPlayerStatus,
  AudioResource,
  createAudioResource,
  getVoiceConnection,
} from "@discordjs/voice";

import * as googleTTS from "google-tts-api";
import socket from "../utils/socket";

const audioQueue: AudioResource[] = [];

const handleIdle = () => {
  audioQueue.shift();
  if (audioQueue.length > 0) {
    player.play(audioQueue[0]);
  } else {
    player.off(AudioPlayerStatus.Idle, handleIdle);
  }
};

player.on(AudioPlayerStatus.Idle, handleIdle);

const tryToSend = async (channel: TextChannel, msg: string, author: User) => {
  const name = channel.guild.name;

  if (typeof channel !== "undefined") {
    channel.send(msg);
  } else {
    Print(
      "On server: " +
        name +
        " : error writing to text channel please register channel first with /configure command"
    );
    author.send(
      "On server: " +
        name +
        " : error please register channel first with /configure command"
    );
  }
};

const runCommand = async (
  client: Client,
  word: string,
  getsReplacedBy: string,
  msg: string,
  guild: Guild,
  author: User
) => {
  if (msg.toLowerCase().startsWith(word.toLowerCase())) {
    const whatWrite = msg?.replace(
      word,
      (await fetchPrefix(guild.id)) + " " + getsReplacedBy
    );
    const chatChannel = await fetchTextChannel(guild.id);

    if (chatChannel) {
      const channel = client.channels.cache.get(chatChannel) as TextChannel;
      tryToSend(channel, whatWrite, author);
    }
  }
};
const runCommandSimple = async (
  client: Client,
  word: string,
  printsCommand: string,
  msg: string,
  guild: Guild,
  author: User
) => {
  if (msg.toLowerCase().startsWith(word.toLowerCase())) {
    const whatWrite = (await fetchPrefix(guild.id)) + " " + printsCommand;
    const chatChannel = await fetchTextChannel(guild.id);

    if (chatChannel) {
      const channel = client.channels.cache.get(chatChannel) as TextChannel;
      tryToSend(channel, whatWrite, author);
    }
  }
};

const audioCommands = (msg: VoiceMessage) => {
  audioclips.forEach((clip: string) => {
    if (msg.content?.toLowerCase().includes(clip)) {
      PlaySoundEffect(msg.guild, "./public/" + clip + ".mp3");
    }
  });
};

export default (client: Client): void => {
  client.on("speech", async (msg: VoiceMessage) => {
    // If bot didn't recognize speech, content will be empty
    if (!msg.content) return;

    const guild = msg.guild;
    const message = msg.content[0].toUpperCase() + msg.content.substring(1);
    const author = msg.author;

    CheckForBadWords(
      msg.content.toLowerCase(),
      msg.author,
      msg.guild,
      OffenceEnum.oral
    );
    CheckForGoodWords(msg.content, msg.author, msg.guild);

    if (msg.content.toLowerCase().startsWith("perjantai")) {
      const connection = getVoiceConnection(guild.id);

      if (connection) {
        connection.subscribe(player);
      }

      socket.emit(
        "backend_generate_text",
        msg.content.replace("perjantai", "").trimStart() + "\n",
        (text: string) => {
          Print("Received text from backend: " + text);

          if (text.length > 200) {
            text = text.substring(0, 200);
          }

          // Generate TTS url
          const url = googleTTS.getAudioUrl(text, {
            lang: "fi",
            slow: false,
            host: "https://translate.google.com",
          });

          const resource = createAudioResource(url);
          audioQueue.push(resource);
          if (audioQueue.length === 1) {
            player.play(resource);
          }
          player.play(resource);
        }
      );
      Print("tried to emit a message to backend");
    }

    // do some loop here idk its been too long
    runCommand(client, "Soita", "play", message, guild, author);
    runCommandSimple(client, "Banaani on", "skip", message, guild, author);
    runCommandSimple(client, "Skippaa", "skip", message, guild, author);
    runCommandSimple(client, "Tyhjennä", "clear", message, guild, author);

    audioCommands(msg);

    //implement jail for badwords

    Print(msg.author.username + ": " + msg.content);
  });
};
