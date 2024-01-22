import { canvas, context, player } from "../main.js";
import { Location } from "../entities/Location.js";
import { collisionsCells } from "../utils/CollisionsUtils.js";
import { doorsData } from "../data/doorsData.js";
export class CanvasController {
  constructor() {}

  static lastFrameTime = 0;
  static backgroundYard = new Location({
    backgroundImageSrc: "./data/images/yard.png",
    collisionCells: collisionsCells,
  });

  static animate = (timestamp) => {
    // Вычисляем разницу во времени с предыдущим кадром
    const deltaTime = (timestamp - this.lastFrameTime) / 1000; // переводим в секунды

    // Проверяем, прошло ли достаточно времени (10 миллисекунд)
    if (deltaTime >= 0.01) {
      this.lastFrameTime = timestamp;

      // Код анимации
      this.clear();
      this.backgroundYard.draw();
      // collisionsCells.forEach((collisionCell) => {
      //   collisionCell.draw();
      // });

      doorsData.forEach((door) => {
        door.draw();
      });

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
