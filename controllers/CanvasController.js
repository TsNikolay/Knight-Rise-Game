import { canvas, context, player } from "../main.js";
export class CanvasController {
  constructor() {}

  static animate = () => {
    window.requestAnimationFrame(this.animate);
    this.clear();
    player.draw(100, player.y);
    if (this.checkCollision(player.sides.bottom, canvas.height)) {
      player.update();
    }
  };

  static clear = () => {
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  static checkCollision = (element, obstacle) => {
    return element < obstacle;
  };
}
