import { canvas, context, player } from "../main.js";

import { doors, levelBackground } from "../data/levelsData.js";
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
      // levelCollisionsCells.forEach((collisionCell) => {
      //   collisionCell.draw();
      // });

      doors.forEach((door) => {
        door.draw();
      });

      // ladders.forEach((ladder) => {
      //   ladder.draw();
      // });

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
}
