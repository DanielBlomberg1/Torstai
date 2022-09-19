import { Disconnect } from './commands/Disconnect';
import { JoinVC } from './commands/JoinVoice';
import { Command } from "./Command";
import { Test } from "./commands/TestCommand";

export const Commands: Command[] = [Test, JoinVC, Disconnect];