/* ==========================================================================
   VERDE SOW
   Contact Form Module

   Responsabilidades:
   - Validação dos formulários
   - Estado de envio
   - Feedback ao utilizador
   - Preparado para integração com backend
   ========================================================================== */

export function initContactForms() {

    const forms = document.querySelectorAll("[data-contact-form]");

    if (!forms.length) return;

    forms.forEach(form => {

        form.addEventListener("submit", handleSubmit);

    });

}


/* ==========================================================================
   SUBMISSÃO
   ========================================================================== */

async function handleSubmit(event) {

    event.preventDefault();

    const form = event.currentTarget;

    if (!validateForm(form)) return;

    const submitButton = form.querySelector(
        '[type="submit"]'
    );

    const originalText = submitButton.innerHTML;

    setLoading(submitButton);

    try {

        /* ======================================================
           Quando existir backend,
           substituir este bloco pelo fetch().
        ======================================================= */

        await fakeRequest();

        showSuccess(form);

        form.reset();

    }

    catch (error) {

        console.error(error);

        showError(form);

    }

    finally {

        submitButton.disabled = false;
        submitButton.innerHTML = originalText;

    }

}


/* ==========================================================================
   VALIDAÇÃO
   ========================================================================== */

function validateForm(form) {

    let valid = true;

    clearErrors(form);

    const requiredFields = form.querySelectorAll("[required]");

    requiredFields.forEach(field => {

        if (!field.value.trim()) {

            showFieldError(
                field,
                "Este campo é obrigatório."
            );

            valid = false;

            return;

        }

        if (
            field.type === "email" &&
            !isValidEmail(field.value)
        ) {

            showFieldError(
                field,
                "Introduza um e-mail válido."
            );

            valid = false;

        }

    });

    return valid;

}


/* ==========================================================================
   EMAIL
   ========================================================================== */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}


/* ==========================================================================
   ERROS
   ========================================================================== */

function showFieldError(field, message) {

    field.classList.add("is-invalid");

    let error = document.createElement("small");

    error.className = "form-error";

    error.textContent = message;

    field.insertAdjacentElement(
        "afterend",
        error
    );

}

function clearErrors(form) {

    form
        .querySelectorAll(".form-error")
        .forEach(error => error.remove());

    form
        .querySelectorAll(".is-invalid")
        .forEach(field => {

            field.classList.remove("is-invalid");

        });

}


/* ==========================================================================
   LOADING
   ========================================================================== */

function setLoading(button) {

    button.disabled = true;

    button.innerHTML = "A enviar...";

}


/* ==========================================================================
   SUCESSO
   ========================================================================== */

function showSuccess(form) {

    showMessage(

        form,

        "Mensagem enviada com sucesso. Entraremos em contacto brevemente.",

        "success"

    );

}


/* ==========================================================================
   ERRO
   ========================================================================== */

function showError(form) {

    showMessage(

        form,

        "Ocorreu um erro ao enviar. Tente novamente.",

        "error"

    );

}


/* ==========================================================================
   MENSAGEM
   ========================================================================== */

function showMessage(form, message, type) {

    let container = form.querySelector(".form-message");

    if (!container) {

        container = document.createElement("div");

        container.className = "form-message";

        form.appendChild(container);

    }

    container.textContent = message;

    container.className = `form-message form-message--${type}`;

}


/* ==========================================================================
   SIMULAÇÃO DE ENVIO

   Remover quando existir backend.
   ========================================================================== */

function fakeRequest() {

    return new Promise(resolve => {

        setTimeout(resolve, 1500);

    });

}