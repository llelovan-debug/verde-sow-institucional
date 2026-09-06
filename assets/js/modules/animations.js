/* ==========================================================================
   ANIMAÇÕES — VERDE SOW
   Ficheiro: assets/js/modules/animations.js

   Responsabilidade:
   - Revelar elementos com data-reveal
   - Animar grupos com data-stagger
   - Aplicar atrasos personalizados
   - Respeitar prefers-reduced-motion
   - Evitar que elementos fiquem invisíveis sem necessidade
   ========================================================================== */


/* ==========================================================================
   01. CONFIGURAÇÕES
   ========================================================================== */

const REVEAL_SELECTOR = "[data-reveal]";
const STAGGER_GROUP_SELECTOR = "[data-stagger]";
const STAGGER_ITEM_SELECTOR = "[data-stagger-item]";

const DEFAULT_REVEAL_DELAY = 0;
const DEFAULT_STAGGER_STEP = 100;

const OBSERVER_OPTIONS = {
    root: null,
    rootMargin: "0px 0px -8% 0px",
    threshold: 0.12
};


/* ==========================================================================
   02. UTILITÁRIOS
   ========================================================================== */

/**
 * Converte um valor para número inteiro seguro.
 *
 * @param {string | null} value
 * @param {number} fallback
 * @returns {number}
 */
function parsePositiveInteger(value, fallback = 0) {
    const parsedValue = Number.parseInt(value ?? "", 10);

    if (!Number.isFinite(parsedValue) || parsedValue < 0) {
        return fallback;
    }

    return parsedValue;
}


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
 * Torna um elemento visível.
 *
 * @param {Element} element
 */
function revealElement(element) {
    element.classList.add("is-visible");
}


/**
 * Remove propriedades temporárias usadas pela animação.
 *
 * @param {Element} element
 */
function clearAnimationProperties(element) {
    element.style.removeProperty("--animation-delay");
}


/* ==========================================================================
   03. ATRASOS DOS ELEMENTOS
   ========================================================================== */

/**
 * Aplica o atraso definido em data-reveal-delay.
 *
 * Exemplo:
 * data-reveal-delay="200"
 *
 * @param {Element} element
 */
function applyRevealDelay(element) {
    const delay = parsePositiveInteger(
        element.getAttribute("data-reveal-delay"),
        DEFAULT_REVEAL_DELAY
    );

    element.style.setProperty(
        "--animation-delay",
        `${delay}ms`
    );
}


/**
 * Configura os atrasos sequenciais dos grupos.
 *
 * Exemplo:
 * data-stagger-step="120"
 *
 * @param {Element} group
 */
function configureStaggerGroup(group) {
    const items = Array.from(
        group.querySelectorAll(STAGGER_ITEM_SELECTOR)
    );

    if (items.length === 0) {
        return;
    }

    const step = parsePositiveInteger(
        group.getAttribute("data-stagger-step"),
        DEFAULT_STAGGER_STEP
    );

    items.forEach((item, index) => {
        const customDelay = parsePositiveInteger(
            item.getAttribute("data-reveal-delay"),
            index * step
        );

        item.style.setProperty(
            "--animation-delay",
            `${customDelay}ms`
        );
    });
}


/* ==========================================================================
   04. INTERSECTION OBSERVER
   ========================================================================== */

/**
 * Cria o observer das animações.
 *
 * @returns {IntersectionObserver}
 */
function createRevealObserver() {
    return new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    return;
                }

                const element = entry.target;

                revealElement(element);

                observer.unobserve(element);

                window.setTimeout(
                    () => clearAnimationProperties(element),
                    1200
                );
            });
        },
        OBSERVER_OPTIONS
    );
}


/* ==========================================================================
   05. ELEMENTOS JÁ VISÍVEIS NO CARREGAMENTO
   ========================================================================== */

/**
 * Revela imediatamente elementos que já estão próximos do viewport.
 * Isto evita atrasos estranhos no Hero ao carregar a página.
 *
 * @param {Element} element
 * @returns {boolean}
 */
function shouldRevealImmediately(element) {
    const rect = element.getBoundingClientRect();

    return (
        rect.top < window.innerHeight * 0.92 &&
        rect.bottom > 0
    );
}


/* ==========================================================================
   06. REVELAÇÃO SEM OBSERVER
   ========================================================================== */

/**
 * Mostra todos os elementos sem animação.
 * Usado quando há movimento reduzido ou quando o navegador
 * não suporta IntersectionObserver.
 *
 * @param {Element[]} elements
 */
function revealAll(elements) {
    elements.forEach(element => {
        revealElement(element);
        clearAnimationProperties(element);
    });
}


/* ==========================================================================
   07. INICIALIZAÇÃO
   ========================================================================== */

export function initAnimations() {
    const revealElements = Array.from(
        document.querySelectorAll(REVEAL_SELECTOR)
    );

    const staggerGroups = Array.from(
        document.querySelectorAll(STAGGER_GROUP_SELECTOR)
    );

    staggerGroups.forEach(configureStaggerGroup);
    revealElements.forEach(applyRevealDelay);

    const animatedElements = Array.from(
        new Set([
            ...revealElements,
            ...document.querySelectorAll(STAGGER_ITEM_SELECTOR)
        ])
    );

    if (animatedElements.length === 0) {
        return;
    }

    if (
        prefersReducedMotion() ||
        !("IntersectionObserver" in window)
    ) {
        revealAll(animatedElements);
        return;
    }

    const observer = createRevealObserver();

    animatedElements.forEach(element => {
        if (shouldRevealImmediately(element)) {
            revealElement(element);

            window.setTimeout(
                () => clearAnimationProperties(element),
                1200
            );

            return;
        }

        observer.observe(element);
    });
}