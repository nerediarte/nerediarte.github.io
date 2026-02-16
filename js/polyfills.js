/**
 * polyfills.js
 * Proporciona versiones vacías de funciones jQuery que no estamos usando
 * para evitar errores "is not a function"
 */

// Esperar a que jQuery esté completamente cargado
function initializePolyfills() {
  if (typeof jQuery === 'undefined' || typeof $ === 'undefined') {
    // jQuery aún no está cargado, reintentar en 100ms
    setTimeout(initializePolyfills, 100);
    return;
  }

  // Polyfill para slick (carousel)
  if (!$.fn.slick) {
    $.fn.slick = function(options) {
      console.warn('⚠️ Slick carousel no está disponible, pero se ha llamado.');
      return this;
    };
  }

  // Polyfill para meanmenu (menú responsivo)
  if (!$.fn.meanmenu) {
    $.fn.meanmenu = function(options) {
      console.warn('⚠️ Meanmenu no está disponible, pero se ha llamado.');
      return this;
    };
  }

  // Polyfill para fancybox si es necesario
  if (!$.fn.fancybox) {
    $.fn.fancybox = function(options) {
      console.warn('⚠️ Fancybox no está disponible, pero se ha llamado.');
      return this;
    };
  }

  console.log('✓ Polyfills jQuery cargados correctamente');
}

// Iniciar polyfills
initializePolyfills();

// Silenciar errores de tracking.js
window.tracking = {};
