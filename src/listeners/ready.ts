import { fetchAutoJoin } from "./../Database/Mongoose";
import {
  DiscordGatewayAdapterCreator,
  joinVoiceChannel,
} from "@discordjs/voice";
import { Client, Guild } from "discord.js";
import { Print } from "../utils/Print";
import { Commands } from "../Commands";

export default (client: Client): void => {
  client.on("ready", async () => {
    if (!client.user || !client.application) {
      return;
    }

    Print(`${client.user.username} has come online`);

    await client.application.commands.set(Commands);

    client.guilds.cache.forEach(async (g: Guild) => {
      const boolean = await fetchAutoJoin(g.id);
      if (boolean) {
        // temp vars
        let size = 0;
        let curId = "";
        let curName = "";

        g.channels.cache.forEach((c) => {
          if (c.isVoiceBased() && c.joinable && c.members.size > size) {
            size = c.members.size;
            curId = c.id;
            curName = c.name;
          }
        });
        if (curId != "") {
          joinVoiceChannel({
            channelId: curId,
            guildId: g.id as string,
            adapterCreator:
              g.voiceAdapterCreator as DiscordGatewayAdapterCreator,
            selfDeaf: false,
          });
          Print(
            "Joined voicechannel " +
              curName +
              " on server " +
              g.name +
              " because it has a size of " +
              size
          );
        }
      }
    });
  });
};
