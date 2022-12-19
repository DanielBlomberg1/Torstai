export interface GuildData {
  id: string;
  name: string;
  iconURL: string;
  users: UserData[];
}

export interface UserData {
  id: string;
  tag: string;
  username: string;
  nickname?: string;
  avatarURL: string;
  bot: boolean;
}
