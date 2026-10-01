import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { work, projects } from '../site/content.mjs';
import { render, routeFor } from '../site/render.mjs';

const root = new URL('../', import.meta.url).pathname;
const routes = ['/', '/about/', '/certifications/', '/projects/', ...work.map(item => `/work/${item.slug}/`), ...projects.map(item => `/projects/${item.slug}/`)];
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char]);

function documentFor(path) {
  const route = routeFor(path);
  const title = route.type === 'home' ? 'Prajwal Kulkarni — Data Engineering & Applied AI' : `${route.title} | Prajwal Kulkarni`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#07111e">
  <meta name="author" content="Prajwal Kulkarni">
  <meta name="description" content="${escapeHTML(route.description)}">
  <meta name="google-site-verification" content="cwkehgB8xRYyDlfEnEldTpWNw6EUySsBsSEe3eQvdQM">
  <link rel="canonical" href="https://kp-prajwal.github.io${path}">
  <link rel="icon" href="/site/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="/site/style.css?v=20260930-type2">
  <title>${escapeHTML(title)}</title>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-0WBMN3DLLW"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-0WBMN3DLLW')</script>
  <script type="module" src="/site/app.mjs?v=20260930-type2"></script>
</head>
<body><div id="app">${render(path)}</div></body>
</html>
`;
}

for (const path of routes) {
  const directory = join(root, path);
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, 'index.html'), documentFor(path));
}
await writeFile(join(root, '404.html'), documentFor('/404/'));
await writeFile(join(root, '.nojekyll'), '');
console.log(`Built ${routes.length} pages and a 404 page.`);
