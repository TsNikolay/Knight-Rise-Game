export class MovementController {
  static keys = {
    w: { pressed: false },
    a: { pressed: false },
    s: { pressed: false },
    d: { pressed: false },
    e: { pressed: false },
  };
  constructor() {}

  static listenKeyDown() {
    window.addEventListener("keydown", (event) => {
      switch (event.code) {
        case "KeyW":
          this.keys.w.pressed = true;
          break;
        case "KeyA":
          this.keys.a.pressed = true;
          break;
        case "KeyD":
          this.keys.d.pressed = true;
          break;
        case "KeyS":
          //вниз

          break;
        case "KeyE":
          this.keys.e.pressed = true;
          break;
        default:
          console.log(event.key);
      }
    });
  }

  static listenKeyUp() {
    window.addEventListener("keyup", (event) => {
      switch (event.code) {
        case "KeyA":
          this.keys.a.pressed = false;
          break;
        case "KeyD":
          this.keys.d.pressed = false;
          break;
        case "KeyW":
          this.keys.w.pressed = false;
          break;
        case "KeyE":
          this.keys.e.pressed = false;
          break;
      }
    });
  }
}
