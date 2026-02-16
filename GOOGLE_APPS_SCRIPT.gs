// ============================================
// GOOGLE APPS SCRIPT - PROCESAR FORMULARIOS
// ============================================
// Copia este código en Google Apps Script
// https://script.google.com

// ID del Google Sheet donde guardarás los datos
// Cambiar este valor por el ID de tu hoja
const SHEET_ID = "TU_ID_DE_GOOGLE_SHEET_AQUI";

// Correo para recibir notificaciones
const NOTIFICATION_EMAIL = "nerediarte@gmail.com";

/**
 * Función que recibe datos del formulario y los guarda en Google Sheets
 */
function doPost(e) {
  try {
    // Validar que e y postData existan
    if (!e || !e.postData || !e.postData.contents) {
      Logger.log('⚠️ ERROR: No se recibieron datos POST');
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'Error: No se recibieron datos. El script debe ser llamado desde una solicitud POST válida.'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Obtener los parámetros POST
    const data = JSON.parse(e.postData.contents);
    
    // Validar que SHEET_ID esté configurado
    if (SHEET_ID === "TU_ID_DE_GOOGLE_SHEET_AQUI") {
      throw new Error("SHEET_ID no está configurado. Por favor, actualiza el Google Apps Script con el ID correcto de tu Google Sheet.");
    }
    
    // Obtener la hoja
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    
    // Si es la primera fila, agregar encabezados
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Timestamp',
        'Tipo',
        'Email',
        'Nombre',
        'Mensaje',
        'Cantidad',
        'Fecha',
        'Parroquia',
        'Texto',
        'Subtotal',
        'Producto',
        'Precio'
      ];
      sheet.appendRow(headers);
    }
    
    // Preparar datos para la fila
    const timestamp = new Date().toLocaleString('es-ES');
    const tipo = data.tipo || 'contacto';
    const email = data.email || '';
    const nombre = data.nombre || '';
    const mensaje = data.mensaje || '';
    const cantidad = data.cantidad || '';
    const fecha = data.fecha || '';
    const parroquia = data.parroquia || '';
    const texto = data.texto || '';
    const subtotal = data.subtotal || '';
    const producto = data.producto || '';
    const precio = data.precio || '';
    
    // Agregar fila a la hoja
    const newRow = [
      timestamp,
      tipo,
      email,
      nombre,
      mensaje,
      cantidad,
      fecha,
      parroquia,
      texto,
      subtotal,
      producto,
      precio
    ];
    
    sheet.appendRow(newRow);
    
    // Enviar email de notificación
    enviarEmailNotificacion(data, timestamp);
    
    // Generar número de pedido único
    const orderNumber = 'ORD' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMddHHmmss') + Math.floor(Math.random() * 9000 + 1000);
    
    Logger.log('✓ Formulario procesado correctamente: ' + email);
    
    // Respuesta exitosa
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Datos guardados correctamente',
      order_number: orderNumber
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('❌ Error: ' + error.toString());
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Error al procesar el formulario: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Enviar email de notificación
 */
function enviarEmailNotificacion(data, timestamp) {
  try {
    const tipo = data.tipo || 'contacto';
    let asunto = '';
    let cuerpo = 'Nueva solicitud desde nerediarte.github.io\n\n';
    let cuerpo_fecha = 'Fecha: ' + timestamp + '\n';
    
    if (tipo === 'pedido') {
      asunto = '📦 Nuevo Pedido - ' + (data.nombre || 'Sin nombre');
      cuerpo += 'Tipo: Pedido\n';
      cuerpo += 'Nombre: ' + (data.nombre || '') + '\n';
      cuerpo += 'Email: ' + (data.email || '') + '\n';
      cuerpo += 'Cantidad: ' + (data.cantidad || '') + '\n';
      cuerpo += 'Fecha Evento: ' + (data.fecha || '') + '\n';
      cuerpo += 'Parroquia: ' + (data.parroquia || '') + '\n';
      cuerpo += 'Texto: ' + (data.texto || '') + '\n';
      cuerpo += 'Subtotal: €' + (data.subtotal || '0') + '\n';
      cuerpo += 'Producto: ' + (data.producto || '') + '\n';
      cuerpo += 'Precio: €' + (data.precio || '0') + '\n';
    } else {
      asunto = '💬 Nuevo Mensaje de Contacto - ' + (data.nombre || 'Sin nombre');
      cuerpo += 'Tipo: Contacto\n';
      cuerpo += 'Email: ' + (data.email || '') + '\n';
      cuerpo += 'Nombre: ' + (data.nombre || '') + '\n';
      cuerpo += 'Mensaje: ' + (data.mensaje || '') + '\n';
    }
    
    cuerpo += cuerpo_fecha + '\n';
    cuerpo += '---\nResponde directamente a este email para ponerte en contacto.';
    
    // Enviar email
    MailApp.sendEmail(
      NOTIFICATION_EMAIL,
      asunto,
      cuerpo,
      {
        replyTo: data.email || NOTIFICATION_EMAIL
      }
    );
  } catch (error) {
    Logger.log('⚠️ Error al enviar email: ' + error.toString());
  }
}

/**
 * Función para obtener que el script está funcionando (para testing)
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'ok',
    message: 'Google Apps Script está funcionando correctamente. Use POST para enviar datos.',
    note: 'Asegúrate de haber configurado SHEET_ID y NOTIFICATION_EMAIL correctamente.'
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Función para probar el script sin datos POST
 * Descomenta esta función si necesitas probar el script desde el editor
 */
function testScript() {
  const testData = {
    tipo: 'contacto',
    email: 'test@example.com',
    nombre: 'Test User',
    mensaje: 'Este es un mensaje de prueba'
  };
  
  // Llamar a doPost simulando una solicitud válida
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  Logger.log('Resultado de prueba: ' + result.getContent());
}
