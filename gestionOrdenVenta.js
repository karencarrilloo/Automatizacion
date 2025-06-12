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

    // === Paso 3: Clic en botón del campo "Centro Poblado" ===

    // Espera hasta que se localice el botón desplegable del campo "Centro Poblado"
    const botonCentroPoblado = await driver.wait(
      until.elementLocated(By.xpath('//*[@id="widget-picklist-populatedCenters"]/div[1]/span[2]/button')),
      10000
    );

    // Hace scroll para asegurar visibilidad del botón
    await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", botonCentroPoblado);
    await driver.sleep(1000); // Espera pequeña

    // Verifica si el botón está visible y habilitado
    const visibleCentroPoblado = await botonCentroPoblado.isDisplayed();
    const habilitadoCentroPoblado = await botonCentroPoblado.isEnabled();

    if (!visibleCentroPoblado || !habilitadoCentroPoblado) {
      throw new Error("❌ El botón 'Centro Poblado' no está visible o habilitado");
    }

    // Hace clic en el botón del campo "Centro Poblado"
    await driver.executeScript("arguments[0].click();", botonCentroPoblado);
    await driver.sleep(3000); // Espera para que se cargue el modal

    // === Paso 4: Buscar y seleccionar "PALMIRA" en Centro Poblado ===

    // Esperar que el contenedor scrollable del modal esté presente
    const contenedorCentroPoblado = await driver.wait(
      until.elementLocated(By.xpath('//*[@id="widget-dialog-dialog-picklist-populatedCenters"]/div/div/div[2]/div')),
      10000
    );

    // Buscar todas las filas del listado en el cuerpo de la tabla
    const filasCentroPoblado = await driver.findElements(By.css('#grid-table-crud-grid-populatedCenters tbody tr'));

    let pobladoEncontrado = false;

    for (const fila of filasCentroPoblado) {
      const celdas = await fila.findElements(By.css('td'));

      for (const celda of celdas) {
        const texto = await celda.getText();

        if (texto.trim().toUpperCase() === "PALMIRA") {
          // Hace scroll dentro del contenedor específico y luego clic en la fila
          await driver.executeScript("arguments[0].scrollTop = arguments[1].offsetTop;", contenedorCentroPoblado, fila);
          await driver.sleep(500);
          await fila.click();
          pobladoEncontrado = true;
          break;
        }
      }

      if (pobladoEncontrado) break;
    }

    if (!pobladoEncontrado) {
      throw new Error('❌ No se encontró el centro poblado "PALMIRA"');
    }

    await driver.sleep(2000); // Espera a que se habilite el botón

    // Hacer clic en el botón "Seleccionar"
    const botonSeleccionarCentro = await driver.wait(
      until.elementLocated(By.css('#widget-button-btSelect-populatedCenters .btn.btn-primary')),
      10000
    );

    // Esperar a que el botón esté habilitado
    await driver.wait(async () => {
      const disabled = await botonSeleccionarCentro.getAttribute('disabled');
      return disabled === null;
    }, 10000);

    // Clic en el botón seleccionar
    await botonSeleccionarCentro.click();

    // ✅ Esperar dinámicamente a que desaparezca el progress tras seleccionar "PALMIRA"
    const progressSelector = By.xpath('//*[@id="progress-progress-work-order-templates"]');

    try {
      // Esperar a que aparezca (si lo hace en 5s)
      await driver.wait(until.elementLocated(progressSelector), 5000);

      // Esperar a que desaparezca
      await driver.wait(async () => {
        const progress = await driver.findElement(progressSelector);
        const visible = await progress.isDisplayed().catch(() => false);
        return !visible;
      }, 20000, '❌ El loader no desapareció a tiempo');
    } catch (err) {
      console.log('⏩ Progress bar no apareció, continuando...');
    }

    // === Paso 5: Clic en el campo "Vía Principal" para desplegar las opciones ===

    // Espera a que el select esté presente en el DOM
    const campoViaPrincipal = await driver.wait(
      until.elementLocated(By.id('input-select-id-list-headboard')),
      10000
    );

    // Asegura que esté visible y habilitado
    await driver.wait(until.elementIsVisible(campoViaPrincipal), 10000);
    await driver.wait(until.elementIsEnabled(campoViaPrincipal), 10000);

    // Hace clic en el <select> para desplegar la lista de opciones
    await campoViaPrincipal.click();
    await driver.sleep(1000); // pequeña espera por visualización del desplegable


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
