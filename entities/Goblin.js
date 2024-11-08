import { Boss } from "./Boss.js";
import { Sprite } from "./Sprite.js";
import { player } from "../main.js";
import { checkCollisions } from "../utils/CollisionsUtils.js";
import { doors } from "../data/levelsData.js";

export class Goblin extends Boss {
  constructor(options) {
    super({
      ...options,
    });
    this.nextCheckpoint = 0;          // Наступна точка патрулювання
    this.attacksMade = 0;             // Кількість атак
    this.speedOfPoisonFlying = 100;   // Швидкість польоту отрути
    this.hasDied = false;             // Прапорець смерті
    this.poisonDamage = 30;           // Шкода від отрути
  }

  // Секція: Оновлення
  // Оновлення стану гобліна
  update() {
    if (!player.isAlive) return; // Якщо гравець мертвий, припиняємо оновлення

    if (!this.isAlive) {
      // Анімація смерті, якщо вона ще не почалася
      if (!this.hasDied) { // Перевірка, чи завершилася анімація смерті
        this.switchSprite("goblin", "deathLeft");

        // Додаємо двері лише при першій перевірці
        doors.push(new Sprite({
          imgSrc: "./data/images/doorOpening.png",
          x: 800,
          y: 360,
          frameRate: 4,
          framesSpeed: 14,
          loop: false,
          autoplay: false,
        }));

        // Встановлюємо прапорець смерті і завершуємо анімацію
        this.hasDied = true;
      }

      // Після смерті більше нічого не виконуємо
      return;
    }

    // Якщо персонаж живий, виконуємо основну логіку
    super.update();

    if (this.nextCheckpoint === 0) {
      this.moveFrom0To1Checkpoint();
    }
    if (this.nextCheckpoint === 1) {
      this.moveFrom1To0Checkpoint();
    }

    if (this.isAttacking) {
      this.attack1();
    }

    if (this.health <= 0) {
      this.death();
    }
  }

  // Секція: Переміщення
  // Переміщення від контрольної точки 0 до 1
  moveFrom0To1Checkpoint() {
    this.stopRunning();
    if (this.x > 90) {
      this.moveLeft();
    } else if (this.y > 80) {
      this.doWeCheckCollisions = false;
      this.climb();
    } else {
      this.switchSprite("goblin", "inactionRight");
      this.velocity.y = 0;
      this.doWeCheckCollisions = true;
      this.isAttacking = true;
    }
  }

  // Переміщення від контрольної точки 1 до 0
  moveFrom1To0Checkpoint() {
    this.stopRunning();
    if (this.x < 250) {
      this.moveRight();
      this.jump();
    } else if (this.x < 350) {
      this.moveRight();
    } else if (this.x < 500) {
      this.moveRight();
      this.jump();
    } else if (this.x < 600) {
      this.moveRight();
    } else if (this.x < 800) {
      this.moveRight();
      this.jump();
    } else {
      this.switchSprite("goblin", "inactionLeft");
      this.velocity.y = 0;
      this.doWeCheckCollisions = true;
      this.isAttacking = true;
    }
  }

  // Секція: Атака
  // Основна атака з отрутою
  attack1() {
    this.createAndDrawCharge();
    this.trackPlayerStartPosition();
    this.makeAttack(this.playerStartPosition);
  }

  // Створення та відображення отрути
  createAndDrawCharge() {
    if (!this.poison) {
      this.poison = new Sprite({
        imgSrc: "./data/images/goblin_sprites/poison1.png",
        x: this.hitbox.x - 20,
        y: this.hitbox.y - 20,
        frameRate: 1,
        framesSpeed: 1,
        loop: false,
        autoplay: true,
      });
    }
    this.poison.draw();
  }

  // Відстеження стартової позиції гравця для прицілювання
  trackPlayerStartPosition() {
    if (!this.playerStartPosition) {
      this.playerStartPosition = new Sprite({
        x: player.hitbox.x,
        y: player.hitbox.y + player.hitbox.height, // Щоб зіткнення було не з верхньою частиною хитбокса, а з нижньою
        width: player.hitbox.width,
        height: 1, // Щоб хитбокс стартової позиції був максимально тонким
      });
    }
  }

  // Виконання атаки по стартовій позиції гравця
  makeAttack(playerStartPos) {
    const horizontalFlightLength = playerStartPos.x - this.x;
    const verticalFlightLength = playerStartPos.y - this.y;
    this.poison.x += horizontalFlightLength / this.speedOfPoisonFlying;
    this.poison.y += verticalFlightLength / this.speedOfPoisonFlying;

    if (
      this.didPoisonReachPlayerStartPos(playerStartPos) ||
      this.didPoisonReachPlayer()
    ) {
      if (this.didPoisonReachPlayer()) {
        this.doDamage(this.poisonDamage);
      }
      this.poison = null;
      this.playerStartPosition = null;
      this.attacksMade++;
    }

    if (this.attacksMade === 2) {
      this.attacksMade = 0;
      this.isAttacking = false;
      this.nextCheckpoint = this.nextCheckpoint === 1 ? 0 : 1;
    }
  }

  // Секція: Хитбокси
  // Оновлення хитбокса гобліна
  updateHitbox() {
    this.hitbox = {
      x: this.x + 20,
      y: this.y,
      width: 50,
      height: 100,
    };
  }

  // Перевірка, чи досягла отрута стартової позиції гравця
  didPoisonReachPlayerStartPos(startPos) {
    return checkCollisions(this.poison, startPos);
  }

  // Перевірка, чи досягла отрута гравця
  didPoisonReachPlayer() {
    return checkCollisions(this.poison, player.hitbox);
  }
}
