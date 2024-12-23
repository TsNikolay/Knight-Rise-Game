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

  static updateHearts(currentSemiHeartsAmount) {
    this.hearts = [];
    const offset = 3; // Отступ между сердцами

    // Добавляем полные сердца
    for (let i = 0; i < Math.floor(currentSemiHeartsAmount / 2); i++) {
      const heart = new Sprite({
        imgSrc: "./data/images/GUI/heart.png",
        x: 665 + (i + 1) * (20 + offset),
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

    // Проверяем, если есть половина сердца
    if (currentSemiHeartsAmount % 2 === 1) {
      const semiHeart = new Sprite({
        imgSrc: "./data/images/GUI/heart.png",
        x: 665 + Math.round(currentSemiHeartsAmount / 2) * (20 + offset),
        y: 25,
        width: 20,
        height: 19,
        frameRate: 3,
        framesSpeed: 50,
        loop: false,
        autoplay: false,
      });
      semiHeart.currentFrame = 1; // Устанавливаем кадр для полусердца
      this.hearts.push(semiHeart);
    }

    console.log(this.hearts);
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
    this.updateHearts(this.heartsAmount * 2);
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

    if (player.chestWasChosen && player.isChoosingChests) {
      player.isVisible = false;
      if (player.chosenChestPrize === "Cure") {
        this.chestCureModal.draw();
      } else if (player.chosenChestPrize === "Nothing") {
        this.chestNothingModal.draw();
      }
      setTimeout(() => {
        player.chosenChestPrize === "";
        player.isChoosingChests = false;
        player.isVisible = true;
      }, 3000);
      return;
    }
    if (player.isChoosingChests) {
      player.isVisible = false;
      this.chestsModal.draw();
    } else {
      player.isVisible = true;
    }
  }

  static recoveryOfHealth(currentHealth) {
    const healthInOneSemiHeart = 10;
    const currentSemiHeartAmount = currentHealth / healthInOneSemiHeart;
    this.updateHearts(currentSemiHeartAmount);
  }

  static lossOfHealth(lostHealth) {
    if (lostHealth > player.health) {
      lostHealth = player.health;
    }

    const healthInOneSemiHeart = 10;
    const amountOfLostSemiHeart = lostHealth / healthInOneSemiHeart;
    const currentSemiHeartsAmount = player.health / healthInOneSemiHeart - amountOfLostSemiHeart;
    this.updateHearts(currentSemiHeartsAmount);
  }

  static fullRecovery() {
    this.updateHearts(this.heartsAmount * 2);
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
