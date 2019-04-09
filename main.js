
console.log("Initializing game...");

const canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

const drawBackground = ctx => {
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillRect(0, 0, 800, 600);
}

const playerShip = {
    x: 100,
    y: 100,
    rotation: 0,
    moveDirection: {
        x: 0,
        y: 0
    }
};

drawShip = (c, ship) => {
    c.save();
    c.strokeStyle = 'white';
    c.translate(ship.x, ship.y);
    c.rotate(ship.rotation);
    c.beginPath();
    c.moveTo(0, -10);
    c.lineTo(5, 10);
    c.lineTo(0, 5);
    c.lineTo(-5, 10);
    c.closePath();
    c.stroke();
    c.restore();
}

function draw() {
    ctx.clearRect(0, 0, 800, 600);
    drawBackground(ctx);
    drawShip(ctx, playerShip);
}

const keys = [];

window.addEventListener("keydown", e => {
    keys[e.keyCode] = true;
});

window.addEventListener("keyup", e => {
    delete keys[e.keyCode];
});

const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;

function handleInput(timeFactor) {
    if (keys[KEY_LEFT])
        playerShip.rotation -= 0.1 * timeFactor;
    if (keys[KEY_RIGHT])
        playerShip.rotation += 0.1 * timeFactor;

    const moveDirection = playerShip.moveDirection;
    moveDirection.x *= 0.99 * timeFactor;
    moveDirection.y *= 0.99 * timeFactor;

    if (keys[KEY_UP] || keys[KEY_DOWN]) {
        const sgn = keys[KEY_UP] ? 1 : -1;
        const rad = playerShip.rotation + Math.PI / 2; // ship facing up is 90°
        const v = {
            x: Math.cos(rad) * 0.3 * timeFactor,
            y: Math.sin(rad) * 0.3 * timeFactor
        };
        moveDirection.x += sgn * v.x;
        moveDirection.y += sgn * v.y;
        playerShip.moveDirection = moveDirection;
    }

    playerShip.x -= moveDirection.x;
    playerShip.y -= moveDirection.y;
}

let lastTimestamp;

function loop(timestamp) {
    const timeFactor = (lastTimestamp != null) ? (timestamp - lastTimestamp) / (1000 / 60) : 1;
    lastTimestamp = timestamp;
    handleInput(timeFactor);
    draw();
    window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);
