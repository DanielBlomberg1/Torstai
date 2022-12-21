import { Document, Model } from "mongoose";

export interface GuildData {
  guildId: string;
  name: string;
  iconURL: string;
  users: MemberData[];
}

export interface MemberData {
  userId: string;
  tag: string;
  username: string;
  nickname?: string;
  avatarURL: string;
  bot: boolean;
  active: boolean;
  authLevel: AuthLevel;
}

export enum AuthLevel {
  SUPERKARHU = "SUPERKARHU",
  KARHU = "KARHU",
  NONE = "NONE",
}

export interface GuildDocument extends GuildData, Document {}
export type GuildModel = Model<GuildDocument>;
