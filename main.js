import { Player } from "./entities/Player.js";
import { CanvasController } from "./controllers/CanvasController.js";
import { MovementController } from "./controllers/MovementController.js";
import { animationsData } from "./data/animationsData.js";
import { level, levels } from "./data/levelsData.js";

export const canvas = document.querySelector("canvas");
export const context = canvas.getContext("2d");
export const player = new Player({
  imgSrc: "./data/images/player_sprites/Player_Inaction_Right.png",
  x: 100,
  y: 100,
  animations: animationsData,
  frameRate: 4,
  framesSpeed: 15,
  loop: true,
});

canvas.width = 40 * 24; //1024
canvas.height = 40 * 14; //576

levels[level].init();

MovementController.listenKeyDown();
MovementController.listenKeyUp();
CanvasController.animate();
