import { context } from "../main.js";

export class Sprite {
  constructor({
    imgSrc,
    x,
    y,
    width,
    height,
    animations,
    frameRate = 1,
    framesSpeed,
    loop = true,
    autoplay = true,
  }) {
    this.x = x;
    this.y = y;
    this.isLoaded = false;

    if (imgSrc) {
      this.image = new Image();
      this.image.onload = () => {
        this.isLoaded = true;
        this.width = this.image.width / this.frameRate;
        this.height = this.image.height;
      };
      this.image.src = imgSrc;
    } else if (width && height) {
      this.isLoaded = true;
      this.width = width;
      this.height = height;
    } else {
      this.isLoaded = true;
      this.width = 100;
      this.height = 100;
    }

    this.frameRate = frameRate;
    this.currentFrame = 0;
    this.framesPast = 0;
    this.framesSpeed = framesSpeed;
    this.animations = animations;

    if (this.animations) {
      for (let character in this.animations) {
        for (let animation in this.animations[character]) {
          const image = new Image();
          image.src = this.animations[character][animation].imageSrc;
          this.animations[character][animation].image = image;
        }
      }
    }

    this.loop = loop;
    this.autoplay = autoplay;
    this.currentAnimation = null;
  }

  draw() {
    if (!this.isLoaded) return;

    if (this.image) {
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
    } else {
      this.drawShape();
    }
  }

  drawShape() {
    context.fillStyle = "rgba(0,255,0,0.3)";
    context.fillRect(this.x, this.y, this.width, this.height);
  }

  updateFrames() {
    if (!this.autoplay) return;

    this.framesPast++;
    if (this.framesPast % this.framesSpeed === 0) {
      if (this.currentFrame < this.frameRate - 1) {
        this.currentFrame++;
      } else if (this.loop) {
        this.currentFrame = 0;
      }
    }

    if (this.currentAnimation && this.currentAnimation.onComplete) {
      if (
        this.currentFrame === this.frameRate - 1 &&
        !this.currentAnimation.isActive
      ) {
        this.currentAnimation.onComplete();
        this.currentAnimation.isActive = true;
      }
    }
  }

  setAutoplayTrue() {
    this.autoplay = true;
  }

  moveLeft(distance) {
    this.x += -distance;
  }
  moveRight(distance) {
    this.x += -distance;
  }

  moveUp(distance) {
    this.y += -distance;
  }
  moveDown(distance) {
    this.y += -distance;
  }
}
