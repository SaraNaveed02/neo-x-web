/**
 * Mobile-only early init — app shell turant load (navbar flash na ho)
 */
(function () {
    if (!window.matchMedia('(max-width: 900px)').matches) return;
    if (/(^|\/)login\.html$/i.test(location.pathname || '')) return;

    window.__NEOXWEB_MOBILE_INIT__ = true;
    document.documentElement.classList.add('mobile-view');

    if (window.NexuraApp || document.querySelector('script[src*="bootstrap-app.js"]')) return;

    function siteBase() {
        if (window.__NEOXWEB_BASE__) return window.__NEOXWEB_BASE__;
        var root = window.NexuraConfig && window.NexuraConfig.siteRoot;
        if (root) return String(root).replace(/\/?$/, '/');
        var path = window.location.pathname || '/';
        var last = path.lastIndexOf('/');
        return last >= 0 ? path.slice(0, last + 1) : '/';
    }

    var base = siteBase();

    function loadWhatsAppWidget() {
        if (document.querySelector('script[src*="whatsapp-widget.js"]')) return;
        if (!document.querySelector('link[href*="neoxweb-theme.css"]')) {
            var css = document.createElement('link');
            css.rel = 'stylesheet';
            css.href = base + 'css/neoxweb-theme.css';
            document.head.appendChild(css);
        }
        var wa = document.createElement('script');
        wa.src = base + 'js/whatsapp-widget.js';
        wa.defer = true;
        document.head.appendChild(wa);
    }

    loadWhatsAppWidget();

    function loadMobileShell() {
        if (window.NexuraApp || document.querySelector('script[src*="bootstrap-app.js"]')) return;
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = base + 'css/mobile-app-dock.css';
        document.head.appendChild(link);
        var script = document.createElement('script');
        script.src = base + 'js/bootstrap-app.js';
        script.defer = true;
        script.onerror = function () {
            document.documentElement.classList.remove('mobile-view');
        };
        document.head.appendChild(script);

        setTimeout(function () {
            if (!document.body.classList.contains('nx-app-body')) {
                document.documentElement.classList.remove('mobile-view');
            }
        }, 8000);
    }

    loadMobileShell();
})();
