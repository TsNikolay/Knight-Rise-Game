import { Player } from "./Player.js";

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
}
