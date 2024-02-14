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
      if (cell === 1) {
        objects.push(new CollisionBlock({ x: x * 40, y: y * 40 }));
      }
    });
  });
  return objects;
};

export const createCollisionsArray = (array) => {
  return array.convertToMatrix24by14().createObjectsFromMatrix();
};

export function checkCollisions(object, collisionBlock) {
  return (
    object.x <= collisionBlock.x + collisionBlock.width &&
    object.x + object.width >= collisionBlock.x &&
    object.y + object.height >= collisionBlock.y &&
    object.y <= collisionBlock.y + collisionBlock.height
  );
}

export function checkOverlapping(object, objectToOverlap) {
  return (
    object.x + object.width <= objectToOverlap.x + objectToOverlap.width &&
    object.x >= objectToOverlap.x &&
    object.y + object.height >= objectToOverlap.y &&
    object.y <= objectToOverlap.y + objectToOverlap.height
  );
}
