import './styles.css';

const TEXT = 'HelloWorld';
const FONT_SIZE = 48;
const FONT_FAMILY = 'Space Grotesk, sans-serif';
const LETTER_SPACING = FONT_SIZE * 0.8;
const MAX_SPEED = 4;

const app = document.getElementById('app');

const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
app.appendChild(canvas);

const ctx = canvas.getContext('2d');
ctx.font = `${FONT_SIZE}px ${FONT_FAMILY}`;
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const offset = (TEXT.length - 1) / 2;

const letters = TEXT.split('').map((char, index) => ({
  char,
  x: centerX + (index - offset) * LETTER_SPACING,
  y: centerY,
  vx: (Math.random() - 0.5) * MAX_SPEED,
  vy: (Math.random() - 0.5) * MAX_SPEED,
}));

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  letters.forEach((letter) => {
    letter.x += letter.vx;
    letter.y += letter.vy;

    if (letter.x <= FONT_SIZE || letter.x >= canvas.width - FONT_SIZE) {
      letter.vx *= -1;
    }
    if (letter.y <= FONT_SIZE || letter.y >= canvas.height - FONT_SIZE) {
      letter.vy *= -1;
    }

    ctx.fillText(letter.char, letter.x, letter.y);
  });

  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.font = `${FONT_SIZE}px ${FONT_FAMILY}`;
});

animate();
