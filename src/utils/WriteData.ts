import fs from "fs"
import { Print } from "./Print";

export const writeToFile = () => {
    JSON.stringify(Object.fromEntries(global.mainTextChannels));
    var data = JSON.stringify(Object.fromEntries(global.mainTextChannels));
    
    fs.writeFile('./data.json', data, function (err: any) {
      if (err) {
        Print('There was an error saving textChannels');
        return;
      }
    });
}
