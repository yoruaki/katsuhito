const elms = {
    heading: document.querySelector('.header__heading'),
    nav: document.querySelector('.header__nav'),
    btn: document.querySelector('.header__navButton'),
    menu: document.querySelector('.header__navList')
};

const tabbableElms = [
    elms.btn,
    ...elms.menu.querySelectorAll('.header__navLink')
];

const toggleMenu = () => {
    const isOpen = elms.nav.classList.toggle('header__nav--isOpen');
    updateAriaAttributes(isOpen);

    document[isOpen ? 'addEventListener' : 'removeEventListener']('keydown', handleTabLoop);
};

const updateAriaAttributes = (isOpen) => {
    elms.btn.setAttribute('aria-expanded', isOpen);
    isOpen ? elms.menu.removeAttribute('aria-hidden') : elms.menu.setAttribute('aria-hidden', 'true');
};

const reapplyHeadingAnimation = () => {
    elms.heading.classList.remove('header__heading--animation');
    setTimeout(() => {
        // Force reflow
        void elms.heading.offsetWidth;
        elms.heading.classList.add('header__heading--animation');
    }, 400);
};

const closeMenuOnLinkClick = (evt) => {
    const target = evt.target;
    if (target.classList.contains('header__navLink')) {
        if (target.classList.contains('header__navLink--top')) {
            evt.preventDefault();
            window.scrollTo({ top: 0 });
            reapplyHeadingAnimation();
            // Remove `#` from the URL
            window.history.replaceState(null, null, window.location.pathname);
        }
        closeMenu();
    }
};

const closeMenu = () => {
    elms.nav.classList.remove('header__nav--isOpen');
    updateAriaAttributes(false);
    document.removeEventListener('keydown', handleTabLoop);
};

const closeMenuOnEscape = (evt) => {
    if (evt.key === 'Escape') {
        closeMenu();
    }
};

const closeMenuOnOutsideClick = (evt) => {
    if (!elms.nav.contains(evt.target)) {
        closeMenu();
    }
};

// Loop focus with the Tab key
const handleTabLoop = (evt) => {
    if (evt.key !== 'Tab') return;

    const [firstElm, lastElm] = [tabbableElms[0], tabbableElms[tabbableElms.length - 1]];

    if (evt.shiftKey && document.activeElement === firstElm) {
        evt.preventDefault();
        lastElm.focus();
    } else if (!evt.shiftKey && document.activeElement === lastElm) {
        evt.preventDefault();
        firstElm.focus();
    }
};

elms.btn.addEventListener('click', toggleMenu);
elms.menu.addEventListener('click', closeMenuOnLinkClick);
document.addEventListener('keydown', closeMenuOnEscape);
document.addEventListener('click', closeMenuOnOutsideClick);
