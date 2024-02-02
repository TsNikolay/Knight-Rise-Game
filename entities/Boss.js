import { Player } from "./Player.js";
import { Sprite } from "./Sprite.js";
import { player } from "../main.js";
import { bossesBehavior } from "../data/bossesBehaviors.js";

export class Boss extends Player {
  constructor(playerRelatedOptions, behaviorType) {
    super({
      ...playerRelatedOptions,
    });
    this.currentCheckPoint = 0;
    this.attacksMade = 0;
    this.isAttacking = false;
    this.behaviorType = behaviorType;
  }

  update() {
    super.update();

    if (this.currentCheckPoint === 0) {
      this.moveByInstructions(() =>
        bossesBehavior[this.behaviorType].moveFrom0To1Checkpoint(this),
      );
    }

    if (this.isAttacking) {
      this.attackByInstructions(() =>
        bossesBehavior[this.behaviorType].attack1(this),
      );
    }
  }

  moveByInstructions(instructions) {
    instructions();
  }

  updateHitbox() {
    this.hitbox = {
      x: this.x + 20,
      y: this.y,
      width: 50,
      height: 100,
    };
  }

  attackByInstructions(instructions) {
    instructions();
  }

  createAndDrawCharge() {
    if (!this.poison) {
      this.updateHitbox();

      this.poison = new Player({
        //чтобы к нему применять гравитацию и перемещать как игрока
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
    if (!this.playerStartHitbox) {
      this.playerStartHitbox = new Sprite({
        x: player.hitbox.x,
        y: player.hitbox.y,
        width: player.hitbox.width,
        height: player.hitbox.height,
      });
    }
  }
  makeAttack(aim) {
    if (this.x < aim.x && this.poison.x < aim.x) {
      this.poison.x += 7;
    } else if (this.x > aim.x && this.poison.x > aim.x) {
      this.poison.x -= 7;
    }

    if (this.y < aim.y && this.poison.y < aim.y) {
      this.poison.y += 7;
    } else if (this.y > aim.y && this.poison.y > aim.y) {
      this.poison.y -= 7;
    }

    const isCollision =
      this.poison.x + this.poison.width > aim.x &&
      this.poison.x < aim.x + aim.width &&
      this.poison.y + this.poison.height > aim.y &&
      this.poison.y <= aim.y + aim.height;

    if (isCollision) {
      this.poison = null;
      this.playerStartHitbox = null;
      this.attacksMade++;
    }

    if (this.attacksMade === 5) {
      this.isAttacking = false;
    }
  }
}
