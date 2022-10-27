import { User } from 'discord.js';
import { en } from './en';
import { fi } from './fi';
import { OffenceType } from '../interfaces/LeaderBoard';
import { Print } from './Print';

export default async(msg: string, author: User, offenceType: OffenceType) => {
    let offenceCommited = false;
    msg.split(/\s+/).forEach((word : string)=>{
        if(checkWords(word)){
            offenceCommited=true;
        }
    });

    if(offenceCommited){
        const commitedAt = new Date();

        Print("Detected blacklisted word in a message of type: " + offenceType.toString() + " By user " + author.username + " the message content was :" + msg);
    }
}

function checkWords(word: string): boolean {
    if(en.includes(word) || fi.includes(word)){return true;}
    return false;
}
