import { CanvasController } from "./controllers/CanvasController.js";
import { KeysController } from "./controllers/KeysController.js";
import { animationsData } from "./data/animationsData.js";
import { level, levels } from "./data/levelsData.js";
import { Player } from "./entities/Player.js";
import { InterfaceController } from "./controllers/InterfaceConrtoller.js";

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
  health: 100,
});
canvas.width = 40 * 24; //960
canvas.height = 40 * 14; //560

levels[level].init();

KeysController.listenKeyDown();
KeysController.listenKeyUp();
KeysController.listenMouseClick();

CanvasController.animate();
InterfaceController.createInterface();
