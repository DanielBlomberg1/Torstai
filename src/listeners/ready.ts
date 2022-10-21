import { joinVoiceChannel } from "@discordjs/voice";
import { Client, Guild, InternalDiscordGatewayAdapterCreator } from "discord.js";
import { Commands } from "../Commands";

export default (client: Client): void => {
    client.on("ready", async () => {
        if (!client.user || !client.application) {
            return;
        }

        await client.application.commands.set(Commands);

        client.guilds.cache.forEach((g : Guild)=>{
            // temp vars
            let size = 0;
            let curId = "";

            g.channels.cache.forEach(c => {
                if(c.isVoiceBased() && c.joinable && c.members.size > size){
                    size = c.members.size;
                    curId = c.id;
                }
            });
            if(curId != ""){
                joinVoiceChannel(
                    {
                        channelId: curId,
                        guildId: g.id as string,
                        adapterCreator: g.voiceAdapterCreator as InternalDiscordGatewayAdapterCreator,
                        selfDeaf: false,
                    }
                )
            }
        })
       
        
        console.log(`${client.user.username} has come online`);
    });
};