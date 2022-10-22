import fs from 'fs';

export const LoadData = () => {
    let data = fs.readFileSync('./data.json'),myObj;
    try {
      myObj = JSON.parse(data as unknown as string);
      console.dir(myObj);
    }
    catch (err) {
      console.log('There has been an error parsing your JSON.')
      console.log(err);
  }
    return new Map<string, string>(Object.entries(myObj));
  }