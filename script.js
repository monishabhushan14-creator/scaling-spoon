
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("high-score");
const restartBtn = document.getElementById("restartBtn");

const GRID_SIZE = 20;
const TILE_COUNT = canvas.width / GRID_SIZE;

let snake = [];
let food = { x: 0, y: 0 };
let dx = 0;
let dy = 0;
let score = 0;
let highScore = Number(localStorage.getItem("snakeHighScore")) || 0;
let gameLoop = null;
let changingDirection = false;

highScoreEl.textContent = highScore;

function initGame() {
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ];
  dx = 1;
  dy = 0;
  score = 0;
  scoreEl.textContent = score;
  restartBtn.classList.add("hidden");
  spawnFood();

  if (gameLoop) clearInterval(gameLoop);
  gameLoop = setInterval(update, 100);
}

function update() {
  changingDirection = false;
  moveSnake();

  if (checkCollision()) {
    endGame();
    return;
  }

  draw();
}

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreEl.textContent = score;
    if (score > highScore) {
      highScore = score;
      highScoreEl.textContent = highScore;
      localStorage.setItem("snakeHighScore", highScore);
    }
    spawnFood();
  } else {
    snake.pop();
  }
}

function checkCollision() {
  const head = snake[0];

  // Wall collision
  if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
    return true;
  }

  // Self collision
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }
  return false;
}

function spawnFood() {
  food = {
    x: Math.floor(Math.random() * TILE_COUNT),
    y: Math.floor(Math.random() * TILE_COUNT)
  };

  // Prevent food from spawning on the snake
  if (snake.some(part => part.x === food.x && part.y === food.y)) {
    spawnFood();
  }
}

function draw() {
  ctx.fillStyle = "#1e1e1e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw food
  ctx.fillStyle = "#f87171";
  ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);

  // Draw snake
  snake.forEach((part, index) => {
    ctx.fillStyle = index === 0 ? "#4ade80" : "#22c55e";
    ctx.fillRect(part.x * GRID_SIZE, part.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
  });
}

function endGame() {
  clearInterval(gameLoop);
  ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 28px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2);

  restartBtn.classList.remove("hidden");
}

document.addEventListener("keydown", (e) => {
  if (changingDirection) return;

  const key = e.key.toLowerCase();
  const goingUp = dy === -1;
  const goingDown = dy === 1;
  const goingRight = dx === 1;
  const goingLeft = dx === -1;

  if ((key === "arrowleft" || key === "a") && !goingRight) {
    dx = -1; dy = 0; changingDirection = true;
  } else if ((key === "arrowup" || key === "w") && !goingDown) {
    dx = 0; dy = -1; changingDirection = true;
  } else if ((key === "arrowright" || key === "d") && !goingLeft) {
    dx = 1; dy = 0; changingDirection = true;
  } else if ((key === "arrowdown" || key === "s") && !goingUp) {
    dx = 0; dy = 1; changingDirection = true;
  }
});

restartBtn.addEventListener("click", initGame);

initGame();
