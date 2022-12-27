export interface ServerToClientEvents {
  noArg: () => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  torstai: (data: string) => void;
}

export interface ClientToServerEvents {
  torstai: (data: string) => void;
}
