/**
 * polyfills.js
 * Proporciona versiones vacías de funciones jQuery que no estamos usando
 * para evitar errores "is not a function"
 */

(function($) {
  // Polyfill para slick (carousel)
  if (!$.fn.slick) {
    $.fn.slick = function(options) {
      console.warn('Slick carousel no está disponible, pero se ha llamado.');
      return this;
    };
  }

  // Polyfill para meanmenu (menú responsivo)
  if (!$.fn.meanmenu) {
    $.fn.meanmenu = function(options) {
      // Simplemente hacer nada si meanmenu no está disponible
      return this;
    };
  }

  // Polyfill para fancybox si es necesario
  if (!$.fn.fancybox) {
    $.fn.fancybox = function(options) {
      console.warn('Fancybox no está disponible.');
      return this;
    };
  }
})(jQuery || {});

// Silenciar errores de tracking.js
window.tracking = {};
console.log('Polyfills jQuery cargados correctamente');
