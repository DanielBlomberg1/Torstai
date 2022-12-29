import { io, Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "src/types/socketio.types";

const token: string = process.env.SOCKETIO_AUTH_TOKEN || "";
const backendUrl: string = process.env.BACKEND_URL || "";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  backendUrl,
  {
    auth: {
      token: token,
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
