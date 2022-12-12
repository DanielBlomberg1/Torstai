import { AddmanualKarma } from './commands/AddManualKarma';
import { Crimes } from "./commands/Crimes";
import { CriminalRecord } from "./commands/CriminalRecord";
import { Configure } from "./commands/ConfigureServer";
import { JoinVC } from "./commands/JoinVoice";
import { Disconnect } from "./commands/Disconnect";
import { Command } from "./interfaces/Command";
import { Test } from "./commands/TestCommand";
import { Record } from "./commands/Record";
import { GetStandings } from "./commands/GetStadings";

export const Commands: Command[] = [
  AddmanualKarma,
  Test,
  JoinVC,
  Disconnect,
  Crimes,
  Configure,
  CriminalRecord,
  GetStandings,
];
