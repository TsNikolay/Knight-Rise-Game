export class KeysController {
  static keys = {
    w: { pressed: false },
    a: { pressed: false },
    s: { pressed: false },
    d: { pressed: false },
    e: { pressed: false },
    one: { pressed: false },
    two: { pressed: false },
    three: { pressed: false },
    leftMouseButton: { pressed: false },
    rightMouseButton: { pressed: false },
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
          this.keys.s.pressed = true;

          break;
        case "KeyE":
          this.keys.e.pressed = true;
          break;
        case "Digit1":
          this.keys.one.pressed = true;
          break;
        case "Digit2":
          this.keys.two.pressed = true;
          break;
        case "Digit3":
          this.keys.three.pressed = true;
          break;
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
        case "KeyS":
          this.keys.s.pressed = false;
          break;
        case "KeyE":
          this.keys.e.pressed = false;
          break;
        case "Digit1":
          this.keys.one.pressed = false;
          break;
        case "Digit2":
          this.keys.two.pressed = false;
          break;
        case "Digit3":
          this.keys.three.pressed = false;
          break;
      }
    });
  }

  static listenMouseClick() {
    window.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });

    window.addEventListener("mousedown", (event) => {
      if (event.button === 0) {
        this.keys.leftMouseButton.pressed = true;
      } else if (event.button === 2) {
        this.keys.rightMouseButton.pressed = true;
      }
    });

    window.addEventListener("mouseup", (event) => {
      if (event.button === 2) {
        this.keys.rightMouseButton.pressed = false;
      }
    });
  }
}
