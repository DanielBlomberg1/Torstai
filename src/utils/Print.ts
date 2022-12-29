import { io, Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "src/types/socketio.types";

const token = process.env.SOCKETIO_AUTH_TOKEN;

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://localhost:5000",
  {
    auth: {
      token: token,
    },
  }
);

console.log(token);

socket.on("connect", () => {
  console.log("Connected to backend");

  socket.emit("torstai", "Torstai connected");
});

socket.on("connect_error", (err) => {
  console.log(err.message);
});

export const Print = (s: string) => {
  const date: Date = new Date();

  socket.emit("torstai", s);

  console.log(date.toUTCString() + " " + s);
};
