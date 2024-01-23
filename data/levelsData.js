import { Sprite } from "../entities/Sprite.js";
import { createCollisionsArray } from "../utils/CollisionsUtils.js";
import { collisionsLevel0, collisionsLevel1 } from "./collisionsLayout.js";
import { player } from "../main.js";

export let levelCollisionsCells;
export let levelBackground;
export let doors;
export let level = 1;
export const levelIncrease = () => {
  if (level === Object.keys(levels).length) {
    level = 1;
  } else {
    level++;
  }
};

export let levels = {
  1: {
    init: () => {
      player.switchSprite("inactionRight");
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
    },
  },
  2: {
    init: () => {
      player.switchSprite("inactionRight");
      player.preventInput = false;
      player.x = 100;
      player.y = 120;
      if (player.currentAnimation) player.currentAnimation.isActive = false;

      levelBackground = new Sprite({
        imgSrc: "./data/images/goblinArena.png",
        x: 0,
        y: 0,
      });

      levelCollisionsCells = createCollisionsArray(collisionsLevel1);

      doors = [
        new Sprite({
          imgSrc: "./data/images/doorOpening.png",
          x: 800,
          y: 360,
          frameRate: 4,
          framesSpeed: 14,
          loop: false,
          autoplay: false,
        }),
      ];
    },
  },
};
