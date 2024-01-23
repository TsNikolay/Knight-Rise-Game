import { player } from "../main.js";
import { MovementController } from "../controllers/MovementController.js";
import { Sprite } from "./Sprite.js";
import { doors, levelCollisionsCells } from "../data/levelsData.js";

export class Player extends Sprite {
  constructor({
    imgSrc,
    x,
    y,
    animations,
    frameRate,
    framesSpeed,
    loop,
    autoplay,
  }) {
    super({ imgSrc, x, y, animations, frameRate, framesSpeed, loop, autoplay });

    this.velocity = {
      x: 0,
      y: 0,
    };
    this.gravity = 1;
    this.jumpHeight = -22; //минус потому что чем меньше "y" тем выше прыжок
    this.runningSpeed = 5;
  }

  update() {
    this.x += this.velocity.x;
    this.updateHitbox();
    this.handleHorizontalCollisions(levelCollisionsCells);
    this.applyGravity();
    this.updateHitbox();

    //Отрисовка границ хитбокса и игрока
    // context.fillStyle = "rgba(0,0,255,0.3)";
    // context.fillRect(this.x, this.y, this.width, this.height);
    // context.fillStyle = "rgba(0,255,0,0.3)";
    // context.fillRect(
    //   this.hitbox.x,
    //   this.hitbox.y,
    //   this.hitbox.width,
    //   this.hitbox.height,
    // );

    this.handleVerticalCollisions(levelCollisionsCells);
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
      this.x = collisionBlock.x + collisionBlock.width - offset + 0.01; //0.01 чтобы не точно на границе блока мы были
    }
    if (this.velocity.x > 0) {
      //Если идем вправо
      const offset = this.hitbox.x - this.x + this.hitbox.width;
      this.x = collisionBlock.x - offset - 0.01; //0.01 чтобы не точно на границе блока мы были
    }
  }
  preventVerticalCollision(collisionBlock) {
    if (this.velocity.y < 0) {
      //Если идем вверх
      this.velocity.y = 0;
      const offset = this.hitbox.y - this.y;
      this.y = collisionBlock.y + collisionBlock.height - offset + 0.01; //0.01 чтобы не точно на границе блока мы были
      MovementController.keys.w.pressed = false;
    }
    if (this.velocity.y > 0) {
      //Если идем вниз
      this.velocity.y = 0;
      const offset = this.hitbox.y - this.y + this.hitbox.height;
      this.y = collisionBlock.y - offset - 0.01; //0.01 чтобы не точно на границе блока мы были
    }
  }

  applyGravity() {
    this.velocity.y += this.gravity;
    this.y += this.velocity.y;
  }
  handleKeysInput() {
    if (this.preventInput) return;

    this.stopMoving();

    if (MovementController.keys.a.pressed) {
      this.switchSprite("runLeft");
      this.lastDirection = "left";
      this.moveLeft();
    }
    if (MovementController.keys.d.pressed) {
      this.switchSprite("runRight");
      this.lastDirection = "right";
      this.moveRight();
    }

    if (MovementController.keys.w.pressed) {
      this.jump();

      if (this.lastDirection === "left") {
        this.switchSprite("jumpLeft");
      } else {
        this.switchSprite("jumpRight");
      }
    }

    if (MovementController.keys.e.pressed) {
      for (let i = 0; i < doors.length; i++) {
        const door = doors[i];
        if (this.checkOverlapping(door)) {
          this.velocity.x = 0;
          this.preventInput = true;
          const offset = 9;
          this.x = door.x + offset;
          door.setAutoplayTrue();
          this.switchSprite("enterDoor");
        }
      }
    }

    if (
      //Если бы сделал else if и просто else, персонаж бы не мог одновременно прыгать и бегать (с return тоже самое)
      !MovementController.keys.a.pressed &&
      !MovementController.keys.d.pressed &&
      !MovementController.keys.w.pressed &&
      !MovementController.keys.e.pressed
    ) {
      if (player.lastDirection === "left") {
        this.switchSprite("inactionLeft");
      } else {
        this.switchSprite("inactionRight");
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

  stopMoving() {
    player.velocity.x = 0;
  }

  updateHitbox() {
    this.hitbox = {
      x: this.x + 35,
      y: this.y + 30,
      width: 38,
      height: 70,
    };
  }

  switchSprite(name) {
    if (this.image === this.animations[name].image) return;

    this.currentFrame = 0;
    this.image = this.animations[name].image;
    this.frameRate = this.animations[name].frameRate;
    this.framesSpeed = this.animations[name].framesSpeed;
    this.loop = this.animations[name].loop;
    this.currentAnimation = this.animations[name];
  }
}
