import { fetchPrefix, fetchTextChannel } from "./../Database/Mongoose";
import { VoiceMessage } from "discord-speech-recognition";
import { Client, Guild, TextChannel, User } from "discord.js";
import { promisify } from "util";
import { execFile } from "child_process";
import fs from "fs";

import { PlaySoundEffect } from "../audio/SoundEffectPlayer";

import { Print } from "../utils/Print";
import { audioclips, susaudioclips } from "../utils/audioclips";
import CheckForBadWords from "../utils/CheckForBadWords";
import { OffenceEnum } from "../Database/schemas/usersmodel.types";
import CheckForGoodWords from "../utils/CheckForGoodWords";

const execFile2 = promisify(execFile);
const outputPath = "./public/output.mp3";
let isDownloading = false;

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
    console.log("try to play", msg, word, whatWrite);

    if (chatChannel) {
      const channel = client.channels.cache.get(chatChannel) as TextChannel;
      console.log(channel.name);
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

const timeBasedCommands = (msg: VoiceMessage) => {
  const d = new Date();

  if (d.getHours() === 3 && d.getMinutes() === 0) {
    // sus youtube file
    if (!fs.existsSync(outputPath) && !isDownloading) {
      isDownloading = true;
      const randomnumber = Math.floor(Math.random() * susaudioclips.length);
      execFile2("./public/yt-dlp.exe", [
        "-x",
        "--audio-format",
        "mp3",
        "-o",
        outputPath,
        susaudioclips[randomnumber],
      ]).then(() => {
        Print("Downloaded Sus file at 3AM");
        isDownloading = false;
        PlaySoundEffect(msg.guild, outputPath);
      });
    }
  }
};
