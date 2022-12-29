import { io, Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "src/types/socketio.types";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://192.168.1.3:5000",
  {
    auth: {
      token: process.env.SOCKETIO_AUTH_TOKEN,
    },
  }
);

export const Print = (s: string) => {
  const date: Date = new Date();

  socket.emit("torstai", s);

  console.log(date.toUTCString() + " " + s);
};

socket.on("connect", () => {
  Print("Torstai connected to backend");
});

socket.on("connect_error", (err) => {
  Print(err.message);
});
