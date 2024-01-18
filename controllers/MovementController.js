export class MovementController {
  static keys = {
    w: { pressed: false },
    a: { pressed: false },
    s: { pressed: false },
    d: { pressed: false },
  };
  constructor() {}

  static listenKeyDown() {
    window.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "w":
        case "ц":
          this.keys.w.pressed = true;
          break;
        case "a":
        case "ф":
          this.keys.a.pressed = true;
          break;
        case "d":
        case "в":
          this.keys.d.pressed = true;
          break;
        case "s":
        case "ы":
          //вниз

          break;
        default:
          console.log(event.key);
      }
    });
  }

  static listenKeyUp() {
    window.addEventListener("keyup", (event) => {
      switch (event.key) {
        case "a":
        case "ф":
          this.keys.a.pressed = false;
          break;
        case "d":
        case "в":
          this.keys.d.pressed = false;
          break;
        case "w":
        case "ы":
          this.keys.w.pressed = false;
          break;
      }
    });
  }
}
