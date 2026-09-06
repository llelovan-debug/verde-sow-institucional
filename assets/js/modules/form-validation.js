/* ==========================================================================
   VALIDAÇÃO DE FORMULÁRIOS — VERDE SOW
   Ficheiro: assets/js/modules/form-validation.js

   Responsabilidade:
   - Validar campos obrigatórios
   - Validar e-mail, telefone, checkbox, select e ficheiros
   - Mostrar e remover mensagens de erro
   - Atualizar atributos de acessibilidade
   - Ser reutilizado pelo contacto e pela newsletter
   ========================================================================== */


/* ==========================================================================
   01. CONFIGURAÇÕES
   ========================================================================== */

const FIELD_SELECTOR = [
    "input:not([type='hidden'])",
    "select",
    "textarea"
].join(",");

const ERROR_CLASS = "form__error";
const GROUP_ERROR_CLASS = "has-error";
const GROUP_SUCCESS_CLASS = "has-success";

const DEFAULT_MESSAGES = {
    required: "Este campo é obrigatório.",
    email: "Introduza um endereço de e-mail válido.",
    telephone: "Introduza um número de telefone válido.",
    minimumLength: "O conteúdo introduzido é demasiado curto.",
    maximumLength: "O conteúdo introduzido é demasiado longo.",
    pattern: "O formato introduzido não é válido.",
    checkbox: "É necessário aceitar esta opção.",
    fileSize: "O ficheiro selecionado excede o tamanho permitido.",
    fileType: "O tipo de ficheiro selecionado não é permitido."
};


/* ==========================================================================
   02. UTILITÁRIOS
   ========================================================================== */

/**
 * Encontra o grupo visual de um campo.
 *
 * Estrutura recomendada:
 *
 * <div class="form__group">
 *     <label ...></label>
 *     <input ...>
 *     <small class="form__error" hidden></small>
 * </div>
 *
 * @param {HTMLElement} field
 * @returns {HTMLElement | null}
 */
function getFieldGroup(field) {
    return field.closest(
        ".form__group, .form-group, .form-consent, .form__choice"
    );
}


/**
 * Cria um identificador para a mensagem de erro.
 *
 * @param {HTMLElement} field
 * @returns {string}
 */
function getErrorId(field) {
    if (!field.id) {
        field.id = `field-${crypto.randomUUID()}`;
    }

    return `${field.id}-error`;
}


/**
 * Devolve o valor normalizado de um campo.
 *
 * @param {HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement} field
 * @returns {string}
 */
function getFieldValue(field) {
    return typeof field.value === "string"
        ? field.value.trim()
        : "";
}


/**
 * Verifica se o campo deve ser ignorado.
 *
 * @param {HTMLElement} field
 * @returns {boolean}
 */
function shouldIgnoreField(field) {
    return (
        field.disabled ||
        field.hidden ||
        field.closest("[hidden]") !== null
    );
}


/* ==========================================================================
   03. VALIDADORES
   ========================================================================== */

/**
 * Valida um endereço de e-mail.
 *
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(email);
}


/**
 * Valida um número de telefone com formato internacional ou local.
 *
 * Aceita números, espaços, parênteses, hífen e sinal de adição.
 *
 * @param {string} telephone
 * @returns {boolean}
 */
function isValidTelephone(telephone) {
    const normalizedTelephone = telephone.replace(/[^\d+]/g, "");

    return /^\+?\d{9,15}$/u.test(normalizedTelephone);
}


/**
 * Verifica a extensão e o MIME type de um ficheiro.
 *
 * @param {File} file
 * @param {string} acceptedTypes
 * @returns {boolean}
 */
function isAcceptedFileType(file, acceptedTypes) {
    if (!acceptedTypes) {
        return true;
    }

    const acceptedValues = acceptedTypes
        .split(",")
        .map(value => value.trim().toLowerCase())
        .filter(Boolean);

    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();

    return acceptedValues.some(acceptedValue => {
        if (acceptedValue.startsWith(".")) {
            return fileName.endsWith(acceptedValue);
        }

        if (acceptedValue.endsWith("/*")) {
            const category = acceptedValue.slice(0, -1);

            return fileType.startsWith(category);
        }

        return fileType === acceptedValue;
    });
}


/**
 * Valida o tamanho máximo do ficheiro.
 *
 * O atributo data-max-file-size deve estar em megabytes.
 *
 * @param {File} file
 * @param {string | undefined} maximumSize
 * @returns {boolean}
 */
function isAcceptedFileSize(file, maximumSize) {
    if (!maximumSize) {
        return true;
    }

    const maximumSizeInMegabytes = Number.parseFloat(maximumSize);

    if (
        !Number.isFinite(maximumSizeInMegabytes) ||
        maximumSizeInMegabytes <= 0
    ) {
        return true;
    }

    const maximumSizeInBytes =
        maximumSizeInMegabytes * 1024 * 1024;

    return file.size <= maximumSizeInBytes;
}


/* ==========================================================================
   04. MENSAGENS PERSONALIZADAS
   ========================================================================== */

/**
 * Obtém uma mensagem personalizada definida no HTML.
 *
 * Exemplo:
 * data-error-required="Indique o seu nome."
 *
 * @param {HTMLElement} field
 * @param {string} type
 * @returns {string}
 */
function getValidationMessage(field, type) {
    const attributeName =
        `data-error-${type.replace(/[A-Z]/g, letter =>
            `-${letter.toLowerCase()}`
        )}`;

    return (
        field.getAttribute(attributeName) ||
        DEFAULT_MESSAGES[type] ||
        "O valor introduzido não é válido."
    );
}


/* ==========================================================================
   05. REGRAS DE VALIDAÇÃO
   ========================================================================== */

/**
 * Devolve a mensagem de erro de um campo.
 * Quando o campo é válido, devolve uma string vazia.
 *
 * @param {HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement} field
 * @returns {string}
 */
export function getFieldError(field) {
    if (shouldIgnoreField(field)) {
        return "";
    }

    const value = getFieldValue(field);
    const isCheckboxOrRadio = [
        "checkbox",
        "radio"
    ].includes(field.type);

    if (
        field.required &&
        isCheckboxOrRadio &&
        !field.checked
    ) {
        return getValidationMessage(field, "checkbox");
    }

    if (
        field.required &&
        field.type === "file" &&
        field.files.length === 0
    ) {
        return getValidationMessage(field, "required");
    }

    if (
        field.required &&
        !isCheckboxOrRadio &&
        field.type !== "file" &&
        value === ""
    ) {
        return getValidationMessage(field, "required");
    }

    if (!value && field.type !== "file") {
        return "";
    }

    if (
        field.type === "email" &&
        !isValidEmail(value)
    ) {
        return getValidationMessage(field, "email");
    }

    if (
        field.type === "tel" &&
        !isValidTelephone(value)
    ) {
        return getValidationMessage(field, "telephone");
    }

    if (
        field.minLength > 0 &&
        value.length < field.minLength
    ) {
        return getValidationMessage(field, "minimumLength");
    }

    if (
        field.maxLength > 0 &&
        value.length > field.maxLength
    ) {
        return getValidationMessage(field, "maximumLength");
    }

    if (
        field.pattern &&
        !new RegExp(`^(?:${field.pattern})$`, "u").test(value)
    ) {
        return getValidationMessage(field, "pattern");
    }

    if (
        field.type === "file" &&
        field.files.length > 0
    ) {
        const files = Array.from(field.files);

        const invalidType = files.some(file =>
            !isAcceptedFileType(file, field.accept)
        );

        if (invalidType) {
            return getValidationMessage(field, "fileType");
        }

        const invalidSize = files.some(file =>
            !isAcceptedFileSize(
                file,
                field.dataset.maxFileSize
            )
        );

        if (invalidSize) {
            return getValidationMessage(field, "fileSize");
        }
    }

    return "";
}


/* ==========================================================================
   06. APRESENTAÇÃO DO ERRO
   ========================================================================== */

/**
 * Encontra ou cria o elemento da mensagem de erro.
 *
 * @param {HTMLElement} field
 * @returns {HTMLElement}
 */
function getErrorElement(field) {
    const group = getFieldGroup(field);
    const errorId = getErrorId(field);

    let errorElement =
        group?.querySelector(`#${CSS.escape(errorId)}`) ||
        document.getElementById(errorId);

    if (!errorElement) {
        errorElement = document.createElement("small");

        errorElement.id = errorId;
        errorElement.className = ERROR_CLASS;
        errorElement.hidden = true;

        field.insertAdjacentElement(
            "afterend",
            errorElement
        );
    }

    return errorElement;
}


/**
 * Mostra uma mensagem de erro.
 *
 * @param {HTMLElement} field
 * @param {string} message
 */
export function showFieldError(field, message) {
    const group = getFieldGroup(field);
    const errorElement = getErrorElement(field);
    const errorId = errorElement.id;

    errorElement.textContent = message;
    errorElement.hidden = false;

    field.setAttribute("aria-invalid", "true");

    const describedBy = new Set(
        (field.getAttribute("aria-describedby") || "")
            .split(/\s+/u)
            .filter(Boolean)
    );

    describedBy.add(errorId);

    field.setAttribute(
        "aria-describedby",
        Array.from(describedBy).join(" ")
    );

    group?.classList.add(GROUP_ERROR_CLASS);
    group?.classList.remove(GROUP_SUCCESS_CLASS);
}


/**
 * Remove o erro visual de um campo.
 *
 * @param {HTMLElement} field
 */
export function clearFieldError(field) {
    const group = getFieldGroup(field);
    const errorElement = getErrorElement(field);
    const errorId = errorElement.id;

    errorElement.textContent = "";
    errorElement.hidden = true;

    field.removeAttribute("aria-invalid");

    const describedBy = (
        field.getAttribute("aria-describedby") || ""
    )
        .split(/\s+/u)
        .filter(value => value && value !== errorId);

    if (describedBy.length > 0) {
        field.setAttribute(
            "aria-describedby",
            describedBy.join(" ")
        );
    } else {
        field.removeAttribute("aria-describedby");
    }

    group?.classList.remove(GROUP_ERROR_CLASS);
}


/**
 * Aplica o estado visual de sucesso.
 *
 * @param {HTMLElement} field
 */
function showFieldSuccess(field) {
    const group = getFieldGroup(field);

    group?.classList.remove(GROUP_ERROR_CLASS);
    group?.classList.add(GROUP_SUCCESS_CLASS);
}


/* ==========================================================================
   07. VALIDAÇÃO DE UM CAMPO
   ========================================================================== */

/**
 * Valida um campo individual.
 *
 * @param {HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement} field
 * @param {{ showSuccess?: boolean }} options
 * @returns {boolean}
 */
export function validateField(
    field,
    { showSuccess = false } = {}
) {
    const errorMessage = getFieldError(field);

    if (errorMessage) {
        showFieldError(field, errorMessage);

        return false;
    }

    clearFieldError(field);

    if (
        showSuccess &&
        getFieldValue(field) !== ""
    ) {
        showFieldSuccess(field);
    }

    return true;
}


/* ==========================================================================
   08. VALIDAÇÃO DO FORMULÁRIO
   ========================================================================== */

/**
 * Devolve todos os campos válidos para validação.
 *
 * @param {HTMLFormElement} form
 * @returns {Array<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>}
 */
function getFormFields(form) {
    return Array.from(
        form.querySelectorAll(FIELD_SELECTOR)
    ).filter(field => !shouldIgnoreField(field));
}


/**
 * Valida todos os campos de um formulário.
 *
 * @param {HTMLFormElement} form
 * @param {{ focusFirstInvalid?: boolean }} options
 * @returns {boolean}
 */
export function validateForm(
    form,
    { focusFirstInvalid = true } = {}
) {
    const fields = getFormFields(form);
    const invalidFields = [];

    fields.forEach(field => {
        const isValid = validateField(field);

        if (!isValid) {
            invalidFields.push(field);
        }
    });

    if (
        focusFirstInvalid &&
        invalidFields.length > 0
    ) {
        invalidFields[0].focus({
            preventScroll: true
        });

        invalidFields[0].scrollIntoView({
            behavior: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches
                ? "auto"
                : "smooth",
            block: "center"
        });
    }

    return invalidFields.length === 0;
}


/* ==========================================================================
   09. LIMPEZA DO FORMULÁRIO
   ========================================================================== */

/**
 * Remove os estados de validação de todo o formulário.
 *
 * @param {HTMLFormElement} form
 */
export function clearFormValidation(form) {
    getFormFields(form).forEach(field => {
        clearFieldError(field);

        getFieldGroup(field)?.classList.remove(
            GROUP_SUCCESS_CLASS
        );
    });
}


/* ==========================================================================
   10. VALIDAÇÃO EM TEMPO REAL
   ========================================================================== */

/**
 * Ativa a validação progressiva de um formulário.
 *
 * O campo só começa a validar durante a escrita depois de
 * o utilizador sair dele pela primeira vez.
 *
 * @param {HTMLFormElement} form
 */
export function initFormValidation(form) {
    if (!(form instanceof HTMLFormElement)) {
        return;
    }

    const fields = getFormFields(form);

    fields.forEach(field => {
        field.addEventListener("blur", () => {
            field.dataset.touched = "true";

            validateField(field);
        });

        const eventName = [
            "checkbox",
            "radio",
            "file"
        ].includes(field.type)
            ? "change"
            : "input";

        field.addEventListener(eventName, () => {
            if (
                field.dataset.touched === "true" ||
                field.getAttribute("aria-invalid") === "true"
            ) {
                validateField(field);
            }
        });
    });

    form.addEventListener("reset", () => {
        window.requestAnimationFrame(() => {
            clearFormValidation(form);

            fields.forEach(field => {
                delete field.dataset.touched;
            });
        });
    });
}