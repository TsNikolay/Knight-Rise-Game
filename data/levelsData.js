import { Sprite } from "../entities/Sprite.js";
import { createCollisionsArray } from "../utils/CollisionsUtils.js";
import { collisionsLevel0, collisionsLevel1 } from "./collisionsLayout.js";
import { player } from "../main.js";
import { animationsData } from "./animationsData.js";
import { Goblin } from "../entities/Goblin.js";

export let levelCollisionsCells;
export let levelBackground;
export let doors;
export let ladders;
export let boss;
export let level = 1;

export const levelIncrease = () => {
  if (level === Object.keys(levels).length) {
    level = 1;
  } else {
    level++;
  }
};
export const levelsReset = () => {
  level = 1;
};

export let levels = {
  1: {
    init: () => {
      player.switchSprite("player", "inactionRight");
      player.preventInput = false;
      player.x = 100;
      player.y = 280;

      if (player.currentAnimation) player.currentAnimation.isActive = false;

      levelBackground = new Sprite({
        imgSrc: "./data/images/yard.png",
        x: 0,
        y: 0,
      });

      levelCollisionsCells = createCollisionsArray(collisionsLevel0);

      doors = [
        new Sprite({
          imgSrc: "./data/images/doorOpening.png",
          x: 720,
          y: 240,
          frameRate: 4,
          framesSpeed: 14,
          loop: false,
          autoplay: false,
        }),
      ];

      ladders = [];
      boss = null;
    },
  },
  2: {
    init: () => {
      player.switchSprite("player", "inactionRight");
      player.preventInput = false;
      player.x = 100;
      player.y = 120;
      player.chestWasChosen = false;
      if (player.currentAnimation) player.currentAnimation.isActive = false;

      levelBackground = new Sprite({
        imgSrc: "./data/images/goblinArena.png",
        x: 0,
        y: 0,
      });

      levelCollisionsCells = createCollisionsArray(collisionsLevel1);
      doors = []; //Пока гоблин живий, дверей для виходу немає

      ladders = [
        new Sprite({
          x: 120,
          y: 160,
          width: 40,
          height: 280,
        }),
        new Sprite({
          x: 760,
          y: 160,
          width: 40,
          height: 280,
        }),
      ];

      boss = new Goblin({
        imgSrc: "./data/images/goblin_sprites/Goblin_Inaction_Left.png",
        x: 800,
        y: 80,
        frameRate: 4,
        framesSpeed: 14,
        loop: true,
        autoplay: true,
        animations: animationsData,
        health: 500,
      });
    },
  },
};
