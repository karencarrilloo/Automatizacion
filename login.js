
// Importa los módulos necesarios de selenium-webdriver
const { Builder, By, until } = require('selenium-webdriver'); 

// Función asincrónica que realiza el login
async function login() {
  // Crea una nueva instancia del navegador Chrome
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    // Abre la URL del sistema OSS
    await driver.get('https://oss-dev.celsiainternet.com/'); // Abre la URL

    // === Paso 1: Ingreso de correo ===
    // Espera hasta que el campo de correo esté presente y visible
    const inputCorreo = await driver.wait(
      until.elementLocated(By.css('#textfield-field-user')),
      10000
    );
    // Ingresa el correo electrónico en el campo
    await inputCorreo.sendKeys('harold.aguirre@hamantsoft.com');

    // === Paso 2: Clic en botón "Siguiente" ===
    // Espera hasta que el botón "Siguiente" esté presente
    const btnSiguiente = await driver.wait(
      until.elementLocated(By.xpath("//div[contains(text(),'Siguiente') and contains(@class, 'btn-default')]")),
      10000
    );
    // Hace clic en el botón usando JavaScript para asegurar que funcione aunque haya overlays
    await driver.executeScript("arguments[0].click();", btnSiguiente);

    // Espera 2 segundos para permitir la transición a la siguiente pantalla
    await driver.sleep(2000); // Esperar transición

    // === Paso 3: Ingreso de contraseña ===
    // Espera hasta que el campo de contraseña esté visible
    const inputPassword = await driver.wait(
      until.elementLocated(By.css('#textfield-field-password')),
      10000
    );
    // Ingresa la contraseña en el campo
    await inputPassword.sendKeys('hJnlIAWpdyE');

    // === Paso 4: Clic en botón "Iniciar sesión" ===
    // Espera hasta que el botón de login esté disponible
    const btnLogin = await driver.wait(
      until.elementLocated(By.css('#widget-button-btn-common-login > div')),
      10000
    );
    // Hace clic en el botón de login usando JavaScript
    await driver.executeScript("arguments[0].click();", btnLogin);

    // === Paso 5: Esperar vista de apps y clic en Himalaya ===
    // Espera a que el botón de la aplicación Himalaya esté presente
    const himalayaBtn = await driver.wait(
      until.elementLocated(By.css('#login-cloud-view-container .popular-apps > div')),
      15000
    );
    // Hace clic en la aplicación Himalaya
    await driver.executeScript("arguments[0].click();", himalayaBtn);

    // Espera 2 segundos a que aparezca el modal de confirmación
    await driver.sleep(2000); // Esperar modal

    // === Paso 6: Confirmar "Sí" en modal ===
    // Espera hasta que el botón "Sí" esté presente en el modal de confirmación
    const btnConfirmar = await driver.wait(
      until.elementLocated(By.xpath("//div[contains(text(),'Sí') and contains(@class, 'btn-default')]")),
      10000
    );
    // Hace clic en el botón "Sí" usando JavaScript
    await driver.executeScript("arguments[0].click();", btnConfirmar);

    // Espera 2 segundos por la transición posterior a la confirmación
    await driver.sleep(2000); // Esperar transición

    // Retorna el driver para que pueda seguir usándose en otros pasos
    return driver;

  } catch (error) {
    console.error('❌ Error en login:', error.message);

    const screenshot = await driver.takeScreenshot();

    // Importar módulos
    const path = require('path');
    const fs = require('fs');

    // Ruta hacia carpeta de errores (fuera de Automatizacion)
    const carpetaErrores = path.resolve(__dirname, '../errores');

    // Crear carpeta si no existe
    if (!fs.existsSync(carpetaErrores)) {
      fs.mkdirSync(carpetaErrores);
    }

    // Ruta completa para el archivo de imagen
    const archivoSalida = path.join(carpetaErrores, `error_login_${Date.now()}.png`);

    // Guardar la imagen
    fs.writeFileSync(archivoSalida, screenshot, 'base64');

    // Cierra el navegador
    await driver.quit();

    // Relanza el error para que el flujo lo capture
    throw error;
    } finally {
    await driver.quit(); // Cierra el navegador
  }
  
}

// Exporta la función login para poder usarla en otros archivos
module.exports = login; // Ejecutar la prueba
