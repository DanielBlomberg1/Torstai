import { fetchPrefix, fetchTextChannel } from "./../Database/Mongoose";
import { VoiceMessage } from "discord-speech-recognition";
import { Client, Guild, TextChannel, User } from "discord.js";
import fs from "fs";
import YTDlpWrap from "yt-dlp-wrap";
import * as googleTTS from 'google-tts-api';

import { PlaySoundEffect } from "../audio/SoundEffectPlayer";

import { Print } from "../utils/Print";
import { audioclips, susaudioclips } from "../utils/audioclips";
import CheckForBadWords from "../utils/CheckForBadWords";
import { OffenceEnum } from "../Database/schemas/offencesmodel.types";
import CheckForGoodWords from "../utils/CheckForGoodWords";
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, getVoiceConnection } from "@discordjs/voice";
import socket from "src/utils/socket";

const outputPath = "./public/output.mp3";
let isDownloading = false;

let audioQueue: any[] = [];

const ytdlp = new YTDlpWrap("./public/yt-dlp.exe");

const tryToSend = (channel: TextChannel, msg: string, author: User) => {
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

    if(msg.content.toLowerCase().startsWith("perjantai")) {
      // I want to make the bot say perjantai in the voice channel
      const connection = getVoiceConnection(guild.id);

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

      // Send message to Socket.IO server and wait for response
      let messageContent = msg.content.toLowerCase();
      messageContent = messageContent.replace('perjantai', '').trim();

      socket.emit('perjantai', messageContent);
      socket.on('perjantaires', (responseMessage) => {
        const url = googleTTS.getAudioUrl(responseMessage, {
          lang: 'fi',
          slow: false,
          host: 'https://translate.google.com',
        });

        const resource = createAudioResource(url);
        audioQueue.push(resource);
        if (audioQueue.length === 1) {
          player.play(resource);
        }
      });
    }

    // do some loop here idk its been too long
    runCommand(client, "Soita", "play", message, guild, author);
    runCommandSimple(client, "Banaani on", "skip", message, guild, author);
    runCommandSimple(client, "Skippaa", "skip", message, guild, author);
    runCommandSimple(client, "Tyhjennä", "clear", message, guild, author);

    audioCommands(msg);

    timeBasedCommands(msg);

    //implement jail for badwords

    Print(msg.author.username + ": " + msg.content);
  });
};

const timeBasedCommands = async (msg: VoiceMessage) => {
  const d = new Date();

  if (d.getHours() === 3 && d.getMinutes() === 0) {
    // sus youtube file
    if (!fs.existsSync(outputPath) && !isDownloading && ytdlp) {
      isDownloading = true;
      const randomnumber = Math.floor(Math.random() * susaudioclips.length);

      Print("Started downloading sus audio clip");
      ytdlp
        .execPromise([
          susaudioclips[randomnumber],
          "-x",
          "--audio-format",
          "mp3",
          "-o",
          outputPath,
        ])
        .then(() => {
          Print("Downloaded Sus file at 3AM");
          isDownloading = false;
          PlaySoundEffect(msg.guild, outputPath);
        });
    }
  }
};
