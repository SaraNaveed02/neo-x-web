function getNavbarContainer() {
    return document.getElementById('navbar-container');
}

const searchData = {
    services: [
        { name: 'Web Development', url: 'web.html', icon: 'fa-code', category: 'Services', desc: 'Modern web applications and SaaS platforms' },
        { name: 'Mobile App Development', url: 'mobile.html', icon: 'fa-mobile-alt', category: 'Services', desc: 'iOS and Android mobile products' },
        { name: 'Cloud Engineering', url: 'cloud.html', icon: 'fa-cloud', category: 'Services', desc: 'Cloud architecture, DevOps and infrastructure' },
        { name: 'Software Engineering', url: 'software-engineering.html', icon: 'fa-laptop-code', category: 'Services', desc: 'Enterprise custom software development' },
        { name: 'Full-Stack Development', url: 'development.html', icon: 'fa-layer-group', category: 'Services', desc: 'Web and mobile full-stack engineering' },
        { name: 'IT Consulting', url: 'it-consulting.html', icon: 'fa-lightbulb', category: 'Consulting', desc: 'Digital transformation and IT strategy' },
        { name: 'Data & Analytics', url: 'data-analytics.html', icon: 'fa-chart-line', category: 'Services', desc: 'BI dashboards and data pipelines' },
        { name: 'SEO Services', url: 'case-study-seo.html', icon: 'fa-search', category: 'Services', desc: 'Technical SEO and organic growth' },
        { name: 'PPC Advertising', url: 'case-study-ppc.html', icon: 'fa-bullhorn', category: 'Services', desc: 'Google Ads and paid campaign management' },
        { name: 'App Modernization', url: 'application-modernization.html', icon: 'fa-rocket', category: 'Services', desc: 'Legacy to cloud-native migration' },
        { name: 'SaaS & Platforms', url: 'saas-platforms.html', icon: 'fa-cubes', category: 'Services', desc: 'Multi-tenant SaaS product development' },
        { name: 'Product Design', url: 'product-design.html', icon: 'fa-palette', category: 'Services', desc: 'UI/UX design and product experience' },
        { name: 'Testing & QA', url: 'testing-qa.html', icon: 'fa-vial', category: 'Services', desc: 'Test automation and quality assurance' },
        { name: 'E-commerce Strategy', url: 'ecommerce-strategy.html', icon: 'fa-shopping-cart', category: 'Services', desc: 'Commerce planning and optimization' },
        { name: 'Graphic Design', url: 'graphic-design.html', icon: 'fa-palette', category: 'Services', desc: 'Branding, logos and social creatives' },
        { name: 'Social Media Marketing', url: 'social-media-marketing.html', icon: 'fa-share-alt', category: 'Services', desc: 'Instagram, Facebook and TikTok growth' },
        { name: 'Video Editing', url: 'video-editing.html', icon: 'fa-video', category: 'Services', desc: 'Reels, ads and YouTube editing' },
        { name: 'AI Solutions', url: 'ai.html', icon: 'fa-robot', category: 'Services', desc: 'AI automation and integrations' }
    ],
    technologies: [
        { name: 'Technologies Hub', url: 'technologies.html', icon: 'fa-microchip', category: 'Technologies', desc: 'All technology expertise' },
        { name: 'Node.js', url: 'tech-nodejs.html', icon: 'fa-node-js', category: 'Backend', desc: 'Express and Nest APIs' },
        { name: 'Laravel', url: 'tech-laravel.html', icon: 'fa-php', category: 'Backend', desc: 'PHP Laravel development' },
        { name: 'Python', url: 'tech-python.html', icon: 'fa-python', category: 'Backend', desc: 'Python backend services' },
        { name: 'ReactJS', url: 'tech-react.html', icon: 'fa-react', category: 'Frontend', desc: 'React web applications' },
        { name: 'Vue.JS', url: 'tech-vue.html', icon: 'fa-vuejs', category: 'Frontend', desc: 'Vue.js frontends' },
        { name: 'Angular', url: 'tech-angular.html', icon: 'fa-angular', category: 'Frontend', desc: 'Angular enterprise apps' },
        { name: 'React Native', url: 'tech-react-native.html', icon: 'fa-mobile-alt', category: 'Mobile', desc: 'Cross-platform mobile' },
        { name: 'Flutter', url: 'tech-flutter.html', icon: 'fa-mobile', category: 'Mobile', desc: 'Flutter mobile apps' },
        { name: 'AWS Cloud', url: 'tech-aws.html', icon: 'fa-aws', category: 'Cloud', desc: 'AWS infrastructure' },
        { name: 'WordPress', url: 'tech-wordpress.html', icon: 'fa-wordpress', category: 'CMS', desc: 'WordPress websites' },
        { name: 'MongoDB', url: 'tech-mongodb.html', icon: 'fa-database', category: 'Database', desc: 'NoSQL databases' }
    ],
    pages: [
        { name: 'Home', url: 'index.html', icon: 'fa-home', desc: 'Main landing page' },
        { name: 'About', url: 'about.html', icon: 'fa-info-circle', desc: 'Company story and values' },
        { name: 'Services', url: 'services.html', icon: 'fa-concierge-bell', desc: 'Service offerings and capabilities' },
        { name: 'Portfolio', url: 'portfolio.html', icon: 'fa-briefcase', desc: 'Featured work and case studies' },
        { name: 'Blog', url: 'blog.html', icon: 'fa-blog', desc: 'Insights and news' },
        { name: 'Our Team', url: 'team.html', icon: 'fa-users', desc: 'Meet the NEOXWEB experts' },
        { name: 'Contact', url: 'contact.html', icon: 'fa-comments', desc: 'WhatsApp chat or send a message' }
    ]
};

const allSearchItems = [
    ...searchData.services.map((item) => ({ ...item, type: item.category || 'Services' })),
    ...(searchData.technologies || []).map((item) => ({ ...item, type: item.category || 'Technologies' })),
    ...searchData.pages.map((item) => ({ ...item, type: 'Pages' }))
];

/* Navbar HTML embedded file se load hota hai */
let navbarEventsBound = false;
let navbarInitStarted = false;
const NAV_DRAWER_BREAKPOINT = 900;

function isNavDrawerMode() {
    return window.innerWidth <= NAV_DRAWER_BREAKPOINT;
}

function getScriptBase() {
    if (window.__NEOXWEB_BASE__) return window.__NEOXWEB_BASE__;
    const script = document.querySelector('script[src*="navbar.js"]');
    if (script?.src) return script.src.replace(/js\/navbar\.js.*$/, '');
    const path = window.location.pathname;
    const idx = path.lastIndexOf('/');
    return idx >= 0 ? path.substring(0, idx + 1) : '/';
}

function sanitizeNavbarHtml(html) {
    if (!html) return '';
    const start = html.indexOf('<div class="nav-backdrop"');
    if (start < 0) return html;
    const modalsEnd = html.indexOf('<!-- NAVBAR-MODALS-END -->', start);
    if (modalsEnd >= 0) return html.slice(start, modalsEnd).trim();
    const headerEnd = html.indexOf('</header>', start);
    if (headerEnd >= 0) return html.slice(start, headerEnd + 9);
    return html.slice(start);
}

function ensureNavbarModalAssets(callback) {
    const base = getScriptBase();
    if (!document.getElementById('navbar-modals-css')) {
        const link = document.createElement('link');
        link.id = 'navbar-modals-css';
        link.rel = 'stylesheet';
        link.href = `${base}css/navbar-modals.css`;
        document.head.appendChild(link);
    }
    const runInit = () => {
        if (typeof window.initNxNavModals === 'function') window.initNxNavModals();
        callback?.();
    };
    if (typeof window.initNxNavModals === 'function') {
        runInit();
        return;
    }
    const existing = document.querySelector('script[src*="navbar-modals.js"]');
    if (existing) {
        existing.addEventListener('load', runInit, { once: true });
        return;
    }
    const script = document.createElement('script');
    script.src = `${base}js/navbar-modals.js`;
    script.onload = runInit;
    script.onerror = () => callback?.();
    document.body.appendChild(script);
}

function mountNavbar(html) {
    const container = getNavbarContainer();
    if (!container || !html) return;
    container.innerHTML = sanitizeNavbarHtml(html);
    attachNavbarEvents();
    ensureNavbarModalAssets();
}

function loadNavbarEmbed(callback) {
    if (window.NAVBAR_EMBED_HTML) {
        callback();
        return;
    }
    const existing = document.querySelector('script[src*="navbar-embed.js"]');
    if (existing) {
        existing.addEventListener('load', callback, { once: true });
        existing.addEventListener('error', callback, { once: true });
        return;
    }
    const script = document.createElement('script');
    script.src = `${getScriptBase()}js/navbar-embed.js`;
    script.onload = callback;
    script.onerror = callback;
    document.head.appendChild(script);
}

function initializeNavbar() {
    if (!getNavbarContainer()) return;

    if (document.getElementById('mainNavbar')) {
        attachNavbarEvents();
        ensureNavbarModalAssets();
        return;
    }

    if (navbarInitStarted) return;
    navbarInitStarted = true;

    loadNavbarEmbed(() => {
        if (window.NAVBAR_EMBED_HTML) {
            mountNavbar(window.NAVBAR_EMBED_HTML);
            return;
        }

        fetch(`${getScriptBase()}navbar.html`, { cache: 'default' })
            .then((response) => {
                if (!response.ok) throw new Error('Navbar fetch failed');
                return response.text();
            })
            .then((html) => mountNavbar(html))
            .catch(() => {
                if (window.NAVBAR_EMBED_HTML) {
                    mountNavbar(window.NAVBAR_EMBED_HTML);
                }
            });
    });
}

function getCurrentPageKey() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    const base = path.replace('.html', '') || 'index';
    const servicePages = [
        'web', 'mobile', 'development', 'software-engineering', 'saas-platforms',
        'it-consulting', 'application-modernization', 'testing-qa', 'cloud',
        'data-analytics', 'ecommerce-strategy', 'product-design'
    ];
    if (servicePages.includes(base)) return 'services';
    if (base === 'login' || base === 'profile') return base;
    return base;
}

function setActiveNavLink() {
    const key = getCurrentPageKey();
    document.querySelectorAll('.navbar [data-nav]').forEach((link) => {
        const nav = link.dataset.nav;
        if (nav === 'quote') return;
        const isActive = nav === key || (nav === 'index' && (key === 'index' || key === ''));
        link.classList.toggle('active', isActive);
        if (isActive) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
    });
}

let navbarScrollBound = false;

function initNavbarScroll() {
    if (navbarScrollBound) return;
    navbarScrollBound = true;
    const onScroll = () => {
        const navbar = document.getElementById('mainNavbar');
        if (!navbar) return;
        const scrolled = window.scrollY > 50;
        navbar.classList.toggle('scrolled', scrolled);
        navbar.classList.toggle('navbar-scrolled', scrolled);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
}

function ensureFixedLoginButton() {
    document.getElementById('nxFixedLogin')?.remove();
}

function renderNavbarAuth() {
    const authSection = document.getElementById('authSection');
    if (!authSection) return;

    authSection.innerHTML = `
            <a href="contact.html" class="btn-login navbar__login-btn navbar__login-btn--label navbar__contact-btn" id="contactNavBtn" aria-label="Contact NEOXWEB">
                <span class="navbar__login-label">Contact Us</span>
            </a>`;

    ensureFixedLoginButton();
}

function closeMobileNav() {
    const navMenu = document.getElementById('navMenu');
    const hamburger = document.getElementById('hamburger');
    const backdrop = document.getElementById('navBackdrop');
    navMenu?.classList.remove('active');
    hamburger?.classList.remove('active');
    hamburger?.setAttribute('aria-expanded', 'false');
    backdrop?.classList.remove('active');
    document.body.classList.remove('nav-open');
    document.querySelectorAll('.mega-dropdown-trigger.active').forEach((el) => el.classList.remove('active'));
}

function openMobileNav() {
    const navMenu = document.getElementById('navMenu');
    const hamburger = document.getElementById('hamburger');
    const backdrop = document.getElementById('navBackdrop');
    navMenu?.classList.add('active');
    hamburger?.classList.add('active');
    hamburger?.setAttribute('aria-expanded', 'true');
    backdrop?.classList.add('active');
    document.body.classList.add('nav-open');
}

function filterSearchItems(query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allSearchItems.filter((item) =>
        item.name.toLowerCase().includes(q)
        || item.desc.toLowerCase().includes(q)
        || (item.type && item.type.toLowerCase().includes(q))
    ).slice(0, 8);
}

function renderSearchResults(container, items) {
    if (!container) return;
    if (!items.length) {
        container.innerHTML = '<div class="nav-search-empty">No results found</div>';
        container.hidden = false;
        return;
    }
    container.innerHTML = items.map((item) => `
        <a href="${item.url}" class="nav-search-item">
            <i class="fas ${item.icon}" aria-hidden="true"></i>
            <div>
                <strong>${item.name}</strong>
                <span>${item.type} · ${item.desc}</span>
            </div>
        </a>
    `).join('');
    container.hidden = false;
}

function hideSearchResults(container) {
    if (!container) return;
    container.hidden = true;
    container.innerHTML = '';
}

function initNavSearch(input, resultsEl) {
    if (!input || !resultsEl) return;

    input.addEventListener('input', () => {
        const items = filterSearchItems(input.value);
        if (!input.value.trim()) {
            hideSearchResults(resultsEl);
            return;
        }
        renderSearchResults(resultsEl, items);
    });

    input.addEventListener('focus', () => {
        const items = filterSearchItems(input.value);
        if (items.length) renderSearchResults(resultsEl, items);
    });

    resultsEl.addEventListener('click', () => {
        hideSearchResults(resultsEl);
        closeMobileNav();
    });

    document.addEventListener('click', (event) => {
        if (!input.closest('.nav-search')?.contains(event.target) && !resultsEl.contains(event.target)) {
            hideSearchResults(resultsEl);
        }
    });
}

function initServicesMegaPanels() {
    document.querySelectorAll('.mega-services').forEach((root) => {
        const cats = root.querySelectorAll('.mega-services__cat[data-panel]');
        const panels = root.querySelectorAll('.mega-services__panel[data-panel]');
        if (!cats.length || !panels.length) return;

        const activate = (id) => {
            cats.forEach((cat) => cat.classList.toggle('is-active', cat.dataset.panel === id));
            panels.forEach((panel) => panel.classList.toggle('is-active', panel.dataset.panel === id));
        };

        cats.forEach((cat) => {
            cat.addEventListener('mouseenter', () => activate(cat.dataset.panel));
            cat.addEventListener('focus', () => activate(cat.dataset.panel));
            cat.addEventListener('click', (event) => {
                event.preventDefault();
                activate(cat.dataset.panel);
            });
        });
    });
}

function initNxvServiceHoverEffects() {
    const links = document.querySelectorAll('.nxv-service-link');
    const caseCard = document.getElementById('nxvCaseStudyCard');
    const image = document.getElementById('nxvCaseStudyImage');
    const badge = document.getElementById('nxvCaseStudyBadge');
    const title = document.getElementById('nxvCaseStudyTitle');
    const description = document.getElementById('nxvCaseStudyDescription');

    if (!links.length || !caseCard || !image || !badge || !title || !description) return;

    const setCaseStudy = (link) => {
        const nextImage = link.dataset.image || image.getAttribute('src');
        const nextBadge = link.dataset.badge || badge.textContent;
        const nextTitle = link.dataset.title || title.textContent;
        const nextDescription = link.dataset.description || description.textContent;
        const nextUrl = link.dataset.url || caseCard.getAttribute('href');

        links.forEach((item) => item.classList.toggle('active', item === link));
        image.src = nextImage;
        image.alt = nextTitle;
        badge.textContent = nextBadge;
        title.textContent = nextTitle;
        description.textContent = nextDescription;
        caseCard.setAttribute('href', nextUrl);
    };

    links.forEach((link) => {
        link.addEventListener('mouseenter', () => setCaseStudy(link));
        link.addEventListener('focus', () => setCaseStudy(link));
        link.addEventListener('click', () => setCaseStudy(link));
    });

    setCaseStudy(document.querySelector('.nxv-service-link.active') || links[0]);
}

function initMegaServiceLinks() {
    document.querySelectorAll('.mega-menu--services .mega-services__panel a[href]').forEach((link) => {
        if (link.dataset.navBound === '1') return;
        link.dataset.navBound = '1';

        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');
            if (!href || href === '#' || href.startsWith('javascript:')) return;
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;

            if (isNavDrawerMode()) {
                closeMobileNav();
                return;
            }

            event.preventDefault();
            event.stopPropagation();
            window.location.assign(href);
        });
    });
}

function attachNavbarEvents() {
    if (navbarEventsBound) {
        setActiveNavLink();
        renderNavbarAuth();
        return;
    }
    navbarEventsBound = true;

    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const backdrop = document.getElementById('navBackdrop');
    const drawerClose = document.getElementById('navDrawerClose');
    const searchToggle = document.getElementById('navSearchToggle');

    const toggleMobileNav = () => {
        if (navMenu?.classList.contains('active')) closeMobileNav();
        else openMobileNav();
    };

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', toggleMobileNav);
    }

    drawerClose?.addEventListener('click', closeMobileNav);
    backdrop?.addEventListener('click', closeMobileNav);

    searchToggle?.addEventListener('click', () => {
        openMobileNav();
        setTimeout(() => {
            document.getElementById('navSearchInputMobile')?.focus();
        }, 320);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMobileNav();
            hideSearchResults(document.getElementById('navSearchResults'));
            hideSearchResults(document.getElementById('navSearchResultsMobile'));
        }
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
            event.preventDefault();
            const desktopInput = document.getElementById('navSearchInput');
            if (!isNavDrawerMode() && desktopInput) {
                desktopInput.focus();
            } else {
                openMobileNav();
                setTimeout(() => document.getElementById('navSearchInputMobile')?.focus(), 320);
            }
        }
    });

    navMenu?.querySelectorAll('.nav-links a, .navbar__drawer-login').forEach((link) => {
        if (link.closest('.mega-dropdown-trigger') && link.querySelector('.nav-chevron')) return;
        link.addEventListener('click', () => {
            if (!isNavDrawerMode()) return;
            closeMobileNav();
        });
    });

    navMenu?.querySelectorAll('.mega-menu a').forEach((link) => {
        link.addEventListener('click', () => {
            if (!isNavDrawerMode()) return;
            closeMobileNav();
        });
    });

    document.querySelectorAll('.mega-dropdown-trigger > a').forEach((link) => {
        link.addEventListener('click', (event) => {
            const parent = link.closest('.mega-dropdown-trigger');
            if (!parent) return;

            if (isNavDrawerMode()) {
                if (!link.querySelector('.nav-chevron')) return;
                event.preventDefault();
                const isOpen = parent.classList.contains('active');
                document.querySelectorAll('.mega-dropdown-trigger.active').forEach((el) => el.classList.remove('active'));
                if (!isOpen) parent.classList.add('active');
                return;
            }

            if (link.querySelector('.nav-chevron')) {
                event.preventDefault();
                const isOpen = parent.classList.contains('active');
                document.querySelectorAll('.mega-dropdown-trigger.active').forEach((el) => el.classList.remove('active'));
                if (!isOpen) parent.classList.add('active');
            }
        });
    });

    document.addEventListener('click', (event) => {
        if (isNavDrawerMode()) return;
        if (event.target.closest('.mega-dropdown-trigger')) return;
        document.querySelectorAll('.mega-dropdown-trigger.active').forEach((el) => el.classList.remove('active'));
    });

    initNavSearch(document.getElementById('navSearchInput'), document.getElementById('navSearchResults'));
    initNavSearch(document.getElementById('navSearchInputMobile'), document.getElementById('navSearchResultsMobile'));
    initServicesMegaPanels();
    initNxvServiceHoverEffects();
    initMegaServiceLinks();

    setActiveNavLink();
    initNavbarScroll();
    renderNavbarAuth();
    ensureFixedLoginButton();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeNavbar();
        ensureFixedLoginButton();
    });
} else {
    initializeNavbar();
    ensureFixedLoginButton();
}

window.addEventListener('resize', () => {
    ensureFixedLoginButton();
});
