import { context } from "../main.js";

export class Location {
  constructor(backgroundImageSrc, collisionCells = []) {
    this.backgroundImage = new Image();
    this.backgroundImage.src = backgroundImageSrc;
    this.collisionCells = collisionCells;
    this.backgroundImage.onload = () => {
      this.isLoaded = true;
    };
    this.isLoaded = false;
  }

  draw() {
    if (!this.isLoaded) return;
    context.drawImage(this.backgroundImage, 0, 0);
  }
}
