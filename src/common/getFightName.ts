import getBossName from "./getBossName";
import getWipeCount from "./getWipeCount";
import { formatDuration } from "./format";
import { Fight, Report } from "../wcl-types";

export default function getFightName(report: Report, fight: Fight) {
  const wipeCount = getWipeCount(report, fight);
  return `${getBossName(fight)} - ${
    fight.kill ? "Kill" : `Wipe ${wipeCount}`
  } (${formatDuration((fight.end_time - fight.start_time) / 1000)})`;
}
