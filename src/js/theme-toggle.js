/**
 * Sistema de cambio de tema claro/oscuro
 * Archivo: theme-toggle.js
 */

document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeBtn = document.querySelector('.mobile-theme-btn');
    const body = document.body;
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    // Verificar tema guardado o preferencia del sistema
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Aplicar tema inicial
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        enableDarkMode();
    } else {
        enableLightMode();
    }
    
    // Toggle tema desde botón principal
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Toggle tema desde botón móvil
    if (mobileThemeBtn) {
        mobileThemeBtn.addEventListener('click', function() {
            toggleTheme();
            // Cerrar menú móvil después de cambiar tema
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
            }
        });
    }
    
    // Toggle menú móvil
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            // Cambiar icono del menú
            const icon = menuToggle.querySelector('i');
            if (mobileMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(event) {
            if (!menuToggle.contains(event.target) && !mobileMenu.contains(event.target)) {
                mobileMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
    
    function toggleTheme() {
        if (body.classList.contains('dark-mode')) {
            enableLightMode();
        } else {
            enableDarkMode();
        }
    }
    
    function enableDarkMode() {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
        updateThemeButton('dark');
    }
    
    function enableLightMode() {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
        updateThemeButton('light');
    }
    
    function updateThemeButton(theme) {
        const buttons = [themeToggle, mobileThemeBtn];
        buttons.forEach(btn => {
            if (btn) {
                const icon = btn.querySelector('i');
                const text = btn.querySelector('.theme-text, span');
                
                if (theme === 'dark') {
                    if (icon) {
                        icon.classList.remove('fa-moon');
                        icon.classList.add('fa-sun');
                    }
                    if (text) {
                        text.textContent = 'Modo Claro';
                    }
                } else {
                    if (icon) {
                        icon.classList.remove('fa-sun');
                        icon.classList.add('fa-moon');
                    }
                    if (text) {
                        text.textContent = 'Modo Oscuro';
                    }
                }
            }
        });
    }
    
    // Detectar cambios en la preferencia del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                enableDarkMode();
            } else {
                enableLightMode();
            }
        }
    });
});