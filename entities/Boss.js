import { Player } from "./Player.js";
import { player } from "../main.js";
import { InterfaceController } from "../controllers/InterfaceConrtoller.js";
import { context } from "../main.js";

export class Boss extends Player {
  constructor(options) {
    super({
      ...options,
    });
    this.currentCheckPoint = 0;
    this.attacksMade = 0;
    this.isAttacking = false;
    this.health = options.health;
    this.maxHealth = options.health;
    this.healthBar = {
      width: 80, 
      height: 10, 
      offsetY: -20 
    };
  }

  update() {
    super.update();
  }

  draw(){
    super.draw()
    this.drawHealthBar()
  }

  doDamage(damage) {
    player.health -= damage;
    player.takesDamage = true;
    InterfaceController.lossOfHealth();
    setTimeout(() => {
      player.takesDamage = false;
    }, 500);
  }

  drawHealthBar(){
    if(!this.isAlive) return

    if (this.health < 0) {
      this.health = 0;
    }

    // Расчет ширины полоски здоровья
    const healthRatio = this.health / this.maxHealth;
    const healthBarWidth = this.healthBar.width * healthRatio;

    // Отрисовка полоски здоровья
    context.fillStyle = "red"; 
    context.fillRect(this.x + (this.width - this.healthBar.width) / 2, this.y + this.healthBar.offsetY, healthBarWidth, this.healthBar.height);
    
    context.strokeStyle = "black";
    context.strokeRect(this.x + (this.width - this.healthBar.width) / 2, this.y + this.healthBar.offsetY, this.healthBar.width, this.healthBar.height);
  }
}
