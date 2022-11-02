import { Client, Guild, Message } from "discord.js";
import { OffenceEnum } from "../Database/schemas/usersmodel.types";
import CheckForBadWords from "../utils/CheckForBadWords";

// this is not working for whatever reason
export default (client: Client): void => {
  client.on("messageCreate", (msg: Message) => {
    if (msg.guild) {
      CheckForBadWords(
        msg.content.toLowerCase(),
        msg.author,
        msg.guild,
        OffenceEnum.written
      );
    }
  });
};
