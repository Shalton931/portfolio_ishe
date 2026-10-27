(() => {
  'use strict';

  // ---- Safe DOM helpers: content is ALWAYS inserted as text (never innerHTML), preventing XSS. ----
  const $ = (id) => document.getElementById(id);

  function el(tag, opts = {}, children = []) {
    const node = document.createElement(tag);
    if (opts.className) node.className = opts.className;
    if (opts.text != null) node.textContent = opts.text;
    if (opts.attrs) for (const [k, v] of Object.entries(opts.attrs)) node.setAttribute(k, v);
    for (const child of children) if (child) node.append(child);
    return node;
  }

  // Only allow http(s) links from the API. Anything else (javascript:, data:, ...) is dropped.
  function safeUrl(value) {
    try {
      const u = new URL(value);
      return u.protocol === 'https:' || u.protocol === 'http:' ? u.href : null;
    } catch {
      return null;
    }
  }

  function extLink(label, href) {
    const url = safeUrl(href);
    if (!url) return null;
    return el('a', { text: label, attrs: { href: url, rel: 'noopener noreferrer', target: '_blank' } });
  }

  async function getJSON(path) {
    const res = await fetch(path, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  // ---- Renderers ----
  function renderProfile(p) {
    document.title = `${p.full_name} | Portfolio`;
    $('name').textContent = p.full_name;
    $('headline').textContent = p.headline;
    $('location').textContent = p.location;
    $('summary').textContent = p.summary;

    if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(p.email)) {
      const a = $('contact');
      a.href = `mailto:${p.email}`;
      a.hidden = false;
    }
  }

  function renderProjects(list) {
    const root = $('project-list');
    root.replaceChildren();
    if (!list.length) {
      root.append(el('p', { text: 'Projects coming soon.' }));
      return;
    }
    for (const p of list) {
      const chips = el('ul', { className: 'chips', attrs: { 'aria-label': 'Technologies' } },
        (p.technologies || []).map((t) => el('li', { text: t })));
      const links = [extLink('Source code', p.repo_url), extLink('Live site', p.live_url)].filter(Boolean);
      root.append(
        el('article', { className: 'card' }, [
          el('h3', { text: p.title }),
          el('p', { className: 'sub', text: p.subtitle }),
          el('p', { text: p.description }),
          el('p', { className: 'role', text: p.role }),
          chips,
          links.length ? el('div', { className: 'links' }, links) : null,
        ])
      );
    }
  }

  function renderSkills(groups) {
    const root = $('skill-list');
    root.replaceChildren();
    for (const g of groups) {
      root.append(
        el('div', { className: 'card' }, [
          el('h3', { text: g.category }),
          el('ul', { className: 'chips' }, g.items.map((i) => el('li', { text: i }))),
        ])
      );
    }
  }

  function renderEducation(list) {
    const root = $('education-list');
    root.replaceChildren();
    for (const e of list) {
      root.append(
        el('li', {}, [
          el('h3', { text: e.institution }),
          el('p', { text: e.qualification }),
          el('p', { text: e.period }),
          e.details ? el('p', { text: e.details }) : null,
        ])
      );
    }
  }

  function renderAchievements(list) {
    const root = $('achievement-list');
    root.replaceChildren();
    for (const a of list) root.append(el('li', { text: a }));
  }

  function showError() {
    const s = $('status');
    s.hidden = false;
    s.className = 'wrap status error';
    s.textContent = 'Sorry, the portfolio data could not be loaded right now. Please try again shortly.';
  }

  async function init() {
    $('year').textContent = String(new Date().getFullYear());
    // Each section loads independently so one failure does not blank the whole page.
    const jobs = [
      ['/api/profile', renderProfile],
      ['/api/projects', renderProjects],
      ['/api/skills', renderSkills],
      ['/api/education', renderEducation],
      ['/api/achievements', renderAchievements],
    ].map(([path, render]) => getJSON(path).then(render));

    const results = await Promise.allSettled(jobs);
    if (results.some((r) => r.status === 'rejected')) showError();
  }

  init();
})();
