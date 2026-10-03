"use strict";

import { authAPI } from './api/auth.js';
import { sessionManager } from './utils/session.js';
import { messageRenderer } from './renderers/messages.js';

// DOM elements that we will use
const loginForm = document.getElementById("login-form");
const errorsDiv = document.getElementById("errors");

// Main function that will run when the page is ready
function main() {
    // Handle the form's submit event
    loginForm.addEventListener("submit", function (event) {
        handleSubmitLogin(event);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    main();
});

///////////////////////////////////////////////////////////////////////////////

function handleSubmitLogin(event) {
    // Prevent the browser from sending the form on its own,
    // because we'll do it using AJAX
    event.preventDefault();
    errorsDiv.innerHTML = "";

    let formData = new FormData(loginForm);

    sendLogin(formData);
}

function sendLogin(formData) {
    authAPI.login(formData)
        .then(loginData => {
            // Successful login
            let sessionToken = loginData.sessionToken;
            let loggedUser = loginData.user;
            sessionManager.login(sessionToken, loggedUser);
            window.location.href = "index.html";
        })
        .catch(error => {
            const blockedMessage = error.response?.status === 429
                ? error.response.data?.message
                : null;

            messageRenderer.showErrorMessage(
                blockedMessage || "No se pudo iniciar sesión. Comprueba tus datos e inténtalo de nuevo."
            );
        });
}
