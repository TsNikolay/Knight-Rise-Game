export class KeysController {
  static keys = {
    w: { pressed: false },
    a: { pressed: false },
    s: { pressed: false },
    d: { pressed: false },
    e: { pressed: false },
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
