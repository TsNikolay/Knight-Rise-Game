import { MovementController } from "../controllers/MovementController.js";
import { Sprite } from "./Sprite.js";
import { doors, ladders, levelCollisionsCells } from "../data/levelsData.js";
import { context } from "../main.js";

export class Player extends Sprite {
  constructor(spriteRelatedOptions) {
    super({
      ...spriteRelatedOptions,
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
  }

  checkCollisions(collisionBlock) {
    return (
      this.hitbox.x <= collisionBlock.x + collisionBlock.width &&
      this.hitbox.x + this.hitbox.width >= collisionBlock.x &&
      this.hitbox.y + this.hitbox.height >= collisionBlock.y &&
      this.hitbox.y <= collisionBlock.y + collisionBlock.height
    );
  }

  checkOverlapping(objectToOverlap) {
    return (
      this.hitbox.x + this.hitbox.width <=
        objectToOverlap.x + objectToOverlap.width &&
      this.hitbox.x >= objectToOverlap.x &&
      this.hitbox.y + this.hitbox.height >= objectToOverlap.y &&
      this.hitbox.y <= objectToOverlap.y + objectToOverlap.height
    );
  }

  handleHorizontalCollisions = (collisionsCells) => {
    for (let i = 0; i < collisionsCells.length; i++) {
      const collisionBlock = collisionsCells[i];
      if (this.checkCollisions(collisionBlock)) {
        this.preventHorizontalCollision(collisionBlock);
        break;
      }
    }
  };

  handleVerticalCollisions = (collisionsCells) => {
    for (let i = 0; i < collisionsCells.length; i++) {
      const collisionBlock = collisionsCells[i];
      if (this.checkCollisions(collisionBlock)) {
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
      MovementController.keys.w.pressed = false;
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

  handleKeysInput() {
    if (this.preventInput) return;

    this.stopRunning();

    if (MovementController.keys.a.pressed) {
      this.switchSprite("player", "runLeft");
      this.lastDirection = "left";
      this.moveLeft();
    }

    if (MovementController.keys.d.pressed) {
      this.switchSprite("player", "runRight");
      this.lastDirection = "right";
      this.moveRight();
    }

    if (MovementController.keys.w.pressed) {
      //обнуляем все лестницы и ставим свойство именно той по которой лезем
      ladders.forEach((ladder) => {
        ladder.isClimbed = this.checkCollisions(ladder);
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

    if (MovementController.keys.s.pressed) {
      for (let ladder of ladders) {
        if (this.checkCollisions(ladder)) {
          this.doWeCheckCollisions = false;
          const newX = ladder.x - (this.hitbox.x - this.x) + 0.01;
          this.setNewCoords(newX, this.y);
          this.climbDown();
          this.switchSprite("player", "climbing");
        }
      }
    }

    if (MovementController.keys.e.pressed) {
      for (let door of doors) {
        if (this.checkOverlapping(door)) {
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
      !MovementController.keys.a.pressed &&
      !MovementController.keys.d.pressed &&
      !MovementController.keys.w.pressed &&
      !MovementController.keys.s.pressed &&
      !MovementController.keys.e.pressed
    ) {
      if (this.lastDirection === "left") {
        this.switchSprite("player", "inactionLeft");
      } else {
        this.switchSprite("player", "inactionRight");
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

  switchSprite(character, animation) {
    if (this.image === this.animations[character][animation].image) return;

    this.currentFrame = 0;
    this.image = this.animations[character][animation].image;
    this.frameRate = this.animations[character][animation].frameRate;
    this.framesSpeed = this.animations[character][animation].framesSpeed;
    this.loop = this.animations[character][animation].loop;
    this.currentAnimation = this.animations[character][animation];
  }

  drawHitboxAndBorders() {
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
}
