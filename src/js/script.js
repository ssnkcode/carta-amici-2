// Cargar productos desde JSON y mostrar en la página
document.addEventListener('DOMContentLoaded', function() {
    cargarProductos();
    inicializarEventos();
    // Inicializar listeners del modal después de cargar el DOM
    if (window.modalFunctions && window.modalFunctions.setupImageModalListeners) {
        // Se ejecutará después de cargar productos
        setTimeout(() => {
            window.modalFunctions.setupImageModalListeners();
        }, 100);
    }
});

async function cargarProductos() {
    try {
        const response = await fetch('./src/productos/products.json');
        const data = await response.json();
        mostrarProductos(data.productos);
    } catch (error) {
        console.error('Error cargando productos:', error);
        mostrarProductosPorDefecto();
    }
}

function mostrarProductos(categorias) {
    const contenedor = document.getElementById('menu-categories');
    contenedor.innerHTML = '';

    categorias.forEach(categoria => {
        const categoriaHTML = crearCategoriaHTML(categoria);
        contenedor.appendChild(categoriaHTML);
    });

    // Re-aplicar observador a las nuevas secciones
    aplicarEfectoScroll();
    
    // IMPORTANTE: Configurar los listeners del modal después de mostrar productos
    setTimeout(() => {
        if (window.modalFunctions && window.modalFunctions.setupImageModalListeners) {
            window.modalFunctions.setupImageModalListeners();
        }
    }, 100);
}

function crearCategoriaHTML(categoria) {
    const categoriaDiv = document.createElement('div');
    categoriaDiv.className = 'category-section';
    
    // Iconos por categoría
    const iconos = {
        'EMPANADAS': 'fas fa-pie-chart',
        'HAMBURGUESAS': 'fas fa-hamburger',
        'PIZZAS': 'fas fa-pizza-slice',
        'SÁNDWICHES': 'fas fa-bread-slice'
    };
    
    const icono = iconos[categoria.categoria] || 'fas fa-utensils';
    
    categoriaDiv.innerHTML = `
        <div class="category-header">
            <h3 class="category-title"><i class="${icono} category-icon"></i> ${categoria.categoria}</h3>
        </div>
        <p class="category-description">${obtenerDescripcionCategoria(categoria.categoria)}</p>
        <div class="items-grid">
            ${categoria.items.map(item => crearItemHTML(item)).join('')}
        </div>
    `;
    
    return categoriaDiv;
}

function crearItemHTML(item) {
    let badges = '';
    if (item.promocion) {
        badges += '<span class="promo-badge">PROMO</span>';
    }
    if (item.especialidad) {
        badges += '<span class="promo-badge especialidad-badge">ESPECIALIDAD</span>';
    }
    
    // MODIFICACIÓN: Agregar data-product attribute a la imagen
    return `
        <div class="menu-item">
            <div class="item-image">
                <img src="${item.imagen}" 
                     alt="${item.nombre}" 
                     class="product-img" 
                     data-product="${item.nombre}"
                     onerror="this.src='./assets/logo/logo.png'">
            </div>
            <div class="item-header">
                <span class="item-name">${item.nombre}</span>
                <span class="item-price">${item.precio}</span>
            </div>
            <p class="item-description">${item.descripcion}</p>
            ${badges}
        </div>
    `;
}

function obtenerDescripcionCategoria(categoria) {
    const descripciones = {
        'EMPANADAS': 'Nuestras empanadas son preparadas con masa casera y los mejores ingredientes.',
        'HAMBURGUESAS': 'Hamburguesas jugosas con ingredientes frescos y de calidad.',
        'PIZZAS': 'Pizzas recién horneadas con ingredientes seleccionados.',
        'SÁNDWICHES': 'Sándwiches generosos con ingredientes frescos y de calidad.'
    };
    return descripciones[categoria] || 'Productos de alta calidad preparados con esmero.';
}

function mostrarProductosPorDefecto() {
    const productosPorDefecto = [
        {
            categoria: "EMPANADAS",
            items: [
                {
                    nombre: "Empanadas Saladas",
                    precio: "$11.000",
                    descripcion: "Deliciosas empanadas saladas con el mejor relleno tradicional.",
                    imagen: "./assets/logo/logo.png"
                }
            ]
        }
    ];
    mostrarProductos(productosPorDefecto);
}

function inicializarEventos() {
    // Eventos para botones de PDF
    document.querySelectorAll('.pdf-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Verificar que el PDF exista
            const pdfPath = this.getAttribute('href');
            if (pdfPath.includes('carta_amici_ultima_Ale.pdf')) {
                // Simular descarga
                setTimeout(() => {
                    showNotification('La carta se está descargando...', 'info');
                }, 500);
            }
        });
    });

    // Efecto de desplazamiento suave para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Efecto de aparición para las secciones al hacer scroll
function aplicarEfectoScroll() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Aplicar observador a las secciones del menú
    document.querySelectorAll('.category-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(section);
    });
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    // Verificar si ya existe una notificación
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        document.body.removeChild(existingNotification);
    }
    
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-${type === 'info' ? 'info-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Estilos para la notificación
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #000000;
        color: #FFD700;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 2001;
        display: flex;
        align-items: center;
        gap: 8px;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.5s ease;
        max-width: 300px;
        border: 2px solid #FFD700;
        font-family: 'Poppins', sans-serif;
    `;
    
    document.body.appendChild(notification);
    
    // Mostrar notificación
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    }, 10);
    
    // Ocultar y eliminar después de 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 500);
    }, 3000);
}

// NUEVA FUNCIÓN: Configurar imagen para modal
function setupImageModal(imgElement, product) {
    imgElement.setAttribute('data-product', product.nombre);
    
    // Asegurar que tenga la clase correcta
    if (!imgElement.classList.contains('product-img')) {
        imgElement.classList.add('product-img');
    }
    
    // Configurar cursor
    imgElement.style.cursor = 'zoom-in';
    
    // Agregar evento click
    imgElement.addEventListener('click', function() {
        if (window.modalFunctions && window.modalFunctions.openModal) {
            window.modalFunctions.openModal(this);
        }
    });
}

// Función para configurar listeners de imágenes después de cargar
function setupAllImageModals() {
    const productImages = document.querySelectorAll('.product-img');
    productImages.forEach(img => {
        if (!img.hasAttribute('data-product')) {
            img.setAttribute('data-product', img.alt || 'Producto AMICI');
        }
        
        img.addEventListener('click', function() {
            if (window.modalFunctions && window.modalFunctions.openModal) {
                window.modalFunctions.openModal(this);
            }
        });
    });
}

// Exportar funciones para el modal
if (typeof window.modalFunctions === 'undefined') {
    window.modalFunctions = {};
}
window.modalFunctions.setupAllImageModals = setupAllImageModals;