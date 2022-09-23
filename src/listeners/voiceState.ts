import { Client } from "discord.js";
import { getVoiceConnection } from "@discordjs/voice";
export default (client: Client): void => {
    client.on('voiceStateUpdate', (oldState, newState) => {
        let c = getVoiceConnection(newState.guild.id);
        let sz = newState.channel?.members.size as number;

        if ((oldState.channel != newState.channel)){
            if(c && sz < 2){
                c.destroy();
                console.log("nobody here... disconnecting...")
            }
        };     
    });
};

//300000