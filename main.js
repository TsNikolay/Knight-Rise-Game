import { Player } from "./entities/Player.js";
import { CanvasController } from "./controllers/CanvasController.js";

export const canvas = document.querySelector("canvas");
export const context = canvas.getContext("2d");
export const player = new Player();

canvas.width = 64 * 16; //1024
canvas.height = 64 * 9; //576

CanvasController.animate();
