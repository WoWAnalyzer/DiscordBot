import { Fight } from "../wcl-types";
import getDifficulty from "./getDifficulty";

export default function getBossName(fight: Fight, withDifficulty = true) {
  return withDifficulty ? `${getDifficulty(fight)} ${fight.name}` : fight.name;
}
