import { AddmanualKarma } from './commands/AddManualKarma';
import { CrimesBefore } from "./commands/CrimesBefore";
import { CriminalRecord } from "./commands/CriminalRecord";
import { Configure } from "./commands/ConfigureServer";
import { JoinVC } from "./commands/JoinVoice";
import { Disconnect } from "./commands/Disconnect";
import { Command } from "./interfaces/Command";
import { Test } from "./commands/TestCommand";
import { Record } from "./commands/Record";
import { GetStandings } from "./commands/GetStadings";

export const Commands: Command[] = [
  Test,
  JoinVC,
  Disconnect,
  Configure,
  GetStandings,
  CriminalRecord,
  CrimesBefore,
  AddmanualKarma
];
