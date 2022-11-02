export interface User{
    guildId:String,
    userId:String,
    Karma: Number,
    Offences: Offences[]
}

export interface Offences{
    offenceType: OffenceType,
    offenceDescription?: string,
    commitedOn: Date,
    oldKarma: Number,
    newKarma: Number,
}

export enum OffenceType{
    oral,
    written,
    other
}