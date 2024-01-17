import { canvas, context, player } from "../main.js";
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
      player.draw(100, player.y);
      player.update();
    }

    // Запускаем следующий кадр
    window.requestAnimationFrame(this.animate); //requestAnimationFrame сразу параметром передаёт текущее время
  };

  static clear = () => {
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  static checkCollision = (element, obstacle) => {
    return element > obstacle;
  };
}
