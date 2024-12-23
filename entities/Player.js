import { KeysController } from "../controllers/KeysController.js";
import { Sprite } from "./Sprite.js";
import { Character } from "./Character.js";
import { boss, doors, ladders, levelCollisionsCells } from "../data/levelsData.js";
import { context } from "../main.js";
import { checkCollisions, checkOverlapping } from "../utils/CollisionsUtils.js";

export class Player extends Character {
  constructor(options) {
    super(options);
    this.maxHealth = 100;
    this.jumpHeight = -22; // Висота стрибка
    this.runningSpeed = 5; // Швидкість бігу
    this.climbingSpeed = -5; // Швидкість підйому по драбині
    this.swordDamage = 5; // Шкода від меча
    this.isInvulnerable = false; // Прапорець невразливості
    this.wasThereShieldAttempt = false; // Прапорець для спроби захисту

    this.isChoosingChests = false;
    this.chestWasChosen = false;
    this.chosenChestPrize = "";
  }

  // Секція: Управління рухом
  // Обробка натискання клавіш для руху персонажа
  handleMovementKeysInput() {
    if (this.preventInput) return;

    // Атака при натисканні лівої кнопки миші
    if (KeysController.keys.leftMouseButton.pressed) {
      if (this.lastDirection === "left") {
        this.switchSprite("player", "attackLeft");
      } else {
        this.switchSprite("player", "attackRight");
      }

      if (this.currentFrame === this.frameRate - 1) {
        KeysController.keys.leftMouseButton.pressed = false;
      }

      this.createAndDrawSword();
      this.makeAttack();

      return;
    }

    // Захист при натисканні правої кнопки миші
    if (KeysController.keys.rightMouseButton.pressed) {
      if (this.lastDirection === "left") {
        this.switchSprite("player", "defenseLeft");
      } else {
        this.switchSprite("player", "defenseRight");
      }

      this.defense();
      this.stopRunning();
      return;
    }

    this.stopRunning();

    // Рух вліво
    if (KeysController.keys.a.pressed) {
      this.switchSprite("player", "runLeft");
      this.lastDirection = "left";
      this.moveLeft();
    }

    // Рух вправо
    if (KeysController.keys.d.pressed) {
      this.switchSprite("player", "runRight");
      this.lastDirection = "right";
      this.moveRight();
    }

    // Обробка стрибка та підйому по драбині
    if (KeysController.keys.w.pressed) {
      ladders.forEach((ladder) => {
        ladder.isClimbed = checkCollisions(this.hitbox, ladder);
      });

      const atLeastOneIsClimbed = ladders.some((ladder) => ladder.isClimbed); // Перевірка, чи є принаймні одна драбина, по якій ліземо

      // Підйом або стрибок
      if (atLeastOneIsClimbed) {
        this.doWeCheckCollisions = false; // Вимикаємо зіткнення, щоб не битися об бар'єри
        const ladder = ladders.find((ladder) => ladder.isClimbed); // Драбина, по якій ліземо
        const newX = ladder.x - (this.hitbox.x - this.x) + 0.01;
        this.setNewCoords(newX, this.y); // Підганяємо координати під драбину
        this.climb();
        this.switchSprite("player", "climbing");
      } else {
        this.jump();
        if (this.lastDirection === "left") {
          this.switchSprite("player", "jumpLeft");
        } else {
          this.switchSprite("player", "jumpRight");
        }
      }
    }

    // Спуск по драбині
    if (KeysController.keys.s.pressed) {
      for (let ladder of ladders) {
        if (checkCollisions(this.hitbox, ladder)) {
          this.doWeCheckCollisions = false;
          const newX = ladder.x - (this.hitbox.x - this.x) + 0.01;
          this.setNewCoords(newX, this.y);
          this.climbDown();
          this.switchSprite("player", "climbing");
        }
      }
    }

    // Взаємодія з дверима
    if (KeysController.keys.e.pressed) {
      for (let door of doors) {
        if (checkOverlapping(this.hitbox, door)) {
          this.stopRunning();
          this.preventInput = true;
          const offset = 9;
          const newX = door.x + offset;
          this.setNewCoords(newX, this.y);
          door.setAutoplayTrue();
          this.switchSprite("player", "enterDoor");
        }
      }
    }

    // Стан очікування або бездіяльності
    if (
      !KeysController.keys.a.pressed &&
      !KeysController.keys.d.pressed &&
      !KeysController.keys.w.pressed &&
      !KeysController.keys.s.pressed &&
      !KeysController.keys.e.pressed &&
      !KeysController.keys.leftMouseButton.pressed &&
      !KeysController.keys.rightMouseButton.pressed
    ) {
      this.removeDefense(); // Знімаємо захист після відпускання правої кнопки миші

      if (this.lastDirection === "left") {
        if (!this.isAlive) {
          this.preventInput = true;
          this.switchSprite("player", "deathLeft");
        } else if (this.takesDamage) {
          this.switchSprite("player", "damagedLeft");
        } else {
          this.switchSprite("player", "inactionLeft");
        }
      } else {
        if (!this.isAlive) {
          this.preventInput = true;
          this.switchSprite("player", "deathRight");
        } else if (this.takesDamage) {
          this.switchSprite("player", "damagedRight");
        } else {
          this.switchSprite("player", "inactionRight");
        }
      }
    }
  }

  // Секція: Оновлення хитбоксів
  // Оновлення хитбокса персонажа
  updateHitbox() {
    this.hitbox = {
      x: this.x + 35,
      y: this.y + 30,
      width: 40,
      height: 70,
    };
  }

  // Оновлення хитбокса для меча
  updateSwordHitbox() {
    this.updateHitbox();
    this.swordHitbox = {
      y: this.hitbox.y - 20,
      width: 25,
      height: this.hitbox.height + 20,
    };

    if (this.lastDirection === "left") {
      this.swordHitbox.x = this.hitbox.x - this.hitbox.width;
    } else {
      this.swordHitbox.x = this.hitbox.x + this.hitbox.width;
    }
  }

  // Відображення хитбокса
  HitboxAndBorders() {
    context.fillStyle = "rgba(0,0,255,0.3)";
    context.fillRect(this.x, this.y, this.width, this.height);
    context.fillStyle = "rgba(0,255,0,0.3)";
    context.fillRect(this.hitbox.x, this.hitbox.y, this.hitbox.width, this.hitbox.height);
  }

  // Секція: Життєвий цикл
  // Обробка смерті персонажа
  death() {
    super.death();
    boss.isAttacking = false;
  }

  // Скидання властивостей персонажа
  resetProperties() {
    this.health = this.maxHealth;
    this.isAlive = true;
    this.x = 100;
    this.y = 100;
    this.switchSprite("player", "inactionRight");
    this.lastDirection = "right";
  }

  //Лікування
  heal(healthPoints) {
    if (this.health + healthPoints > this.maxHealth) {
      this.health = this.maxHealth;
    } else {
      this.health += healthPoints;
    }
  }

  // Секція: Атака
  // Створення та відображення меча
  createAndDrawSword() {
    this.updateSwordHitbox();
    if (!this.sword) {
      this.sword = new Sprite({
        x: this.swordHitbox.x,
        y: this.swordHitbox.y,
        width: this.swordHitbox.width,
        height: this.swordHitbox.height,
      });
    }
    this.sword = null;
  }

  // Атака поціленого об'єкта
  makeAttack() {
    if (this.didSwordReachBoss()) {
      this.doDamage(this.swordDamage);
    }
    if (boss && !boss.isAlive && !this.chestWasChosen) {
      this.disapearToChooseChest();
    }
  }

  disapearToChooseChest() {
    this.isVisible = false;
    this.isChoosingChests = true;
  }

  appearAfterChoosingChest() {
    this.isVisible = true;
    this.isChoosingChests = false;
  }
  _;

  // Перевірка, чи досяг меч босса
  didSwordReachBoss() {
    if (!boss) {
      return false;
    }
    return checkCollisions(this.swordHitbox, boss);
  }

  // Застосування шкоди до босса
  doDamage(damage) {
    boss.health -= damage;
  }

  // Секція: Захист
  // Захист персонажа
  defense() {
    if (this.wasThereShieldAttempt) return;

    const checkLuck = Math.floor(Math.random() * 2) + 1; // Якщо випаде 1, то захист спрацював, якщо 2 - ні
    if (checkLuck === 1) {
      this.isInvulnerable = true;
      console.log("Захист спрацював");
    }
    this.wasThereShieldAttempt = true;
  }

  // Вимкнення захисту
  removeDefense() {
    this.isInvulnerable = false;
    this.wasThereShieldAttempt = false;
  }
}
