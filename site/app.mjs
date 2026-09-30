import { identity, work, projects } from './content.mjs';
import { renderPanels, routeFor } from './render.mjs';

const viewport = document.querySelector('#viewport');
const rail = document.querySelector('#rail');
let audioContext;
let audioNodes = [];
let soundOn = false;
let preference;
const previewItems = new Map([
  ...work.map((item, index) => [`work:${item.slug}`, { ...item, kind: 'SELECTED WORK', index, total: work.length }]),
  ...projects.map((item, index) => [`project:${item.slug}`, { ...item, kind: 'PROJECT', index, total: projects.length }]),
]);
const story = document.querySelector('[data-canvas-story]');
let fieldContext = story?.dataset.activePreview || 'work:albertsons';
let storyChangeTimer;
try { preference = localStorage.getItem('prajwal-portfolio-sound'); } catch { preference = null; }

function routePreviewKey() {
  const route = routeFor(location.pathname);
  if (route.type === 'work') return `work:${route.item.slug}`;
  if (route.type === 'project') return `project:${route.item.slug}`;
  return route.type === 'projects' ? 'project:cometverse' : 'work:albertsons';
}

function setPreview(key, animate = true) {
  const item = previewItems.get(key);
  if (!story || !item || story.dataset.activePreview === key) return;
  clearTimeout(storyChangeTimer);
  if (animate) story.classList.add('is-changing');
  const update = () => {
    story.querySelector('[data-story-kind]').textContent = item.kind;
    story.querySelector('[data-story-index]').textContent = `${String(item.index + 1).padStart(2, '0')} / ${String(item.total).padStart(2, '0')}`;
    story.querySelector('[data-story-title]').textContent = item.title;
    story.querySelector('[data-story-metric]').textContent = item.metric || item.category;
    story.querySelector('[data-story-label]').textContent = item.metricLabel || item.teaser;
    story.querySelector('[data-story-tags]').textContent = item.tags.slice(0, 4).join(' · ');
    story.dataset.activePreview = key;
    fieldContext = key;
    story.classList.remove('is-changing');
  };
  storyChangeTimer = setTimeout(update, animate ? 120 : 0);
}

function soundState() {
  const button = document.querySelector('[data-sound]');
  if (!button) return;
  button.setAttribute('aria-pressed', String(soundOn));
  button.setAttribute('aria-label', soundOn ? 'Turn sound off' : 'Turn sound on');
  button.title = soundOn ? 'Turn sound off' : 'Turn sound on';
  button.querySelector('.sound-label').textContent = soundOn ? 'SOUND ON' : 'SOUND OFF';
}

function rememberSound(value) {
  preference = value;
  try { localStorage.setItem('prajwal-portfolio-sound', value); } catch { /* Optional preference. */ }
}

async function startSound(explicit = false) {
  if (soundOn || (!explicit && preference === 'off')) return;
  try {
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) return;
    audioContext ||= new Context();
    await audioContext.resume();
    // An original, gently moving chord. No external audio file or autoplay is needed.
    if (!audioNodes.length) {
      const master = audioContext.createGain();
      master.gain.value = 0;
      master.connect(audioContext.destination);
      const filter = audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 650;
      filter.connect(master);
      const slowMotion = audioContext.createOscillator();
      const motionDepth = audioContext.createGain();
      slowMotion.frequency.value = 0.055;
      motionDepth.gain.value = 175;
      slowMotion.connect(motionDepth).connect(filter.frequency);
      slowMotion.start();
      const frequencies = [110, 164.81, 220, 277.18, 329.63];
      frequencies.forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const voice = audioContext.createGain();
        oscillator.type = index % 2 ? 'triangle' : 'sine';
        oscillator.frequency.value = frequency;
        voice.gain.value = [0.16, 0.08, 0.10, 0.06, 0.035][index];
        oscillator.connect(voice).connect(filter);
        oscillator.start();
        audioNodes.push(oscillator);
      });
      audioNodes.push(slowMotion, master);
    }
    const master = audioNodes.at(-1);
    master.gain.cancelScheduledValues(audioContext.currentTime);
    master.gain.setTargetAtTime(0.065, audioContext.currentTime, 1.4);
    soundOn = true;
    if (explicit) rememberSound('on');
    soundState();
  } catch { soundOn = false; soundState(); }
}

function stopSound() {
  if (!audioContext || !audioNodes.length) return;
  const master = audioNodes.at(-1);
  master.gain.cancelScheduledValues(audioContext.currentTime);
  master.gain.setTargetAtTime(0, audioContext.currentTime, 0.17);
  soundOn = false;
  rememberSound('off');
  soundState();
}

function positionRail(animate = true) {
  const panels = [...rail.querySelectorAll('.panel')];
  const last = panels.at(-1);
  if (!last) return;
  const available = viewport.clientWidth;
  const rightPeek = panels.length > 1 ? (available > 720 ? Math.min(available * .11, 145) : Math.min(available * .09, 48)) : 0;
  const desired = Math.min(last.offsetLeft, Math.max(0, last.offsetLeft + last.offsetWidth - available + rightPeek));
  if (!animate) rail.style.transition = 'none';
  rail.style.transform = `translateX(-${desired}px)`;
  if (!animate) requestAnimationFrame(() => { rail.style.transition = ''; });
}

function navigate(pathname, push = true) {
  const path = pathname.endsWith('/') ? pathname : pathname + '/';
  if (push && path !== location.pathname) history.pushState({}, '', path);
  const route = routeFor(path);
  rail.innerHTML = renderPanels(path);
  document.title = route.type === 'home' ? identity.name : `${route.title} | ${identity.name}`;
  document.querySelector('meta[name="description"]').content = route.description;
  document.querySelector('link[rel="canonical"]').href = `https://kp-prajwal.github.io${path}`;
  soundState();
  positionRail();
  rail.querySelector('.panel:last-child')?.scrollTo(0, 0);
  if (push) rail.querySelector('.panel:last-child')?.focus({ preventScroll: true });
  setPreview(routePreviewKey());
}

document.addEventListener('click', async event => {
  const soundButton = event.target.closest('[data-sound]');
  if (soundButton) {
    if (soundOn) stopSound(); else await startSound(true);
    return;
  }
  const emailButton = event.target.closest('[data-email]');
  if (emailButton) {
    try {
      await navigator.clipboard.writeText(identity.email);
      emailButton.innerHTML = 'Copied! <span aria-hidden="true">✓</span>';
      setTimeout(() => { if (emailButton.isConnected) emailButton.innerHTML = 'Copy email <span aria-hidden="true">↗</span>'; }, 2200);
    } catch { location.href = `mailto:${identity.email}`; }
    return;
  }
  const routeLink = event.target.closest('a[data-route]');
  if (!routeLink || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
  event.preventDefault();
  navigate(new URL(routeLink.href).pathname);
});

document.addEventListener('pointerdown', event => {
  if (event.target.closest('[data-sound]') || preference === 'off' || soundOn) return;
  startSound(false);
}, { passive: true });

document.addEventListener('pointerover', event => {
  const link = event.target.closest('[data-preview]');
  if (link) setPreview(link.dataset.preview);
});
document.addEventListener('pointerout', event => {
  const link = event.target.closest('[data-preview]');
  if (link && !link.contains(event.relatedTarget)) setPreview(routePreviewKey());
});
document.addEventListener('focusin', event => {
  const link = event.target.closest('[data-preview]');
  if (link) setPreview(link.dataset.preview);
});
document.addEventListener('focusout', event => {
  const link = event.target.closest('[data-preview]');
  if (link && !link.contains(event.relatedTarget)) setPreview(routePreviewKey());
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && location.pathname !== '/') {
    const route = routeFor(location.pathname);
    navigate(route.type === 'project' ? '/projects/' : '/');
  }
  if (event.key.toLowerCase() === 'm' && !event.repeat && !event.target.closest('input,textarea,[contenteditable]')) {
    if (soundOn) stopSound(); else startSound(true);
  }
});
window.addEventListener('popstate', () => navigate(location.pathname, false));
window.addEventListener('resize', () => positionRail(false));
soundState();
requestAnimationFrame(() => positionRail(false));

// A responsive data field: individual cells breathe and respond to the pointer.
const canvas = document.querySelector('#field');
const context = canvas.getContext('2d', { alpha: false });
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let canvasWidth = 0, canvasHeight = 0, pointer = { x: -1000, y: -1000 }, lastFrame = 0;
const fieldThemes = {
  'work:albertsons': { hue: 196, glow: -34, warm: -132, x: .75, y: .42 },
  'work:generativeproduct': { hue: 211, glow: 55, warm: -48, x: .79, y: .34 },
  'work:abb': { hue: 188, glow: -14, warm: -148, x: .72, y: .56 },
  'project:cometverse': { hue: 205, glow: -35, warm: 72, x: .76, y: .36 },
  'project:pm-interview-assistant': { hue: 218, glow: 48, warm: -62, x: .70, y: .44 },
  'project:streaming-pipeline': { hue: 190, glow: -58, warm: -105, x: .80, y: .47 },
  'project:amazon-etl': { hue: 202, glow: -25, warm: 92, x: .73, y: .52 },
  'project:demand-prediction': { hue: 181, glow: -34, warm: -118, x: .77, y: .39 },
  'project:nfl-injuries': { hue: 205, glow: -10, warm: -162, x: .68, y: .48 },
};
function sizeCanvas() {
  const ratio = Math.min(devicePixelRatio || 1, 2);
  canvasWidth = innerWidth; canvasHeight = innerHeight;
  canvas.width = Math.round(canvasWidth * ratio);
  canvas.height = Math.round(canvasHeight * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  drawField(performance.now());
}
function drawField(now) {
  const step = innerWidth < 600 ? 22 : 25;
  const theme = fieldThemes[fieldContext] || fieldThemes['work:albertsons'];
  context.fillStyle = '#07111e';
  context.fillRect(0, 0, canvasWidth, canvasHeight);
  const motion = reducedMotion.matches ? 0 : now * 0.00019;
  const orbX = canvasWidth * (theme.x + Math.sin(motion) * .10);
  const orbY = canvasHeight * (theme.y + Math.cos(motion * .8) * .15);
  for (let y = 0; y < canvasHeight; y += step) {
    for (let x = 0; x < canvasWidth; x += step) {
      const dx = x - orbX, dy = y - orbY;
      const warmX = x - canvasWidth * .93, warmY = y - canvasHeight * .82;
      const pdx = x - pointer.x, pdy = y - pointer.y;
      const glow = Math.exp(-(dx * dx + dy * dy) / 140000);
      const warm = Math.exp(-(warmX * warmX + warmY * warmY) / 115000);
      const touch = Math.exp(-(pdx * pdx + pdy * pdy) / 11500);
      const ripple = .5 + .5 * Math.sin(x * .025 + y * .018 + motion * 5);
      const light = 9 + glow * 28 + warm * 15 + touch * 22 + ripple * 3;
      const hue = theme.hue + glow * theme.glow + warm * theme.warm + touch * 20;
      const sat = 34 + glow * 37 + warm * 25;
      context.fillStyle = `hsl(${hue} ${sat}% ${light}%)`;
      context.fillRect(x + 1, y + 1, step - 2, step - 2);
    }
  }
}
function tick(now) {
  if (now - lastFrame > 45 && !document.hidden) { drawField(now); lastFrame = now; }
  if (!reducedMotion.matches) requestAnimationFrame(tick);
}
window.addEventListener('pointermove', event => { pointer = { x: event.clientX, y: event.clientY }; }, { passive: true });
window.addEventListener('resize', sizeCanvas);
reducedMotion.addEventListener('change', () => { drawField(performance.now()); if (!reducedMotion.matches) requestAnimationFrame(tick); });
sizeCanvas();
if (!reducedMotion.matches) requestAnimationFrame(tick);
