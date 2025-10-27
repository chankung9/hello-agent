import './styles.css';

const TEXT = 'HelloWorld';
const FONT_SIZE = 48;
const FONT_FAMILY = 'Space Grotesk, sans-serif';
const LETTER_SPACING = FONT_SIZE * 0.8;
const MAX_SPEED = 4;

const DEFAULT_COLORS = {
  textColor: '#f8fafc',
  bgColor: '#0f172a',
};

const STORAGE_KEY = 'hello-agent-color-settings';

class ColorSettingsStore {
  constructor(key, defaults) {
    this.key = key;
    this.defaults = defaults;
    this.state = { ...defaults, ...this.#read() };
  }

  #read() {
    try {
      const raw = window.localStorage.getItem(this.key);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return typeof parsed === 'object' && parsed ? parsed : {};
    } catch (err) {
      console.warn('Failed to read color settings. Falling back to defaults.', err);
      return {};
    }
  }

  save(partial) {
    this.state = { ...this.state, ...partial };
    try {
      window.localStorage.setItem(this.key, JSON.stringify(this.state));
    } catch (err) {
      console.warn('Failed to persist color settings.', err);
    }
    return { ...this.state };
  }

  get() {
    return { ...this.state };
  }
}

const colorStore = new ColorSettingsStore(STORAGE_KEY, DEFAULT_COLORS);
let currentColors = colorStore.get();

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

function applyColorVariables({ textColor, bgColor }) {
  const root = document.documentElement.style;
  root.setProperty('--text-color', textColor);
  root.setProperty('--bg-color', bgColor);
}

function hexToRgb(hex) {
  const normalized = hex.replace('#', '');
  if (![3, 6].includes(normalized.length)) return null;
  if (normalized.length === 3) {
    const pairs = normalized.split('').map((char) => `${char}${char}`);
    const [r, g, b] = pairs.map((chunk) => parseInt(chunk, 16));
    return { r, g, b };
  }
  const matches = normalized.match(/.{2}/g);
  if (!matches) return null;
  const [r, g, b] = matches.map((chunk) => parseInt(chunk, 16));
  return { r, g, b };
}

function luminance(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const mapped = [rgb.r, rgb.g, rgb.b].map((channel) => {
    const srgb = channel / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * mapped[0] + 0.7152 * mapped[1] + 0.0722 * mapped[2];
}

function contrastRatio(colorA, colorB) {
  const lumA = luminance(colorA);
  const lumB = luminance(colorB);
  const brightest = Math.max(lumA, lumB);
  const darkest = Math.min(lumA, lumB);
  return (brightest + 0.05) / (darkest + 0.05);
}

function formatRatio(value) {
  return `${value.toFixed(2)}:1`;
}

const controls = document.createElement('div');
controls.className = 'color-controls';

const textButton = document.createElement('button');
textButton.type = 'button';
textButton.className = 'color-button';
textButton.dataset.tooltip = 'Text Color';
textButton.setAttribute('aria-label', 'Change text color');
textButton.textContent = '🅰️';

const backgroundButton = document.createElement('button');
backgroundButton.type = 'button';
backgroundButton.className = 'color-button';
backgroundButton.dataset.tooltip = 'Background Color';
backgroundButton.setAttribute('aria-label', 'Change background color');
backgroundButton.textContent = '🎨';

const warning = document.createElement('div');
warning.className = 'contrast-warning';
warning.innerHTML = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2a1 1 0 0 1 .88.52l9 16A1 1 0 0 1 21 20H3a1 1 0 0 1-.88-1.48l9-16A1 1 0 0 1 12 2Zm0 4.75a.75.75 0 0 0-.75.75v5a.75.75 0 0 0 1.5 0v-5A.75.75 0 0 0 12 6.75Zm0 9a1 1 0 1 0 1 1a1 1 0 0 0-1-1Z"/>
  </svg>
  <span></span>
`;

controls.append(textButton, backgroundButton, warning);
app.appendChild(controls);

const popover = document.createElement('div');
popover.className = 'color-popover';
popover.innerHTML = `
  <span class="color-popover__label" id="color-popover-label">Adjust color</span>
  <input class="color-popover__input" type="color" aria-labelledby="color-popover-label" />
  <span class="color-popover__value" id="color-popover-value"></span>
`;

const colorInput = popover.querySelector('input');
const colorValue = popover.querySelector('#color-popover-value');
const colorLabel = popover.querySelector('#color-popover-label');

app.appendChild(popover);

let activePicker = null;

function openPopover(target) {
  activePicker = target;
  const labelText = target === 'textColor' ? 'Text color' : 'Background color';
  colorLabel.textContent = labelText;
  const value = currentColors[target];
  colorInput.value = value;
  colorValue.textContent = value.toUpperCase();
  popover.classList.add('is-visible');
  colorInput.focus({ preventScroll: true });
}

function closePopover() {
  popover.classList.remove('is-visible');
  activePicker = null;
}

function updateContrastWarning() {
  const ratio = contrastRatio(currentColors.textColor, currentColors.bgColor);
  if (ratio < 4.5) {
    warning.classList.add('is-visible');
    warning.querySelector('span').textContent = `Contrast ${formatRatio(ratio)} (< 4.5:1)`;
  } else {
    warning.classList.remove('is-visible');
  }
}

textButton.addEventListener('click', () => {
  if (activePicker === 'textColor') {
    closePopover();
  } else {
    openPopover('textColor');
  }
});

backgroundButton.addEventListener('click', () => {
  if (activePicker === 'bgColor') {
    closePopover();
  } else {
    openPopover('bgColor');
  }
});

colorInput.addEventListener('input', (event) => {
  if (!activePicker) return;
  const nextValue = event.target.value;
  colorValue.textContent = nextValue.toUpperCase();
  currentColors = colorStore.save({ [activePicker]: nextValue });
  applyColorVariables(currentColors);
  updateContrastWarning();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && popover.classList.contains('is-visible')) {
    closePopover();
  }
});

document.addEventListener('click', (event) => {
  const withinControls =
    controls.contains(event.target) || popover.contains(event.target);
  if (!withinControls) {
    closePopover();
  }
});

applyColorVariables(currentColors);
updateContrastWarning();

let cachedTextColor = currentColors.textColor;
let cachedBgColor = currentColors.bgColor;

function syncColorCache() {
  const next = colorStore.get();
  if (next.textColor !== cachedTextColor || next.bgColor !== cachedBgColor) {
    cachedTextColor = next.textColor;
    cachedBgColor = next.bgColor;
    applyColorVariables(next);
    updateContrastWarning();
  }
}

function animate() {
  syncColorCache();

  ctx.fillStyle = cachedBgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  letters.forEach((letter) => {
    letter.x += letter.vx;
    letter.y += letter.vy;

    if (letter.x <= FONT_SIZE || letter.x >= canvas.width - FONT_SIZE) {
      letter.vx *= -1;
    }
    if (letter.y <= FONT_SIZE || letter.y >= canvas.height - FONT_SIZE) {
      letter.vy *= -1;
    }
  });

  ctx.fillStyle = cachedTextColor;
  letters.forEach((letter) => {
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
