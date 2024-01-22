import { player } from "../main.js";

import { MovementController } from "../controllers/MovementController.js";
import { collisionsCells } from "../utils/CollisionsUtils.js";
import { Sprite } from "./Sprite.js";

export class Player extends Sprite {
  constructor(imgSrc, x, y, frameRate) {
    super(imgSrc, x, y, frameRate);

    this.sides = {
      bottom: this.y + this.height,
      top: this.y,
      leftSide: this.x,
      rightSide: this.x + this.width,
    };

    this.velocity = {
      x: 0,
      y: 0,
    };
    this.gravity = 1;
    this.jumpHeight = -22; //минус потому что чем меньше "y" тем выше прыжок
    this.runningSpeed = 7;
  }

  update() {
    this.x += this.velocity.x;
    this.updateHitbox();
    this.handleHorizontalCollisions(collisionsCells);
    this.applyGravity();
    this.updateHitbox();

    //Отрисовка границ хитбокса и игрока
    // context.fillStyle = "rgba(0,0,255,0.3)";
    // context.fillRect(this.x, this.y, this.width, this.height);
    // context.fillStyle = "rgba(0,255,0,0.3)";
    // context.fillRect(
    //   this.hitbox.x,
    //   this.hitbox.y,
    //   this.hitbox.width,
    //   this.hitbox.height,
    // );

    this.handleVerticalCollisions(collisionsCells);
  }

  checkCollisions(collisionBlock) {
    return (
      this.hitbox.x <= collisionBlock.sides.rightSide &&
      this.hitbox.x + this.hitbox.width >= collisionBlock.sides.leftSide &&
      this.hitbox.y + this.hitbox.height >= collisionBlock.sides.top &&
      this.hitbox.y <= collisionBlock.sides.bottom
    );
  }

  handleHorizontalCollisions = (collisionsCells) => {
    this.updateSidesValues();
    for (let i = 0; i < collisionsCells.length; i++) {
      const collisionBlock = collisionsCells[i];
      if (this.checkCollisions(collisionBlock)) {
        this.preventHorizontalCollision(collisionBlock);
        break;
      }
    }
  };

  handleVerticalCollisions = (collisionsCells) => {
    this.updateSidesValues();
    for (let i = 0; i < collisionsCells.length; i++) {
      const collisionBlock = collisionsCells[i];
      if (this.checkCollisions(collisionBlock)) {
        this.preventVerticalCollision(collisionBlock);
      }
    }
  };

  preventHorizontalCollision(collisionBlock) {
    if (this.velocity.x < 0) {
      //Если идем влево
      const offset = this.hitbox.x - this.x;
      this.x = collisionBlock.x + collisionBlock.width - offset + 0.01; //0.01 чтобы не точно на границе блока мы были
    }
    if (this.velocity.x > 0) {
      //Если идем вправо
      const offset = this.hitbox.x - this.x + this.hitbox.width;
      this.x = collisionBlock.x - offset - 0.01; //0.01 чтобы не точно на границе блока мы были
    }
  }
  preventVerticalCollision(collisionBlock) {
    if (this.velocity.y < 0) {
      //Если идем вверх
      this.velocity.y = 0;
      const offset = this.hitbox.y - this.y;
      this.y = collisionBlock.y + collisionBlock.height - offset + 0.01; //0.01 чтобы не точно на границе блока мы были
      MovementController.keys.w.pressed = false;
    }
    if (this.velocity.y > 0) {
      //Если идем вниз
      this.velocity.y = 0;
      const offset = this.hitbox.y - this.y + this.hitbox.height;
      this.y = collisionBlock.y - offset - 0.01; //0.01 чтобы не точно на границе блока мы были
    }
  }

  applyGravity() {
    this.velocity.y += this.gravity;
    this.y += this.velocity.y;
  }
  handleKeysInput() {
    this.stopMoving();

    if (MovementController.keys.a.pressed) {
      this.moveLeft();
    }
    if (MovementController.keys.d.pressed) {
      this.moveRight();
    }
    if (MovementController.keys.w.pressed) {
      this.jump();
    }
  }

  jump() {
    if (this.velocity.y === 0) {
      this.velocity.y = this.jumpHeight + 0.1; //0.1 чтобы избежать двойного прыжка, без этого в верхней точке velocity тоже === 0
    }
  }

  moveLeft() {
    this.velocity.x = -this.runningSpeed;
  }

  moveRight() {
    this.velocity.x = this.runningSpeed;
  }

  stopMoving() {
    player.velocity.x = 0;
  }

  updateSidesValues() {
    this.sides = {
      bottom: this.y + this.height,
      top: this.y,
      leftSide: this.x,
      rightSide: this.x + this.width,
    };
  }

  updateHitbox() {
    this.hitbox = {
      x: this.x + 30,
      y: this.y + 30,
      width: 45,
      height: 70,
    };
  }
}
