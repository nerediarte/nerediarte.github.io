/**
 * sheets-form.js
 * Maneja el envío de formularios a Google Sheets vía Google Apps Script
 * 
 * Uso:
 * <form id="miFormulario" class="contact-form">
 *   <input type="email" name="email" required>
 *   <input type="text" name="nombre">
 *   <textarea name="mensaje"></textarea>
 *   <button type="submit">Enviar</button>
 * </form>
 */

// URL del Google Apps Script publicado
// CAMBIAR ESTO POR TU URL DE GOOGLE APPS SCRIPT
window.GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx9y8OQs93LLV8MKZ9nzxlG5WZwxEIsJmGmwUmzzH29OQz97iTmuuibHtoX09klH6vbNg/exec";
const GOOGLE_APPS_SCRIPT_URL = window.GOOGLE_APPS_SCRIPT_URL;

/**
 * Inicializar todos los formularios en la página
 */
function initializeForms() {
  // Encontrar todos los formularios con action="procesar_formulario.php"
  const forms = document.querySelectorAll('form[action="procesar_formulario.php"]');
  
  forms.forEach((form, index) => {
    form.id = form.id || `form-${index}`;
    
    // Prevenir la acción de envío por defecto
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      submitForm(form);
    });
  });
}

/**
 * Enviar un formulario a Google Sheets
 */
async function submitForm(form) {
  try {
    // Mostrar indicador de carga
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<img src="images/loading.gif" alt="Enviando..."> Enviando...';
    
    // Recopilar datos del formulario
    const formData = new FormData(form);
    const data = {
      tipo: form.dataset.type || 'contacto', // 'contacto' o 'pedido'
      timestamp: new Date().toISOString()
    };
    
    // Agregar campos del formulario
    for (let [key, value] of formData.entries()) {
      data[key] = value || '';
    }
    
    // Validar email
    if (!data.email || !isValidEmail(data.email)) {
      throw new Error('Por favor, ingresa un email válido.');
    }
    
    // Validar según el tipo de formulario
    if (data.tipo === 'pedido') {
      if (!data.nombre) throw new Error('Por favor, ingresa tu nombre.');
    } else if (data.tipo === 'contacto') {
      if (!data.email) throw new Error('Por favor, ingresa tu email.');
      if (!data.mensaje) throw new Error('Por favor, escribe un mensaje.');
    }
    
    // Enviar a Google Apps Script
    const response = await fetch(window.GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Necesario para CORS
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    // Mostrar mensaje de éxito
    showSuccessMessage(form);
    
    // Limpiar formulario
    form.reset();
    
    // Restaurar botón
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonText;
    
    // Log
    console.log('Formulario enviado exitosamente:', data);
    
  } catch (error) {
    console.error('Error al enviar formulario:', error);
    showErrorMessage(form, error.message);
    
    // Restaurar botón
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = false;
  }
}

/**
 * Validar formato de email
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Mostrar mensaje de éxito
 */
function showSuccessMessage(form) {
  // Eliminar mensajes previos
  const existingMessage = form.parentElement.querySelector('.form-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Crear y mostrar mensaje
  const messageDiv = document.createElement('div');
  messageDiv.className = 'form-message success-message';
  messageDiv.innerHTML = `
    <div class="alert alert-success" role="alert">
      ✓ ¡Mensaje enviado correctamente!
      <br>
      <small>Te contactaremos en menos de 24 horas.</small>
    </div>
  `;
  
  form.parentElement.insertBefore(messageDiv, form);
  
  // Desaparecer después de 5 segundos
  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}

/**
 * Mostrar mensaje de error
 */
function showErrorMessage(form, errorMessage) {
  // Eliminar mensajes previos
  const existingMessage = form.parentElement.querySelector('.form-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Crear y mostrar mensaje
  const messageDiv = document.createElement('div');
  messageDiv.className = 'form-message error-message';
  messageDiv.innerHTML = `
    <div class="alert alert-danger" role="alert">
      ✗ Error: ${errorMessage}
      <br>
      <small>Por favor, intenta de nuevo o contacta a <a href="mailto:nerediarte@gmail.com">nerediarte@gmail.com</a></small>
    </div>
  `;
  
  form.parentElement.insertBefore(messageDiv, form);
  
  // Desaparecer después de 8 segundos
  setTimeout(() => {
    messageDiv.remove();
  }, 8000);
}

/**
 * Ejecutar cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', function() {
  // Verificar que la URL de Google Apps Script está configurada
  console.log('✓ sheets-form.js cargado correctamente');
  console.log('  URL: ' + window.GOOGLE_APPS_SCRIPT_URL);
  
  if (window.GOOGLE_APPS_SCRIPT_URL === "TU_URL_GOOGLE_APPS_SCRIPT_AQUI") {
    console.warn('⚠️ ADVERTENCIA: Debes configurar GOOGLE_APPS_SCRIPT_URL en sheets-form.js');
    console.warn('Reemplaza "TU_URL_GOOGLE_APPS_SCRIPT_AQUI" con la URL de tu Google Apps Script publicado.');
  }
  
  // Inicializar formularios
  initializeForms();
});

/**
 * Helper: Obtener datos de un formulario como objeto
 */
function getFormDataAsObject(form) {
  const formData = new FormData(form);
  const obj = {};
  for (let [key, value] of formData.entries()) {
    obj[key] = value;
  }
  return obj;
}
