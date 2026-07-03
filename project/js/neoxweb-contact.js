/**
 * NEOXWEB — contact info (email + WhatsApp)
 */
(function () {
    const EMAIL = 'supportneoxweb@gmail.com';
    const NUMBERS = [
        { display: '+92 314 066 6734', e164: '923140666734' }
    ];

    function normalize(num) {
        return String(num || '').replace(/\D/g, '');
    }

    function waLink(number, text) {
        const msg = text || 'Hi NEOXWEB! I need help with my website project.';
        return `https://wa.me/${normalize(number)}?text=${encodeURIComponent(msg)}`;
    }

    function formatDisplay(e164) {
        const n = normalize(e164);
        if (n.length === 12 && n.startsWith('92')) {
            return `+92 ${n.slice(2, 5)} ${n.slice(5, 8)} ${n.slice(8)}`;
        }
        return e164;
    }

    window.NeoxwebContact = {
        email: EMAIL,
        numbers: NUMBERS,
        primary: () => NUMBERS[0].e164,
        all: () => NUMBERS.map((item) => ({ ...item })),
        waLink,
        formatDisplay,
        normalize,
        mailto: (subject) => {
            const sub = subject ? `?subject=${encodeURIComponent(subject)}` : '';
            return `mailto:${EMAIL}${sub}`;
        }
    };

    if (!window.__neoxwebWhatsApp) {
        window.__neoxwebWhatsApp = NUMBERS[0].e164;
    }
})();
