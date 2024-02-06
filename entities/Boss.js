import { Player } from "./Player.js";
import { player } from "../main.js";
import { InterfaceController } from "../controllers/InterfaceConrtoller.js";

export class Boss extends Player {
  constructor(options) {
    super({
      ...options,
    });
    this.currentCheckPoint = 0;
    this.attacksMade = 0;
    this.isAttacking = false;
  }

  update() {
    super.update();
  }

  doDamage(damage) {
    player.health -= damage;
    player.takesDamage = true;
    InterfaceController.lossOfHealth();
    setTimeout(() => {
      player.takesDamage = false;
    }, 500);
  }
}
