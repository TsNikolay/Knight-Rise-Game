import { canvas, context, player } from "../main.js";

import {
  boss,
  doors,
  ladders,
  levelBackground,
  levelCollisionsCells,
} from "../data/levelsData.js";
import { InterfaceController } from "./InterfaceConrtoller.js";

export class CanvasController {
  constructor() {}

  static lastFrameTime = 0;

  static animate = (timestamp) => {
    // Вычисляем разницу во времени с предыдущим кадром
    const deltaTime = (timestamp - this.lastFrameTime) / 1000; // переводим в секунды

    // Проверяем, прошло ли достаточно времени (10 миллисекунд)
    if (deltaTime >= 0.01) {
      this.lastFrameTime = timestamp;

      // Код анимации
      this.clear();
      levelBackground.draw();
      InterfaceController.draw();

      // this.drawCollisions();
      this.drawDoors();
      // this.drawLaddersCollisions();

      if (boss) {
        boss.draw();
        boss.update();
      }

      player.draw();
      player.update();
      player.handleKeysInput();
    }

    // Запускаем следующий кадр
    window.requestAnimationFrame(this.animate); //requestAnimationFrame сразу параметром передаёт текущее время
  };

  static clear = () => {
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  static drawCollisions() {
    levelCollisionsCells.forEach((collisionCell) => {
      collisionCell.draw();
    });
  }

  static drawDoors() {
    doors.forEach((door) => {
      door.draw();
    });
  }

  static drawLaddersCollisions() {
    ladders.forEach((ladder) => {
      ladder.draw();
    });
  }
}
