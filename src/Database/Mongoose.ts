import configmodel from "./schemas/serverconfig";


export const fetchPrefix = async function(id:string){
    let config = await configmodel.findOne({guildId:id});
    if(config){
        return config.commandPrefix;
    }
    return null
}

export const fetchAutoJoin = async function(id:string){
    let config = await configmodel.findOne({guildId:id});
    if(config){
        return config.autoJoin;
    }

    return null;
}

export const fetchTextChannel = async function(id:string){
    let config = await configmodel.findOne({guildId:id});
    if(config){
        return config.outputChannelId;
    }

    return null;
}


