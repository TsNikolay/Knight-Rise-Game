const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

canvas.width = 64 * 16; //1024
canvas.height = 64 * 9; //576

context.fillStyle = "white";
context.fillRect(0, 0, canvas.width, canvas.height);
