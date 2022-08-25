import { Fight, Report } from "../wcl-types";

export default function getWipeCount(report: Report, fight: Fight) {
  let count = 1;
  report.fights.forEach((item) => {
    if (item.boss === fight.boss) {
      if (item.id < fight.id) {
        count += 1;
      }
    }
  });
  return count;
}
