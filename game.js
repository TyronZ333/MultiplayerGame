const canvas = document.getElementById("game-canvas");
const context = canvas.getContext("2d");

const playerRadius = 10;
const playerSpeed = 5;
let playerX = canvas.width / 2;
let playerY = canvas.height / 2;

let otherPlayers = {};

function drawPlayer(x, y) {
    context.beginPath();
    context.arc(x, y, playerRadius, 0, Math.PI * 2);
    context.fillStyle = "blue";
    context.fill();
    context.closePath();
}

function drawOtherPlayers() {
    for (let id in otherPlayers) {
        const player = otherPlayers[id];
        drawPlayer(player.x, player.y);
    }
}

function movePlayer(event) {
    switch (event.keyCode) {
        case 37: // left arrow
            playerX -= playerSpeed;
            break;
        case 38: // up arrow
            playerY -= playerSpeed;
            break;
        case 39: // right arrow
            playerX += playerSpeed;
            break;
        case 40: // down arrow
            playerY += playerSpeed;
            break;
    }

    socket.emit("playerMoved", { x: playerX, y: playerY });
}

const socket = io();
socket.on("connect", () => {
    console.log(`Connected with ID ${socket.id}`);
});

socket.on("newPlayer", data => {
    otherPlayers[data.id] = { x: data.x, y: data.y };
});

socket.on("playerMoved", data => {
    otherPlayers[data.id].x = data.x;
    otherPlayers[data.id].y = data.y;
});

document.addEventListener("keydown", movePlayer);

function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer(playerX, playerY);
    drawOtherPlayers();

    window.requestAnimationFrame(gameLoop);
}

gameLoop();
