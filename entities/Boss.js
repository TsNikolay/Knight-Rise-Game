import { player } from "../main.js";
import { InterfaceController } from "../controllers/InterfaceConrtoller.js";
import { context } from "../main.js";
import { Character } from "./Character.js";

export class Boss extends Character {
  constructor(options) {
    super(options);
    this.currentCheckPoint = 0; // Поточна точка патрулювання
    this.attacksMade = 0; // Кількість атак
    this.isAttacking = false; // Прапорець атаки
    this.maxHealth = options.health; // Максимальне здоров'я боса
    this.jumpHeight = -22; // Висота стрибка
    this.runningSpeed = 5; // Швидкість бігу
    this.climbingSpeed = -5; // Швидкість підйому
    this.healthBar = {
      // Налаштування панелі здоров'я
      width: 80,
      height: 10,
      offsetY: -20,
    };
  }

  // Секція: Оновлення і відображення
  // Відображення босса та його панелі здоров'я
  draw() {
    super.draw();
    this.drawHealthBar();
  }

  // Секція: Атака і шкода
  // Нанесення шкоди гравцеві
  doDamage(damage) {
    if (player.isInvulnerable) return; // Якщо гравець невразливий, шкода не застосовується
    InterfaceController.lossOfHealth(damage);
    player.health -= damage;
    player.takesDamage = true;

    setTimeout(() => {
      player.takesDamage = false;
    }, 500); // Через 500 мс знімається статус отримання шкоди
  }

  // Секція: Панель здоров'я
  // Відображення панелі здоров'я боса
  drawHealthBar() {
    if (!this.isAlive) return;

    if (this.health < 0) {
      this.health = 0;
    }

    // Розрахунок ширини панелі здоров'я на основі відсотка здоров'я
    const healthRatio = this.health / this.maxHealth;
    const healthBarWidth = this.healthBar.width * healthRatio;

    // Малювання червоної панелі здоров'я
    context.fillStyle = "red";
    context.fillRect(this.x + (this.width - this.healthBar.width) / 2, this.y + this.healthBar.offsetY, healthBarWidth, this.healthBar.height);

    // Контур панелі здоров'я
    context.strokeStyle = "black";
    context.strokeRect(
      this.x + (this.width - this.healthBar.width) / 2,
      this.y + this.healthBar.offsetY,
      this.healthBar.width,
      this.healthBar.height
    );
  }

  // Секція: Хитбокси
  // Оновлення хитбоксу боса
  updateHitbox() {
    this.hitbox = {
      x: this.x + 35,
      y: this.y + 30,
      width: 40,
      height: 70,
    };
  }
}
