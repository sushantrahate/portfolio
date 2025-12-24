// script.js
(function () {
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');

  const sunIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun-icon lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
  `;

  const moonIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon-icon lucide-moon"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg>
  `;

  function setIcon(isDark) {
    if (icon) icon.innerHTML = isDark ? sunIcon : moonIcon;
  }

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    root.classList.toggle('dark', isDark);
    setIcon(isDark);
  }

  function getInitialTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    const prefersDark =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  // init theme
  applyTheme(getInitialTheme());

  if (btn) {
    btn.addEventListener('click', () => {
      const next = root.classList.contains('dark') ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      applyTheme(next);
    });
  }

  // footer year
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // -----------------------------
  // GitHub stars fetch (defer until after first paint)
  // -----------------------------
  const starEls = document.querySelectorAll('[data-repo]');
  const CACHE_KEY = 'github-stars-cache';

  function loadStarsWhenIdle() {
    let cache = {};
    try {
      cache = JSON.parse(sessionStorage.getItem(CACHE_KEY)) || {};
    } catch (_) {}

    // Render cached values immediately (no network)
    starEls.forEach((el) => {
      const repo = el.getAttribute('data-repo');
      if (!repo) return;
      if (cache[repo]) el.textContent = `★ ${cache[repo]}`;
    });

    // Start network only after the page is fully loaded
    const run = async () => {
      // limit concurrency to avoid spamming network
      const repos = Array.from(starEls)
        .map((el) => el.getAttribute('data-repo'))
        .filter(Boolean);

      const uniqueRepos = [...new Set(repos)];

      const CONCURRENCY = 2;
      let idx = 0;

      async function worker() {
        while (idx < uniqueRepos.length) {
          const repo = uniqueRepos[idx++];
          if (!repo || cache[repo]) continue;

          try {
            const res = await fetch(`https://api.github.com/repos/${repo}`, {
              cache: 'force-cache',
            });
            if (!res.ok) throw new Error('GitHub API error');
            const data = await res.json();
            const stars = data.stargazers_count ?? 0;

            cache[repo] = stars;
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache));

            // Update all elements for this repo
            starEls.forEach((el) => {
              if (el.getAttribute('data-repo') === repo) {
                el.textContent = `★ ${stars}`;
              }
            });
          } catch (_) {
            // leave as-is (★ stars) or show placeholder
            starEls.forEach((el) => {
              if (el.getAttribute('data-repo') === repo) el.textContent = '★ —';
            });
          }
        }
      }

      await Promise.all(Array.from({ length: CONCURRENCY }, worker));
    };

    // Kick after load + idle (keeps it out of LCP chain)
    const start = () => {
      if ('requestIdleCallback' in window)
        requestIdleCallback(run, { timeout: 2500 });
      else setTimeout(run, 1200);
    };

    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
  }

  if (starEls.length) loadStarsWhenIdle();
})();
