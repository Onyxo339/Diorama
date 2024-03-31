const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const balls = [];
const drops = [];
const buildings = [];
const numBalls = 100;
const numDrops = 200;

const dropColor = 'rgba(255, 255, 255, 0.5)';
const buildingColors = ["#808080", "#A9A9A9", "#696969"];

const buildingWidth = canvas.width / 10;
for (let i = 0; i < 10; i++) {
  const x = i * buildingWidth;
  const height = Math.random() * 200 + 100;
  const roofType = Math.random() < 0.5 ? 'flat' : 'sloping';
  let roofHeight = 0;
  let roofWidth = buildingWidth;
  let buildingColor = buildingColors[Math.floor(Math.random() * buildingColors.length)];
  let roofColor = buildingColors[Math.floor(Math.random() * buildingColors.length)];
  
  if (roofType === 'sloping') {
    roofHeight = Math.random() * 50 + 20;
    roofWidth = buildingWidth * 0.8;
    while (roofColor === buildingColor) {
      roofColor = buildingColors[Math.floor(Math.random() * buildingColors.length)];
    }
  }
  buildings.push({
    x,
    y: canvas.height - height,
    width: buildingWidth,
    height,
    roofHeight,
    roofWidth,
    roofType,
    buildingColor,
    roofColor
  });
}

for (let i = 0; i < numBalls; i++) {
  balls.push({
    x: Math.random() * canvas.width,
    y: -Math.random() * canvas.height,
    radius: Math.random() * 10 + 2,
    speed: Math.random() * 1 + 0.25,
    color: "white"
  });
}

for (let i = 0; i < numDrops; i++) {
  drops.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    length: Math.random() * 20 + 10,
    speed: Math.random() * 10 + 5,
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#d3d3d3';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  buildings.forEach(building => {
    ctx.fillStyle = building.buildingColor;
    ctx.fillRect(building.x, building.y, building.width, building.height);
    if (building.roofType === 'sloping') {
      ctx.fillStyle = building.roofColor;
      ctx.beginPath();
      ctx.moveTo(building.x, building.y);
      ctx.lineTo(building.x + building.width, building.y); 
      ctx.lineTo(building.x + (building.width / 2), building.y - building.roofHeight);
      ctx.closePath();
      ctx.fill();
    }
  });

  ctx.strokeStyle = dropColor;
  ctx.lineWidth = 2;
  drops.forEach(drop => {
    ctx.beginPath();
    ctx.moveTo(drop.x, drop.y);
    ctx.lineTo(drop.x, drop.y + drop.length);
    ctx.stroke();
  });

  balls.forEach(ball => {
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
  });

}

function update() {
  drops.forEach(drop => {
    drop.y += drop.speed;

    if (drop.y - drop.length > canvas.height) {
      drop.y = -drop.length;
      drop.x = Math.random() * canvas.width;
    }
  });

  balls.forEach((ball, ballIndex) => {
    ball.y += ball.speed;

    buildings.forEach((building, buildingIndex) => {
      if ((ball.x + ball.radius > building.x && ball.x - ball.radius < building.x + building.width &&
          ball.y + ball.radius > building.y && ball.y - ball.radius < building.y + building.height) ||
          (building.roofType === 'sloping' &&
          ball.x + ball.radius > building.x && ball.x - ball.radius < building.x + building.width &&
          ball.y - ball.radius < building.y && ball.y - ball.radius > building.y - building.roofHeight)) {
        if (ball.radius < 6) {
          ball.y = -ball.radius;
          ball.x = Math.random() * canvas.width;
        }
      }
    });

    if (ball.y - ball.radius > canvas.height) {
      ball.y = -ball.radius;
      ball.x = Math.random() * canvas.width;
    }
  });
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();