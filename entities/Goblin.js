import { Boss } from "./Boss.js";
import { Sprite } from "./Sprite.js";
import { player } from "../main.js";
import { checkCollisions } from "../utils/CollisionsUtils.js";

export class Goblin extends Boss {
  constructor(options) {
    super({
      ...options,
    });
    this.currentCheckPoint = 0;
    this.attacksMade = 0;
    this.isAttacking = false;
    this.speedOfPoisonFlying = 75;
  }

  update() {
    super.update();

    if (this.currentCheckPoint === 0) {
      this.moveFrom0To1Checkpoint();
    }

    if (this.isAttacking) {
      this.attack1();
    }
  }

  moveFrom0To1Checkpoint() {
    this.stopRunning();
    if (this.x > 90) {
      this.moveLeft();
    } else if (this.y > 80) {
      this.doWeCheckCollisions = false;
      this.climb();
    } else {
      this.switchSprite("goblin", "inactionRight");
      this.velocity.y = 0;
      this.currentCheckPoint = 1;
      this.doWeCheckCollisions = true;
      this.isAttacking = true;
    }
  }

  attack1() {
    this.createAndDrawCharge();
    this.trackPlayerStartPosition();
    this.makeAttack(this.playerStartPosition);
  }

  createAndDrawCharge() {
    if (!this.poison) {
      this.poison = new Sprite({
        imgSrc: "./data/images/goblin_sprites/poison1.png",
        x: this.hitbox.x - 20,
        y: this.hitbox.y - 20,
        frameRate: 1,
        framesSpeed: 1,
        loop: false,
        autoplay: true,
      });
    }
    this.poison.draw();
  }

  trackPlayerStartPosition() {
    if (!this.playerStartPosition) {
      this.playerStartPosition = new Sprite({
        x: player.hitbox.x,
        y: player.hitbox.y + player.hitbox.height, //чтобы столкновение было не с верхней частью хитбокса, а с нижней
        width: player.hitbox.width,
        height: 1, // чтоб хитбокс стартовой позиции был максимально тонким
      });
    }
  }

  makeAttack(playerStartPos) {
    const horizontalFlightLength = playerStartPos.x - this.x;
    const verticalFlightLength = playerStartPos.y - this.y;
    this.poison.x += horizontalFlightLength / this.speedOfPoisonFlying;
    this.poison.y += verticalFlightLength / this.speedOfPoisonFlying;

    if (
      this.didPoisonReachPlayerStartPos(playerStartPos) ||
      this.didPoisonReachPlayer()
    ) {
      if (this.didPoisonReachPlayer()) {
        this.doDamage(10);
      }

      this.poison = null;
      this.playerStartPosition = null;
      this.attacksMade++;
    }

    if (this.attacksMade === 50) {
      this.isAttacking = false;
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

  didPoisonReachPlayerStartPos(startPos) {
    return checkCollisions(this.poison, startPos);
  }

  didPoisonReachPlayer() {
    return checkCollisions(this.poison, player.hitbox);
  }
}
