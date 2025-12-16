/**
 * Modal para visualización de imágenes en grande
 * Archivo: modal.js
 */

// Modal functionality - VERSIÓN MEJORADA
function openModal(imgElement) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.querySelector('.close-modal');
    const productName = imgElement.alt || imgElement.getAttribute('data-product') || 'Producto AMICI';
    
    // Establecer imagen en el modal
    modalImg.src = imgElement.src;
    modalImg.alt = productName;
    
    // Bloquear scroll del body
    document.body.style.overflow = 'hidden';
    
    // Forzar reflow para asegurar que la animación funcione
    void modal.offsetWidth;
    
    // Mostrar modal con animación
    modal.classList.add('active');
    
    // Enfocar el botón de cerrar para accesibilidad
    setTimeout(() => {
        if (closeBtn) closeBtn.focus();
    }, 100);
    
    console.log('Modal abierto:', productName);
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    
    console.log('Cerrando modal...');
    
    // Remover clase active para ocultar con animación
    modal.classList.remove('active');
    
    // Limpiar imagen después de la animación
    setTimeout(() => {
        modalImg.src = '';
        modalImg.alt = '';
        document.body.style.overflow = 'auto'; // Restaurar scroll
    }, 300);
}

// Inicializar funcionalidad del modal
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('imageModal');
    const closeBtn = document.querySelector('.close-modal');
    
    console.log('Modal.js cargado');
    
    // 1. Cerrar modal con el botón X
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Clic en botón X');
            closeModal();
        });
    }
    
    // 2. Cerrar modal haciendo clic fuera de la imagen
    modal.addEventListener('click', function(e) {
        console.log('Clic en overlay');
        // Solo cerrar si se hace clic en el overlay (no en la imagen o contenido)
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // 3. Cerrar con tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            console.log('Tecla ESC presionada');
            closeModal();
        }
    });
    
    // 4. Configurar eventos para imágenes existentes
    setTimeout(() => {
        setupImageModalListeners();
    }, 500);
});

// Función para agregar eventos click a las imágenes
function setupImageModalListeners() {
    const productImages = document.querySelectorAll('.product-img');
    console.log('Configurando listeners para', productImages.length, 'imágenes');
    
    productImages.forEach(img => {
        // Remover cualquier listener anterior
        img.removeEventListener('click', handleImageClick);
        
        // Agregar nuevo listener
        img.addEventListener('click', handleImageClick);
        
        // Asegurar que tenga cursor pointer
        img.style.cursor = 'zoom-in';
    });
}

function handleImageClick() {
    console.log('Clic en imagen:', this.alt);
    openModal(this);
}

// Función para configurar una imagen específica
function setupImageModal(imgElement) {
    if (!imgElement) return;
    
    imgElement.addEventListener('click', function() {
        openModal(this);
    });
    
    imgElement.style.cursor = 'zoom-in';
}

// Función para configurar todas las imágenes de la página
function setupAllImageModals() {
    setupImageModalListeners();
}

// Exportar funciones para uso global
window.modalFunctions = {
    openModal,
    closeModal,
    setupImageModalListeners,
    setupAllImageModals,
    setupImageModal
};

// También exponer funciones globalmente para fácil acceso
window.openImageModal = openModal;
window.closeImageModal = closeModal;