import { io, Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "src/types/socketio.types";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://localhost:5000"
);

socket.on("connect", () => {
  socket.emit("torstai", "Torstai connected");
});

export const Print = (s: string) => {
  const date: Date = new Date();

  socket.emit("torstai", s);

  console.log(date.toUTCString() + " " + s);
};
