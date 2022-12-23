import { Client, Guild, GuildMember, PartialGuildMember } from "discord.js";
import {
  addGuildMember,
  removeGuildMember,
  updateGuildData,
  updateGuildMember,
} from "../Database/Mongoose";

export default (client: Client): void => {
  client.on("guildMemberUpdate", (oldMember, newMember: GuildMember) => {
    updateGuildMember(newMember);
  });

  client.on("guildUpdate", (oldGuild, newGuild: Guild) => {
    updateGuildData(newGuild);
  });

  client.on("guildMemberAdd", (member: GuildMember) => {
    addGuildMember(member);
  });

  client.on("guildMemberRemove", (member: GuildMember | PartialGuildMember) => {
    removeGuildMember(member);
  });
};
