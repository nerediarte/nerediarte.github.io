# 📊 Guía de Configuración: Google Sheets + Google Apps Script

Esta guía te ayudará a configurar tu sistema de formularios para usar Google Sheets como base de datos.

---

## PASO 1: Crear una Google Sheet

1. Ve a [Google Sheets](https://sheets.google.com)
2. Clic en **"+ Crear una nueva hoja de cálculo"**
3. Nómbrala algo como **"Pedidos nereediarte"** o **"Formularios Nerediarte"**
4. Abre la hoja y **copia el ID de la URL**
   - La URL se ve así: `https://docs.google.com/spreadsheets/d/AQUI_VA_TU_ID/edit`
   - El ID está entre `/d/` y `/edit`

**Ejemplo:** Si tu URL es:
```
https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j/edit
```
Tu ID es: `1a2b3c4d5e6f7g8h9i0j`

---

## PASO 2: Crear el Google Apps Script

1. Ve a [Google Apps Script](https://script.google.com)
2. Clic en **"+ Nuevo proyecto"**
3. Nómbralo **"Formularios Nerediarte"**
4. En el editor, elimina todo el código que viene por defecto
5. **Copia y pega el contenido del archivo** `GOOGLE_APPS_SCRIPT.gs` (que está en tu proyecto)
6. Modifica estas dos líneas al inicio del script:

```javascript
// Línea 5: Reemplaza con el ID que copiaste en el Paso 1
const SHEET_ID = "AQUI_VA_TU_ID_DE_GOOGLE_SHEET";

// Línea 8: Tu email de contacto (puede ser el mismo de Google)
const NOTIFICATION_EMAIL = "nerediarte@gmail.com";
```

7. Clic en **"Guardar"** (Ctrl+S)
   - Dale un nombre al proyecto si aparece un diálogo

8. **IMPORTANTE - Para probar el script:**
   - Busca la función `testScript()` al final del código
   - Selecciona `testScript` en el menú desplegable (donde dice "Seleccionar función")
   - Clic en **"Ejecutar"**
   - Esto enviará datos de prueba sin errores
   - Si prefieres, puedes ejecutar directamente `doPost` pero no es necesario (solo genera error esperado)

9. Autoriza los permisos:
   - Aparecerá un pedido de permisos, autoriza el acceso a Google Sheets y al email

---

## PASO 3: Publicar el Google Apps Script

1. Ve al menú **"Implementación"** (o **"Deploy"** si está en inglés)
2. Clic en **"Crear implementación"** o **"New Deployment"**
3. En "Tipo", selecciona **"Aplicación web"**
4. Configura:
   - **Ejecutar como**: Tu cuenta de Google
   - **Quién tiene acceso**: Cualquiera (Anyone)
5. Clic en **"Desplegar"** o **"Deploy"**
6. **IMPORTANTE**: Se mostrará una URL como esta:
```
https://script.google.com/macros/d/AQUI_VA_UN_ID_LARGO/usercontent
```

**Copia esta URL completa** - la necesitas en el siguiente paso.

---

## PASO 4: Actualizar tu archivo JavaScript

1. Abre el archivo `js/sheets-form.js` en tu editor
2. Busca esta línea (aproximadamente línea 10):
```javascript
const GOOGLE_APPS_SCRIPT_URL = "TU_URL_GOOGLE_APPS_SCRIPT_AQUI";
```
3. Reemplázala con la URL que copiaste en el Paso 3:
```javascript
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/d/AQUI_VA_UN_ID_LARGO/usercontent";
```
4. **Guarda el archivo**

---

## PASO 5: Actualizar los formularios HTML

En los archivos HTML donde tengas formularios (`shop.html`, `recordatorio.html`, `producto.html`, etc.), necesitas:

1. **Agregar el atributo `data-type`** a los formularios para especificar qué tipo son:

Para formularios de **contacto**:
```html
<form id="contactForm" class="contact-form" data-type="contacto">
  <input type="email" name="email" required>
  <textarea name="mensaje" required></textarea>
  <button type="submit">Enviar</button>
</form>
```

Para formularios de **pedido**:
```html
<form id="orderForm" class="order-form" data-type="pedido">
  <input type="text" name="nombre" required>
  <input type="email" name="email" required>
  <input type="text" name="cantidad">
  <input type="text" name="fecha">
  <input type="text" name="parroquia">
  <input type="text" name="texto">
  <button type="submit">Enviar</button>
</form>
```

2. **Agregar el script** al final del `<body>` en los archivos HTML:

```html
<script src="js/sheets-form.js"></script>
```

---

## PASO 6: Probar los Formularios

1. Abre tu sitio web en el navegador: https://nerediarte.github.io
2. Abre la consola del navegador (F12 > Console)
3. **Para diagnosticar**, copia y ejecuta este código en la consola (line by line):

```javascript
// Primero verifica si todo está configurado
console.log('Google Apps Script URL:', GOOGLE_APPS_SCRIPT_URL);

// Luego intenta enviar un formulario
const testData = {
  tipo: 'contacto',
  email: 'tuEmail@ejemplo.com',
  nombre: 'Tu Nombre',
  mensaje: 'Mensaje de prueba'
};

fetch('TU_URL_AQUI', {
  method: 'POST',
  mode: 'no-cors',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify(testData)
}).then(() => console.log('✓ Enviado!')).catch(err => console.error('❌ Error:', err));
```

4. Completa y envía un formulario desde tu sitio
5. Dentro de 1-2 segundos, deberías ver un mensaje de confirmación
6. **Verifica en tu Google Sheet**: Los datos deberían aparecer en una nueva fila
7. **Verifica tu email**: Deberías recibir un email de notificación

---

## ¿Qué sucede cuando se envía un formulario?

1. ✓ Los datos se guardan automáticamente en tu Google Sheet
2. ✓ Se envía un email de notificación a `nerediarte@gmail.com`
3. ✓ El usuario recibe una confirmación visual de que su mensaje fue enviado

---

## Campos que se capturan

**Para formularios de CONTACTO:**
- email (requerido)
- nombre
- mensaje (requerido)

**Para formularios de PEDIDO:**
- email (requerido)
- nombre (requerido)
- cantidad
- fecha (fecha del evento)
- parroquia
- texto
- producto
- precio
- subtotal

---

## Solución de problemas

### "TypeError: Cannot read properties of undefined (reading 'postData')"
- **Esto es NORMAL**: Este error aparece si ejecutas directamente la función `doPost` sin enviar datos POST reales
- **Solución - Forma correcta de probar el script**:
  1. En el editor de Google Apps Script, busca la función `testScript()` al final del archivo
  2. En el menú desplegable (que dice "Seleccionar función"), cambia a `testScript`
  3. Clic en "Ejecutar"
  4. Deberías ver en "Ejecuciones recientes" que se completó correctamente
  5. Si completó, significa que el script está funcionando bien
- El script funcionará perfectamente cuando reciba datos reales desde tu sitio web
- **NO es necesario ejecutar directamente `doPost`** - eso siempre genera error si no hay datos

### "Error: SHEET_ID no está configurado"
- Significa que olvidaste reemplazar `SHEET_ID` en el Google Apps Script
- Ve a la línea 8 del Google Apps Script
- Reemplaza `"TU_ID_DE_GOOGLE_SHEET_AQUI"` con el ID real de tu Google Sheet

- Asegúrate de haber copiado correctamente la URL del Paso 3
- Verifica que esté actualizado en `js/sheets-form.js`

### Los datos no aparecen en Google Sheets
- Verifica que el `SHEET_ID` esté correcto en el Google Apps Script
- Asegúrate de haber autorizado permisos cuando ejecutaste el script
- Abre la consola del navegador (F12) y busca errores

### No recibo emails
- Verifica que `NOTIFICATION_EMAIL` esté correcto en el Google Apps Script
- Revisa la carpeta de spam
- Asegúrate de haber autorizado permisos de email al ejecutar el script

### CORS Error en la consola
- Esto es normal con `mode: 'no-cors'`
- No impide que funcione el formulario

---

## Preguntas frecuentes

**¿Mis datos son privados?**
Sí, solo tú tienes acceso a tu Google Sheet. La URL del Google Apps Script es pública pero no hace nada sin los datos correctos del formulario.

**¿Puedo cambiar los campos del formulario?**
Sí, puedes agregar más campos `<input>` en los formularios HTML. El script captura automáticamente cualquier campo con atributo `name`.

**¿Cuántos formularios puedo tener?**
Ilimitados. El script detecta automáticamente todos los formularios con `action="procesar_formulario.php"`.

**¿Necesito hacer algo más?**
Una vez completados estos pasos, tu sistema está listo. Solo necesitas probar un formulario para confirmar que funciona.

---

## Soporte

Si tienes problemas, revisa:
1. La consola del navegador (F12 → Console tab)
2. Los registros de Google Apps Script (Ejecuciones)
3. Tu carpeta de spam de email

¡Éxito con tu sitio! 🎉
