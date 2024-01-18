import { context } from "../main.js";

export class Sprite {
  constructor(imgSrc, x, y) {
    this.x = x;
    this.y = y;
    this.image = new Image();
    this.image.onload = () => {
      this.isLoaded = true;
    };
    this.image.src = imgSrc;
    this.isLoaded = false;
  }

  draw() {
    if (!this.isLoaded) return;
    context.drawImage(this.image, this.x, this.y);
  }
}
