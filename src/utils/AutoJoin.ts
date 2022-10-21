import { joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import { InternalDiscordGatewayAdapterCreator, VoiceState } from "discord.js";

export const AutoJoin = async(c: VoiceConnection | undefined, curState : VoiceState)=>{
    if(!c){
        let size = 0;
        let curId = "";
    
        // join channel with most users
        curState.guild.channels.cache.forEach(c => {
            if(c.isVoiceBased() && c.joinable && c.members.size > size){
                size = c.members.size;
                curId = c.id;
            }
        });
        if(curId != ""){
            joinVoiceChannel(
                {
                    channelId: curId,
                    guildId: curState.guild.id as string,
                    adapterCreator: curState.guild?.voiceAdapterCreator as InternalDiscordGatewayAdapterCreator,
                    selfDeaf: false,
                }
            )
        }
    }
}

