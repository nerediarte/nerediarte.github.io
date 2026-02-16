/**
 * DIAGNÓSTICO - Google Apps Script
 * 
 * Copia y pega este código en la consola del navegador (F12 > Console)
 * para verificar si el Google Apps Script está funcionando correctamente
 */

async function diagnosticoFormulario() {
  console.log('🔍 Iniciando diagnóstico del formulario...\n');
  
  // Verificar que sheets-form.js está cargado
  if (typeof initializeForms === 'undefined') {
    console.error('❌ ERROR: sheets-form.js no está cargado');
    console.log('Solución: Asegúrate de agregar <script src="js/sheets-form.js"></script> antes de cerrar </body>');
    return;
  }
  console.log('✓ sheets-form.js está cargado correctamente');
  
  // Verificar que GOOGLE_APPS_SCRIPT_URL está configurado
  if (typeof GOOGLE_APPS_SCRIPT_URL === 'undefined') {
    console.error('❌ ERROR: GOOGLE_APPS_SCRIPT_URL no está definido');
    return;
  }
  console.log('✓ GOOGLE_APPS_SCRIPT_URL está definido');
  console.log('  URL: ' + GOOGLE_APPS_SCRIPT_URL);
  
  // Verificar si la URL es la predeterminada
  if (GOOGLE_APPS_SCRIPT_URL.includes('TU_URL_GOOGLE_APPS_SCRIPT_AQUI')) {
    console.warn('⚠️  ADVERTENCIA: Aún usas la URL de prueba');
    console.log('  Debes reemplazarla con tu URL real de Google Apps Script');
    return;
  }
  
  // Probar conexión con Google Apps Script
  console.log('\n📡 Pruebando conexión con Google Apps Script...');
  
  try {
    const testData = {
      tipo: 'contacto',
      email: 'test@example.com',
      nombre: 'Test',
      mensaje: 'Mensaje de prueba'
    };
    
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    console.log('✓ Conexión establecida correctamente');
    console.log('  Status: ' + response.status);
    console.log('  Type: ' + response.type);
    
  } catch (error) {
    console.error('❌ ERROR en la conexión: ' + error.message);
    console.log('Solución: Verifica que:');
    console.log('1. La URL de Google Apps Script esté completa y correcta');
    console.log('2. El Google Apps Script esté publicado como "Aplicación web"');
    console.log('3. Los permisos estén autorizados');
  }
  
  // Verificar formularios en la página
  console.log('\n📝 Buscando formularios en la página...');
  const forms = document.querySelectorAll('form[action="procesar_formulario.php"]');
  console.log('  Formularios encontrados: ' + forms.length);
  
  forms.forEach((form, index) => {
    console.log(`\n  Formulario ${index + 1}:`);
    console.log('    ID: ' + (form.id || 'sin ID'));
    console.log('    data-type: ' + (form.dataset.type || 'no especificado'));
    
    const fields = form.querySelectorAll('input, textarea, select');
    console.log('    Campos: ' + fields.length);
    fields.forEach(field => {
      console.log('      - ' + field.name + ' (' + field.type + ')');
    });
  });
  
  console.log('\n✅ Diagnóstico completado');
  console.log('Si todo aparece correcto, los formularios deberían funcionar correctamente.');
}

// Ejecutar diagnóstico
console.log('%c=== DIAGNÓSTICO DE FORMULARIOS NEREDIARTE ===', 'font-size: 14px; font-weight: bold; color: #4b5745;');
diagnosticoFormulario();
