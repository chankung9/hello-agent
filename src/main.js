import './styles.css';

const app = document.getElementById('app');

const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
app.appendChild(canvas);

const ctx = canvas.getContext('2d');

const letters = 'HelloWord'.split('').map((char) => ({
  char,
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  vx: (Math.random() - 0.5) * 4,
  vy: (Math.random() - 0.5) * 4,
}));

ctx.font = '48px sans-serif';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  letters.forEach((letter) => {
    letter.x += letter.vx;
    letter.y += letter.vy;

    if (letter.x <= 0 || letter.x >= canvas.width) {
      letter.vx *= -1;
    }
    if (letter.y <= 0 || letter.y >= canvas.height) {
      letter.vy *= -1;
    }

    ctx.fillText(letter.char, letter.x, letter.y);
  });

  requestAnimationFrame(animate);
}

animate();
