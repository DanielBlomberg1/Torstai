import fs from "fs";
import { Print } from "./Print";

export const writeToFile = () => {
  JSON.stringify(Object.fromEntries(global.serverConfig));
  var data = JSON.stringify(Object.fromEntries(global.serverConfig));

  fs.writeFile("./data.json", data, function (err: any) {
    if (err) {
      Print("There was an error saving textChannels");
      return;
    }
  });
};
