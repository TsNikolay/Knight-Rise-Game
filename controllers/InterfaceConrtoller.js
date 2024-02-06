import { Sprite } from "../entities/Sprite.js";
import { canvas } from "../main.js";

export class InterfaceController {
  static hearts = [];
  static healthBar;
  static heartsAmount = 5;
  constructor() {}

  static createHearts() {
    for (let i = 1; i <= this.heartsAmount; i++) {
      const offset = 3;
      const heart = new Sprite({
        imgSrc: "./data/images/heart.png",
        x: 665 + i * (20 + offset),
        y: 25,
        width: 20,
        height: 19,
        frameRate: 3,
        framesSpeed: 50,
        loop: false,
        autoplay: false,
      });
      this.hearts.push(heart);
    }
  }

  static createHealthBar() {
    this.healthBar = new Sprite({
      imgSrc: "./data/images/healthBar.png",
      x: canvas.width - 289 - 20,
      y: 0,
      width: 289,
      height: 90,
      frameRate: 1,
      framesSpeed: 15,
      loop: false,
      autoplay: false,
    });
  }

  static createInterface() {
    this.createHealthBar();
    this.createHearts();
  }

  static draw() {
    this.healthBar.draw();
    this.hearts.forEach((heart) => {
      heart.draw();
    });
  }

  static lossOfHealth() {
    const lastHeartIndex = this.hearts.length - 1;
    for (let i = lastHeartIndex; i >= 0; i--) {
      const heart = this.hearts[i];
      if (heart.currentFrame !== heart.frameRate - 1) {
        heart.currentFrame++;
        heart.updateFrames();
        return;
      }
    }
  }
}
