import { Client, Guild, GuildMember, PartialGuildMember } from "discord.js";
import { updateGuildData, updateGuildMember } from "../Database/Mongoose";

export default (client: Client): void => {
  client.on("guildMemberUpdate", (oldMember, newMember: GuildMember) => {
    updateGuildMember(newMember);
  });

  client.on("guildUpdate", (oldGuild, newGuild: Guild) => {
    updateGuildData(newGuild);
  });

  client.on("guildMemberAdd", (member: GuildMember) => {
    updateGuildMember(member);
  });

  client.on("guildMemberRemove", (member: GuildMember | PartialGuildMember) => {
    if (member instanceof GuildMember) updateGuildMember(member);
  });
};
