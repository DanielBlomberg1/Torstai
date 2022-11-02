import { OffenceType } from '../interfaces/User';
import { putOffence } from './../Database/Mongoose';
import { Guild, User } from 'discord.js';
import { en } from './en';
import { fi } from './fi';
import { OffenceEnum } from '../interfaces/User';
import { Print } from './Print';

export default async(msg: string, author: User, guild: Guild, offenceType: OffenceEnum) => {
    let offenceCommited = false;
    msg.split(/\s+/).forEach((word : string)=>{
        if(checkWords(word)){
            offenceCommited=true;
        }
    });

    if(offenceCommited){
        const commitedAt = new Date();
        let karmaPenalty = 0;
        const offenceString = "Detected blacklisted word in a message of type: " + offenceType.toString() + " By user " + author.username + " the message content was: " + msg 
        
        if(offenceType == 0){
            karmaPenalty = -Math.floor(Math.random() * ( 100 - 75 + 1 ) + 75)
        }else{
            karmaPenalty = -Math.floor(Math.random() * ( 50 - 25 + 1 ) + 25)
        }

        Print(offenceString);
        const offence: OffenceType = { 
            commitedOn: commitedAt,
            karmaChange: karmaPenalty,
            offenceType: offenceType,
            offenceDescription: commitedAt.toUTCString() + " " + offenceString
        }

        await putOffence(guild, author,offence ,karmaPenalty);
    }
}

function checkWords(word: string): boolean {
    if(en.includes(word) || fi.includes(word)){return true;}
    return false;
}
