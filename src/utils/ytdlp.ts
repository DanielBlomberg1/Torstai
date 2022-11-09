import YTDlpWrap from "yt-dlp-wrap";
import fs from "fs";
import { Print } from "./Print";

export const pathToYtdlp = "./public/yt-dlp.exe";

export const installIfNotInstalled = async function () {
  Print("yt-dlp not installed, installing...");
  if (!fs.existsSync(pathToYtdlp)) {
    await YTDlpWrap.downloadFromGithub(
      pathToYtdlp,
      "2022.10.04",
      process.platform
    ).then(() => Print("yt-dlp installed"));
  }
};
