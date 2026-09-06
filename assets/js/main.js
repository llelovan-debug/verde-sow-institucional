/* ==========================================================================
   JAVASCRIPT PRINCIPAL — VERDE SOW
   Ficheiro: assets/js/main.js

   Responsabilidade:
   - Inicializar os módulos globais do website
   - Manter cada funcionalidade separada
   - Impedir que o erro de um módulo bloqueie os restantes
   ========================================================================== */


/* ==========================================================================
   01. IMPORTAÇÃO DOS MÓDULOS
   ========================================================================== */

import { initNavigation } from "./modules/navigation.js";
import { initAnimations } from "./modules/animations.js";
import { initScrollEffects } from "./modules/scroll-effects.js";
import { initAccordions } from "./modules/accordion.js";
import { initContactForms } from "./modules/contact-form.js";


/* ==========================================================================
   02. INICIALIZAÇÃO SEGURA

   Cada módulo é executado individualmente.
   Se um deles apresentar erro, os outros continuam a funcionar.
   ========================================================================== */

/**
 * Inicializa um módulo de forma segura.
 *
 * @param {string} moduleName
 * @param {() => void} initializer
 */
function initializeModule(moduleName, initializer) {
    if (typeof initializer !== "function") {
        console.warn(
            `[Verde Sow] O módulo "${moduleName}" não possui uma função de inicialização válida.`
        );

        return;
    }

    try {
        initializer();
    } catch (error) {
        console.error(
            `[Verde Sow] Erro ao inicializar o módulo "${moduleName}":`,
            error
        );
    }
}


/* ==========================================================================
   03. INICIALIZAÇÃO DA APLICAÇÃO
   ========================================================================== */

function initializeApp() {
    initializeModule(
        "navigation",
        initNavigation
    );

    initializeModule(
        "animations",
        initAnimations
    );

    initializeModule(
        "scroll-effects",
        initScrollEffects
    );

    initializeModule(
        "accordion",
        initAccordions
    );

    initializeModule(
        "contact-form",
        initContactForms
    );

    /*
     * Indica que a aplicação terminou a inicialização.
     * Pode ser usado futuramente no CSS ou em outros módulos.
     */

    document.documentElement.classList.add("is-ready");

    /*
     * Evento personalizado disponível para funcionalidades futuras.
     */

    document.dispatchEvent(
        new CustomEvent("verdesow:ready")
    );
}


/* ==========================================================================
   04. DOM READY
   ========================================================================== */

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initializeApp,
        {
            once: true
        }
    );
} else {
    initializeApp();
}