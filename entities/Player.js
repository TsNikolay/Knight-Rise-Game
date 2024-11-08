import { KeysController } from "../controllers/KeysController.js";
import { Sprite } from "./Sprite.js";
import {
  boss,
  doors,
  ladders,
  levelCollisionsCells,
} from "../data/levelsData.js";
import { context } from "../main.js";
import { checkCollisions, checkOverlapping } from "../utils/CollisionsUtils.js";

export class Player extends Sprite {
  constructor(options) {
    super({
      ...options,
    });

    this.velocity = {
      x: 0,
      y: 0,
    };
    this.gravity = 1;
    this.jumpHeight = -22; //минус потому что чем меньше "y" тем выше прыжок
    this.runningSpeed = 5;
    this.climbingSpeed = -5;
    this.doWeCheckCollisions = true;
    this.health = options.health;
    this.isAlive = true;
    this.swordDamage = 5;
  }

  update() {
    this.setNewCoords(this.x + this.velocity.x, this.y);

    this.updateHitbox();

    if (this.doWeCheckCollisions === true) {
      this.handleHorizontalCollisions(levelCollisionsCells);
    }

    this.applyGravity();
    this.updateHitbox();

    if (this.doWeCheckCollisions === true) {
      this.handleVerticalCollisions(levelCollisionsCells);
    }
    // this.drawHitboxAndBorders();
    this.doWeCheckCollisions = true;

    if (this.health <= 0) {
      this.death();
    }
  }

  handleHorizontalCollisions = (collisionsCells) => {
    for (let i = 0; i < collisionsCells.length; i++) {
      const collisionBlock = collisionsCells[i];
      if (checkCollisions(this.hitbox, collisionBlock)) {
        this.preventHorizontalCollision(collisionBlock);
        break;
      }
    }
  };

  handleVerticalCollisions = (collisionsCells) => {
    for (let i = 0; i < collisionsCells.length; i++) {
      const collisionBlock = collisionsCells[i];
      if (checkCollisions(this.hitbox, collisionBlock)) {
        this.preventVerticalCollision(collisionBlock);
      }
    }
  };

  preventHorizontalCollision(collisionBlock) {
    if (this.velocity.x < 0) {
      //Если идем влево
      const offset = this.hitbox.x - this.x;
      const newX = collisionBlock.x + collisionBlock.width - offset + 0.01; //0.01 чтобы не точно на границе блока мы были
      this.setNewCoords(newX, this.y);
    }
    if (this.velocity.x > 0) {
      //Если идем вправо
      const offset = this.hitbox.x - this.x + this.hitbox.width;
      const newX = collisionBlock.x - offset - 0.01; //0.01 чтобы не точно на границе блока мы были
      this.setNewCoords(newX, this.y);
    }
  }

  preventVerticalCollision(collisionBlock) {
    if (this.velocity.y < 0) {
      //Если идем вверх
      this.velocity.y = 0;
      const offset = this.hitbox.y - this.y;
      const newY = collisionBlock.y + collisionBlock.height - offset + 0.01; //0.01 чтобы не точно на границе блока мы были
      this.setNewCoords(this.x, newY);
      KeysController.keys.w.pressed = false;
    }
    if (this.velocity.y > 0) {
      //Если идем вниз
      this.velocity.y = 0;
      const offset = this.hitbox.y - this.y + this.hitbox.height;
      const newY = collisionBlock.y - offset - 0.01; //0.01 чтобы не точно на границе блока мы были
      this.setNewCoords(this.x, newY);
    }
  }

  applyGravity() {
    this.velocity.y += this.gravity;
    this.setNewCoords(this.x, this.y + this.velocity.y);
  }

  handleMovementKeysInput() {
    if (this.preventInput) return;

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

    this.stopRunning();

    if (KeysController.keys.a.pressed) {
      this.switchSprite("player", "runLeft");
      this.lastDirection = "left";
      this.moveLeft();
    }

    if (KeysController.keys.d.pressed) {
      this.switchSprite("player", "runRight");
      this.lastDirection = "right";
      this.moveRight();
    }

    if (KeysController.keys.w.pressed) {
      //обнуляем все лестницы и ставим свойство именно той по которой лезем
      ladders.forEach((ladder) => {
        ladder.isClimbed = checkCollisions(this.hitbox, ladder);
      });

      const atLeastOneIsClimbed = ladders.some((ladder) => ladder.isClimbed); // Проверка есть ли хоть одна лестница по которой лезем

      //Проверим надо лезть или прыгать
      if (atLeastOneIsClimbed) {
        this.doWeCheckCollisions = false; //отключаем столкновения чтоб головой не биться об барьеры
        const ladder = ladders.find((ladder) => ladder.isClimbed); //лестница по которой лезем
        const newX = ladder.x - (this.hitbox.x - this.x) + 0.01;
        this.setNewCoords(newX, this.y); //подогнать игрока под координаты лестницы
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

    if (KeysController.keys.e.pressed) {
      for (let door of doors) {
        console.log(doors)
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

    if (
      //Если бы сделал else if и просто else, персонаж бы не мог одновременно прыгать и бегать (с return тоже самое)
      !KeysController.keys.a.pressed &&
      !KeysController.keys.d.pressed &&
      !KeysController.keys.w.pressed &&
      !KeysController.keys.s.pressed &&
      !KeysController.keys.e.pressed &&
      !KeysController.keys.leftMouseButton.pressed
    ) {
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

  jump() {
    if (this.velocity.y === 0) {
      this.velocity.y = this.jumpHeight + 0.1; //0.1 чтобы избежать двойного прыжка, без этого в верхней точке velocity тоже === 0
    }
  }

  moveLeft() {
    this.velocity.x = -this.runningSpeed;
  }

  moveRight() {
    this.velocity.x = this.runningSpeed;
  }

  stopRunning() {
    this.velocity.x = 0;
  }

  climb() {
    this.velocity.y = this.climbingSpeed;
  }

  climbDown() {
    this.velocity.y = -this.climbingSpeed;
  }

  setNewCoords(newX = this.x, newY = this.y) {
    this.x = newX;
    this.y = newY;
  }

  updateHitbox() {
    this.hitbox = {
      x: this.x + 35,
      y: this.y + 30,
      width: 40,
      height: 70,
    };
  }

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

  switchSprite(character, animation) {
    if (this.image === this.animations[character][animation].image) return;

    this.currentFrame = 0;
    this.image = this.animations[character][animation].image;
    this.frameRate = this.animations[character][animation].frameRate;
    this.framesSpeed = this.animations[character][animation].framesSpeed;
    this.loop = this.animations[character][animation].loop;
    this.currentAnimation = this.animations[character][animation];
  }

  HitboxAndBorders() {
    context.fillStyle = "rgba(0,0,255,0.3)";
    context.fillRect(this.x, this.y, this.width, this.height);
    context.fillStyle = "rgba(0,255,0,0.3)";
    context.fillRect(
      this.hitbox.x,
      this.hitbox.y,
      this.hitbox.width,
      this.hitbox.height,
    );
  }

  death() {
    this.isAlive = false;
    boss.isAttacking = false;
  }

  resetProperties() {
    this.health = 100;
    this.isAlive = true;
    this.x = 100;
    this.y = 100;
    this.switchSprite("player", "inactionRight");
    this.lastDirection = "right";
  }

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
    // this.sword.drawShape();
    this.sword = null;
  }

  makeAttack() {
    if (this.didSwordReachBoss()) {
      this.doDamage(this.swordDamage);
      console.log(boss.health);
    }
  }
  didSwordReachBoss() {
    if (!boss) {
      return false;
    }
    return checkCollisions(this.swordHitbox, boss);
  }

  doDamage(damage) {
    boss.health -= damage;
  }
}
