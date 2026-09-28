"use strict";

import { sessionManager } from './utils/session.js';

// DOM elements that we will use
const userLink = document.getElementById("showUsername");
const logoutButton = document.getElementById("logout-button");
const profileButton = document.getElementById("profile-button");
const headerLogin = document.getElementById("header-login");
const headerLogout = document.getElementById("header-logout");
const headerProfile = document.getElementById("header-profile");

function main() {
    showUser();
    addLogoutHandler();
    hideHeaderOptions();
}

document.addEventListener("DOMContentLoaded", function () {
    main();
});

///////////////////////////////////////////////////////////////////////////////

function showUser() {
    // Greet the user in the navbar
    let loggedUser = sessionManager.getLoggedUser();
    let username = loggedUser !== null ? loggedUser.firstName : "Guest";
    userLink.textContent = "Hi, " + username;
}

function addLogoutHandler() {
    // Assign the "Logout" link to the session logout() function
    logoutButton.addEventListener("click", function () {
        sessionManager.logout();
        window.location.href = "index.html";
    });
}

function hideHeaderOptions() {
    // Hide the appropriate options
    if (sessionManager.isLogged()) {
        headerLogin.style.display = "none";
    } else {
        headerLogout.style.display = "none";
        headerProfile.style.display = "none";
    }
}