import { context } from "../main.js";

export class Sprite {
  constructor(imgSrc, x, y, frameRate, animations) {
    this.x = x;
    this.y = y;

    this.image = new Image();
    this.image.onload = () => {
      this.isLoaded = true;
      this.width = this.image.width / this.frameRate;
      this.height = this.image.height;
    };
    this.image.src = imgSrc;
    this.isLoaded = false;
    this.frameRate = frameRate;
    this.currentFrame = 0;
    this.framesPast = 0;
    this.framesSpeed = 15;
    this.animations = animations;

    if (this.animations) {
      for (let key in this.animations) {
        const image = new Image();
        image.src = this.animations[key].imageSrc;
        this.animations[key].image = image;
      }
    }
  }

  draw() {
    if (!this.isLoaded) return;
    context.drawImage(
      this.image,
      this.width * this.currentFrame,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height,
    );
    this.updateFrames();
  }

  updateFrames() {
    this.framesPast++;
    if (this.framesPast % this.framesSpeed === 0) {
      if (this.currentFrame < this.frameRate - 1) {
        this.currentFrame++;
      } else {
        this.currentFrame = 0;
      }
    }
  }
}
