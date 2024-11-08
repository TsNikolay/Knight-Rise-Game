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
    
    this.nextCheckpoint = 0;
    this.attacksMade = 0;
    this.isAttacking = false;
    this.speedOfPoisonFlying = 100;
    this.hasDied = false
  }


  update() {
    // Проверяем, если персонаж мертв, то делаем действия один раз и завершаем обновления
    if (!this.isAlive) {
      // Анимация смерти, если она еще не началась
      if (!this.hasDied) { // Проверка на то, выполнена ли анимация смерти
        this.switchSprite("goblin", "deathLeft");
  
        // Добавляем дверь только при первой проверке
        doors.push(new Sprite({
          imgSrc: "./data/images/doorOpening.png",
          x: 800,
          y: 360,
          frameRate: 4,
          framesSpeed: 14,
          loop: false,
          autoplay: false,
        }));
  
        // Устанавливаем флаг, что персонаж уже умер и анимация выполнена
        this.hasDied = true;
      }
  
      // После смерти ничего больше не выполняем
      return;
    }
  
    // Если персонаж жив, выполняем логику
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

  attack1() {
    this.createAndDrawCharge();
    this.trackPlayerStartPosition();
    this.makeAttack(this.playerStartPosition);
  }

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

  trackPlayerStartPosition() {
    if (!this.playerStartPosition) {
      this.playerStartPosition = new Sprite({
        x: player.hitbox.x,
        y: player.hitbox.y + player.hitbox.height, //чтобы столкновение было не с верхней частью хитбокса, а с нижней
        width: player.hitbox.width,
        height: 1, // чтоб хитбокс стартовой позиции был максимально тонким
      });
    }
  }

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
        this.doDamage(10);
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

  updateHitbox() {
    this.hitbox = {
      x: this.x + 20,
      y: this.y,
      width: 50,
      height: 100,
    };
  }

  didPoisonReachPlayerStartPos(startPos) {
    return checkCollisions(this.poison, startPos);
  }

  didPoisonReachPlayer() {
    return checkCollisions(this.poison, player.hitbox);
  }
}
