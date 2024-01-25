import { Player } from "./Player.js";

export class Boss extends Player {
  constructor(bossOptions) {
    super({
      ...bossOptions,
    });
    this.currentPosiition = 0;
  }

  update() {
    super.update();

    if (this.currentPosiition === 0) {
      this.moveToFirstCheckPoint();
    }
  }

  moveToFirstCheckPoint() {
    this.stopRunning();
    if (this.x > 90) {
      this.moveLeft();
    } else if (this.y > 80) {
      this.doWeCheckCollisions = false;
      this.climb();
    } else {
      this.switchSprite("goblin", "inactionRight");

      this.velocity.y = 0;
      this.currentPosiition = 1;
      this.doWeCheckCollisions = true;
    }
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
