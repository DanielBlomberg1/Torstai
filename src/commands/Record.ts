import { VoiceConnection } from "@discordjs/voice";
import {
  ApplicationCommandOptionType,
  Client,
  CommandInteraction,
  Snowflake,
} from "discord.js";
import { createListeningStream } from "../audio/createListeningStream";
import { Command } from "../interfaces/Command";

export const Record: Command = {
  name: "record",
  description: "records the convo",
  options: [
    {
      name: "speaker",
      type: ApplicationCommandOptionType.User,
      description: "The user to record",
      required: true,
    },
  ],
  run: async (
    client: Client,
    interaction: CommandInteraction,
    recordable: Set<Snowflake>,
    connection?: VoiceConnection
  ) => {
    if (connection) {
        const userId = interaction.options.get("speaker")!.value! as Snowflake;
        recordable.add(userId);

        const receiver = connection.receiver;
        createListeningStream(receiver, userId, client.users.cache.get(userId));

        await interaction.followUp({ ephemeral: true, content: "Listening!" });
    } else {
        await interaction.followUp({
        ephemeral: true,
        content: "Join a voice channel and then try that again!",
      });
    }
  },
};
