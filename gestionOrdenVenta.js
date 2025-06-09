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
    // === Paso 1: Scroll y clic en la última orden creada ===

    // Esperar contenedor lateral donde están las órdenes
    const contenedorOrdenes = await driver.wait(
      until.elementLocated(By.css('.container-side-list')),
      10000
    );

    // Scroll al final del contenedor lateral para ver la última orden
    await driver.executeScript(
      "arguments[0].scrollTop = arguments[0].scrollHeight;",
      contenedorOrdenes
    );
    await driver.sleep(1000); // pequeña espera para que se renderice

    // Esperar a que esté disponible al menos una orden
    const ordenes = await driver.wait(
      until.elementsLocated(By.css('.container-side-list .item-list')),
      10000
    );

    // Obtener la última orden (asumimos que se añade al final)
    const ultimaOrden = ordenes[ordenes.length - 1];

    // Asegurar visibilidad con scroll (opcional si ya se hizo scroll al contenedor)
    await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", ultimaOrden);
    await driver.sleep(500);

    // Hacer clic en la orden para gestionarla
    await ultimaOrden.click();
    await driver.sleep(2000);

    console.log('✅ Paso 1 completado: Orden más reciente seleccionada para gestión');

    // Aquí puedes continuar con pasos siguientes (por ejemplo, editar, asignar, gestionar...)

  } catch (error) {
    console.error('❌ Error en la gestión de orden:', error.message);
    const screenshot = await driver.takeScreenshot();
    fs.writeFileSync(`error_gestionOrden_${Date.now()}.png`, screenshot, 'base64');
    throw error;
  } finally {
    await driver.quit(); // Cierra el navegador
  }
})();
