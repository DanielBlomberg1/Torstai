export interface User{
    guildId:String,
    userId:String,
    Karma: Number,
    Offences: OffenceType[]
}

export interface OffenceType{
    offenceType: OffenceEnum,
    offenceDescription?: string,
    commitedOn: Date,
    karmaChange: Number
}

export enum OffenceEnum{
    oral,
    written,
    other
}