import { context } from "../main.js";

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
  }
  draw() {
    context.fillStyle = "red";
    context.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.y++;
    this.sides.bottom = this.y + this.height;
  }
}
