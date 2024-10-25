const heading = document.querySelector('.header__heading');
const nav = document.querySelector('.header__nav');
const btn = nav.querySelector('.header__navButton');
const menu = nav.querySelector('.header__navList');
const tabbableElms = [btn, ...menu.querySelectorAll('.header__navLink')];

const toggleMenu = () => {
    const isOpen = nav.classList.toggle('header__nav--isOpen');
    btn.setAttribute('aria-expanded', isOpen);
    menu.toggleAttribute('inert', !isOpen);

    if (isOpen) {
        document.addEventListener('keydown', handleTabLoop);
    } else {
        document.removeEventListener('keydown', handleTabLoop);
    }
};

const reapplyHeadingAnimation = () => {
    heading.classList.remove('header__heading--animation');
    setTimeout(() => {
        void heading.offsetWidth; // Access offsetWidth to force a reflow
        heading.classList.add('header__heading--animation');
    }, 400);
};

const closeMenuOnLinkClick = (evt) => {
    if (evt.target.classList.contains('header__navLink')) {
        // Reapply the animation only for top links
        if (evt.target.classList.contains('header__navLink--top')) {
            evt.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            reapplyHeadingAnimation();
            // Remove '#' from the URL
            window.history.replaceState(null, null, window.location.pathname);
        }

        closeMenu();
    }
};

const closeMenuOnEscape = (evt) => {
    if (evt.key === 'Escape') {
        closeMenu();
    }
};

const closeMenuOnOutsideClick = (evt) => {
    if (!nav.contains(evt.target)) {
        closeMenu();
    }
};

const closeMenu = () => {
    nav.classList.remove('header__nav--isOpen');
    btn.setAttribute('aria-expanded', 'false');
    menu.setAttribute('inert', '');
    document.removeEventListener('keydown', handleTabLoop);
};

// Loop focus with the Tab key
const handleTabLoop = (evt) => {
    if (evt.key !== 'Tab') return;

    const firstElement = tabbableElms[0];
    const lastElement = tabbableElms[tabbableElms.length - 1];

    if (evt.shiftKey && document.activeElement === firstElement) {
        evt.preventDefault();
        lastElement.focus();
    } else if (!evt.shiftKey && document.activeElement === lastElement) {
        evt.preventDefault();
        firstElement.focus();
    }
};

btn.addEventListener('click', toggleMenu);
menu.addEventListener('click', closeMenuOnLinkClick);
document.addEventListener('keydown', closeMenuOnEscape);
document.addEventListener('click', closeMenuOnOutsideClick);
