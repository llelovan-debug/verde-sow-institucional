/* ==========================================================================
   VERDE SOW
   Navigation Module

   Responsabilidades:
   - Header com efeito ao scroll
   - Menu mobile
   - Acessibilidade
   - Lock do scroll
   ========================================================================== */

export function initNavigation() {

    const header = document.querySelector("[data-site-header]");
    const menu = document.querySelector("[data-mobile-menu]");
    const toggle = document.querySelector("[data-menu-toggle]");

    if (!header || !menu || !toggle) return;

    const closeButtons = menu.querySelectorAll("[data-menu-close]");
    const navigationLinks = menu.querySelectorAll("a");

    let isMenuOpen = false;

    /* ==========================================================
       HEADER SCROLL
       ========================================================== */

    function updateHeader() {

        if (window.scrollY > 30) {
            header.classList.add("is-scrolled");
        } else {
            header.classList.remove("is-scrolled");
        }

    }

    updateHeader();

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );

    /* ==========================================================
       MENU
       ========================================================== */

    function openMenu() {

        if (isMenuOpen) return;

        isMenuOpen = true;

        menu.classList.add("is-open");

        menu.setAttribute(
            "aria-hidden",
            "false"
        );

        toggle.setAttribute(
            "aria-expanded",
            "true"
        );

        document.body.classList.add("menu-open");

    }

    function closeMenu() {

        if (!isMenuOpen) return;

        isMenuOpen = false;

        menu.classList.remove("is-open");

        menu.setAttribute(
            "aria-hidden",
            "true"
        );

        toggle.setAttribute(
            "aria-expanded",
            "false"
        );

        document.body.classList.remove("menu-open");

    }

    toggle.addEventListener(
        "click",
        () => {

            if (isMenuOpen) {
                closeMenu();
            } else {
                openMenu();
            }

        }
    );

    /* ==========================================================
       BOTÕES FECHAR
       ========================================================== */

    closeButtons.forEach(button => {

        button.addEventListener(
            "click",
            closeMenu
        );

    });

    /* ==========================================================
       LINKS
       ========================================================== */

    navigationLinks.forEach(link => {

        link.addEventListener(
            "click",
            closeMenu
        );

    });

    /* ==========================================================
       ESC
       ========================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                closeMenu();

            }

        }
    );

}