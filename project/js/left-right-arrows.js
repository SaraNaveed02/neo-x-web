document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.tm-section').forEach(initTestimonialSlider);
});

function initTestimonialSlider(section) {
    const track = section.querySelector('.tm-slider-track');
    const container = section.querySelector('.tm-slider-container');
    const cards = section.querySelectorAll('.tm-card');
    const dotsContainer = section.querySelector('.tm-dots');
    const leftArrow = section.querySelector('.tm-arrow-left');
    const rightArrow = section.querySelector('.tm-arrow-right');

    if (!track || !container || !cards.length) return;

    let currentIndex = 0;
    let autoScrollTimer = null;
    let touchStartX = 0;
    let touchDeltaX = 0;

    function getVisibleCount() {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    }

    function getMaxIndex() {
        return Math.max(0, cards.length - getVisibleCount());
    }

    function getCardStep() {
        const card = cards[0];
        if (!card) return 0;
        const gap = parseFloat(getComputedStyle(track).gap) || 0;
        return card.offsetWidth + gap;
    }

    function updateArrows() {
        const maxIndex = getMaxIndex();
        if (leftArrow) leftArrow.disabled = currentIndex <= 0;
        if (rightArrow) rightArrow.disabled = currentIndex >= maxIndex;
    }

    function buildDots() {
        if (!dotsContainer) return;

        const pages = getMaxIndex() + 1;
        dotsContainer.innerHTML = '';

        for (let i = 0; i < pages; i++) {
            const dot = document.createElement('span');
            dot.className = 'tm-dot' + (i === currentIndex ? ' active-dot' : '');
            dot.setAttribute('role', 'button');
            dot.setAttribute('aria-label', 'Go to review slide ' + (i + 1));
            dot.addEventListener('click', function (event) {
                event.preventDefault();
                goTo(i);
                resetAutoScroll();
            });
            dotsContainer.appendChild(dot);
        }
    }

    function updateDots() {
        if (!dotsContainer) return;
        dotsContainer.querySelectorAll('.tm-dot').forEach(function (dot, index) {
            dot.classList.toggle('active-dot', index === currentIndex);
        });
    }

    function moveSlider() {
        const maxIndex = getMaxIndex();
        if (currentIndex > maxIndex) currentIndex = maxIndex;

        track.style.transform = 'translateX(-' + (currentIndex * getCardStep()) + 'px)';
        updateDots();
        updateArrows();
    }

    function goTo(index) {
        const maxIndex = getMaxIndex();
        currentIndex = Math.min(Math.max(index, 0), maxIndex);
        moveSlider();
    }

    function nextSlide() {
        goTo(currentIndex + 1);
    }

    function previousSlide() {
        goTo(currentIndex - 1);
    }

    function resetAutoScroll() {
        clearInterval(autoScrollTimer);
        if (getMaxIndex() === 0) return;
        autoScrollTimer = setInterval(function () {
            if (currentIndex >= getMaxIndex()) goTo(0);
            else nextSlide();
        }, 6000);
    }

    if (rightArrow) {
        rightArrow.addEventListener('click', function (event) {
            event.preventDefault();
            nextSlide();
            resetAutoScroll();
        });
    }

    if (leftArrow) {
        leftArrow.addEventListener('click', function (event) {
            event.preventDefault();
            previousSlide();
            resetAutoScroll();
        });
    }

    container.addEventListener('touchstart', function (event) {
        touchStartX = event.changedTouches[0].screenX;
        touchDeltaX = 0;
    }, { passive: true });

    container.addEventListener('touchmove', function (event) {
        touchDeltaX = event.changedTouches[0].screenX - touchStartX;
    }, { passive: true });

    container.addEventListener('touchend', function () {
        if (Math.abs(touchDeltaX) < 40) return;
        if (touchDeltaX < 0) nextSlide();
        else previousSlide();
        resetAutoScroll();
    });

    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            buildDots();
            goTo(currentIndex);
            resetAutoScroll();
        }, 120);
    });

    buildDots();
    moveSlider();
    resetAutoScroll();
}
