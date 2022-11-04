import { Document, Model } from "mongoose";

export interface IUser {
  guildId: string;
  userId: string;
  karma: number;
  Offences: OffenceType[];
}

export interface OffenceType {
  offenceType: OffenceEnum;
  offenceDescription?: string;
  commitedOn: Date;
  karmaChange: number;
}

export enum OffenceEnum {
  oral,
  written,
  other,
}

export interface IUserDocument extends IUser, Document {}
export type IUserModel = Model<IUserDocument>;
