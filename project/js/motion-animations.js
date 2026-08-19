const sections = [...document.querySelectorAll("section")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const mobileViewport = window.matchMedia("(max-width: 700px)");

function setSectionVisibility(section, isVisible) {
    section.classList.toggle("motion-revealed", isVisible);
}

if (reducedMotion.matches) {
    sections.forEach((section) => setSectionVisibility(section, true));
} else {
    sections.forEach((section) => {
        section.classList.add("motion-section");
    });

    const observer = new IntersectionObserver(
        (entries, currentObserver) => {
            entries.forEach((entry) => {
                setSectionVisibility(entry.target, entry.isIntersecting);
            });
        },
        {
            threshold: mobileViewport.matches ? 0.04 : 0.12,
            rootMargin: mobileViewport.matches ? "0px 0px -5%" : "0px 0px -10%"
        }
    );

    sections.forEach((section) => observer.observe(section));
}