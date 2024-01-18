import { context } from "../main.js";

export class CollisionBlock {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
  }
  draw() {
    context.fillStyle = "rgba(255, 0, 0, 0.5)";
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}
