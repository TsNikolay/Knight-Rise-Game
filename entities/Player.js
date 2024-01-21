import { context, player } from "../main.js";

import { MovementController } from "../controllers/MovementController.js";
import { collisionsCells } from "../utils/CollisionsUtils.js";

export class Player {
  constructor() {
    this.x = 100;
    this.y = 100;
    this.width = 85;
    this.height = 85;
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
  draw() {
    context.fillStyle = "red";
    context.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.x += this.velocity.x;
    this.handleHorizontalCollisions(collisionsCells);

    this.applyGravity();
    this.handleVerticalCollisions(collisionsCells);
  }

  checkCollisions(collisionBlock) {
    return (
      this.sides.leftSide <= collisionBlock.sides.rightSide &&
      this.sides.rightSide >= collisionBlock.sides.leftSide &&
      this.sides.bottom >= collisionBlock.sides.top &&
      this.sides.top <= collisionBlock.sides.bottom
    );
  }

  handleHorizontalCollisions = (collisionsCells) => {
    this.updateSidesValues();
    for (let i = 0; i < collisionsCells.length; i++) {
      const collisionBlock = collisionsCells[i];
      if (this.checkCollisions(collisionBlock)) {
        this.preventHorizontalCollision(collisionBlock);
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
    if (this.velocity.x < -1) {
      //Если идем влево
      this.x = collisionBlock.x + collisionBlock.width + 0.01; //0.01 чтобы не точно на границе блока мы были
    }
    if (this.velocity.x > 1) {
      //Если идем вправо
      this.x = collisionBlock.x - this.width - 0.01; //0.01 чтобы не точно на границе блока мы были
    }
  }
  preventVerticalCollision(collisionBlock) {
    if (this.velocity.y < 0) {
      //Если идем вверх
      this.velocity.y = 0;
      this.y = collisionBlock.y + collisionBlock.height + 0.01; //0.01 чтобы не точно на границе блока мы были
      MovementController.keys.w.pressed = false;
    }
    if (this.velocity.y > 0) {
      //Если идем вниз
      this.velocity.y = 0;
      this.y = collisionBlock.y - this.height - 0.01; //0.01 чтобы не точно на границе блока мы были
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
}
