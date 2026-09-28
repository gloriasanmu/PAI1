"use strict";

import { authAPI } from './api/auth.js';
import { sessionManager } from './utils/session.js';
import { messageRenderer } from './renderers/messages.js';

// Elementos del DOM
const signupForm = document.getElementById("signup-form");
const errorsDiv = document.getElementById("errors");

// Función principal
function main() {
    signupForm.addEventListener("submit", function (event) {
        handleSubmitSignUp(event);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    main();
});

///////////////////////////////////////////////////////////////////////////////

function handleSubmitSignUp(event) {
    event.preventDefault();

    if (errorsDiv) {
        errorsDiv.innerHTML = "";
    }

    let formData = new FormData(signupForm);

    // Validar que las contraseñas coincidan antes de enviar a la API
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password && confirmPassword && password !== confirmPassword) {
        messageRenderer.showErrorMessage("Las contraseñas no coinciden.");
        return;
    }

    sendSignUp(formData);
}

function sendSignUp(formData) {
    authAPI.register(formData)
        .then(registerData => {
            // Registro e inicio de sesión automático tras la respuesta del servidor
            let sessionToken = registerData.sessionToken;
            let loggedUser = registerData.user;
            sessionManager.login(sessionToken, loggedUser);
            window.location.href = "index.html";
        })
        .catch(error => messageRenderer.showErrorMessage(error));
}