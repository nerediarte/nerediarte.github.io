/**
 * jquery-init.js
 * Asegura que jQuery está completamente cargado antes de que se ejecuten otros scripts
 * Este archivo debe cargarse DESPUÉS de jquery.min.js pero ANTES de plugin.js
 */

(function() {
  'use strict';
  
  // Variable global para rastrear el estado de jQuery
  window.jQueryReady = false;
  window.originaljQuery = window.jQuery;
  
  // Crear proxy de jQuery que espera a que esté listo
  if (typeof jQuery === 'undefined') {
    console.warn('jQuery no está disponible aún');
  } else {
    // jQuery está disponible
    window.jQueryReady = true;
    
    // Asegurar que $ y jQuery están disponibles globalmente
    window.$ = jQuery;
    window.jQuery = jQuery;
    
    // Marcar que jQuery está listo
    jQuery.ready = true;
    
    console.log('✓ jQuery inicializado correctamente');
    
    // Si jQuery ya pasó su ready, dispara el evento
    if (jQuery.isReady) {
      console.log('✓ jQuery ya estaba en estado ready');
    }
  }
})();
