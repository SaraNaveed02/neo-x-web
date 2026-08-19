/**
 * NEOXWEB Frontend Web Application Runtime
 * Loader · SPA navigation · Search · Mobile dock · Toasts
 */
(function (global) {
    'use strict';

    const SEARCH_INDEX = [
        { name: 'Home', url: 'index.html', icon: 'fa-home' },
        { name: 'About', url: 'about.html', icon: 'fa-info-circle' },
        { name: 'Services', url: 'services.html', icon: 'fa-layer-group' },
        { name: 'Web Development', url: 'web.html', icon: 'fa-code' },
        { name: 'Mobile Apps', url: 'mobile.html', icon: 'fa-mobile-alt' },
        { name: 'Cloud Engineering', url: 'cloud.html', icon: 'fa-cloud' },
        { name: 'Case Studies', url: 'portfolio.html', icon: 'fa-briefcase' },
        { name: 'EdTech Case Study', url: 'case-study.html', icon: 'fa-book-open' },
        { name: 'SEO Case Study', url: 'case-study-seo.html', icon: 'fa-search' },
        { name: 'PPC Case Study', url: 'case-study-ppc.html', icon: 'fa-chart-line' },
        { name: 'Industries', url: 'industry.html', icon: 'fa-industry' },
        { name: 'Contact', url: 'contact.html', icon: 'fa-envelope' },
        { name: 'Login', url: 'login.html', icon: 'fa-sign-in-alt' },
        { name: 'Blog', url: 'blog.html', icon: 'fa-blog' },
        { name: 'Team', url: 'team.html', icon: 'fa-users' }
    ];

    let spaEnabled = true;

    function qs(sel, ctx) { return (ctx || document).querySelector(sel); }

    function injectRefNav() {
        if (!document.body.classList.contains('ui-ref-theme')) return;

        if (!document.querySelector('.ui-bottom-nav')) {
            document.body.insertAdjacentHTML('beforeend', `
                <nav class="ui-bottom-nav" aria-label="Quick navigation">
                    <a href="index.html" class="ui-bottom-nav__fab" aria-label="Home"><i class="fas fa-link"></i></a>
                    <a href="portfolio.html" data-app-link="1"><i class="fas fa-book-open"></i> Case Studies</a>
                    <a href="resources.html" data-app-link="1"><i class="fas fa-file-alt"></i> Resources</a>
                    <a href="industry.html" data-app-link="1"><i class="fas fa-industry"></i> Industry</a>
                    <a href="contact.html" data-app-link="1"><i class="fas fa-pen"></i> Enquire</a>
                </nav>
            `);
        }

        if (!document.querySelector('.ui-chat-fab')) {
            document.body.insertAdjacentHTML('beforeend',
                '<button type="button" class="ui-chat-fab" id="uiChatFab" aria-label="Chat"><i class="fas fa-comment-dots"></i></button>'
            );
        }

        document.body.classList.add('has-dock');

        const current = document.body.dataset.uiNav || location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.ui-bottom-nav a:not(.ui-bottom-nav__fab)').forEach((a) => {
            a.classList.toggle('active', a.getAttribute('href') === current);
        });

        const chatFab = document.getElementById('uiChatFab');
        if (chatFab && !chatFab.dataset.wired) {
            chatFab.dataset.wired = '1';
            chatFab.addEventListener('click', () => {
                global.location.href = 'contact.html';
            });
        }
    }

    function injectAppShell() {
        if (qs('#appProgress')) return;

        document.body.insertAdjacentHTML('afterbegin', `
            <div id="appProgress" class="app-progress" aria-hidden="true"></div>
            <div id="appToastStack" class="app-toast-stack" aria-live="polite"></div>
            <div id="appSearchBackdrop" class="app-search-backdrop" aria-hidden="true"></div>
            <div id="appSearchPanel" class="app-search-panel" role="dialog" aria-label="Search">
                <div class="app-search-wrap">
                    <i class="fas fa-search"></i>
                    <input type="search" id="appSearchInput" class="app-search-input" placeholder="Search pages & services..." autocomplete="off">
                </div>
                <div id="appSearchResults" class="app-search-results"></div>
            </div>
            <nav id="appMobileDock" class="app-mobile-dock" aria-label="App navigation">
                <a href="index.html" data-dock="index.html"><i class="fas fa-home"></i> Home</a>
                <a href="services.html" data-dock="services.html"><i class="fas fa-th-large"></i> Services</a>
                <a href="portfolio.html" data-dock="portfolio.html"><i class="fas fa-briefcase"></i> Cases</a>
                <a href="contact.html" data-dock="contact.html"><i class="fas fa-comment-dots"></i> Contact</a>
                <a href="login.html" data-dock="login.html"><i class="fas fa-user"></i> Login</a>
            </nav>
        `);

        document.body.classList.add('unified-app', 'has-dock');
    }

    function hideLoader() {
        const loader = qs('#appLoader');
        if (loader) {
            loader.remove();
        }
    }

    function progressStart() {
        const bar = qs('#appProgress');
        if (!bar) return;
        bar.classList.remove('done');
        bar.classList.add('active');
        bar.style.width = '';
    }

    function progressDone() {
        const bar = qs('#appProgress');
        if (!bar) return;
        bar.classList.remove('active');
        bar.classList.add('done');
        setTimeout(() => { bar.classList.remove('done'); bar.style.width = '0%'; }, 300);
    }

    global.showAppToast = function (msg, type) {
        const stack = qs('#appToastStack');
        if (!stack) return;
        const el = document.createElement('div');
        el.className = 'app-toast' + (type ? ' ' + type : '');
        el.textContent = msg;
        stack.appendChild(el);
        setTimeout(() => el.remove(), 3500);
    };

    function markAppLinks(root) {
        (root || document).querySelectorAll('a[href]').forEach((a) => {
            const href = a.getAttribute('href');
            if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || a.target === '_blank') return;
            if (/\.html($|[?#])/.test(href) || href.endsWith('.html')) {
                a.setAttribute('data-app-link', '1');
            }
        });
    }

    function getMainEl() {
        return qs('#app-main') || qs('main');
    }

    function initHeaderScroll() {
        const header = qs('#uiHeader') || qs('.ui-header');
        if (!header) return;
        global.addEventListener('scroll', () => {
            header.classList.toggle('ui-header--scrolled', global.scrollY > 24);
        }, { passive: true });
    }

    function initSearch() {
        const backdrop = qs('#appSearchBackdrop');
        const panel = qs('#appSearchPanel');
        const input = qs('#appSearchInput');
        const results = qs('#appSearchResults');
        if (!backdrop || !input) return;

        function openSearch() {
            backdrop.classList.add('open');
            panel.classList.add('open');
            backdrop.setAttribute('aria-hidden', 'false');
            input.focus();
            renderSearch('');
        }

        function closeSearch() {
            backdrop.classList.remove('open');
            panel.classList.remove('open');
            backdrop.setAttribute('aria-hidden', 'true');
        }

        document.addEventListener('click', (e) => {
            if (e.target.closest('#appSearchOpen')) {
                e.preventDefault();
                openSearch();
            }
        });

        backdrop.addEventListener('click', closeSearch);

        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                openSearch();
            }
            if (e.key === 'Escape') closeSearch();
        });

        function renderSearch(q) {
            const query = q.toLowerCase().trim();
            const list = query
                ? SEARCH_INDEX.filter((i) => i.name.toLowerCase().includes(query))
                : SEARCH_INDEX.slice(0, 8);
            results.innerHTML = list.map((i) =>
                `<a href="${i.url}" data-app-link="1"><i class="fas ${i.icon}"></i>${i.name}</a>`
            ).join('') || '<p style="padding:0.75rem;color:var(--ui-muted);font-size:0.875rem">No results</p>';
            markAppLinks(results);
        }

        input.addEventListener('input', () => renderSearch(input.value));
    }

    function initMobileDock() {
        const current = document.body.dataset.uiNav || location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('#appMobileDock a').forEach((a) => {
            const href = a.getAttribute('href');
            if (href === current || (current === 'index.html' && href === 'index.html')) {
                a.classList.add('active');
            }
        });
    }

    function runPageScripts(container) {
        container.querySelectorAll('script').forEach((old) => {
            const s = document.createElement('script');
            if (old.src) s.src = old.src;
            else s.textContent = old.textContent;
            old.replaceWith(s);
        });
    }

    async function loadPage(url, pushState) {
        if (!spaEnabled) { global.location.href = url; return; }

        const main = getMainEl();
        if (!main) { global.location.href = url; return; }

        const file = url.split('?')[0].split('#')[0];
        progressStart();
        main.classList.add('app-main-loading');

        try {
            const res = await fetch(file, { credentials: 'same-origin' });
            if (!res.ok) throw new Error('Failed');
            const html = await res.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const newMain = doc.querySelector('#app-main') || doc.querySelector('main');
            if (!newMain) throw new Error('No main');

            main.innerHTML = newMain.innerHTML;
            document.title = doc.title || document.title;

            const nav = doc.body.dataset.uiNav;
            if (nav) document.body.dataset.uiNav = nav;

            if (pushState !== false) history.pushState({ page: file }, '', file);

            main.classList.remove('app-main-loading');
            main.classList.add('app-main-enter');
            setTimeout(() => main.classList.remove('app-main-enter'), 400);

            markAppLinks(main);
            initMobileDock();
            injectRefNav();
            if (typeof global.initUnifiedNav === 'function') {
                global.initUnifiedNav.__reset && global.initUnifiedNav.__reset();
            }
            if (typeof global.initUnifiedNav === 'function') global.initUnifiedNav();
            if (typeof global.initCaseSlider === 'function') global.initCaseSlider();
            runPageScripts(main);

            global.scrollTo({ top: 0, behavior: 'smooth' });
            progressDone();
        } catch (_) {
            main.classList.remove('app-main-loading');
            progressDone();
            global.location.href = url;
        }
    }

    function initSpaNav() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[data-app-link]');
            if (!link) return;
            if (e.metaKey || e.ctrlKey || e.shiftKey) return;
            const href = link.getAttribute('href');
            if (!href || href.startsWith('http')) return;
            e.preventDefault();
            loadPage(href);
        });

        global.addEventListener('popstate', (e) => {
            const page = e.state?.page || location.pathname.split('/').pop();
            if (page) loadPage(page, false);
        });
    }

    global.initCaseSlider = function () {
        const slider = qs('#uiCsSlider');
        const prev = qs('#uiCsPrev');
        const next = qs('#uiCsNext');
        if (!slider) return;
        const scroll = (dir) => slider.scrollBy({ left: dir * 440, behavior: 'smooth' });
        prev?.addEventListener('click', () => scroll(-1));
        next?.addEventListener('click', () => scroll(1));
    };

    function initUnifiedApp() {
        injectAppShell();
        markAppLinks(document);
        initHeaderScroll();
        initSearch();
        initMobileDock();
        initSpaNav();
        initCaseSlider();
        injectRefNav();

    }

    global.initUnifiedApp = initUnifiedApp;
    global.markAppLinks = markAppLinks;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUnifiedApp);
    } else {
        initUnifiedApp();
    }
})(window);
