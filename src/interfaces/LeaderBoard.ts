export interface LeaderBoards{
    Karma: Number,
    Offences: Offences[]
}

interface Offences{
    offenceType: OffenceType,
    offenceDescription?: string,
    commitedOn: Date,
    oldKarma: Number,
    newKarma: Number,
}

export enum OffenceType{
    oral = "verbal",
    written = "written",
    other = "other"
}