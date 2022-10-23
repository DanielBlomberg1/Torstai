import { getVoiceConnection, createAudioPlayer, createAudioResource, AudioPlayerStatus  } from '@discordjs/voice';
import { Guild } from 'discord.js';

const player = createAudioPlayer();

export const PlaySoundEffect = (guild:Guild, pathToClip: string) =>{
    const resource = createAudioResource(pathToClip);
    let c = getVoiceConnection(guild.id);

    if(player.state.status !=  AudioPlayerStatus.Playing){
        player.play(resource);
        c?.subscribe(player);
    }
}