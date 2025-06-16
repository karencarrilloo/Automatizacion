
// Importa la función de login desde el archivo login.js
const loginTest = require('./login');

// Importa los módulos necesarios de selenium-webdriver
const { By, until } = require('selenium-webdriver');

// Importa fs para guardar capturas de pantalla en caso de error
const fs = require('fs'); // Para guardar capturas de pantalla

async function main() {
  // Ejecuta el login y obtiene el driver del navegador
  const driver = await loginTest();

  try {
 // === Paso 1: Clic en módulo eCenter ===
    const eCenterBtn = await driver.wait(
      until.elementLocated(By.xpath("//div[@id='118' and contains(@class, 'item-module')]")),
      10000
    );
    await driver.executeScript("arguments[0].click();", eCenterBtn);
    await driver.sleep(1000);

    // === Paso 2: Esperar el contenedor scrollable ===
    const scrollContainer = await driver.wait(
      until.elementLocated(By.css('.container-applications')),
      10000
    );
    await driver.executeScript(
      "arguments[0].scrollTop = arguments[0].scrollHeight;",
      scrollContainer
    );
    await driver.sleep(1000);

    // === Paso 3: Clic en "Gestion de Activos" ===
    const gestionActivosBtn = await driver.wait(
      until.elementLocated(By.css('div.application-item[title="Gestion de Activos"]')),
      10000
    );
    await driver.executeScript(
      "arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });",
      gestionActivosBtn
    );
    await driver.wait(until.elementIsVisible(gestionActivosBtn), 10000);
    await driver.wait(until.elementIsEnabled(gestionActivosBtn), 10000);
    await driver.sleep(1000);
    await driver.executeScript("arguments[0].click();", gestionActivosBtn);
    await driver.sleep(5000);

   
    // === Paso 4: Clic en "Seleccionar entidad" ===
    // Espera hasta que aparezca el botón con el texto deseado
    const entidadBtn = await driver.wait(
      until.elementLocated(By.xpath("//div[contains(text(), 'Seleccionar entidad') and contains(@class, 'btn-primary')]")),
      20000
    );

    // Asegura que sea visible antes de interactuar
    await driver.wait(until.elementIsVisible(entidadBtn), 10000);
    await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", entidadBtn);
    await driver.sleep(1000); // Por si hay animaciones

    // Hace clic en el botón "Seleccionar entidad"
    await driver.executeScript("arguments[0].click();", entidadBtn);
    await driver.sleep(5000); // Espera carga siguiente

    // === Paso 5: Seleccionar "Elemento secundario" en la tabla del modal ===
// ===  Obtener la tabla del modal ===
const tablaSelector = await driver.wait(
  until.elementLocated(By.css('div.modal-body table tbody')),
  10000
);

// ===  Obtener todas las filas de la tabla ===
const rowsOrder = await tablaSelector.findElements(By.css('tr'));

let foundOrder = false;

// === Recorrer filas y celdas para buscar "Elemento secundario" ===
for (const row of rowsOrder) {
  const cells = await row.findElements(By.css('td'));

  for (const cell of cells) {
    const text = (await cell.getText()).trim().toLowerCase();

    // Comparación parcial insensible a mayúsculas y espacios
    if (text.includes('elemento secundario')) {
      // Scroll al centro de la vista
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", cell);
      await driver.sleep(500); // Breve espera para scroll

      // Clic en la celda
      await driver.executeScript("arguments[0].click();", cell);
      foundOrder = true;
      console.log('✅ Se encontró y seleccionó: "Elemento secundario".');
      break;
    }
  }

  if (foundOrder) break;
}

// === Validación si no se encontró la opción ===
if (!foundOrder) {
  throw new Error('❌ No se encontró ninguna opción que contenga "Elemento secundario".');
}

 // Clic en el botón "Seleccionar"
    const botonSeleccionarEntidad = await driver.wait(
      until.elementLocated(By.css('#widget-button-btn-next-step .btn.btn-primary')),
      10000
    );

    // Espera que el botón esté habilitado
    await driver.wait(async () => {
      const disabled = await botonSeleccionarEntidad.getAttribute('disabled');
      return disabled === null;
    }, 10000);

    // Hace clic en el botón "Seleccionar"
    await botonSeleccionarEntidad.click();
    await driver.sleep(3000);



/////////////////////////////////////
  // === Paso 6: Seleccionar "ONT" en la tabla del modal ===
// ===  Obtener la tabla del modal ===
const tablaSelectorOnt = await driver.wait(
  until.elementLocated(By.css('div.modal-body table tbody')),
  10000
);

// ===  Obtener todas las filas de la tabla ===
const rowsOrderOnt = await tablaSelectorOnt.findElements(By.css('tr'));

let foundOrderOnt = false;

// === Recorrer filas y celdas para buscar "ONT" ===
for (const row of rowsOrderOnt) {
  const cells = await row.findElements(By.css('td'));

  for (const cell of cells) {
    const text = (await cell.getText()).trim().toLowerCase();

    // Comparación parcial insensible a mayúsculas y espacios
    if (text.includes('ONT')) {
      // Scroll al centro de la vista
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", cell);
      await driver.sleep(500); // Breve espera para scroll

      // Clic en la celda
      await driver.executeScript("arguments[0].click();", cell);
      foundOrder = true;
      console.log('✅ Se encontró y seleccionó: "ONT".');
      break;
    }
  }

  if (foundOrder) break;
}

// === Validación si no se encontró la opción ===
if (!foundOrder) {
  throw new Error('❌ No se encontró ninguna opción que contenga "ONT".');
}

 // Clic en el botón "Seleccionar"
    const botonSeleccionarOnt = await driver.wait(
      until.elementLocated(By.css('#widget-button-btn-next-step .btn.btn-primary')),
      10000
    );

    // Espera que el botón esté habilitado
    await driver.wait(async () => {
      const disabled = await botonSeleccionarOnt.getAttribute('disabled');
      return disabled === null;
    }, 10000);

    // Hace clic en el botón "Seleccionar"
    await botonSeleccionarOnt.click();
    await driver.sleep(3000);





    //////////////////////////////////////////



  } catch (error) {
    console.error("❌ No se pudo completar la prueba:", error.message);
    const screenshot = await driver.takeScreenshot();
    fs.writeFileSync(`error_gestionActivos_${Date.now()}.png`, screenshot, 'base64');
    throw error;
}
};

if (require.main === module) {
  main();
}