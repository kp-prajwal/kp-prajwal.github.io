import { identity } from './content.mjs';
import { renderPanels, routeFor } from './render.mjs';

const viewport = document.querySelector('#viewport');
const rail = document.querySelector('#rail');
let audioContext;
let audioNodes = [];
let soundOn = false;
let preference;
const toast = document.querySelector('[data-easter-toast]');
const discoveriesToggle = document.querySelector('[data-discoveries-toggle]');
const discoveriesCard = document.querySelector('[data-discoveries-card]');
let visualMode = 'default';
let visualTimer;
let toastTimer;
let locationIndex = 0;
let typedSequence = '';
let discovered = new Set();
try { preference = localStorage.getItem('prajwal-portfolio-sound'); } catch { preference = null; }
try { discovered = new Set(JSON.parse(sessionStorage.getItem('prajwal-discoveries') || '[]')); } catch { discovered = new Set(); }
if (discovered.delete('ride')) {
  discovered.add('data');
  try { sessionStorage.setItem('prajwal-discoveries', JSON.stringify([...discovered])); } catch { /* Session progress is optional. */ }
}

function updateDiscoveries() {
  document.querySelector('[data-discoveries-count]').textContent = `${discovered.size} / 3`;
  document.querySelectorAll('[data-discovery-clue]').forEach(clue => {
    clue.classList.toggle('is-found', discovered.has(clue.dataset.discoveryClue));
  });
}

function markDiscovery(name) {
  if (discovered.has(name)) return;
  discovered.add(name);
  try { sessionStorage.setItem('prajwal-discoveries', JSON.stringify([...discovered])); } catch { /* Session progress is optional. */ }
  updateDiscoveries();
}

function toggleDiscoveries() {
  const opening = discoveriesCard.hidden;
  discoveriesCard.hidden = !opening;
  discoveriesToggle.setAttribute('aria-expanded', String(opening));
}

discoveriesToggle.addEventListener('click', event => {
  event.stopPropagation();
  toggleDiscoveries();
});

function showToast(message, duration = 2400) {
  if (!toast) return;
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('is-visible');
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), duration);
}

function activateVisual(mode, message, duration = 8500) {
  clearTimeout(visualTimer);
  if (visualMode === mode) {
    visualMode = 'default';
    showToast('Back to the data field.');
  } else {
    visualMode = mode;
    showToast(message);
    visualTimer = setTimeout(() => { visualMode = 'default'; }, duration);
  }
  if (typeof drawField === 'function') drawField(performance.now());
}

function switchLocation(button) {
  const locations = [
    { city: 'Dallas', zone: 'America/Chicago' },
    { city: 'Bengaluru', zone: 'Asia/Kolkata' },
  ];
  locationIndex = (locationIndex + 1) % locations.length;
  const location = locations[locationIndex];
  const time = new Intl.DateTimeFormat('en-US', { timeZone: location.zone, hour: 'numeric', minute: '2-digit' }).format(new Date());
  button.querySelector('[data-location-label]').textContent = `${location.city} · ${time}`;
  showToast(locationIndex ? 'Where I started.' : 'Where I am now.');
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
  locationIndex = 0;
  document.title = route.type === 'home' ? identity.name : `${route.title} | ${identity.name}`;
  document.querySelector('meta[name="description"]').content = route.description;
  document.querySelector('link[rel="canonical"]').href = `https://kp-prajwal.github.io${path}`;
  soundState();
  positionRail();
  rail.querySelector('.panel:last-child')?.scrollTo(0, 0);
  if (push) rail.querySelector('.panel:last-child')?.focus({ preventScroll: true });
}

document.addEventListener('click', async event => {
  const footballButton = event.target.closest('[data-football]');
  if (footballButton) {
    markDiscovery('football');
    activateVisual('football', 'GGMU · Manchester is red.');
    return;
  }
  const locationButton = event.target.closest('[data-location]');
  if (locationButton) {
    markDiscovery('location');
    switchLocation(locationButton);
    return;
  }
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
  if (event.target.closest('[data-sound],[data-easter]') || preference === 'off' || soundOn) return;
  startSound(false);
}, { passive: true });

document.addEventListener('keydown', event => {
  if (!event.metaKey && !event.ctrlKey && !event.altKey && event.key.length === 1 && !event.target.closest('input,textarea,[contenteditable]')) {
    typedSequence = (typedSequence + event.key.toLowerCase()).slice(-16);
    if (typedSequence.endsWith('data')) {
      typedSequence = '';
      markDiscovery('data');
      activateVisual('data', 'DATA IN MOTION · SOURCE → SIGNAL');
    }
  }
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
updateDiscoveries();
requestAnimationFrame(() => positionRail(false));

// A responsive data field: individual cells breathe and respond to the pointer.
const canvas = document.querySelector('#field');
const context = canvas.getContext('2d', { alpha: false });
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let canvasWidth = 0, canvasHeight = 0, pointer = { x: -1000, y: -1000 }, lastFrame = 0;
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
  context.fillStyle = '#07111e';
  context.fillRect(0, 0, canvasWidth, canvasHeight);
  const motion = reducedMotion.matches ? 0 : now * 0.00019;
  const orbX = canvasWidth * (.74 + Math.sin(motion) * .10);
  const orbY = canvasHeight * (.40 + Math.cos(motion * .8) * .15);
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
      const hue = 196 - glow * 30 - warm * 135 + touch * 20;
      const sat = 34 + glow * 37 + warm * 25;
      context.fillStyle = `hsl(${hue} ${sat}% ${light}%)`;
      context.fillRect(x + 1, y + 1, step - 2, step - 2);
    }
  }
  if (visualMode === 'football') drawFootballField();
  if (visualMode === 'data') drawDataPipeline(now);
}
function drawFootballField() {
  const left = Math.max(420, canvasWidth * .34), right = canvasWidth - 38;
  const top = 42, bottom = canvasHeight - 42, width = right - left, height = bottom - top;
  if (width < 260 || height < 260) return;
  context.save();
  context.strokeStyle = 'rgba(205,255,224,.42)';
  context.lineWidth = 1.2;
  context.strokeRect(left, top, width, height);
  context.beginPath();
  context.moveTo(left + width / 2, top); context.lineTo(left + width / 2, bottom);
  context.stroke();
  context.beginPath();
  context.arc(left + width / 2, top + height / 2, Math.min(width, height) * .12, 0, Math.PI * 2);
  context.stroke();
  const boxWidth = width * .15, boxHeight = height * .38;
  context.strokeRect(left, top + (height - boxHeight) / 2, boxWidth, boxHeight);
  context.strokeRect(right - boxWidth, top + (height - boxHeight) / 2, boxWidth, boxHeight);
  context.fillStyle = 'rgba(205,255,224,.55)';
  context.beginPath(); context.arc(left + width / 2, top + height / 2, 2.5, 0, Math.PI * 2); context.fill();
  context.restore();
}
function drawDataPipeline(now) {
  const left = Math.max(430, canvasWidth * .38);
  const right = canvasWidth - 48;
  const width = right - left;
  const centerY = canvasHeight * .5;
  if (width < 260) return;

  const nodes = [
    { x: left, y: centerY },
    { x: left + width * .24, y: centerY },
    { x: left + width * .47, y: canvasHeight * .30 },
    { x: left + width * .47, y: canvasHeight * .70 },
    { x: left + width * .73, y: centerY },
    { x: right, y: centerY },
  ];
  const segments = [[0, 1], [1, 2], [1, 3], [2, 4], [3, 4], [4, 5]];
  context.save();
  context.lineCap = 'round';
  context.strokeStyle = 'rgba(176, 240, 220, .34)';
  context.lineWidth = 1.25;
  segments.forEach(([from, to]) => {
    context.beginPath();
    context.moveTo(nodes[from].x, nodes[from].y);
    context.lineTo(nodes[to].x, nodes[to].y);
    context.stroke();
  });

  nodes.forEach((node, index) => {
    context.fillStyle = index === 0 || index === nodes.length - 1
      ? 'rgba(204, 255, 229, .92)'
      : 'rgba(111, 215, 201, .82)';
    context.beginPath();
    context.arc(node.x, node.y, index === 0 || index === nodes.length - 1 ? 5 : 3.5, 0, Math.PI * 2);
    context.fill();
  });

  const elapsed = reducedMotion.matches ? 0 : now * .00022;
  segments.forEach(([from, to], segmentIndex) => {
    for (let record = 0; record < 3; record++) {
      const progress = (elapsed + segmentIndex * .19 + record / 3) % 1;
      const start = nodes[from], end = nodes[to];
      const x = start.x + (end.x - start.x) * progress;
      const y = start.y + (end.y - start.y) * progress;
      const pulse = .68 + Math.sin((progress + elapsed) * Math.PI * 2) * .2;
      context.fillStyle = `rgba(211, 255, 234, ${pulse})`;
      context.shadowColor = 'rgba(99, 255, 209, .75)';
      context.shadowBlur = 8;
      context.fillRect(x - 3, y - 3, 6, 6);
    }
  });
  context.restore();
}
function tick(now) {
  if (now - lastFrame > 45 && !document.hidden) { drawField(now); lastFrame = now; }
  if (!reducedMotion.matches) requestAnimationFrame(tick);
}
window.addEventListener('pointermove', event => {
  pointer = { x: event.clientX, y: event.clientY };
}, { passive: true });
window.addEventListener('resize', sizeCanvas);
reducedMotion.addEventListener('change', () => { drawField(performance.now()); if (!reducedMotion.matches) requestAnimationFrame(tick); });
sizeCanvas();
if (!reducedMotion.matches) requestAnimationFrame(tick);
