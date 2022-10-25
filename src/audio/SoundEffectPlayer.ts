import { getVoiceConnection, createAudioPlayer, createAudioResource, AudioPlayerStatus, AudioResource  } from '@discordjs/voice';
import { Guild } from 'discord.js';

//make this modular for multiple servers
const player = createAudioPlayer();

export const PlaySoundEffect = (guild:Guild, pathToClip: string) =>{
    const resource = createAudioResource(pathToClip);
    PlayResource(guild, resource);
}

export const PlayResource = (guild:Guild, resource: AudioResource)=>{
    let c = getVoiceConnection(guild.id);

    if(player.state.status !=  AudioPlayerStatus.Playing){
        player.play(resource);
        c?.subscribe(player);
    }
}

export const PlayerStopPlaying = () => {
    player.stop(true);    
}