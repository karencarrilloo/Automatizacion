// Importa la función de login desde el archivo login.js
const loginTest = require('./login');

// Importa los módulos necesarios de selenium-webdriver
const { By, until } = require('selenium-webdriver');

// Importa fs para guardar capturas de pantalla en caso de error
const fs = require('fs'); // Para guardar capturas de pantalla

// Función autoejecutable asincrónica
(async () => {
  // Ejecuta el login y obtiene el driver del navegador
  const driver = await loginTest();

  try {
    // === Paso 7: Clic en módulo eWorkForce ===
    // Espera hasta que se localice el botón del módulo eWorkForce
    const eWorkForceBtn = await driver.wait(
      until.elementLocated(By.xpath("//div[@id='23' and contains(@class, 'item-module')]")),
      10000
    );
    // Hace clic en el módulo usando JavaScript
    await driver.executeScript("arguments[0].click();", eWorkForceBtn);
    // Espera 1 segundo por la transición
    await driver.sleep(1000);

    // === Paso 8: Esperar el contenedor scrollable ===
    // Espera hasta que el contenedor de aplicaciones esté presente
    const scrollContainer = await driver.wait(
      until.elementLocated(By.css('.container-applications')),
      10000
    );
    // Realiza scroll hasta el final del contenedor
    await driver.executeScript(
      "arguments[0].scrollTop = arguments[0].scrollHeight;",
      scrollContainer
    );
    await driver.sleep(1000); // Pausa corta para asegurar el scroll

    // === Paso 9: Clic en "Creación de citas" ===
    // Espera hasta que aparezca el ítem con título "Creación de citas"
    const creacionCitasBtn = await driver.wait(
      until.elementLocated(By.css('div.application-item[title="Creación de citas"]')),
      10000
    );

    // Se asegura de que el botón esté visible en el viewport
    await driver.executeScript(
      "arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });",
      creacionCitasBtn
    );

    // Espera a que sea visible y habilitado
    await driver.wait(until.elementIsVisible(creacionCitasBtn), 10000);
    await driver.wait(until.elementIsEnabled(creacionCitasBtn), 10000);
    await driver.sleep(1000); // Por si hay animaciones

    // Hace clic en "Creación de citas"
    await driver.executeScript("arguments[0].click();", creacionCitasBtn);
    await driver.sleep(5000); // Espera carga de pantalla

    // === Paso 10: Clic en "Crear orden para agendamiento" ===
    // Espera hasta que aparezca el botón con el texto deseado
    const btnCrearOrden = await driver.wait(
      until.elementLocated(By.xpath("//div[contains(text(), 'Crear orden para agendamiento') and contains(@class, 'btn-primary')]")),
      20000
    );

    // Asegura que sea visible antes de interactuar
    await driver.wait(until.elementIsVisible(btnCrearOrden), 10000);
    await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", btnCrearOrden);
    await driver.sleep(1000); // Por si hay animaciones

    // Hace clic en el botón "Crear orden para agendamiento"
    await driver.executeScript("arguments[0].click();", btnCrearOrden);
    await driver.sleep(5000); // Espera carga siguiente

    // === Paso 11: "Clic en botón del campo "Departamento" ===
    // Espera hasta que se localice el botón desplegable del campo "Departamento"
    const botonDepartamento = await driver.wait(
      until.elementLocated(By.xpath('//*[@id="widget-picklist-leProvince"]/div[1]/span[2]/button')),
      10000
    );

    // Hace scroll para asegurar que el botón está en pantalla
    await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", botonDepartamento);
    await driver.sleep(1000);

    // Verifica visibilidad y habilitación del botón
    const visible = await botonDepartamento.isDisplayed();
    const habilitado = await botonDepartamento.isEnabled();

    // Si no está visible o habilitado, lanza error
    if (!visible || !habilitado) {
      throw new Error("❌ El botón 'Departamento' no está visible o habilitado");
    }

    // Hace clic en el botón de "Departamento"
    await driver.executeScript("arguments[0].click();", botonDepartamento);
    await driver.sleep(3000); // Espera para carga de opciones

    // Paso 12: Seleccionar "VALLE DEL CAUCA" de la tabla

    // Obtiene todas las filas (<tr>) del cuerpo de la tabla (#grid-table-crud-grid-leProvince)
    const rows = await driver.findElements(By.css('#grid-table-crud-grid-leProvince tbody tr'));

    // Variable para llevar control si se encontró la fila
    let found = false;

    // Recorre cada fila encontrada
    for (const row of rows) {
      // Dentro de cada fila, obtiene todas las celdas (<td>)
      const cells = await row.findElements(By.css('td'));

      // Recorre cada celda dentro de la fila
      for (const cell of cells) {
        // Obtiene el texto visible de la celda
        const text = await cell.getText();

        // Compara el texto con "VALLE DEL CAUCA" (ignorando espacios y mayúsculas/minúsculas)
        if (text.trim().toUpperCase() === "VALLE DEL CAUCA") {
          // Si encuentra la coincidencia, hace clic en toda la fila
          await row.click();

          // Marca como encontrado para salir del bucle principal
          found = true;
          break;
        }
      }

      // Si ya encontró la fila, sale del bucle externo
      if (found) break;
    }

    // Si no encontró ninguna fila con "VALLE DEL CAUCA", lanza un error
    if (!found) {
      throw new Error('❌ No se encontró la fila con "VALLE DEL CAUCA"');
    }

    await driver.sleep(3000);

    // Paso 13: Hacer clic en el botón "Seleccionar"
    // Localizamos el botón "Seleccionar"
    let botonSeleccionar = await driver.wait(
      until.elementLocated(By.css('#widget-button-btSelect-leProvince .btn.btn-primary')),
      10000
    );

    // Esperamos a que el botón esté habilitado (es decir, que NO tenga el atributo 'disabled')
    await driver.wait(async () => {
      const disabled = await botonSeleccionar.getAttribute('disabled');
      return disabled === null;
    }, 10000);

    // Hacemos clic cuando esté habilitado
    await botonSeleccionar.click();
    await driver.sleep(3000);

    // === Paso 14: "Clic en botón del campo 'TIPO DE ORDEN'" ===

    const botonTipoOrden = await driver.wait(
      until.elementLocated(By.xpath('//*[@id="widget-picklist-workSpecificationIdCreateOrder"]/div[1]/span[2]/button')),
      10000
    );   

    // Verifica visibilidad y habilitación del botón
    const visibleTipoOrden = await botonTipoOrden.isDisplayed();
    const habilitadoTipoOrden = await botonTipoOrden.isEnabled();

    if (!visibleTipoOrden || !habilitadoTipoOrden) {
      throw new Error("❌ El botón 'TIPO DE ORDEN' no está visible o habilitado");
    }

    // Hace clic en el botón "TIPO DE ORDEN"
    await driver.executeScript("arguments[0].click();", botonTipoOrden);
    await driver.sleep(3000); // Espera para carga de opciones

    console.log("✅ Se hizo clic en el botón 'TIPO DE ORDEN'");


   // Paso 15: Seleccionar "ORDEN - VENTA E INSTALACION" haciendo scroll dentro del tbody

// Obtener el cuerpo de la tabla del modal
const tablaSelector = await driver.findElement(By.css('#grid-table-crud-grid-workSpecificationIdCreateOrder tbody'));

// Obtener todas las filas visibles
const rowsOrder = await tablaSelector.findElements(By.css('tr'));

let foundOrder = false;

// Recorrer cada fila y sus celdas para buscar coincidencia parcial
for (const row of rowsOrder) {
  const cells = await row.findElements(By.css('td'));

  for (const cell of cells) {
    const text = await cell.getText();

    // Comparación parcial y en mayúsculas: buscamos "VENTA E INSTALACION"
    if (text.toUpperCase().includes('VENTA E INSTALACION')) {
      // Asegurar visibilidad de la celda con scroll
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", cell);
      await driver.sleep(500); // Espera breve por scroll

      // Clic directamente en la celda para seleccionar la fila
      await driver.executeScript("arguments[0].click();", cell);
      foundOrder = true;
      break;
    }
  }

  if (foundOrder) break;
}

// Validación por si no encuentra el tipo de orden
if (!foundOrder) {
  throw new Error('❌ No se encontró ninguna opción que contenga "VENTA E INSTALACION".');
}

// Paso 4: Esperar y dar clic en el botón SELECCIONAR del modal
const botonSeleccionarOrder = await driver.wait(
  until.elementLocated(By.css('#widget-button-btSelect-workSpecificationIdCreateOrder .btn.btn-primary')),
  10000
);

// Esperar que esté habilitado antes de hacer clic
await driver.wait(async () => {
  const disabled = await botonSeleccionarOrder.getAttribute('disabled');
  return disabled === null;
}, 10000);

// Clic final en el botón "SELECCIONAR"
await driver.executeScript("arguments[0].click();", botonSeleccionarOrder);
await driver.sleep(2000); // Espera para asegurar la acción

  } catch (error) {
    // Muestra error en consola si algo falla
    console.error("❌ No se pudo completar la prueba:", error.message);
    // Toma y guarda una captura de pantalla del error
    const screenshot = await driver.takeScreenshot();
    fs.writeFileSync(`error_departamento_${Date.now()}.png`, screenshot, 'base64');
    // Relanza el error para detener el flujo
    throw error;
  } finally {
    // Cierra el navegador al final de la prueba, exitoso o fallido
    await driver.quit();
  }
})();