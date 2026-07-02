/**
 * Nexura Bootstrap 5 Mobile App Shell
 */
const NexuraApp = (() => {
    const NAV_TABS = [
        {
            href: 'index.html',
            icon: 'bi-house-door-fill',
            label: 'Home',
            match: ['app.html', 'index.html', '']
        },
        {
            href: 'resources.html',
            icon: 'bi-collection-fill',
            label: 'Resources',
            match: [
                'resources.html', 'services.html', 'blog.html', 'portfolio.html',
                'web.html', 'mobile.html', 'development.html', 'product-design.html',
                'testing-qa.html', 'software-engineering.html', 'contact.html', 'profile.html'
            ]
        },
        {
            href: 'studies.html',
            icon: 'bi-mortarboard-fill',
            label: 'Studies',
            match: ['studies.html', 'about.html', 'team.html', 'it-consulting.html', 'data-analytics.html', 'product-design.html', 'testing-qa.html']
        },
        {
            href: 'industry.html',
            icon: 'bi-building-fill',
            label: 'Industry',
            match: [
                'industry.html', 'cloud.html', 'saas-platforms.html',
                'ecommerce-strategy.html', 'application-modernization.html'
            ]
        },
        {
            href: 'contact.html',
            icon: 'bi-chat-dots-fill',
            label: 'Contact',
            match: ['contact.html']
        }
    ];

    const DRAWER_SECTIONS = [
        {
            title: 'Main Menu',
            links: [
                { href: 'index.html', icon: 'bi-house-door-fill', label: 'Home' },
                { href: 'about.html', icon: 'bi-info-circle-fill', label: 'About' },
                { href: 'services.html', icon: 'bi-grid-fill', label: 'All Services' },
                { href: 'portfolio.html', icon: 'bi-briefcase-fill', label: 'Portfolio' },
                { href: 'about.html#team', icon: 'bi-people-fill', label: 'Our Team' },
                { href: 'blog.html', icon: 'bi-journal-text', label: 'Blog' },
                { href: 'team.html', icon: 'bi-people-fill', label: 'Our Team' },
                { href: 'contact.html', icon: 'bi-envelope-fill', label: 'Contact / Message' }
            ]
        },
        {
            title: 'NEOXWEB Services',
            links: [
                { href: 'web.html', icon: 'bi-globe2', label: 'Web Development' },
                { href: 'mobile.html', icon: 'bi-phone-fill', label: 'Mobile Apps' },
                { href: 'development.html', icon: 'bi-code-slash', label: 'Full-Stack Dev' },
                { href: 'software-engineering.html', icon: 'bi-cpu-fill', label: 'Software Engineering' },
                { href: 'data-analytics.html', icon: 'bi-graph-up-arrow', label: 'SEO & Analytics' },
                { href: 'ecommerce-strategy.html', icon: 'bi-megaphone-fill', label: 'PPC & E-commerce' },
                { href: 'product-design.html', icon: 'bi-palette-fill', label: 'UI/UX Design' },
                { href: 'testing-qa.html', icon: 'bi-shield-check', label: 'Testing & QA' },
                { href: 'cloud.html', icon: 'bi-cloud-fill', label: 'Cloud Engineering' },
                { href: 'saas-platforms.html', icon: 'bi-boxes', label: 'SaaS Platforms' },
                { href: 'application-modernization.html', icon: 'bi-arrow-repeat', label: 'App Modernization' },
                { href: 'it-consulting.html', icon: 'bi-lightbulb-fill', label: 'IT Consulting' }
            ]
        }
    ];

    const PAGE_TITLES = {
        'app.html': 'Home',
        'index.html': 'Home',
        'resources.html': 'Resources',
        'studies.html': 'Studies',
        'industry.html': 'Industry',
        'services.html': 'Services',
        'team.html': 'Our Team',
        'contact.html': 'Contact',
        'about.html': 'About',
        'portfolio.html': 'Portfolio',
        'blog.html': 'Blog'
    };

    let assetsLoaded = false;

    function assetBase() {
        if (window.NexuraConfig?.siteRoot !== undefined) {
            const root = window.NexuraConfig.siteRoot;
            return root ? `${root.replace(/\/$/, '')}/` : './';
        }
        const s = document.querySelector('script[src*="bootstrap-app.js"], script[src*="mobile-app.js"], script[src*="main.js"]');
        if (s?.src) return s.src.replace(/js\/(bootstrap-app|mobile-app|main)\.js.*$/, '');
        if (window.NexuraConfig?.projectBase) return window.NexuraConfig.projectBase.replace(/\/?$/, '/');
        const path = window.location.pathname;
        const i = path.indexOf('/project/');
        if (i >= 0) return path.substring(0, i + '/project/'.length);
        return './';
    }

    function currentPage() {
        const path = window.location.pathname.split('/').pop() || 'index.html';
        return path === '' ? 'index.html' : path;
    }

    function isActiveTab(item, page) {
        return item.match.some((m) => m === page || (m === '' && page === 'index.html'));
    }

    function isMobileView() {
        return window.matchMedia('(max-width: 900px)').matches;
    }

    function loadAssets() {
        if (assetsLoaded) return Promise.resolve();
        const base = assetBase();

        const links = [
            { href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css', id: 'bs-css' },
            { href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css', id: 'bs-icons' },
            { href: base + 'css/bootstrap-app.css', id: 'nx-app-css' },
            { href: base + 'css/mobile-app-dock.css', id: 'nx-mobile-dock-css' },
            { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap', id: 'nx-font' }
        ];

        links.forEach(({ href, id }) => {
            if (!document.getElementById(id)) {
                const link = document.createElement('link');
                link.id = id;
                link.rel = 'stylesheet';
                link.href = href;
                document.head.appendChild(link);
            }
        });

        return new Promise((resolve) => {
            let settled = false;
            const finish = () => {
                if (settled) return;
                settled = true;
                assetsLoaded = true;
                resolve();
            };

            if (document.getElementById('bs-js')) {
                finish();
                return;
            }

            const script = document.createElement('script');
            script.id = 'bs-js';
            script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js';
            script.onload = finish;
            script.onerror = finish;
            document.head.appendChild(script);
            setTimeout(finish, 8000);
        });
    }

    function getStoredUser() {
        try {
            const raw = localStorage.getItem('nexuraSession');
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    }

    function injectHeader(page) {
        if (document.getElementById('nxAppHeader')) return;
        const base = assetBase();

        const header = document.createElement('header');
        header.id = 'nxAppHeader';
        header.className = 'nx-app-header ui-mobile-header';
        header.innerHTML = `
            <a href="${base}index.html" class="ui-mobile-logo navbar__logo--nx" aria-label="NEOXWEB Home">
                <img src="${base}assets/images/neoxweb/logo-nx-mark.jpg" alt="NEOXWEB" class="navbar__logo-img navbar__logo-img--nx" width="160" height="64" loading="eager">
            </a>
            <div class="ui-mobile-header__actions">
                <a href="${base}contact.html" class="ui-mobile-icon-btn ui-mobile-icon-btn--login" aria-label="Contact">
                    <i class="fas fa-comments"></i>
                </a>
                <button type="button" class="ui-mobile-icon-btn" id="nxMobileSearch" aria-label="Search">
                    <i class="fas fa-search"></i>
                </button>
                <button type="button" class="ui-mobile-icon-btn" id="nxMobileMenu" aria-label="Open menu">
                    <i class="fas fa-bars"></i>
                </button>
            </div>
        `;
        document.body.prepend(header);

        document.getElementById('nxMobileSearch')?.addEventListener('click', () => {
            const drawer = document.getElementById('nxAppDrawer');
            if (drawer && typeof bootstrap !== 'undefined') {
                bootstrap.Offcanvas.getOrCreateInstance(drawer).show();
            }
        });

        document.getElementById('nxMobileMenu')?.addEventListener('click', () => {
            const drawer = document.getElementById('nxAppDrawer');
            if (drawer && typeof bootstrap !== 'undefined') {
                bootstrap.Offcanvas.getOrCreateInstance(drawer).show();
            }
        });
    }

    function injectDrawer() {
        if (document.getElementById('nxAppDrawer')) return;

        const user = getStoredUser();
        const userBlock = user
            ? `<div class="nx-drawer-user">
                    <div class="nx-drawer-user-avatar">${(user.name || 'U').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}</div>
                    <div>
                        <strong>${user.name || 'User'}</strong>
                        <span>${user.email || ''}</span>
                    </div>
               </div>`
            : '';

        const sections = DRAWER_SECTIONS.map((section) => {
            const items = section.links.map((l) =>
                `<a href="${l.href}" class="list-group-item list-group-item-action nx-drawer-link">
                    <i class="bi ${l.icon}"></i>${l.label}
                </a>`
            ).join('');
            return `<div class="nx-drawer-section">
                <div class="nx-drawer-section-title">${section.title}</div>
                <div class="list-group list-group-flush">${items}</div>
            </div>`;
        }).join('');

        const drawer = document.createElement('div');
        drawer.className = 'offcanvas offcanvas-start nx-drawer';
        drawer.id = 'nxAppDrawer';
        drawer.tabIndex = -1;
        drawer.innerHTML = `
            <div class="offcanvas-header">
                <span class="nx-app-brand">NEOXWEB</span>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body p-0 nx-drawer-body">
                ${userBlock}
                ${sections}
                <div class="p-3 mt-1">
                    <a href="contact.html" class="nx-btn nx-btn-primary w-100 d-flex">
                        <i class="bi bi-chat-quote-fill"></i> Get a Free Quote
                    </a>
                    <button type="button" class="nx-btn nx-btn-outline w-100 mt-2" id="nxDrawerInstall">
                        <i class="bi bi-download"></i> Install App
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(drawer);

        document.getElementById('nxDrawerInstall')?.addEventListener('click', () => {
            window.dispatchEvent(new CustomEvent('nexura-install-pwa'));
            toast('Install prompt opened', 'info');
        });
    }

    const DOCK_TABS = [
        { href: 'portfolio.html', icon: 'fa-book-open', label: 'Case Studies', match: ['portfolio.html', 'case-study.html', 'case-study-seo.html', 'case-study-ppc.html', 'studies.html'] },
        { href: 'resources.html', icon: 'fa-file-alt', label: 'Resources', match: ['resources.html', 'blog.html', 'services.html'] },
        { href: 'industry.html', icon: 'fa-industry', label: 'Industry', match: ['industry.html', 'cloud.html', 'saas-platforms.html'] },
        { href: 'contact.html', icon: 'fa-comments', label: 'Contact', match: ['contact.html'] }
    ];

    function injectBottomNav(page) {
        if (document.querySelector('.ui-bottom-nav')) return;
        const base = assetBase();

        const nav = document.createElement('nav');
        nav.className = 'ui-bottom-nav';
        nav.setAttribute('aria-label', 'Quick navigation');

        const tabsHtml = DOCK_TABS.map((item) => {
            const active = item.match.includes(page) ? ' active' : '';
            return `<a href="${base}${item.href}" class="${active.trim()}" aria-current="${active ? 'page' : 'false'}"><i class="fas ${item.icon}"></i> ${item.label}</a>`;
        }).join('');

        nav.innerHTML = `
            <button type="button" class="ui-bottom-nav__fab" id="nxAiChatFab" aria-label="AI Assistant"><i class="fas fa-robot"></i></button>
            <div class="ui-bottom-nav__links">${tabsHtml}</div>
        `;
        document.body.appendChild(nav);
    }

    function injectAiChatPanel() {
        if (document.getElementById('nxAiChatPanel')) return;
        const base = assetBase();
        const wrap = document.createElement('div');
        wrap.className = 'nx-ai-chat';
        wrap.id = 'nxAiChatPanel';
        wrap.innerHTML = `
            <div class="nx-ai-chat__panel" role="dialog" aria-label="NEOXWEB AI Assistant">
                <div class="nx-ai-chat__head">
                    <div class="nx-ai-chat__head-icon"><i class="fas fa-robot" aria-hidden="true"></i></div>
                    <div>
                        <strong>NEOXWEB AI</strong>
                        <span>Ask about web, SEO &amp; PPC</span>
                    </div>
                    <button type="button" class="nx-ai-chat__close" id="nxAiChatClose" aria-label="Close chat">&times;</button>
                </div>
                <div class="nx-ai-chat__messages" id="nxAiChatMessages">
                    <div class="nx-ai-chat__bubble nx-ai-chat__bubble--bot">Hi! 👋 I'm the NEOXWEB assistant. How can I help you today?</div>
                </div>
                <div class="nx-ai-chat__foot">
                    <input type="text" id="nxAiChatInput" placeholder="Type your question..." autocomplete="off" maxlength="400">
                    <button type="button" id="nxAiChatSend" aria-label="Send"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
        `;
        document.body.appendChild(wrap);

        if (!document.querySelector('script[src*="ai-chatbot.js"]')) {
            const script = document.createElement('script');
            script.src = base + 'js/ai-chatbot.js';
            script.defer = true;
            document.body.appendChild(script);
        }
    }

    function injectChatFab() {
        if (document.getElementById('uiChatFab')) return;
        const link = document.createElement('a');
        link.href = 'https://wa.me/923084858836';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.className = 'ui-chat-fab';
        link.id = 'uiChatFab';
        link.setAttribute('aria-label', 'WhatsApp chat');
        link.innerHTML = '<i class="fas fa-comment-dots"></i>';
        document.body.appendChild(link);
    }

    function injectToastContainer() {
        if (document.getElementById('nxToastContainer')) return;

        const container = document.createElement('div');
        container.id = 'nxToastContainer';
        container.className = 'toast-container position-fixed bottom-0 start-50 translate-middle-x nx-toast-container';
        document.body.appendChild(container);
    }

    function injectPageLoader() {
        if (document.getElementById('nxPageLoader')) return;
        if (document.readyState === 'complete') return;

        const loader = document.createElement('div');
        loader.id = 'nxPageLoader';
        loader.className = 'nx-page-loader';
        loader.innerHTML = `
            <div class="nx-loader-ring"></div>
            <span class="text-secondary small">Loading...</span>
        `;
        document.body.prepend(loader);

        function hideLoader() {
            setTimeout(() => loader.classList.add('hidden'), 350);
        }

        window.addEventListener('load', hideLoader, { once: true });
        setTimeout(() => loader.classList.add('hidden'), 5000);
    }

    function toast(message, type = 'success') {
        const container = document.getElementById('nxToastContainer');
        if (!container || typeof bootstrap === 'undefined') return;

        const icons = { success: 'check-circle-fill', error: 'x-circle-fill', info: 'info-circle-fill' };
        const colors = { success: 'text-success', error: 'text-danger', info: 'text-primary' };
        const id = 'toast-' + Date.now();

        const el = document.createElement('div');
        el.id = id;
        el.className = 'toast nx-toast align-items-center border-0';
        el.setAttribute('role', 'alert');
        el.innerHTML = `
            <div class="d-flex">
                <div class="toast-body d-flex align-items-center gap-2">
                    <i class="bi bi-${icons[type] || icons.info} ${colors[type] || colors.info}"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        container.appendChild(el);
        const t = new bootstrap.Toast(el, { delay: 3200 });
        t.show();
        el.addEventListener('hidden.bs.toast', () => el.remove());
    }

    function setupPageTransitions() {
        document.querySelectorAll('a[href]').forEach((link) => {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('http') || href.includes('.php') || href.startsWith('mailto:')) return;
            if (!/\.html$/.test(href) && href !== '') return;

            link.addEventListener('click', () => {
                document.body.classList.add('page-transition');
            });
        });
    }

    function mobileEnhancePage() {
        const vp = document.querySelector('meta[name="viewport"]');
        if (vp) {
            vp.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover');
        }
        document.documentElement.style.overflowX = 'hidden';
        document.body.style.overflowX = 'hidden';

        const oldLoader = document.getElementById('pageLoader');
        if (oldLoader) oldLoader.style.display = 'none';

        document.querySelectorAll('footer, .site-footer, .footer-section').forEach((el) => {
            if (el.classList.contains('site-footer--pro')) return;
            el.classList.add('nx-hide-mobile');
        });

        const main = document.querySelector('main');
        if (main && !main.classList.contains('nx-app-main')) {
            main.classList.add('nx-mobile-main');
        }
    }

    function initShell() {
        if (!isMobileView()) return;
        if (document.body.classList.contains('auth-page')) return;

        const page = currentPage();
        document.body.classList.add('nx-app-body', 'page-transition', 'has-dock');
        mobileEnhancePage();

        injectPageLoader();
        injectHeader(page);
        injectDrawer();
        injectBottomNav(page);
        injectAiChatPanel();
        injectToastContainer();
        setupPageTransitions();

        setTimeout(() => document.body.classList.remove('page-transition'), 400);
    }

    function destroyShell() {
        document.getElementById('nxAppHeader')?.remove();
        document.querySelector('.ui-bottom-nav')?.remove();
        document.getElementById('nxAiChatPanel')?.remove();
        document.getElementById('uiChatFab')?.remove();
        document.getElementById('nxAppDrawer')?.remove();
        document.getElementById('nxPageLoader')?.remove();
        document.body.classList.remove('nx-app-body', 'page-transition', 'has-mobile-nav', 'has-dock');
        document.querySelectorAll('footer.nx-hide-mobile, .site-footer.nx-hide-mobile').forEach((el) => {
            el.classList.remove('nx-hide-mobile');
        });
        document.querySelectorAll('main.nx-mobile-main').forEach((el) => {
            el.classList.remove('nx-mobile-main');
        });
    }

    async function init() {
        await loadAssets();

        if (isMobileView()) {
            initShell();
        }

        window.addEventListener('resize', () => {
            if (isMobileView() && !document.querySelector('.ui-bottom-nav')) {
                initShell();
            } else if (!isMobileView()) {
                destroyShell();
            }
        });
    }

    return { init, toast, loadAssets, isMobileView, currentPage };
})();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => NexuraApp.init());
} else {
    NexuraApp.init();
}

window.NexuraApp = NexuraApp;
