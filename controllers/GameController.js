import { player } from "../main.js";
import { level, levels, levelsReset } from "../data/levelsData.js";
import { InterfaceController } from "./InterfaceConrtoller.js";

export class GameController {
  static resetGame() {
    player.resetProperties();
    levelsReset();
    levels[level].init();
    InterfaceController.fullRecovery();
  }
}
