import { Configure } from "./commands/ConfigureServer";
import { JoinVC } from "./commands/JoinVoice";
import { Disconnect } from "./commands/Disconnect";
import { Command } from "./interfaces/Command";
import { Test } from "./commands/TestCommand";
import { Record } from "./commands/Record";

export const Commands: Command[] = [Test, JoinVC, Disconnect, Configure];
