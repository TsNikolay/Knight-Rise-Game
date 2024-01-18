import { canvas, context, player } from "../main.js";
import { CanvasController } from "../controllers/CanvasController.js";
import { MovementController } from "../controllers/MovementController.js";

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
    this.y += this.velocity.y;
    this.sides.bottom = this.y + this.height;

    if (!CanvasController.checkCollision(this.sides.bottom, canvas.height)) {
      this.velocity.y += this.gravity;
    } else {
      this.y = canvas.height - this.height; // если персонаж вылез за карту
      this.velocity.y = 0;
    }
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
}
