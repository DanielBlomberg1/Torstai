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

socket.on("connect", () => {
  console.log("Connected to backend");
}); 

export default socket;