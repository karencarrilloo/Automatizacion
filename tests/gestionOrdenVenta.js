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

    // === Paso 6: Seleccionar aleatoriamente una opción del campo "Vía Principal" ===
    const viaPrincipalSelect = await driver.wait(
      until.elementLocated(By.xpath('//*[@id="input-select-id-list-headboard"]')),
      10000
    );

    // Esperar a que sea visible y habilitado
    await driver.wait(until.elementIsVisible(viaPrincipalSelect), 5000);
    await driver.wait(until.elementIsEnabled(viaPrincipalSelect), 5000);

    // Obtener todas las opciones disponibles
    const opciones = await viaPrincipalSelect.findElements(By.css('option'));

    // Filtrar las opciones válidas (que no sean deshabilitadas o "Seleccionar")
    const opcionesValidas = [];

    for (const opcion of opciones) {
      const valor = await opcion.getAttribute('value');
      const texto = await opcion.getText();

      // Ignora opciones sin valor o que son el placeholder
      if (valor && valor !== 'placeholder' && texto.toUpperCase() !== 'SELECCIONAR') {
        opcionesValidas.push(opcion);
      }
    }

    // Validación: Si no hay opciones válidas, lanzar error
    if (opcionesValidas.length === 0) {
      throw new Error('❌ No hay opciones válidas disponibles en el select de Vía Principal');
    }

    // Seleccionar una opción aleatoria de las válidas
    const opcionAleatoria = opcionesValidas[Math.floor(Math.random() * opcionesValidas.length)];
    await opcionAleatoria.click();

    await driver.sleep(2000); // Espera visual opcional

    // === Paso 7: Seleccionar aleatoriamente una opción del campo "Número" ===
    const numeroSelect = await driver.wait(
      until.elementLocated(By.id('input-select-data-headboard')),
      10000
    );

    // Esperar a que el <select> esté visible y habilitado
    await driver.wait(until.elementIsVisible(numeroSelect), 5000);
    await driver.wait(until.elementIsEnabled(numeroSelect), 5000);

    // Obtener todas las opciones
    const opcionesNumero = await numeroSelect.findElements(By.css('option'));

    // Filtrar opciones válidas (que tengan un valor distinto de "placeholder")
    const opcionesValidasNumero = [];
    for (const opcion of opcionesNumero) {
      const valor = await opcion.getAttribute('value');
      const texto = await opcion.getText();

      if (valor && valor !== 'placeholder' && texto.toUpperCase() !== 'SELECCIONAR') {
        opcionesValidasNumero.push(opcion);
      }
    }

    // Validar si hay opciones
    if (opcionesValidasNumero.length === 0) {
      throw new Error('❌ No hay opciones válidas disponibles en el select de Número');
    }

    // Elegir una opción al azar
    const opcionNumeroAleatoria = opcionesValidasNumero[Math.floor(Math.random() * opcionesValidasNumero.length)];
    await opcionNumeroAleatoria.click();

    await driver.sleep(2000); // Espera visual opcional

    // === Paso 8: Seleccionar aleatoriamente una opción del campo "Vía Generadora" ===
    const viaGeneradoraSelect = await driver.wait(
      until.elementLocated(By.id('input-select-id-list-secondary')),
      10000
    );

    // Esperar a que el <select> esté visible y habilitado
    await driver.wait(until.elementIsVisible(viaGeneradoraSelect), 5000);
    await driver.wait(until.elementIsEnabled(viaGeneradoraSelect), 5000);

    // Obtener todas las opciones
    const opcionesViaGeneradora = await viaGeneradoraSelect.findElements(By.css('option'));

    // Filtrar opciones válidas (que no sean placeholder ni "Seleccionar")
    const opcionesValidasViaGeneradora = [];
    for (const opcion of opcionesViaGeneradora) {
      const valor = await opcion.getAttribute('value');
      const texto = await opcion.getText();

      if (valor && valor !== 'placeholder' && texto.toUpperCase() !== 'SELECCIONAR') {
        opcionesValidasViaGeneradora.push(opcion);
      }
    }

    // Validar si hay opciones disponibles
    if (opcionesValidasViaGeneradora.length === 0) {
      throw new Error('❌ No hay opciones válidas disponibles en el select de Vía Generadora');
    }

    // Elegir una opción aleatoria y seleccionarla
    const opcionViaGeneradoraAleatoria = opcionesValidasViaGeneradora[Math.floor(Math.random() * opcionesValidasViaGeneradora.length)];
    await opcionViaGeneradoraAleatoria.click();

    await driver.sleep(2000); // Espera visual opcional

    // === Paso 9: Seleccionar aleatoriamente una opción del campo "Número" de Vía Generadora ===
    const numeroGeneradoraSelect = await driver.wait(
      until.elementLocated(By.id('input-select-data-secondary')),
      10000
    );

    // Esperar dinámicamente a que el select se habilite (no tenga el atributo disabled)
    await driver.wait(async () => {
      const disabledAttr = await numeroGeneradoraSelect.getAttribute('disabled');
      return disabledAttr === null;
    }, 10000, '❌ El campo Número de Vía Generadora no se habilitó a tiempo');

    // Esperar que esté visible y habilitado
    await driver.wait(until.elementIsVisible(numeroGeneradoraSelect), 5000);
    await driver.wait(until.elementIsEnabled(numeroGeneradoraSelect), 5000);

    // Obtener todas las opciones
    const opcionesNumeroGeneradora = await numeroGeneradoraSelect.findElements(By.css('option'));

    // Filtrar opciones válidas
    const opcionesValidasNumeroGeneradora = [];
    for (const opcion of opcionesNumeroGeneradora) {
      const valor = await opcion.getAttribute('value');
      const texto = await opcion.getText();

      if (valor && valor !== 'placeholder' && texto.toUpperCase() !== 'SELECCIONAR') {
        opcionesValidasNumeroGeneradora.push(opcion);
      }
    }

    // Validar que hay opciones disponibles
    if (opcionesValidasNumeroGeneradora.length === 0) {
      throw new Error('❌ No hay opciones válidas en el select de Número de Vía Generadora');
    }

    // Seleccionar aleatoriamente una opción
    const opcionNumeroGeneradoraAleatoria = opcionesValidasNumeroGeneradora[Math.floor(Math.random() * opcionesValidasNumeroGeneradora.length)];
    await opcionNumeroGeneradoraAleatoria.click();

    await driver.sleep(2000); // Pausa opcional para visualización

    // === Paso 10: Seleccionar aleatoriamente una opción del campo "Placa" ===
    const placaSelect = await driver.wait(
      until.elementLocated(By.id('input-select-data-plate')),
      10000
    );

    // Esperar dinámicamente a que el select se habilite
    await driver.wait(async () => {
      const disabledAttr = await placaSelect.getAttribute('disabled');
      return disabledAttr === null;
    }, 10000, '❌ El campo Placa no se habilitó a tiempo');

    // Esperar que esté visible y habilitado
    await driver.wait(until.elementIsVisible(placaSelect), 5000);
    await driver.wait(until.elementIsEnabled(placaSelect), 5000);

    // Obtener todas las opciones
    const opcionesPlaca = await placaSelect.findElements(By.css('option'));

    // Filtrar opciones válidas (excluye placeholder)
    const opcionesValidasPlaca = [];
    for (const opcion of opcionesPlaca) {
      const valor = await opcion.getAttribute('value');
      const texto = await opcion.getText();

      if (valor && valor !== 'placeholder' && texto.toUpperCase() !== 'SELECCIONAR') {
        opcionesValidasPlaca.push(opcion);
      }
    }

    // Validar que hay opciones disponibles
    if (opcionesValidasPlaca.length === 0) {
      throw new Error('❌ No hay opciones válidas en el select de Placa');
    }

    // Seleccionar aleatoriamente una opción
    const opcionPlacaAleatoria = opcionesValidasPlaca[Math.floor(Math.random() * opcionesValidasPlaca.length)];
    await opcionPlacaAleatoria.click();

    await driver.sleep(2000); // Pausa opcional para visualización

    // === Paso 11: Clic en el botón "REALIZAR RESERVA" ===

    // Esperar hasta que el botón esté localizado
    const btnReserva = await driver.wait(
      until.elementLocated(By.xpath("//div[contains(text(),'Realizar reserva') and contains(@class, 'btn-primary')]")),
      10000
    );

    // Esperar a que sea visible
    await driver.wait(until.elementIsVisible(btnReserva), 10000);

    // Scroll para que sea visible
    await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", btnReserva);
    await driver.sleep(500);

    // Verificar que no tenga una clase que indique deshabilitado
    await driver.wait(async () => {
      const classAttr = await btnReserva.getAttribute('class');
      // Aquí ajusta según cómo marque el deshabilitado (puede ser "disabled" o similar en la clase)
      return !/disabled/i.test(classAttr);
    }, 10000, '❌ El botón "Realizar reserva" sigue deshabilitado');

    // Clic en el botón
    await driver.executeScript("arguments[0].click();", btnReserva);

    // === Esperar dinámico: esperar a que desaparezca progress ===
    try {
      const progressEl = await driver.wait(until.elementLocated(progressSelector), 5000);
      await driver.wait(until.stalenessOf(progressEl), 15000, '❌ El progress no desapareció después de realizar la reserva.');
    } catch (e) {
      // Si no apareció progress, continuar
    }

    // === Paso 12: Clic en el botón "Siguiente" ===

    // Esperar el mensaje de confirmación y que desaparezca
    try {
      const alertaReserva = await driver.wait(
        until.elementLocated(By.xpath("//div[contains(@class,'body-text') and contains(text(),'La reserva se realizó correctamente')]")),
        10000
      );

      await driver.wait(
        until.stalenessOf(alertaReserva),
        20000,
        '❌ El mensaje de confirmación no desapareció'
      );

      console.log('✅ El mensaje desapareció');
    } catch {
      console.log('⚠️ No se detectó mensaje de confirmación. Continuando...');
    }

    // Esperar el contenedor del botón Siguiente visible
    const containerNext = await driver.wait(
      until.elementLocated(By.id('widget-button-btnNext')),
      10000
    );

    await driver.wait(async () => {
      const display = await containerNext.getCssValue('display');
      return display !== 'none';
    }, 10000, '❌ Contenedor Siguiente no visible');

    // Encontrar el botón
    const btnSiguiente = await driver.findElement(
      By.xpath('//*[@id="widget-button-btnNext"]/div')
    );

    // Asegurar que sea visible
    await driver.wait(
      until.elementIsVisible(btnSiguiente),
      10000,
      '❌ El botón Siguiente no es visible'
    );

    // Scroll y clic inmediato (sin validaciones extra de clase o atributos)
    await driver.executeScript("arguments[0].scrollIntoView({behavior: 'instant', block: 'center'});", btnSiguiente);
    await driver.executeScript("arguments[0].click();", btnSiguiente);
    console.log('✅ Clic en Siguiente ejecutado');

    // Esperar progress si aparece

    try {
      const progress = await driver.wait(
        until.elementLocated(progressSelector),
        5000
      );
      await driver.wait(
        until.stalenessOf(progress),
        15000,
        '❌ El progress no desapareció tras clic en Siguiente'
      );
      console.log('✅ Progress gestionado tras Siguiente');
    } catch {
      console.log('⚠️ No apareció progress tras clic en Siguiente');
    }

    // === Paso 13: Seleccionar aleatoriamente el campo "TIPO DE CLIENTE" ===

    // Localiza el select
    const selectTipoCliente = await driver.wait(
      until.elementLocated(By.id('input-select-TIPODECLIENTE')),
      10000
    );

    // Espera que sea visible
    await driver.wait(
      until.elementIsVisible(selectTipoCliente),
      10000,
      '❌ El campo TIPO DE CLIENTE no es visible'
    );

    // Obtén las opciones del select
    const opcionesTipoCliente = await selectTipoCliente.findElements(By.css('option'));

    // Filtra las opciones válidas (que no sean placeholder)
    const opcionesClienteValidas = [];
    for (const opcion of opcionesTipoCliente) {
      const valor = await opcion.getAttribute('value');
      if (valor !== 'placeholder') {
        opcionesClienteValidas.push(opcion);
      }
    }

    // Verifica que haya opciones válidas
    if (opcionesClienteValidas.length === 0) {
      throw new Error('❌ No hay opciones válidas en TIPO DE CLIENTE');
    }

    // Selecciona una opción aleatoria
    const opcionClienteSeleccionada = opcionesClienteValidas[Math.floor(Math.random() * opcionesClienteValidas.length)];

    // Hace scroll si es necesario y clic
    await driver.executeScript("arguments[0].scrollIntoView({behavior: 'instant', block: 'center'});", selectTipoCliente);
    await opcionClienteSeleccionada.click();

    console.log(`✅ Opción seleccionada en TIPO DE CLIENTE: ${await opcionClienteSeleccionada.getText()}`);

    // Pausa opcional para visualización
    await driver.sleep(1000);

    // === Paso 14: Seleccionar aleatoriamente el campo "TIPO DE USO ESTRATO" ===

    // Localiza el select
    const selectUsoEstrato = await driver.wait(
      until.elementLocated(By.id('input-select-TIPODEUSOESTRATO')),
      10000
    );

    // Espera que sea visible
    await driver.wait(
      until.elementIsVisible(selectUsoEstrato),
      10000,
      '❌ El campo TIPO DE USO ESTRATO no es visible'
    );

    // Obtén las opciones del select
    const opcionesUsoEstrato = await selectUsoEstrato.findElements(By.css('option'));

    // Filtra las opciones válidas (que no sean placeholder)
    const opcionesEstratoValidas = [];
    for (const opcion of opcionesUsoEstrato) {
      const valor = await opcion.getAttribute('value');
      if (valor !== 'placeholder') {
        opcionesEstratoValidas.push(opcion);
      }
    }

    // Verifica que haya opciones válidas
    if (opcionesEstratoValidas.length === 0) {
      throw new Error('❌ No hay opciones válidas en TIPO DE USO ESTRATO');
    }

    // Selecciona una opción aleatoria
    const opcionEstratoSeleccionada = opcionesEstratoValidas[Math.floor(Math.random() * opcionesEstratoValidas.length)];

    // Hace scroll si es necesario y clic
    await driver.executeScript("arguments[0].scrollIntoView({behavior: 'instant', block: 'center'});", selectUsoEstrato);
    await opcionEstratoSeleccionada.click();

    console.log(`✅ Opción seleccionada en TIPO DE USO ESTRATO: ${await opcionEstratoSeleccionada.getText()}`);

    // Pausa opcional para visualización
    await driver.sleep(1000);

    // === Paso 15: Digitar en el campo TELEFONO ALTERNATIVO (opcional) ===

    // Localiza el campo
    const campoTelefonoAlternativo = await driver.wait(
      until.elementLocated(By.css('textarea[placeholder="TELEFONO ALTERNATIVO"]')),
      10000
    );

    // Limpiar el campo si tiene texto previo
    await campoTelefonoAlternativo.clear();

    // Decide si llenar el campo (50% de probabilidad)
    if (Math.random() < 0.5) {
      // Generar número aleatorio de 7 a 10 dígitos
      const longitud = Math.floor(Math.random() * (10 - 7 + 1)) + 7;
      let telefono = '';
      for (let i = 0; i < longitud; i++) {
        telefono += Math.floor(Math.random() * 10);
      }

      // Escribir el teléfono generado
      await campoTelefonoAlternativo.sendKeys(telefono);

      console.log(`✅ Teléfono alternativo ingresado: ${telefono}`);
    } else {
      console.log('ℹ️ Campo TELEFONO ALTERNATIVO dejado vacío (opcional)');
    }

    // Pausa opcional para visualización
    await driver.sleep(1000);

    // === Paso 16: Seleccionar opción en campo ENVIO_DE_FACTURACION ===

    // Esperar el <select>
    const selectEnvioFacturacion = await driver.wait(
      until.elementLocated(By.id("input-select-ENVIO_DE_FACTURACION")),
      10000
    );

    // Obtener todas las opciones disponibles (excepto el placeholder)
    const opcionesEnvioFacturacion = await selectEnvioFacturacion.findElements(By.css('option:not([value="placeholder"])'));

    // Validar que existan opciones válidas
    if (opcionesEnvioFacturacion.length === 0) {
      throw new Error("❌ No hay opciones disponibles en ENVIO_DE_FACTURACION");
    }

    // Elegir una opción aleatoria (nombre único para esta opción)
    const opcionEnvioFacturacion = opcionesEnvioFacturacion[Math.floor(Math.random() * opcionesEnvioFacturacion.length)];
    const valorEnvioFacturacion = await opcionEnvioFacturacion.getAttribute('value');

    // Seleccionar la opción aleatoria
    await selectEnvioFacturacion.sendKeys(valorEnvioFacturacion);

    console.log(`✅ ENVIO_DE_FACTURACION seleccionado: ${valorEnvioFacturacion}`);

    // Pausa breve opcional para visualización
    await driver.sleep(1000);



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
