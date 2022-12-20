import { Document, Model } from "mongoose";

export interface IOffences {
  guildId: string;
  userId: string;
  yearlyOffences: YearlyOffences[];
}

export interface YearlyOffences {
  year: number;
  yearlyKarma: number;
  weeklyData: WeeklyOffences[];
}

export interface WeeklyOffences {
  weekNumber: number;
  weeklyKarma: number;
  Offences: OffenceType[];
}

export interface OffenceType {
  offenceType: OffenceEnum;
  offenceDescription?: string;
  flaggedWords?: string[];
  commitedOn: Date;
  karmaChange: number;
  newKarma: number;
}

export enum OffenceEnum {
  oral,
  written,
  other,
}

export interface IOFfencesDocument extends IOffences, Document {}
export type IOffencesModel = Model<IOFfencesDocument>;
