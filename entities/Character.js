import { Sprite } from "./Sprite.js";
import { KeysController } from "../controllers/KeysController.js";
import {
  boss,
  doors,
  ladders,
  levelCollisionsCells,
} from "../data/levelsData.js";
import { checkCollisions, checkOverlapping } from "../utils/CollisionsUtils.js";

export class Character extends Sprite {
  constructor(options) {
    super(options);
    this.health = options.health || 100; // Здоров'я персонажа
    this.isAlive = true;                  // Прапорець, чи живий персонаж
    this.velocity = { x: 0, y: 0 };       // Швидкість персонажа по x та y
    this.gravity = 1;                     // Гравітація для персонажа
    this.doWeCheckCollisions = true;      // Прапорець перевірки зіткнень
  }



  // Секція: Основні методи
  // Метод оновлення стану персонажа
  update() {
    if (this.health <= 0) {
      this.death();
    } else {
      this.setNewCoords(this.x + this.velocity.x, this.y);
      this.updateHitbox();
      if (this.doWeCheckCollisions) {
        this.handleHorizontalCollisions(levelCollisionsCells);
      }
      this.applyGravity();
      this.updateHitbox();
      super.updateFrames();
      if (this.doWeCheckCollisions) {
        this.handleVerticalCollisions(levelCollisionsCells);
      }
      this.doWeCheckCollisions = true;  
    }
  }

  // Установка нових координат для персонажа
  setNewCoords(newX = this.x, newY = this.y) {
    this.x = newX;
    this.y = newY;
  }

  // Метод отримання ушкоджень
  takeDamage(damage) {
    if (this.isInvulnerable) return;  // Якщо персонаж невразливий, ушкодження не застосовується
    this.health -= damage;
    if (this.health <= 0) {
      this.death();
    }
  }

  // Метод смерті персонажа
  death() {
    this.isAlive = false;
  }



  // Секція: Обробка зіткнень
  // Обробка горизонтальних зіткнень з блоками
  handleHorizontalCollisions = (collisionsCells) => {
    for (let i = 0; i < collisionsCells.length; i++) {
      const collisionBlock = collisionsCells[i];
      if (checkCollisions(this.hitbox, collisionBlock)) {
        this.preventHorizontalCollision(collisionBlock);
        break;
      }
    }
  };

  // Обробка вертикальних зіткнень з блоками
  handleVerticalCollisions = (collisionsCells) => {
    for (let i = 0; i < collisionsCells.length; i++) {
      const collisionBlock = collisionsCells[i];
      if (checkCollisions(this.hitbox, collisionBlock)) {
        this.preventVerticalCollision(collisionBlock);
      }
    }
  };

  // Запобігання горизонтальному зіткненню
  preventHorizontalCollision(collisionBlock) {
    if (this.velocity.x < 0) {
      // Якщо рухаємось вліво
      const offset = this.hitbox.x - this.x;
      const newX = collisionBlock.x + collisionBlock.width - offset + 0.01; // 0.01 щоб не стояти точно на межі блоку
      this.setNewCoords(newX, this.y);
    }
    if (this.velocity.x > 0) {
      // Якщо рухаємось вправо
      const offset = this.hitbox.x - this.x + this.hitbox.width;
      const newX = collisionBlock.x - offset - 0.01; // 0.01 щоб не стояти точно на межі блоку
      this.setNewCoords(newX, this.y);
    }
  }

  // Запобігання вертикальному зіткненню
  preventVerticalCollision(collisionBlock) {
    if (this.velocity.y < 0) {
      // Якщо рухаємось вверх
      this.velocity.y = 0;
      const offset = this.hitbox.y - this.y;
      const newY = collisionBlock.y + collisionBlock.height - offset + 0.01; // 0.01 щоб не стояти точно на межі блоку
      this.setNewCoords(this.x, newY);
      KeysController.keys.w.pressed = false;
    }
    if (this.velocity.y > 0) {
      // Якщо рухаємось вниз
      this.velocity.y = 0;
      const offset = this.hitbox.y - this.y + this.hitbox.height;
      const newY = collisionBlock.y - offset - 0.01; // 0.01 щоб не стояти точно на межі блоку
      this.setNewCoords(this.x, newY);
    }
  }



  // Секція: Переміщення і стрибки
  // Застосування гравітації до персонажа
  applyGravity() {
    this.velocity.y += this.gravity;
    this.setNewCoords(this.x, this.y + this.velocity.y);
  }

  // Стрибок персонажа
  jump() {
    if (this.velocity.y === 0) {
      this.velocity.y = this.jumpHeight + 0.1; // 0.1 щоб уникнути подвійного стрибка, без цього у верхній точці velocity також === 0
    }
  }

  // Рух вліво
  moveLeft() {
    this.velocity.x = -this.runningSpeed;
  }

  // Рух вправо
  moveRight() {
    this.velocity.x = this.runningSpeed;
  }

  // Зупинка руху
  stopRunning() {
    this.velocity.x = 0;
  }

  // Підйом по сходах
  climb() {
    this.velocity.y = this.climbingSpeed;
  }

  // Спуск вниз по сходах
  climbDown() {
    this.velocity.y = -this.climbingSpeed;
  }


  
  // Секція: Управління анімацією
  // Перемикання анімації для персонажа
  switchSprite(character, animation) {
    if (this.image === this.animations[character][animation].image) return;

    this.currentFrame = 0;
    this.image = this.animations[character][animation].image;
    this.frameRate = this.animations[character][animation].frameRate;
    this.framesSpeed = this.animations[character][animation].framesSpeed;
    this.loop = this.animations[character][animation].loop;
    this.currentAnimation = this.animations[character][animation];
  }
}
