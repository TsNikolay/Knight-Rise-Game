import { canvas, context } from "../main.js";
import { CanvasController } from "../controllers/CanvasController.js";

export class Player {
  constructor() {
    this.x = 100;
    this.y = 100;
    this.width = 100;
    this.height = 100;
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
  }
  draw() {
    context.fillStyle = "red";
    context.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.y += this.velocity.y;
    this.sides.bottom = this.y + this.height;

    if (!CanvasController.checkCollision(this.sides.bottom, canvas.height)) {
      this.velocity.y += this.gravity;
    } else {
      this.velocity.y = 0;
    }
  }
}
