import { identity, work, projects, about, certifications } from './content.mjs';

const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const external = (href, label, className = '') => `<a class="${className}" href="${escapeHTML(href)}" target="_blank" rel="noopener noreferrer">${escapeHTML(label)}<span aria-hidden="true"> ↗</span></a>`;

export function routeFor(pathname) {
  const path = pathname.replace(/\/index\.html$/, '').replace(/\/$/, '') || '/';
  if (path === '/') return { type: 'home', depth: 0, title: identity.name, description: identity.description };
  if (path === '/about') return { type: 'about', depth: 1, title: 'About', description: about.summary };
  if (path === '/certifications') return { type: 'certifications', depth: 1, title: 'Certifications', description: 'Selected data and cloud certifications earned by Prajwal Kulkarni.' };
  if (path === '/projects') return { type: 'projects', depth: 1, title: 'Projects', description: 'Selected data engineering, AI, and machine-learning projects by Prajwal Kulkarni.' };
  const workItem = work.find(item => path === `/work/${item.slug}`);
  if (workItem) return { type: 'work', item: workItem, depth: 1, title: workItem.title, description: workItem.summary };
  const project = projects.find(item => path === `/projects/${item.slug}`);
  if (project) return { type: 'project', item: project, depth: 2, title: project.title, description: project.summary };
  return { type: 'not-found', depth: 1, title: 'Page not found', description: identity.description };
}

function listLink(item, type, index) {
  const href = type === 'work' ? `/work/${item.slug}/` : `/projects/${item.slug}/`;
  return `<a class="index-link" data-route data-preview="${type}:${escapeHTML(item.slug)}" href="${href}"><span class="index-number">${String(index + 1).padStart(2, '0')}</span><span class="index-copy"><strong>${escapeHTML(item.title)}</strong><small>${escapeHTML(item.teaser)}</small></span><span class="index-arrow" aria-hidden="true">↗</span></a>`;
}

function canvasStory(pathname) {
  const route = routeFor(pathname);
  const isProject = route.type === 'project' || route.type === 'projects';
  const item = route.type === 'project' ? route.item : (isProject ? projects[0] : (route.type === 'work' ? route.item : work[0]));
  const collection = isProject ? projects : work;
  const index = Math.max(0, collection.findIndex(entry => entry.slug === item.slug));
  const kind = isProject ? 'project' : 'work';
  const metric = item.metric || item.category;
  const metricLabel = item.metricLabel || item.teaser;
  return `<aside class="canvas-story" data-canvas-story data-active-preview="${kind}:${escapeHTML(item.slug)}" aria-hidden="true"${route.type === 'home' ? '' : ' hidden'}>
    <div class="canvas-story-line"></div>
    <div class="canvas-story-head"><span data-story-kind>${isProject ? 'PROJECT' : 'SELECTED WORK'}</span><span data-story-index>${String(index + 1).padStart(2, '0')} / ${String(collection.length).padStart(2, '0')}</span></div>
    <h2 data-story-title>${escapeHTML(item.title)}</h2>
    <div class="canvas-story-metric"><strong data-story-metric>${escapeHTML(metric)}</strong><span data-story-label>${escapeHTML(metricLabel)}</span></div>
    <p data-story-tags>${item.tags.slice(0, 4).map(escapeHTML).join(' · ')}</p>
  </aside>`;
}

function home() {
  return `<section class="home-panel panel" aria-labelledby="site-name">
    <div class="home-top"><div class="monogram" aria-hidden="true">PK<span class="monogram-dot">.</span></div><div class="home-top-right"><span class="edition">PORTFOLIO / 2026</span><button class="sound-toggle" type="button" aria-label="Turn sound on" aria-pressed="false" title="Turn sound on" data-sound><span class="sound-bars" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="sound-label">SOUND OFF</span></button></div></div>
    <div class="home-main">
      <p class="eyebrow"><span class="eyebrow-line"></span> DATA ENGINEERING & APPLIED AI</p>
      <h1 id="site-name">Prajwal<br>Kulkarni<span class="period">.</span></h1>
      <p class="intro">${escapeHTML(identity.intro)}</p>
      <p class="home-location"><span class="location-pip" aria-hidden="true"></span> Dallas, Texas</p>
      <div class="home-index"><div class="section-heading"><span>SELECTED WORK</span><span>01 — 03</span></div><nav aria-label="Selected work">${work.map((item, index) => listLink(item, 'work', index)).join('')}</nav></div>
      <div class="home-explore"><a href="/projects/" data-route class="explore-link">Explore projects <span aria-hidden="true">↗</span></a><a href="/about/" data-route class="explore-link">A little about me <span aria-hidden="true">↗</span></a></div>
    </div>
    <footer class="home-bottom"><div class="footer-links">${identity.links.map(link => external(link.href, link.label)).join('')}<button class="text-button email-button" type="button" data-email>Copy email <span aria-hidden="true">↗</span></button></div></footer>
  </section>`;
}

function panel(title, back, eyebrow, contents, className = '') {
  return `<section class="detail-panel panel ${className}" aria-label="${escapeHTML(title)}" tabindex="-1"><div class="detail-head"><span class="detail-index">${escapeHTML(eyebrow)}</span><a class="close-button" data-route href="${back}" aria-label="Close ${escapeHTML(title)}"><span aria-hidden="true">×</span></a></div>${contents}</section>`;
}

function detail(item, kind) {
  const isWork = kind === 'work';
  const body = `<div class="detail-content"><p class="detail-kicker">${escapeHTML(item.category)}</p><h2>${escapeHTML(item.title)}<span class="period">.</span></h2>${isWork ? `<div class="detail-meta"><span>${escapeHTML(item.role)}</span><span>${escapeHTML(item.period)}</span></div>` : ''}<p class="detail-lead">${escapeHTML(item.summary)}</p>${item.metric ? `<div class="metric"><strong>${escapeHTML(item.metric)}</strong><span>${escapeHTML(item.metricLabel)}</span></div>` : ''}<div class="detail-prose">${item.paragraphs.map(p => `<p>${escapeHTML(p)}</p>`).join('')}</div>${item.external ? `<div class="detail-action">${external(item.external.href, item.external.label)}</div>` : ''}<div class="tag-list" aria-label="Tools and topics">${item.tags.map(tag => `<span>${escapeHTML(tag)}</span>`).join('')}</div></div>`;
  return panel(item.title, isWork ? '/' : '/projects/', isWork ? 'SELECTED WORK' : 'PROJECT NOTE', body, isWork ? 'work-panel' : 'project-panel');
}

function projectIndex() {
  return panel('Projects', '/', 'THE SIDE QUESTS', `<div class="detail-content index-panel-content"><p class="detail-kicker">Things I built to learn</p><h2>Projects<span class="period">.</span></h2><p class="index-intro">A few experiments across data, machine learning, and conversational AI.</p><nav class="project-list" aria-label="Projects">${projects.map((item, index) => listLink(item, 'project', index)).join('')}</nav></div>`, 'projects-panel');
}

function aboutPanel() {
  return panel('About', '/', 'THE PERSON BEHIND THE PIPELINES', `<div class="detail-content"><p class="detail-kicker">Bengaluru → Dallas</p><h2>About me<span class="period">.</span></h2><p class="detail-lead">${escapeHTML(about.summary)}</p><div class="detail-prose">${about.paragraphs.map(p => `<p>${escapeHTML(p)}</p>`).join('')}</div><div class="mini-heading">EDUCATION</div><div class="education-list"><p>MS, Business Analytics & Artificial Intelligence<br><span>The University of Texas at Dallas</span></p><p>BTech, Electrical & Electronics Engineering<br><span>PES University, Bengaluru</span></p></div><div class="detail-action">${external('/resume/Prajwal-Kulkarni-Resume.pdf', 'Read my résumé')}<a href="/certifications/" data-route>Certifications <span aria-hidden="true">↗</span></a></div></div>`, 'about-panel');
}

function certPanel() {
  return panel('Certifications', '/', 'CONTINUING TO LEARN', `<div class="detail-content"><p class="detail-kicker">Selected credentials</p><h2>Certifications<span class="period">.</span></h2><div class="cert-list">${certifications.map((item, index) => `<div><span>${String(index + 1).padStart(2, '0')}</span>${external(item.href, item.label)}</div>`).join('')}</div></div>`, 'cert-panel');
}

export function renderPanels(pathname) {
  const route = routeFor(pathname);
  let panels = '';
  if (route.type === 'work') panels = detail(route.item, 'work');
  else if (route.type === 'projects') panels = projectIndex();
  else if (route.type === 'project') panels = projectIndex() + detail(route.item, 'project');
  else if (route.type === 'about') panels = aboutPanel();
  else if (route.type === 'certifications') panels = certPanel();
  else if (route.type === 'not-found') panels = panel('Page not found', '/', '404', `<div class="detail-content"><h2>Lost in the data<span class="period">.</span></h2><p class="detail-lead">That page is not here. Head back to the beginning.</p><a data-route href="/">Go home ↗</a></div>`);
  return home() + panels;
}

export function render(pathname) {
  return `<div class="frame"><canvas id="field" aria-hidden="true"></canvas><div class="frame-grain" aria-hidden="true"></div>${canvasStory(pathname)}<main class="viewport" id="viewport"><div class="rail" id="rail">${renderPanels(pathname)}</div></main><span class="edge-mark edge-mark-top" aria-hidden="true">+</span><span class="edge-mark edge-mark-bottom" aria-hidden="true">+</span></div>`;
}
