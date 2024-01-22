import { Player } from "./entities/Player.js";
import { CanvasController } from "./controllers/CanvasController.js";
import { MovementController } from "./controllers/MovementController.js";
import { animationsData } from "./data/animationsData.js";

export const canvas = document.querySelector("canvas");
export const context = canvas.getContext("2d");
export const player = new Player(
  "./data/images/player_sprites/Player_Inaction_Right.png",
  100,
  100,
  4,
  animationsData,
);

canvas.width = 40 * 24; //1024
canvas.height = 40 * 14; //576

MovementController.listenKeyDown();
MovementController.listenKeyUp();
CanvasController.animate();
