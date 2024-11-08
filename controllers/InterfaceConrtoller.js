import { Sprite } from "../entities/Sprite.js";
import { canvas, player } from "../main.js";
import { KeysController } from "./KeysController.js";
import { GameController } from "./GameController.js";

export class InterfaceController {
  static hearts = [];
  static healthBar;
  static defeatModal;

  static heartsAmount = 5;
  constructor() {}

  static createHearts() {
    for (let i = 1; i <= this.heartsAmount; i++) {
      const offset = 3;
      const heart = new Sprite({
        imgSrc: "./data/images/GUI/heart.png",
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
      imgSrc: "./data/images/GUI/healthBar.png",
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

  static createDefeatModal() {
    this.defeatModal = new Sprite({
      imgSrc: "./data/images/GUI/defeatModal.png",
      x: 0,
      y: 0,
      frameRate: 1,
      framesSpeed: 15,
      loop: false,
      autoplay: false,
    });
  }

  static createInterface() {
    this.createHealthBar();
    this.createHearts();
    this.createDefeatModal();
  }

  static draw() {
    this.healthBar.draw();
    this.hearts.forEach((heart) => {
      heart.draw();
    });

    if (!player.isAlive) {
      this.defeatModal.draw();
    }
  }

  static lossOfHealth(lostHealth) {
    //Если урон больше чем у игрока осталось здоровья, приравняем занчения чтоб не выйти в минусовые сердечки
    console.log("Lost health: " + lostHealth)
    console.log("Player health: " + player.health)
    console.log("=========")
    if( lostHealth > player.health) {
      lostHealth = player.health
    } 

      //  Например нанесли 30 урона игроку
      //  У игрока 10 пол чердечек (5 сердечек)
      //  100 здоровья всего
      //  Значит 1 полcердечко это 10 урона
      //  Значит должно снести 3 пол чердечка
      
      const healthInOneSemiHeart = 10;
      const amountOfLostSemiHeart = lostHealth / healthInOneSemiHeart

      for(let i = 0; i < amountOfLostSemiHeart; i++){
        const heart = this.hearts.findLast(heart => heart.currentFrame != heart.frameRate - 1); //Останнє не пусте сердце праворуч 
        if (heart.currentFrame !== heart.frameRate - 1) {
          heart.currentFrame++;
          heart.updateFrames();
        }
    }
    
  }

  static fullRecovery() {
    for (let i = 0; i < this.hearts.length; i++) {
      const heart = this.hearts[i];
      heart.currentFrame = 0;
      heart.updateFrames();
    }
  }

  static handleInterfaceKeysInput() {
    if (KeysController.keys.e.pressed) {
      if (!player.isAlive) {
        GameController.resetGame();
      }
    }
  }
}
