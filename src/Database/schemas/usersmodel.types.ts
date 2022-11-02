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
  karmaChange: Number;
}

export enum OffenceEnum {
  oral,
  written,
  other,
}

export interface IUserDocument extends IUser, Document {}
export interface IUserModel extends Model<IUserDocument> {}
