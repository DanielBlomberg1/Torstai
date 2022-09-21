import { Client } from "discord.js";
import { getVoiceConnection } from "@discordjs/voice";
export default (client: Client): void => {
    client.on('voiceStateUpdate', (oldState, newState) => {
        const newChannelSz = newState?.guild?.members?.me?.voice?.channel?.members.size as number;

        if ((newChannelSz <= 1)){
            setTimeout(() => { // if 1 remain, wait five minutes
                if ((newChannelSz <= 1)){
                    getVoiceConnection(oldState.guild.id)?.destroy(); // leave
                    console.log("disconnected due to inactivity on guild " + oldState.guild.id);
                }
            }, 3000); 
        };     
    });
};

//300000