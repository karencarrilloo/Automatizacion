// === gestionOrdenVenta.js ===

// Importar la función que ejecuta la creación de la orden
const ejecutarCreacionOrden = require('./creacionOrdenVenta');

// Importar Selenium WebDriver
const { By, until } = require('selenium-webdriver');
const fs = require('fs');

// Función autoejecutable
(async () => {
  // Ejecuta el flujo de creación de orden y obtiene el driver para continuar
  const driver = await ejecutarCreacionOrden();

  try {

    // === Paso 1: Scroll hasta el final del contenedor de órdenes ===
const contenedorOrdenes = await driver.wait(
  until.elementLocated(By.xpath('//*[@id="container-mainframe"]/div[4]/div[1]/div/div[1]/div[4]/div[2]/div[3]')),
  10000
);

// Hacer scroll hasta el final del contenedor usando scrollHeight
await driver.executeScript(`
  arguments[0].scrollTop = arguments[0].scrollHeight;
`, contenedorOrdenes);

// Espera breve para asegurar que el scroll se aplica
await driver.sleep(2000); // pequeña espera para que se renderice

    // === Paso 2: Hacer clic en la última orden creada (dinámico y robusto) ===

// Obtener todos los elementos con clase 'item-list' dentro del contenedor
const ordenes = await contenedorOrdenes.findElements(By.css('div.item-list'));

// Validar que haya al menos una orden
if (ordenes.length === 0) {
  throw new Error("❌ No se encontraron órdenes en el contenedor lateral");
}

// Seleccionar la última orden
const ultimaOrden = ordenes[ordenes.length - 1];

// Hacer scroll para asegurar visibilidad
await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", ultimaOrden);
await driver.sleep(1000); // Espera por animaciones o renderizado

// Validar visibilidad antes del clic
const visible = await ultimaOrden.isDisplayed();
if (!visible) {
  throw new Error("❌ La última orden no es visible para hacer clic");
}

// Hacer clic sobre la última orden
await driver.executeScript("arguments[0].click();", ultimaOrden);
await driver.sleep(5000); // Esperar que se cargue la vista de la orden


  } catch (error) {
     console.error('❌ Error en la gestión de orden:', error.message);

  const screenshot = await driver.takeScreenshot();

  // Ruta absoluta hacia la carpeta "errores" fuera de "Automatizacion"
  const path = require('path');
  const fs = require('fs');

  const carpetaErrores = path.resolve(__dirname, '../errores');

  // Si la carpeta no existe, la crea
  if (!fs.existsSync(carpetaErrores)) {
    fs.mkdirSync(carpetaErrores);
  }

  // Nombre del archivo con timestamp
  const archivoSalida = path.join(carpetaErrores, `error_gestionOrden_${Date.now()}.png`);

  // Guardar el screenshot
  fs.writeFileSync(archivoSalida, screenshot, 'base64');

  throw error;
  } finally {
    await driver.quit(); // Cierra el navegador
  }
})();
