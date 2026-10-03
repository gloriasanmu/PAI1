"use strict";

import { authAPI } from './api/auth.js';
import { sessionManager } from './utils/session.js';
import { messageRenderer } from './renderers/messages.js';

// DOM elements that we will use
const transaccionForm = document.getElementById("transaccion-form");
const errorsDiv = document.getElementById("errors");

// Main function that will run when the page is ready
function main() {
    // Handle the form's submit event
    transaccionForm.addEventListener("submit", function (event) {
        handleSubmitTransaccion(event);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    main();
});

///////////////////////////////////////////////////////////////////////////////

function handleSubmitTransaccion(event) {
    // Prevent the browser from sending the form on its own,
    // because we'll do it using AJAX
    event.preventDefault();
    errorsDiv.innerHTML = "";

    let formData = new FormData(transaccionForm);

    sendTransaccion(formData);
}

function sendTransaccion(formData) {
    authAPI.transaccion(formData)
        .then(() => {
            window.alert("Transacción realizada con éxito");
            window.location.href = "index.html";
        })
        .catch(error => messageRenderer.showErrorMessage(error));
}
