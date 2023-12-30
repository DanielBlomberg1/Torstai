import socket from "./socket";

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
