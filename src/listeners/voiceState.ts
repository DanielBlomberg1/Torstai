import { Client } from "discord.js";
import { getVoiceConnection } from "@discordjs/voice";
export default (client: Client): void => {
    client.on('voiceStateUpdate', (oldState, newState) => {
        console.log("voicestate");
        if (oldState.channelId !==  oldState.guild.members.me?.voice.channelId || newState.channel || oldState?.channel?.members.size === null){ return;}
        
        const oldChannelSize = oldState?.channel?.members.size as number;

        if ((oldChannelSize <= 1)){
            setTimeout(() => { // if 1 remain, wait five minutes
                if ((oldChannelSize <= 1)){
                    getVoiceConnection(oldState.guild.id)?.destroy(); // leave
                    console.log("disconnected due to inactivity on guild " + oldState.guild.id);
                }
            }, 3000); 
        };     
    });
};

//300000