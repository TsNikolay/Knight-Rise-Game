import { Sprite } from "../entities/Sprite.js";
import { canvas, player } from "../main.js";
import { KeysController } from "./KeysController.js";
import { GameController } from "./GameController.js";
import { getRandomNumberFrom1to3 } from "../utils/random.js";

export class InterfaceController {
  static hearts = [];
  static healthBar;
  static defeatModal;
  static chestsModal;
  static chestNothingModal;
  static chestCureModal;
  static heartsAmount = 5;
  constructor() {}

  static createHearts(currentHeartsAmount) {
    this.hearts = [];
    for (let i = 1; i <= currentHeartsAmount; i++) {
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

  static createChestsModal() {
    this.chestsModal = new Sprite({
      imgSrc: "./data/images/GUI/chestsModal.png",
      x: 0,
      y: 0,
      frameRate: 1,
      framesSpeed: 15,
      loop: false,
      autoplay: false,
    });
  }

  static createChestsNothingModal() {
    this.chestNothingModal = new Sprite({
      imgSrc: "./data/images/GUI/chestNothing.png",
      x: 0,
      y: 0,
      frameRate: 1,
      framesSpeed: 15,
      loop: false,
      autoplay: false,
    });
  }
  static createChestsCureModal() {
    this.chestCureModal = new Sprite({
      imgSrc: "./data/images/GUI/chestCure.png",
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
    this.createHearts(this.heartsAmount);
    this.createDefeatModal();
    this.createChestsModal();
    this.createChestsNothingModal();
    this.createChestsCureModal();
  }

  static draw() {
    this.healthBar.draw();
    this.hearts.forEach((heart) => {
      heart.draw();
    });

    if (!player.isAlive) {
      this.defeatModal.draw();
    }

    if (player.chestWasChosen) {
      player.isVisible = false;
      if (player.chosenChestPrize === "Cure") {
        this.chestCureModal.draw();
      } else if (player.chosenChestPrize === "Nothing") {
        this.chestNothingModal.draw();
      }
      setTimeout(() => {
        player.chosenChestPrize === "";
        player.isChoosingChests = false;
        player.chestWasChosen = false;
        player.isVisible = true;
      }, 3000);
    } else if (player.isChoosingChests) {
      player.isVisible = false;
      this.chestsModal.draw();
    } else {
      player.isVisible = true;
    }
  }

  static recoveryOfHealth(currentHealth) {
    const healthInOneHeart = 20;
    const currentHeartAmount = currentHealth / healthInOneHeart;
    this.createHearts(currentHeartAmount);
  }

  static lossOfHealth(lostHealth) {
    if (lostHealth > player.health) {
      lostHealth = player.health;
    }

    // Наприклад нанесли 30 шкоди гравцю
    // У гравця 10 півсердечок (5 сердець)
    // 100 здоров'я всього
    // Значить 1 півсерце це 10 шкоди
    // Значить має віднятися 3 півсердечка

    const healthInOneSemiHeart = 10;
    const amountOfLostSemiHeart = lostHealth / healthInOneSemiHeart;

    for (let i = 0; i < amountOfLostSemiHeart; i++) {
      const heart = this.hearts.findLast((heart) => heart.currentFrame != heart.frameRate - 1); //Останнє не пусте сердце праворуч
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
    if (KeysController.keys.e.pressed && !player.isAlive) {
      GameController.resetGame();
    }

    if (player.isChoosingChests) {
      const numberOfChestWithPrize = getRandomNumberFrom1to3();
      const keys = KeysController.keys;

      // Отримуємо вибір гравця
      const playerChoice = keys.one.pressed ? 1 : keys.two.pressed ? 2 : keys.three.pressed ? 3 : 0;

      if (playerChoice !== 0 && !player.chestWasChosen) {
        if (playerChoice === numberOfChestWithPrize) {
          player.heal(40);
          this.recoveryOfHealth(player.health);
          player.chosenChestPrize = "Cure";
        } else {
          player.chosenChestPrize = "Nothing";
        }
        player.chestWasChosen = true;
      }
    }
  }
}
