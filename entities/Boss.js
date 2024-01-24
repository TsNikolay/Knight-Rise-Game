import { Player } from "./Player.js";

export class Boss extends Player {
  constructor(bossOptions) {
    super({
      ...bossOptions,
    });
  }

  update() {
    super.update();
    this.jump();
  }

  updateHitbox() {
    this.hitbox = {
      x: this.x + 20,
      y: this.y,
      width: 50,
      height: 100,
    };
  }
}
