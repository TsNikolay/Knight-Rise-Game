import { yardCollisionsLayout } from "../data/collisionsLayout.js";
import { CollisionBlock } from "../entities/CollisionBlock.js";

//Массив-шаблон в матрицу
Array.prototype.convertToMatrix24by14 = function () {
  const rows = [];
  for (let i = 0; i < this.length; i += 24) {
    rows.push(this.slice(i, i + 24));
  }
  return rows;
};

//Матрицу в массив объектов
Array.prototype.createObjectsFromMatrix = function () {
  const objects = [];
  this.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === 800) {
        objects.push(new CollisionBlock(x * 40, y * 40));
      }
    });
  });
  return objects;
};

export const collisionsCells = yardCollisionsLayout
  .convertToMatrix24by14()
  .createObjectsFromMatrix();
