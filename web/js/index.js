"use strict";

import { sessionManager } from './utils/session.js';

import { employeesAPI_auto } from '/js/api/_employees.js';
import { departmentsAPI_auto } from '/js/api/_departments.js';

import { employeeRenderer } from '/js/renderers/employees.js';
import { departmentRenderer } from '/js/renderers/departments.js';
import { messageRenderer } from '/js/renderers/messages.js';

// DOM elements that we will use
const employeesCont = document.getElementById("employees");
const departmentsCont = document.getElementById("departments");
const newDpmtButton = document.getElementById("new-dpmt-button");

// Main function that will run when the page is ready
function main() {
    // Hide the options that shouldnt be available for not logged users
    setLoggedOptions();

    // Load the employees
    loadEmployees();
    
    // Load the departments
    loadDepartments();
    
}

document.addEventListener("DOMContentLoaded", () => {
    loadUsers();
});

async function loadUsers() {
    const container = document.getElementById("users-container");

    try {
        // Petición GET al endpoint de Silence para obtener los usuarios
        const response = await fetch("/api/v1/users");
        
        if (!response.ok) {
            throw new Error("Error al obtener los usuarios");
        }

        const users = await response.json();

        // Limpiar el contenedor antes de renderizar
        container.innerHTML = "";

        if (users.length === 0) {
            container.innerHTML = "<p class='text-muted'>No hay usuarios registrados.</p>";
            return;
        }

        // Generar un cuadradito (Card) por cada usuario
        users.forEach(user => {
            const userCard = `
                <div class="col">
                    <div class="card h-100 shadow-sm border-primary">
                        <div class="card-body text-center">
                            <div class="mb-3">
                                <i class="bi bi-person-circle display-4 text-primary"></i>
                            </div>
                            <h5 class="card-title fw-bold">${escapeHtml(user.username)}</h5>
                            <hr>
                            <p class="card-text text-muted mb-1">Saldo disponible</p>
                            <span class="badge bg-success fs-5">
                                ${parseFloat(user.money || 0).toFixed(2)} €
                            </span>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += userCard;
        });

    } catch (error) {
        console.error("Error:", error);
        container.innerHTML = `
            <div class="alert alert-danger w-100" role="alert">
                Hubo un problema al cargar los usuarios.
            </div>
        `;
    }
}

// Función auxiliar para evitar ataques XSS
function escapeHtml(text) {
    const div = document.createElement("div");
    div.innerText = text;
    return div.innerHTML;
}