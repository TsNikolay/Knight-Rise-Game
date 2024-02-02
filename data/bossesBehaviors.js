export const bossesBehavior = {
  goblin: {
    moveFrom0To1Checkpoint: (boss) => {
      boss.stopRunning();
      if (boss.x > 90) {
        boss.moveLeft();
      } else if (boss.y > 80) {
        boss.doWeCheckCollisions = false;
        boss.climb();
      } else {
        boss.switchSprite("goblin", "inactionRight");
        boss.velocity.y = 0;
        boss.currentCheckPoint = 1;
        boss.doWeCheckCollisions = true;
        boss.isAttacking = true;
      }
    },
    attack1: (boss) => {
      boss.createAndDrawCharge();
      boss.trackPlayerStartPosition();
      boss.makeAttack(boss.playerStartHitbox);
    },
  },
};
