import { level, levelIncrease, levels } from "./levelsData.js";

export const animationsData = {
  player: {
    inactionRight: {
      frameRate: 4,
      framesSpeed: 15,
      loop: true,
      imageSrc: "./data/images/player_sprites/Player_Inaction_Right.png",
    },
    inactionLeft: {
      frameRate: 4,
      framesSpeed: 15,
      loop: true,
      imageSrc: "./data/images/player_sprites/Player_Inaction_Left.png",
    },
    runRight: {
      frameRate: 4,
      framesSpeed: 13,
      loop: true,
      imageSrc: "./data/images/player_sprites/Player_Running_Right.png",
    },
    runLeft: {
      frameRate: 4,
      framesSpeed: 13,
      loop: true,
      imageSrc: "./data/images/player_sprites/Player_Running_Left.png",
    },
    jumpLeft: {
      frameRate: 1,
      framesSpeed: 20,
      loop: true,
      imageSrc: "./data/images/player_sprites/Player_Jump_Left.png",
    },
    jumpRight: {
      frameRate: 1,
      framesSpeed: 20,
      loop: true,
      imageSrc: "./data/images/player_sprites/Player_Jump_Right.png",
    },
    enterDoor: {
      frameRate: 6,
      framesSpeed: 15,
      loop: false,
      imageSrc: "./data/images/player_sprites/Player_EnterDoor.png",
      onComplete: () => {
        levelIncrease();
        levels[level].init();
      },
    },
    climbing: {
      frameRate: 4,
      framesSpeed: 15,
      loop: true,
      imageSrc: "./data/images/player_sprites/Player_Climbing.png",
    },
    damagedRight: {
      frameRate: 4,
      framesSpeed: 10,
      loop: true,
      imageSrc: "./data/images/player_sprites/Player_Damaged_Right.png",
    },
    damagedLeft: {
      frameRate: 4,
      framesSpeed: 10,
      loop: true,
      imageSrc: "./data/images/player_sprites/Player_Damaged_Left.png",
    },

    deathRight: {
      frameRate: 8,
      framesSpeed: 15,
      loop: false,
      imageSrc: "./data/images/player_sprites/Player_Death_Right.png",
    },

    deathLeft: {
      frameRate: 8,
      framesSpeed: 15,
      loop: false,
      imageSrc: "./data/images/player_sprites/Player_Death_Left.png",
    },

    attackRight: {
      frameRate: 4,
      framesSpeed: 7,
      loop: false,
      imageSrc: "./data/images/player_sprites/Player_Attack_Right.png",
    },

    attackLeft: {
      frameRate: 4,
      framesSpeed: 7,
      loop: false,
      imageSrc: "./data/images/player_sprites/Player_Attack_Left.png",
    },

    defenseRight: {
      frameRate: 4,
      framesSpeed: 7,
      loop: false,
      imageSrc: "./data/images/player_sprites/Player_Defense_Right.png",
    },

    defenseLeft: {
      frameRate: 4,
      framesSpeed: 7,
      loop: false,
      imageSrc: "./data/images/player_sprites/Player_Defense_Left.png",
    },
  },
  goblin: {
    inactionRight: {
      frameRate: 4,
      framesSpeed: 15,
      loop: true,
      imageSrc: "./data/images/goblin_sprites/Goblin_Inaction_Right.png",
    },
    inactionLeft: {
      frameRate: 4,
      framesSpeed: 15,
      loop: true,
      imageSrc: "./data/images/goblin_sprites/Goblin_Inaction_Left.png",
    },
    deathLeft: {
      frameRate: 8,
      framesSpeed: 15,
      loop: false,
      imageSrc: "./data/images/goblin_sprites/Goblin_Death_Right.png",
    }
  },
};
