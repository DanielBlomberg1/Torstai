export const Print = (s: string) => {
  const date: Date = new Date();
  console.log(date.toUTCString() + " " + s);
};
