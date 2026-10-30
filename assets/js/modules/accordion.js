/* ==========================================================================
   ACCORDION — VERDE SOW
   Ficheiro: assets/js/modules/accordion.js

   Compatível com:
   - Home
     .accordion__button
     .accordion__content

   - Páginas internas
     .accordion__trigger
     .accordion__panel

   Responsabilidade:
   - Abrir e fechar itens
   - Atualizar acessibilidade
   - Fechar outros itens automaticamente
   - Navegação por teclado
   - Preservar a estrutura visual existente
========================================================================== */


/* ==========================================================================
   01. SELETORES
========================================================================== */

const ACCORDION_SELECTOR = "[data-accordion]";

const ITEM_SELECTOR = ".accordion__item";

/*
 * Suporta tanto a estrutura antiga da Home
 * como a estrutura nova das páginas internas.
 */
const BUTTON_SELECTOR =
    ".accordion__button, .accordion__trigger, [data-accordion-trigger]";


/* ==========================================================================
   02. UTILITÁRIOS
========================================================================== */

/**
 * Obtém o elemento controlado pelo botão através
 * do atributo aria-controls.
 *
 * @param {HTMLButtonElement} button
 * @returns {HTMLElement|null}
 */
function getControlledContent(button) {
    const contentId =
        button.getAttribute("aria-controls");

    if (!contentId) {
        return null;
    }

    return document.getElementById(contentId);
}


/**
 * Obtém o item pai do accordion.
 *
 * @param {HTMLButtonElement} button
 * @returns {HTMLElement|null}
 */
function getAccordionItem(button) {
    return button.closest(ITEM_SELECTOR);
}


/**
 * Verifica se o item está aberto.
 *
 * @param {HTMLButtonElement} button
 * @returns {boolean}
 */
function isItemOpen(button) {
    return (
        button.getAttribute("aria-expanded") ===
        "true"
    );
}


/**
 * Verifica se o conteúdo utiliza o atributo
 * hidden da estrutura nova.
 *
 * A Home não usa hidden porque o CSS existente
 * controla a abertura através de .is-open.
 *
 * @param {HTMLElement} content
 * @returns {boolean}
 */
function usesHiddenAttribute(content) {
    return content.matches(
        ".accordion__panel, [data-accordion-panel]"
    );
}


/* ==========================================================================
   03. ABRIR ITEM
========================================================================== */

function openItem(button) {
    const content =
        getControlledContent(button);

    const item =
        getAccordionItem(button);

    if (!content || !item) {
        return;
    }

    button.setAttribute(
        "aria-expanded",
        "true"
    );

    content.setAttribute(
        "aria-hidden",
        "false"
    );

    /*
     * Apenas a estrutura nova usa hidden.
     * Não mexemos nisso na Home.
     */
    if (usesHiddenAttribute(content)) {
        content.hidden = false;
    }

    item.classList.add("is-open");
}


/* ==========================================================================
   04. FECHAR ITEM
========================================================================== */

function closeItem(button) {
    const content =
        getControlledContent(button);

    const item =
        getAccordionItem(button);

    if (!content || !item) {
        return;
    }

    button.setAttribute(
        "aria-expanded",
        "false"
    );

    content.setAttribute(
        "aria-hidden",
        "true"
    );

    /*
     * hidden apenas nas estruturas
     * que utilizam accordion__panel.
     */
    if (usesHiddenAttribute(content)) {
        content.hidden = true;
    }

    item.classList.remove("is-open");
}


/* ==========================================================================
   05. FECHAR OUTROS ITENS
========================================================================== */

function closeOtherItems(
    accordion,
    currentButton
) {
    const buttons =
        accordion.querySelectorAll(
            BUTTON_SELECTOR
        );

    buttons.forEach((button) => {

        if (
            button !== currentButton &&
            isItemOpen(button)
        ) {
            closeItem(button);
        }

    });
}


/* ==========================================================================
   06. ALTERNAR ITEM
========================================================================== */

function toggleItem(
    accordion,
    button
) {
    const allowMultiple =
        accordion.getAttribute(
            "data-accordion-multiple"
        ) === "true";

    /*
     * Se estiver aberto, fecha.
     */
    if (isItemOpen(button)) {
        closeItem(button);
        return;
    }

    /*
     * Por padrão apenas um item
     * permanece aberto.
     */
    if (!allowMultiple) {
        closeOtherItems(
            accordion,
            button
        );
    }

    openItem(button);
}


/* ==========================================================================
   07. NAVEGAÇÃO POR TECLADO
========================================================================== */

function handleKeyboardNavigation(
    event,
    buttons
) {
    const currentIndex =
        buttons.indexOf(
            document.activeElement
        );

    if (currentIndex === -1) {
        return;
    }

    let nextIndex;

    switch (event.key) {

        case "ArrowDown":

            nextIndex =
                currentIndex ===
                buttons.length - 1
                    ? 0
                    : currentIndex + 1;

            break;


        case "ArrowUp":

            nextIndex =
                currentIndex === 0
                    ? buttons.length - 1
                    : currentIndex - 1;

            break;


        case "Home":

            nextIndex = 0;

            break;


        case "End":

            nextIndex =
                buttons.length - 1;

            break;


        default:

            return;
    }

    event.preventDefault();

    buttons[nextIndex].focus();
}


/* ==========================================================================
   08. NORMALIZAÇÃO INICIAL
========================================================================== */

function normalizeAccordionState(
    accordion
) {
    const buttons =
        accordion.querySelectorAll(
            BUTTON_SELECTOR
        );

    buttons.forEach((button) => {

        const content =
            getControlledContent(button);

        const item =
            getAccordionItem(button);

        if (!content || !item) {
            return;
        }

        const expanded =
            isItemOpen(button);


        /* ----------------------------------------------------------
           BOTÃO
        ---------------------------------------------------------- */

        button.setAttribute(
            "aria-expanded",
            expanded
                ? "true"
                : "false"
        );


        /* ----------------------------------------------------------
           CONTEÚDO
        ---------------------------------------------------------- */

        content.setAttribute(
            "aria-hidden",
            expanded
                ? "false"
                : "true"
        );


        /* ----------------------------------------------------------
           HIDDEN

           Só aplicamos à estrutura nova.
           A Home continua dependente do CSS original.
        ---------------------------------------------------------- */

        if (usesHiddenAttribute(content)) {
            content.hidden = !expanded;
        }


        /* ----------------------------------------------------------
           ESTADO VISUAL
        ---------------------------------------------------------- */

        item.classList.toggle(
            "is-open",
            expanded
        );
    });
}


/* ==========================================================================
   09. INICIALIZAR ACCORDION INDIVIDUAL
========================================================================== */

function initAccordion(
    accordion
) {
    const buttons = Array.from(
        accordion.querySelectorAll(
            BUTTON_SELECTOR
        )
    );

    if (buttons.length === 0) {
        return;
    }


    /*
     * Garante estado inicial correto.
     */
    normalizeAccordionState(
        accordion
    );


    /*
     * Clique nos itens.
     */
    buttons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {
                toggleItem(
                    accordion,
                    button
                );
            }
        );

    });


    /*
     * Navegação por teclado.
     */
    accordion.addEventListener(
        "keydown",
        (event) => {

            handleKeyboardNavigation(
                event,
                buttons
            );

        }
    );
}


/* ==========================================================================
   10. INICIALIZAÇÃO GLOBAL
========================================================================== */

export function initAccordions() {

    const accordions = Array.from(
        document.querySelectorAll(
            ACCORDION_SELECTOR
        )
    );

    if (accordions.length === 0) {
        return;
    }

    accordions.forEach(
        initAccordion
    );
}
