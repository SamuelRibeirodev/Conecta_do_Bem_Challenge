document.addEventListener("DOMContentLoaded", () => {
    setupResponsiveMenu();
    setupContactForm();
    setupDonationForm();
    setupFaqAccordion();
});

function setupResponsiveMenu() {
    const header = document.querySelector(".site-header");
    const navigation = header?.querySelector("nav");

    if (!header || !navigation) return;

    const button = document.createElement("button");

    button.className = "menu-toggle";
    button.type = "button";
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", "menu-principal");
    button.setAttribute("aria-label", "Abrir menu principal");
    button.innerHTML = "<span></span><span></span><span></span>";

    navigation.id = "menu-principal";
    header.querySelector(".logo")?.insertAdjacentElement("afterend", button);

    function closeMenu() {
        header.classList.remove("menu-aberto");
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-label", "Abrir menu principal");
    }

    button.addEventListener("click", () => {
        const open = header.classList.toggle("menu-aberto");

        button.setAttribute("aria-expanded", String(open));
        button.setAttribute(
            "aria-label",
            open ? "Fechar menu principal" : "Abrir menu principal"
        );
    });

    navigation.addEventListener("click", (event) => {
        if (event.target.closest("a")) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth >= 992) {
            closeMenu();
        }
    });
}

function getErrorElement(field) {
    let error = field.parentElement.querySelector(".campo-erro");

    if (!error) {
        error = document.createElement("small");
        error.className = "campo-erro";
        error.id = `${field.id}-erro`;
        error.setAttribute("aria-live", "polite");

        field.insertAdjacentElement("afterend", error);
        field.setAttribute("aria-describedby", error.id);
    }

    return error;
}

function setFieldState(field, message = "") {
    const error = getErrorElement(field);
    const invalid = Boolean(message);

    field.classList.toggle("campo-invalido", invalid);
    field.setAttribute("aria-invalid", String(invalid));
    error.textContent = message;

    return !invalid;
}

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function setupContactForm() {
    const form = document.querySelector(".form-contato");

    if (!form) return;

    const name = form.querySelector("#contato-nome");
    const email = form.querySelector("#contato-email");
    const message = form.querySelector("#contato-mensagem");
    const fields = [name, email, message];

    function validateField(field) {
        const value = field.value.trim();

        if (!value) {
            return setFieldState(
                field,
                "Preencha este campo para continuar."
            );
        }

        if (field === name && value.length < 3) {
            return setFieldState(
                field,
                "Informe um nome com pelo menos 3 caracteres."
            );
        }

        if (field === email && !isValidEmail(value)) {
            return setFieldState(
                field,
                "Informe um e-mail válido, como nome@exemplo.com."
            );
        }

        if (field === message && value.length < 10) {
            return setFieldState(
                field,
                "Escreva uma mensagem com pelo menos 10 caracteres."
            );
        }

        return setFieldState(field);
    }

    fields.forEach((field) => {
        field.addEventListener("blur", () => {
            validateField(field);
        });

        field.addEventListener("input", () => {
            if (field.classList.contains("campo-invalido")) {
                validateField(field);
            }
        });
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const valid = fields
            .map(validateField)
            .every(Boolean);

        let feedback = form.querySelector(".form-feedback");

        if (!feedback) {
            feedback = document.createElement("p");
            feedback.className = "form-feedback";
            feedback.setAttribute("role", "status");
            form.append(feedback);
        }

        if (!valid) {
            feedback.textContent =
                "Revise os campos destacados antes de enviar.";

            feedback.classList.add("form-feedback--erro");
            form.querySelector(".campo-invalido")?.focus();

            return;
        }

        feedback.textContent =
            "Mensagem validada com sucesso! Este protótipo não envia dados reais.";

        feedback.classList.remove("form-feedback--erro");
        form.reset();
    });
}

function setupDonationForm() {
    const form = document.querySelector(".form-doacao");

    if (!form) return;

    const name = form.querySelector("#doador-nome");
    const email = form.querySelector("#doador-email");
    const submitButton = form.querySelector(
        'button[type="submit"]'
    );

    const summary = document.createElement("div");

    summary.className = "doacao-feedback";
    summary.setAttribute("aria-live", "polite");

    form.querySelector("#aviso-botao")?.replaceWith(summary);

    submitButton.disabled = false;
    submitButton.removeAttribute("aria-describedby");

    function updateSummary() {
        const value =
            form.querySelector('input[name="valor"]:checked')?.value ||
            "30";

        const method =
            form.querySelector('input[name="forma"]:checked')?.value ||
            "pix";

        const valueLabel =
            value === "outro"
                ? "um valor personalizado"
                : `R$ ${value}`;

        const methods = {
            pix: "PIX",
            boleto: "boleto",
            recorrente: "doação mensal"
        };

        summary.textContent =
            `Resumo: ${valueLabel}, via ${methods[method]}.`;

        summary.classList.remove("doacao-feedback--sucesso");
    }

    form.addEventListener("change", updateSummary);

    updateSummary();

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const nameValid = setFieldState(
            name,
            name.value.trim().length >= 3
                ? ""
                : "Informe seu nome completo."
        );

        const emailValid = setFieldState(
            email,
            isValidEmail(email.value.trim())
                ? ""
                : "Informe um e-mail válido."
        );

        if (!nameValid || !emailValid) {
            form.querySelector(".campo-invalido")?.focus();
            return;
        }

        summary.textContent =
            "Dados validados! Em uma versão real, você seguiria agora para o pagamento seguro.";

        summary.classList.add("doacao-feedback--sucesso");
    });
}

function setupFaqAccordion() {
    const items = document.querySelectorAll(".faq-item");

    items.forEach((item) => {
        item.addEventListener("toggle", () => {
            if (!item.open) return;

            items.forEach((otherItem) => {
                if (otherItem !== item) {
                    otherItem.open = false;
                }
            });
        });
    });
}