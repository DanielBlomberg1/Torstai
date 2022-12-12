import {
  CommandInteraction,
  Client,
  ApplicationCommandType,
  ApplicationCommandOptionType,
  User,
} from "discord.js";
import { Command } from "../interfaces/Command";
import { fetchStandings, fetchStandingsForGivenWeek } from "../Database/Mongoose";
import { getCurrentWeek, getCurrentYear } from "../utils/dateUtils";

export const GetStandings: Command = {
  name: "getstandings",
  description: "fetch servers behaviour report",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "year",
      type: ApplicationCommandOptionType.Number,
      description: "The year to get standings for",
      required: false,
    },
    {
      name: "week",
      type: ApplicationCommandOptionType.Number,
      description: "the week to get standings for",
      required: false,
    },
  ],
  run: async (client: Client, interaction: CommandInteraction) => {
    const year = interaction.options.get("year")?.value;
    const week = interaction.options.get("week")?.value;

    if (year && week) {
      getStandingsForGivenWeek(year as number, week as number, interaction);
    } else {
      getStandingForCurrentWeek(interaction);
    }
  },
};

const getStandingForCurrentWeek = async (interaction: CommandInteraction) => {
  let content = "success";
  const weekNumber = getCurrentWeek();

  const year = getCurrentYear();

  if (interaction.guild) {
    const userlist = await fetchStandings(interaction.guild);
    content =
      interaction.guild.name +
      " :  Karma Leaderboard : " + year +  "/" + weekNumber + 
      "\n";
    if (userlist.length > 0) {
      content += "```";
      userlist.forEach((u) => {
        const nick = interaction.guild?.members.cache.get(u.userId)?.user
          .username;
        content += nick + " | " + u.karma + "\n";
      });
      content += "```";
    } else {
      content += "No users have committed crimes";
    }
  }

  await interaction.followUp({
    ephemeral: true,
    content,
  });
};

const getStandingsForGivenWeek = async (
  year: number,
  week: number,
  interaction: CommandInteraction
) => {
  let content = "success";

  if (interaction.guild) {
    const userlist = await fetchStandingsForGivenWeek(interaction.guild, week, year);
    content =
      interaction.guild.name + " : Karma Leaderboard : " + year +  "/" + week + "\n";
    if (userlist.length > 0) {
      content += "```";
      userlist.forEach((u) => {
        const nick = interaction.guild?.members.cache.get(u.userId)?.user
          .username;
        content += nick + " | " + u.karma + "\n";
      });
      content += "```";
    } else {
      content += "No users have committed crimes";
    }
  }

  await interaction.followUp({
    ephemeral: true,
    content,
  });
};
