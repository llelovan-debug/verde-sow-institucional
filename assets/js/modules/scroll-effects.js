/* ==========================================================================
   EFEITOS DE SCROLL — VERDE SOW
   Ficheiro: assets/js/modules/scroll-effects.js

   Responsabilidade:
   - Mostrar e ocultar o botão "Voltar ao topo"
   - Fazer scroll suave para o topo
   - Tratar links internos com âncoras
   - Respeitar prefers-reduced-motion
   ========================================================================== */


/* ==========================================================================
   01. CONFIGURAÇÕES
   ========================================================================== */

const BACK_TO_TOP_SELECTOR = "[data-back-to-top]";
const INTERNAL_LINK_SELECTOR = 'a[href^="#"]:not([href="#"])';

const BACK_TO_TOP_OFFSET = 500;


/* ==========================================================================
   02. UTILITÁRIOS
   ========================================================================== */

/**
 * Verifica se o utilizador prefere movimento reduzido.
 *
 * @returns {boolean}
 */
function prefersReducedMotion() {
    return window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;
}


/**
 * Devolve o comportamento de scroll adequado.
 *
 * @returns {"auto" | "smooth"}
 */
function getScrollBehavior() {
    return prefersReducedMotion()
        ? "auto"
        : "smooth";
}


/* ==========================================================================
   03. BOTÃO VOLTAR AO TOPO
   ========================================================================== */

/**
 * Atualiza a visibilidade do botão voltar ao topo.
 *
 * @param {HTMLButtonElement} button
 */
function updateBackToTopVisibility(button) {
    const shouldShow = window.scrollY > BACK_TO_TOP_OFFSET;

    button.classList.toggle(
        "is-visible",
        shouldShow
    );

    button.hidden = false;

    button.setAttribute(
        "aria-hidden",
        shouldShow ? "false" : "true"
    );

    button.tabIndex = shouldShow ? 0 : -1;
}


/**
 * Inicializa o botão voltar ao topo.
 *
 * @param {HTMLButtonElement | null} button
 */
function initBackToTop(button) {
    if (!button) {
        return;
    }

    updateBackToTopVisibility(button);

    window.addEventListener(
        "scroll",
        () => updateBackToTopVisibility(button),
        { passive: true }
    );

    button.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: getScrollBehavior()
        });
    });
}


/* ==========================================================================
   04. LINKS INTERNOS
   ========================================================================== */

/**
 * Faz scroll suave para uma âncora interna.
 *
 * @param {HTMLAnchorElement} link
 */
function handleInternalLink(link) {
    link.addEventListener("click", event => {
        const href = link.getAttribute("href");

        if (!href || !href.startsWith("#")) {
            return;
        }

        const target = document.querySelector(href);

        if (!target) {
            return;
        }

        event.preventDefault();

        target.scrollIntoView({
            behavior: getScrollBehavior(),
            block: "start"
        });

        history.pushState(
            null,
            "",
            href
        );

        if (!target.hasAttribute("tabindex")) {
            target.setAttribute("tabindex", "-1");
        }

        target.focus({
            preventScroll: true
        });
    });
}


/* ==========================================================================
   05. INICIALIZAÇÃO
   ========================================================================== */

export function initScrollEffects() {
    const backToTopButton = document.querySelector(
        BACK_TO_TOP_SELECTOR
    );

    const internalLinks = Array.from(
        document.querySelectorAll(
            INTERNAL_LINK_SELECTOR
        )
    );

    initBackToTop(backToTopButton);

    internalLinks.forEach(handleInternalLink);
}