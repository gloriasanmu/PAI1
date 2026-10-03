"use strict";

import { sessionManager } from './utils/session.js';
import { messageRenderer } from './renderers/messages.js';
import { usersAPI } from './api/users.js';

// DOM elements that we will use
const profileCont = document.getElementById("employee");


// Main function that will run when the page is ready
async function main() {
    if (!sessionManager.isLogged()) {
        messageRenderer.showErrorMessage("Inicia sesión para ver tu perfil.");
        return;
    }

    try {
        const user = await usersAPI.getCurrent();
        if (!user) {
            throw new Error("No se encontraron los datos del usuario.");
        }

        renderProfile(user);
    } catch (error) {
        messageRenderer.showErrorMessage(error.message || "Error al cargar el perfil.");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    main();
});

function renderProfile(user) {
    const profile = document.createElement("ul");
    profile.className = "list-group list-group-flush";

    const name = document.createElement("li");
    name.className = "list-group-item";
    name.textContent = `Nombre: ${user.username}`;

    const money = document.createElement("li");
    money.className = "list-group-item";
    money.textContent = `Dinero: ${Number(user.money ?? 0).toFixed(2)} €`;

    profile.append(name, money);
    profileCont.appendChild(profile);
}