import { Client } from "discord.js";
import { getVoiceConnection } from "@discordjs/voice";
export default (client: Client): void => {
    client.on('voiceStateUpdate', (oldState, newState) => {
        const newChannelSz = newState?.guild?.members?.me?.voice?.channel?.members.size as number;
        let c = getVoiceConnection(newState.guild.id);

        if ((oldState.channel != newState.channel)){
            if(c && newState.channel?.members.size as number < 2){
                c.destroy();
                console.log("nobody here... disconnecting...")
            }
        };     
    });
};

//300000