/*
    FILE: forms.js
    PURPOSE: Contact form and newsletter — connected to backend API
*/

document.addEventListener('DOMContentLoaded', () => {
    initializeContactForm();
    initializeNewsletterForm();
    initializeSidebarNewsletters();
    loadContactPageSettings();
});

function initializeContactForm() {
    const contactForm = qs('#contactForm');
    const messageCounter = qs('#messageCounter');
    if (!contactForm) return;

    const contactMessage = qs('#contactMessage');
    if (contactMessage && messageCounter) {
        contactMessage.addEventListener('input', () => {
            const currentLength = contactMessage.value.length;
            messageCounter.textContent = `${currentLength}/300`;
            messageCounter.classList.toggle('text-danger', currentLength > 300);
        });
    }

    contactForm.addEventListener('submit', event => {
        event.preventDefault();
        submitContactForm();
    });
}

async function loadContactPageSettings() {
    const emailEl = qs('#contactEmailDisplay');
    const phoneEl = qs('#contactPhoneDisplay');
    const heroEmailEl = qs('#contactHeroEmail');
    const heroWaEl = qs('#contactHeroWa');
    const addressEl = qs('#contactAddressDisplay');
    const responseEl = qs('#contactResponseDisplay');

    if (!emailEl && !phoneEl && !heroEmailEl && !heroWaEl) return;

    const defaultMsg = 'Hi NEOXWEB! I need help with my website project.';

    function getWhatsAppNumbers(settings) {
        const numbers = window.NeoxwebContact?.all?.() || [
            { display: '+92 314 066 6734', e164: '923140666734' }
        ];
        if (settings.whatsapp_number) {
            numbers[0].e164 = String(settings.whatsapp_number).replace(/\D/g, '');
            if (window.NeoxwebContact?.formatDisplay) {
                numbers[0].display = window.NeoxwebContact.formatDisplay(numbers[0].e164);
            }
        }
        if (settings.whatsapp_number_2 && numbers[1]) {
            numbers[1].e164 = String(settings.whatsapp_number_2).replace(/\D/g, '');
            if (window.NeoxwebContact?.formatDisplay) {
                numbers[1].display = window.NeoxwebContact.formatDisplay(numbers[1].e164);
            }
        }
        return numbers;
    }

    function waHref(e164) {
        if (window.NeoxwebContact?.waLink) {
            return window.NeoxwebContact.waLink(e164, defaultMsg);
        }
        return `https://wa.me/${String(e164).replace(/\D/g, '')}?text=${encodeURIComponent(defaultMsg)}`;
    }

    function renderWhatsAppHtml(numbers) {
        return numbers.map((item) =>
            `<a href="${waHref(item.e164)}" target="_blank" rel="noopener noreferrer">${item.display}</a>`
        ).join('<br>');
    }

    function renderHeroWhatsApp(numbers) {
        return numbers.map((item) =>
            `<a href="${waHref(item.e164)}" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-whatsapp" aria-hidden="true"></i>${item.display}
            </a>`
        ).join('');
    }

    try {
        const result = await NexuraAPI.getPublicSettings();
        const settings = result.data || {};
        const email = settings.contact_email || 'supportneoxweb@gmail.com';
        const numbers = getWhatsAppNumbers(settings);

        if (emailEl) {
            emailEl.innerHTML = `<a href="mailto:${email}">${email}</a>`;
        }
        if (heroEmailEl) {
            heroEmailEl.href = `mailto:${email}`;
            const span = heroEmailEl.querySelector('span');
            if (span) span.textContent = email;
        }
        if (phoneEl) {
            phoneEl.innerHTML = renderWhatsAppHtml(numbers);
        }
        if (heroWaEl) {
            heroWaEl.innerHTML = renderHeroWhatsApp(numbers);
        }
        if (addressEl) addressEl.textContent = settings.contact_address || 'Lahore, Pakistan';
        if (responseEl) responseEl.textContent = settings.contact_response_time || 'Within minutes on WhatsApp';
        const heroResp = qs('#contactResponseHero');
        if (heroResp && settings.contact_response_time) {
            heroResp.textContent = settings.contact_response_time.replace(/within\s+/i, '').split(' ')[0] || '24h';
        }
    } catch (error) {
        console.warn('Could not load contact settings:', error.message);
    }
}

function initializeNewsletterForm() {
    const newsletter = qs('#footerNewsletter');
    if (!newsletter) return;

    newsletter.addEventListener('submit', event => {
        event.preventDefault();
        const emailInput = newsletter.querySelector('input[type="email"]');
        if (!emailInput) return;

        const email = emailInput.value.trim();
        if (!emailIsValid(email)) {
            showFormToast('Please enter a valid email address.', 'error');
            return;
        }

        const subscriptions = getStorage('nexuraNewsletter', []);
        if (!subscriptions.includes(email)) {
            subscriptions.push(email);
            setStorage('nexuraNewsletter', subscriptions);
        }

        newsletter.reset();
        showFormToast('Thanks! You are subscribed to premium insights.');
    });
}

function initializeSidebarNewsletters() {
    qsa('.sidebar-newsletter').forEach(form => {
        form.addEventListener('submit', event => {
            event.preventDefault();
            const emailInput = form.querySelector('input[type="email"]');
            if (!emailInput) return;

            const email = emailInput.value.trim();
            if (!emailIsValid(email)) {
                showFormToast('Please enter a valid email address.', 'error');
                return;
            }

            const subscriptions = getStorage('nexuraNewsletter', []);
            if (!subscriptions.includes(email)) {
                subscriptions.push(email);
                setStorage('nexuraNewsletter', subscriptions);
            }

            form.reset();
            showFormToast('Thanks! You are subscribed.');
        });
    });
}

async function submitContactForm() {
    const name = qs('#contactName').value.trim();
    const email = qs('#contactEmail').value.trim();
    const phone = qs('#contactPhone').value.trim();
    const message = qs('#contactMessage').value.trim();
    const budget = qs('#contactBudget')?.value || '';
    const service = qs('#contactService')?.value || '';
    const termsChecked = qs('#termsCheck').checked;
    const submitBtn = qs('#contactSubmitBtn');

    clearError('#contactNameError');
    clearError('#contactEmailError');
    clearError('#contactPhoneError');
    clearError('#contactMessageError');

    if (name.length < 2) {
        return showError('#contactNameError', 'Please enter your name.');
    }
    if (!emailIsValid(email)) {
        return showError('#contactEmailError', 'Please enter a valid email.');
    }
    if (message.length < 20) {
        return showError('#contactMessageError', 'Tell us more about your project (min 20 chars).');
    }
    if (message.length > 300) {
        return showError('#contactMessageError', 'Message must be 300 characters or less.');
    }
    if (!termsChecked) {
        return showError('#contactMessageError', 'Please agree to receive updates.');
    }

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    }

    let fullMessage = message;
    if (service) fullMessage = `[Service: ${service}] ${fullMessage}`;
    if (budget) fullMessage = `[Budget: ${budget}] ${fullMessage}`;

    try {
        await NexuraAPI.submitContact({ name, email, phone, message: fullMessage });

        qs('#contactForm').reset();
        if (qs('#messageCounter')) qs('#messageCounter').textContent = '0/300';
        showContactSuccess();
    } catch (error) {
        const msg = error.message || 'Unable to send message.';
        const hint = msg.includes('Database') ? '' : ' (Backend API configure karein: js/config.live.js)';
        showError('#contactMessageError', msg + hint);
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send message';
        }
    }
}

function showContactSuccess() {
    const successEl = qs('#contactSuccess');
    if (successEl) {
        successEl.hidden = false;
        successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return;
    }
    showFormToast('Your message has been sent. We will contact you shortly.');
}

function showFormToast(message, type = 'success') {
    if (window.NexuraApp?.toast) {
        NexuraApp.toast(message, type === 'error' ? 'error' : 'success');
        return;
    }
    let toast = qs('#formToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'formToast';
        toast.className = 'form-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = `form-toast form-toast--${type} form-toast--visible`;
    setTimeout(() => toast.classList.remove('form-toast--visible'), 4000);
}

function clearError(selector) {
    const element = qs(selector);
    if (element) element.textContent = '';
}

function showError(selector, message) {
    const element = qs(selector);
    if (element) element.textContent = message;
}
