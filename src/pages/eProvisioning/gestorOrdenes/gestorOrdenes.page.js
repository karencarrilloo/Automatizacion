import { By, until } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class GestorOrdenesPage {
  /**
 * @param {WebDriver} driver  instancia de selenium
 * @param {string} defaultIdDeal  ID_DEAL global reutilizable
 */
  constructor(driver, defaultIdDeal = '28007068553') {
    this.driver = driver;
    this.defaultIdDeal = defaultIdDeal; // 👈 ID_DEAL global reutilizable
  }

  async seleccionarClientePorIdDeal(idDeal) {
    const driver = this.driver;
    const idBuscar = idDeal || this.defaultIdDeal;

    // === XPaths posibles (Clientes y Órdenes) ===
    const posiblesGrids = [
      // Gestión Clientes
      '//div[contains(@id,"grid-table-crud-grid") and contains(@id,"CustomerManager")]//table/tbody',
      // Gestor de Órdenes
      '//div[contains(@id,"grid-table-crud-grid") and contains(@id,"orderViewerGestor")]//table/tbody',
    ];

    let cuerpoTabla = null;
    for (const gridXpath of posiblesGrids) {
      try {
        cuerpoTabla = await driver.wait(until.elementLocated(By.xpath(gridXpath)), 5000);
        if (cuerpoTabla) {
          console.log(`📋 Grid encontrado: ${gridXpath}`);
          break;
        }
      } catch {
        continue;
      }
    }

    if (!cuerpoTabla)
      throw new Error("❌ No se encontró un grid compatible en la vista actual.");

    await driver.wait(until.elementIsVisible(cuerpoTabla), 5000);
    const filas = await cuerpoTabla.findElements(By.xpath("./tr"));

    if (filas.length === 0)
      throw new Error("❌ No se encontraron filas en la tabla.");

    let filaSeleccionada = null;

    for (const fila of filas) {
      const textoFila = (await fila.getText()).trim();
      if (textoFila.includes(idBuscar)) { // 👈 coincidencia parcial en toda la fila
        filaSeleccionada = fila;
        break;
      }
    }

    if (!filaSeleccionada)
      throw new Error(`❌ No se encontró cliente con ID_DEAL "${idBuscar}"`);

    // Scroll y clic
    await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', filaSeleccionada);
    await driver.sleep(300);
    try {
      await filaSeleccionada.click();
    } catch {
      await driver.executeScript('arguments[0].click();', filaSeleccionada);
    }

    await driver.sleep(800);
    console.log(`✅ Cliente con ID_DEAL "${idBuscar}" seleccionado correctamente.`);
  }


  //  ==================================================
  // === CP_GESORD_001 - Ingreso al Gestor de Órdenes ===
  // 3 pasos
  //  ==================================================
  async ingresarGestorOrdenes() {
    const driver = this.driver;

    try {
      // Paso 1: Módulo eCenter
      const eProvisioningBtn = await driver.wait(
        until.elementLocated(By.xpath("//div[@id='21' and contains(@class, 'item-module')]")),
        10000
      );
      await driver.executeScript("arguments[0].click();", eProvisioningBtn);
      await driver.sleep(1000);

      // Paso 2: Scroll contenedor de apps
      const scrollContainer = await driver.wait(
        until.elementLocated(By.css('.container-applications')),
        10000
      );
      await driver.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight;", scrollContainer);
      await driver.sleep(1000);

      // Paso 3: Clic en la aplicación de Gestor
      const targetApp = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="5524"]')),
        10000
      );
      await driver.executeScript("arguments[0].scrollIntoView({behavior:'smooth', block:'center'});", targetApp);
      await driver.wait(until.elementIsVisible(targetApp), 10000);
      await driver.wait(until.elementIsEnabled(targetApp), 10000);
      await driver.executeScript("arguments[0].click();", targetApp);
      await driver.sleep(10000);

      console.log("✅ Ingreso exitoso a la vista 'Gestor de Órdenes'.");
    } catch (error) {
      console.error(`❌ [CP_GESORD_001] Error: ${error.message}`);
    }
  }

  //  ==================================================
  //  CP_GESORD_002 – Primer Filtro de búsqueda por ID_DEAL
  //  5 pasos
  //  ==================================================

  async filtrarPorIdDeal(caseName = 'CP_GESORD_002', idDeal) {
    const driver = this.driver;
    // 👇 Usa el ID global si no se envía argumento
    const idBuscar = idDeal || this.defaultIdDeal;

    try {
      // === Paso 1: Abrir modal de filtros ===
      const padreXpath = '//*[@id="widget-button-btn-add-filter"]';
      const hijoXpath = './div';

      const divPadre = await driver.wait(until.elementLocated(By.xpath(padreXpath)), 10000);
      await driver.wait(until.elementIsVisible(divPadre), 5000);
      const divHijo = await divPadre.findElement(By.xpath(hijoXpath));
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", divHijo);
      await driver.executeScript("arguments[0].click();", divHijo);
      await driver.sleep(5000);

      const modalFiltros = await driver.wait(
        until.elementLocated(By.xpath('//*[starts-with(@id,"qb_")]')),
        15000
      );
      await driver.wait(until.elementIsVisible(modalFiltros), 5000);

      // === Paso 2: Desplegar select de filtros ===
      const grupoFiltro = await driver.wait(
        until.elementLocated(By.xpath('//*[starts-with(@id,"qb_") and contains(@id,"_rule_0")]')),
        10000
      );
      const contenedorFiltro = await grupoFiltro.findElement(By.css('.rule-filter-container'));
      const selectFiltro = await contenedorFiltro.findElement(By.css('select'));
      await driver.wait(until.elementIsVisible(selectFiltro), 5000);
      await driver.wait(until.elementIsEnabled(selectFiltro), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", selectFiltro);
      await selectFiltro.click();
      await driver.sleep(2000);
      //console.log("✅ Select de filtros desplegado.");

      // === Paso 3: Seleccionar "ID_DEAL" ===
      const selectCampo = await grupoFiltro.findElement(By.css('select'));
      await driver.wait(until.elementIsVisible(selectCampo), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", selectCampo);
      await selectCampo.click();
      await driver.sleep(500);
      await selectCampo.sendKeys("ID_DEAL");
      await driver.sleep(2000);

      // === Paso 4: Diligenciar el campo de ID_DEAL ===
      const textareaCampo = await driver.wait(
        until.elementLocated(By.css('textarea.form-control')),
        10000
      );
      await driver.wait(until.elementIsVisible(textareaCampo), 5000);
      await textareaCampo.click();
      await driver.sleep(300);
      await textareaCampo.clear();
      await textareaCampo.sendKeys(idBuscar);   // 👈 Aquí se usa el ID global
      await driver.sleep(1500);
      console.log(`✅ Filtro por ID_DEAL "${idBuscar}" diligenciado.`);


      // === Paso 5: Clic en "Aplicar filtros" ===
      const botonAplicarFiltro = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-button-btn-apply-filter-element"]/div')),
        10000
      );
      await driver.wait(until.elementIsVisible(botonAplicarFiltro), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonAplicarFiltro);
      await driver.sleep(500);
      await botonAplicarFiltro.click();
      await driver.sleep(3000);
      console.log("✅ Paso 5: boton en Aplicar filtros. clickeado");

    } catch (error) {
      if (this._capturarError) await this._capturarError(error, caseName);
      throw error;
    }

  }

  //  ==================================================
  //  CP_GESORD_00X – Segundo filtro de búsqueda cliente por TIPO DE ORDEN
  //  x pasos
  //  ==================================================
  async filtrarPorTipoOrden(caseName = 'CP_GESORD_00X', idDeal) {
    const driver = this.driver;
    // 👇 Usa el ID global si no se envía argumento
    const idBuscar = idDeal || this.defaultIdDeal;

    try {

      const padreXpath = '//*[@id="widget-button-btn-add-filter"]';
      const hijoXpath = './div';

      // === Paso 1: Volver a abrir modal de filtros  ===
      const divPadre2 = await driver.wait(until.elementLocated(By.xpath(padreXpath)), 10000);
      await driver.wait(until.elementIsVisible(divPadre2), 5000);
      const divHijo2 = await divPadre2.findElement(By.xpath(hijoXpath));
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", divHijo2);
      await driver.executeScript("arguments[0].click();", divHijo2);
      await driver.sleep(5000);

      const modalFiltros2 = await driver.wait(
        until.elementLocated(By.xpath('//*[starts-with(@id,"qb_")]')),
        15000
      );
      await driver.wait(until.elementIsVisible(modalFiltros2), 5000);
      console.log("✅ Paso 1: Modal de filtros reabierto correctamente.");

      // === Paso 2: Clic en el botón "+ Add rule" ===
      const botonAddRule = await driver.wait(
        until.elementLocated(By.xpath('//button[@data-add="rule"]')),
        10000
      );
      await driver.wait(until.elementIsVisible(botonAddRule), 5000);
      await driver.wait(until.elementIsEnabled(botonAddRule), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonAddRule);
      await driver.sleep(500);
      await botonAddRule.click();
      await driver.sleep(2000);
      console.log("✅ Paso 2: Botón '+ Add rule' presionado.");

      // === Paso 3: Clic en select del segundo filtro ===
      const grupoFiltro2 = await driver.wait(until.elementLocated(By.css('.rules-group-container')), 10000);
      const contenedorFiltro2 = await grupoFiltro2.findElement(By.css('.rule-filter-container'));
      const selectFiltro2 = await contenedorFiltro2.findElement(By.css('select'));
      await driver.wait(until.elementIsVisible(selectFiltro2), 5000);
      await driver.wait(until.elementIsEnabled(selectFiltro2), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", selectFiltro2);
      await driver.sleep(500);
      await selectFiltro2.click();
      await driver.sleep(1500);
      console.log("✅ Paso 3: Select del segundo filtro abierto.");

      // === Paso 4: Seleccionar “TIPO DE ORDEN” ===
      const contenedoresFiltro = await driver.wait(
        until.elementsLocated(By.css('.rule-container')),
        10000
      );
      const segundoFiltro = contenedoresFiltro[1];
      const selectCampo2 = await segundoFiltro.findElement(By.css('.rule-filter-container select'));
      await driver.wait(until.elementIsVisible(selectCampo2), 5000);
      await driver.wait(until.elementIsEnabled(selectCampo2), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", selectCampo2);
      await selectCampo2.click();
      await driver.sleep(500);

      const opciones = await selectCampo2.findElements(By.css('option'));
      for (const opcion of opciones) {
        const texto = (await opcion.getText()).trim().toUpperCase();
        if (texto === "TIPO DE ORDEN") {
          await opcion.click();
          break;
        }
      }
      await driver.sleep(1000);
      console.log("✅ Paso 4: 'TIPO DE ORDEN' seleccionado.");

      // === Paso 5: Diligenciar campo “ORDEN - VENTA E INSTALACION” ===
      const segundoFiltroBlock = await driver.wait(
        until.elementLocated(By.xpath('(//div[contains(@class,"rule-container")])[2]')),
        10000
      );
      const textarea = await segundoFiltroBlock.findElement(By.css('textarea'));
      await driver.wait(until.elementIsVisible(textarea), 5000);
      await textarea.clear();
      await textarea.sendKeys("ORDEN - VENTA E INSTALACION");
      await driver.sleep(1000);
      console.log("✅ Paso 5: Valor 'ORDEN - VENTA E INSTALACION' diligenciado.");

      // === Paso 6: Clic en "Aplicar filtros" ===
      const botonAplicarFiltro = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-button-btn-apply-filter-element"]/div')),
        10000
      );
      await driver.wait(until.elementIsVisible(botonAplicarFiltro), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonAplicarFiltro);
      await driver.sleep(500);
      await botonAplicarFiltro.click();
      await driver.sleep(3000);
      console.log("✅ Paso 6: boton en Aplicar filtros. clickeado");


    } catch (error) {
      if (this._capturarError) await this._capturarError(error, caseName);
      throw error;
    }

  }


  // =====================================================
  // CP_GESORD_003 – RawData
  // x pasos
  // =====================================================
  async rawData(caseName = "CP_GESORD_00X", idDeal) {
    const driver = this.driver;

    try {
      // Paso 1: Seleccionar cliente
      await this.seleccionarClientePorIdDeal(idDeal);

      // Paso 2: Abrir menú de opciones
      const btnOpciones = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="btn-options"]')),
        10000
      );
      await driver.wait(until.elementIsVisible(btnOpciones), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", btnOpciones);
      await driver.sleep(300);
      await driver.executeScript("arguments[0].click();", btnOpciones);
      await driver.sleep(1000);

      console.log("✅ Paso 2: Botón 'Opciones' presionado correctamente.");
    } catch (error) {
      throw new Error(`❌ Paso 2: Error al intentar presionar el botón 'opciones': ${error.message}`);
    }

    // === Paso 3: Seleccionar opción "RawData" ===
    try {
      const opcionRawDataXpath = '//*[@id="1097"]/div';

      // 1️⃣ Esperar a que la opción esté disponible en el DOM
      const opcionRawData = await driver.wait(
        until.elementLocated(By.xpath(opcionRawDataXpath)),
        15000
      );

      // 2️⃣ Esperar a que sea visible e interactuable
      await driver.wait(until.elementIsVisible(opcionRawData), 8000);
      await driver.wait(until.elementIsEnabled(opcionRawData), 8000);

      // 3️⃣ Scroll y clic
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", opcionRawData);
      await driver.sleep(300);

      try {
        await opcionRawData.click();
      } catch {
        await driver.executeScript("arguments[0].click();", opcionRawData);
      }

      await driver.sleep(2000); // espera por la apertura del modal o acción
      console.log("✅ Paso 3: Opción 'RawData' seleccionada correctamente.");

    } catch (error) {
      throw new Error(`❌ Paso 3: No se pudo seleccionar la opción 'RawData': ${error.message}`);
    }

    // === Paso 4: Hacer scroll hacia abajo dentro del contenedor RawData ===
    try {
      const contenedorScrollableXpath = '//*[@id="widget-dialog-open-dialog-604576-5524-orderViewerGestor2"]/div/div/div[2]/div/div[2]/div[2]/div[1]';

      // 1️⃣ Esperar a que el contenedor exista y sea visible
      const contenedorScrollable = await driver.wait(
        until.elementLocated(By.xpath(contenedorScrollableXpath)),
        15000
      );
      await driver.wait(until.elementIsVisible(contenedorScrollable), 8000);

      // 2️⃣ Realizar scroll progresivo hacia abajo dentro del elemento
      await driver.executeScript(`
    const element = arguments[0];
    element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
  `, contenedorScrollable);

      // 3️⃣ Pausa para asegurar que el scroll se complete
      await driver.sleep(2000);

      console.log("✅ Paso 4: Scroll hacia abajo ejecutado correctamente en el contenedor RawData.");
    } catch (error) {
      throw new Error(`❌ Paso 4: No se pudo realizar scroll hacia abajo en el contenedor RawData: ${error.message}`);
    }

    // === Paso 5: Clic en el botón "Copiar" ===
    try {
      const btnCopiarXpath = '//*[@id="widget-dialog-open-dialog-604576-5524-orderViewerGestor2"]/div/div/div[2]/div/div[2]/div[1]';
      const spanCopiarXpath = '//*[@id="widget-dialog-open-dialog-604576-5524-orderViewerGestor2"]/div/div/div[2]/div/div[2]/div[1]/span';

      // 1️⃣ Esperar a que el botón (div) esté presente y visible
      const btnCopiar = await driver.wait(
        until.elementLocated(By.xpath(btnCopiarXpath)),
        15000
      );
      await driver.wait(until.elementIsVisible(btnCopiar), 8000);

      // 2️⃣ Scroll al botón
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnCopiar);
      await driver.sleep(500);

      // 3️⃣ Intentar clic normal, con fallback a JS
      try {
        await btnCopiar.click();
      } catch {
        const spanCopiar = await driver.findElement(By.xpath(spanCopiarXpath));
        await driver.executeScript("arguments[0].click();", spanCopiar);
      }

      await driver.sleep(1500);

      console.log("✅ Paso 5: Botón 'Copiar' presionado correctamente.");
    } catch (error) {
      throw new Error(`❌ Paso 5: No se pudo presionar el botón 'Copiar': ${error.message}`);
    }

    // === Paso 6: Clic en el botón "Cerrar" ===
    try {
      const btnCerrarXpath = '//*[@id="widget-button-cancel-confirm-selected"]/div';

      // 1️⃣ Esperar que el botón exista en el DOM
      const btnCerrar = await driver.wait(
        until.elementLocated(By.xpath(btnCerrarXpath)),
        15000
      );

      // 2️⃣ Asegurar visibilidad e interacción
      await driver.wait(until.elementIsVisible(btnCerrar), 8000);
      await driver.wait(until.elementIsEnabled(btnCerrar), 8000);

      // 3️⃣ Scroll al botón
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnCerrar);
      await driver.sleep(500);

      // 4️⃣ Intentar clic normal y fallback con JS
      try {
        await btnCerrar.click();
      } catch {
        await driver.executeScript("arguments[0].click();", btnCerrar);
      }

      // 5️⃣ Esperar cierre del modal (máx 10s)
      await driver.sleep(2000);
      await driver.wait(async () => {
        try {
          return !(await btnCerrar.isDisplayed());
        } catch {
          return true; // si el botón desapareció del DOM, modal cerrado
        }
      }, 10000);

      console.log("✅ Paso 6: Botón 'Cerrar' presionado y modal cerrado correctamente.");
    } catch (error) {
      throw new Error(`❌ Paso 6: No se pudo presionar el botón 'Cerrar': ${error.message}`);
    }



  } catch(error) {
    console.error(`❌ Error en el caso de prueba CP_GESORD_003: ${error.message}`);

    throw error;
  }

  // =====================================================
  // CP_GESORD_004 – Adjuntos
  // x pasos
  // =====================================================
  async Adjuntos(caseName = "CP_GESORD_00X", idDeal) {
    const driver = this.driver;

    try {
      // Paso 1: Seleccionar cliente
      await this.seleccionarClientePorIdDeal(idDeal);

      // Paso 2: Abrir menú de opciones
      const btnOpciones = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="btn-options"]')),
        10000
      );
      await driver.wait(until.elementIsVisible(btnOpciones), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", btnOpciones);
      await driver.sleep(300);
      await driver.executeScript("arguments[0].click();", btnOpciones);
      await driver.sleep(1000);

      console.log("✅ Paso 2: Botón 'Opciones' presionado correctamente.");
    } catch (error) {
      throw new Error(`❌ Paso 2: Error al intentar presionar el botón 'opciones': ${error.message}`);
    }

    // === Paso 3: Seleccionar opción "Adjuntos" ===
    try {
      const opcionAdjuntosXpath = '//*[@id="1096"]/div';


      // 1️⃣ Esperar a que la opción esté disponible en el DOM
      const opcionAdjuntos = await driver.wait(
        until.elementLocated(By.xpath(opcionAdjuntosXpath)),
        15000
      );

      // 2️⃣ Esperar a que sea visible e interactuable
      await driver.wait(until.elementIsVisible(opcionAdjuntos), 8000);
      await driver.wait(until.elementIsEnabled(opcionAdjuntos), 8000);

      // 3️⃣ Scroll y clic
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", opcionAdjuntos);
      await driver.sleep(300);

      try {
        await opcionAdjuntos.click();
      } catch {
        await driver.executeScript("arguments[0].click();", opcionAdjuntosa);
      }

      await driver.sleep(2000); // espera por la apertura del modal o acción
      console.log("✅ Paso 3: Opción 'Adjuntos' seleccionada correctamente.");

    } catch (error) {
      throw new Error(`❌ Paso 3: No se pudo seleccionar la opción 'Adjuntos': ${error.message}`);
    }

    // === Paso 4: Clic en el botón "Refrescar" dentro del modal Adjuntos ===
    try {
      // Localizar el modal de Adjuntos
      const modalAdjuntos = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-dialog-open-dialog-604576-5524-orderViewerGestor2"]/div/div')),
        15000
      );
      await driver.wait(until.elementIsVisible(modalAdjuntos), 10000);

      // Buscar el botón "Refrescar" dentro del modal
      const btnRefrescarModal = await modalAdjuntos.findElement(By.xpath('.//*[@id="crud-refresh-btn"]'));
      await driver.wait(until.elementIsVisible(btnRefrescarModal), 10000);

      // Hacer scroll hacia el botón y hacer clic
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnRefrescarModal);
      await driver.sleep(500);

      try {
        await btnRefrescarModal.click();
      } catch {
        await driver.executeScript("arguments[0].click();", btnRefrescarModal);
      }

      console.log("✅ Paso 4: Botón 'Refrescar' dentro del modal de Adjuntos presionado correctamente.");
      await driver.sleep(4000); // Espera mientras recarga la tabla

    } catch (error) {
      throw new Error(`❌ Paso 4: No se pudo presionar el botón 'Refrescar' dentro del modal de Adjuntos: ${error.message}`);
    }

    // === Paso 5: Clic en el botón "Cerrar" dentro del modal Adjuntos ===
    try {
      const btnCerrarModal = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-button-cancel-confirm-selected"]/div')),
        15000
      );

      await driver.wait(until.elementIsVisible(btnCerrarModal), 8000);
      await driver.wait(until.elementIsEnabled(btnCerrarModal), 8000);

      // Scroll hasta el botón y clic forzado si es necesario
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnCerrarModal);
      await driver.sleep(400);

      try {
        await btnCerrarModal.click();
      } catch {
        await driver.executeScript("arguments[0].click();", btnCerrarModal);
      }

      // Esperar que el modal desaparezca o se oculte
      try {
        await driver.wait(until.stalenessOf(btnCerrarModal), 10000);
      } catch {
        console.log("⚠️ El modal puede seguir visible, pero el botón 'Cerrar' fue clickeado.");
      }

      console.log("✅ Paso 5: Botón 'Cerrar' dentro del modal Adjuntos presionado correctamente.");

    } catch (error) {
      throw new Error(`❌ Paso 5: No se pudo presionar el botón 'Cerrar' dentro del modal Adjuntos: ${error.message}`);
    }



  } catch(error) {
    console.error(`❌ Error en el caso de prueba CP_GESORD_004: ${error.message}`);

    throw error;
  }


  // =====================================================
  // CP_GESORD_005 – Registro de la orden
  // x pasos
  // =====================================================
  async registroOrden(caseName = "CP_GESORD_005", idDeal) {
    const driver = this.driver;

    try {
      // Paso 1: Seleccionar cliente
      await this.seleccionarClientePorIdDeal(idDeal);

      // Paso 2: Abrir menú de opciones
      const btnOpciones = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="btn-options"]')),
        10000
      );
      await driver.wait(until.elementIsVisible(btnOpciones), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", btnOpciones);
      await driver.sleep(300);
      await driver.executeScript("arguments[0].click();", btnOpciones);
      await driver.sleep(1000);

      console.log("✅ Paso 2: Botón 'Opciones' presionado correctamente.");
    } catch (error) {
      throw new Error(`❌ Paso 2: Error al intentar presionar el botón 'opciones': ${error.message}`);
    }

    // === Paso 3: Seleccionar opción "Registro de la orden" ===
    try {
      const opcionregistroOrdenXpath = '//*[@id="1095"]/div';


      // 1️⃣ Esperar a que la opción esté disponible en el DOM
      const opcionregistroOrden = await driver.wait(
        until.elementLocated(By.xpath(opcionregistroOrdenXpath)),
        15000
      );

      // 2️⃣ Esperar a que sea visible e interactuable
      await driver.wait(until.elementIsVisible(opcionregistroOrden), 9000);
      await driver.wait(until.elementIsEnabled(opcionregistroOrden), 9000);

      // 3️⃣ Scroll y clic
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", opcionregistroOrden);
      await driver.sleep(300);

      try {
        await opcionAdjuntos.click();
      } catch {
        await driver.executeScript("arguments[0].click();", opcionregistroOrden);
      }

      await driver.sleep(4000); // espera por la apertura del modal o acción
      console.log("✅ Paso 3: Opción 'Registro de la orden' seleccionada correctamente.");

    } catch (error) {
      throw new Error(`❌ Paso 3: No se pudo seleccionar la opción 'Registro de la orden': ${error.message}`);
    }

    // === Paso 4: Clic en la pestaña "Bitácora" ===
    try {
      const tabBitacoraXpath = '//*[@id="widget-dialog-open-dialog-604576-5524-orderViewerGestor2"]/div/div/div[2]/div/div/ul/li[2]';

      // Esperar que la pestaña exista en el DOM
      const tabBitacora = await driver.wait(
        until.elementLocated(By.xpath(tabBitacoraXpath)),
        15000
      );

      // Esperar que sea visible y habilitada
      await driver.wait(until.elementIsVisible(tabBitacora), 8000);
      await driver.wait(until.elementIsEnabled(tabBitacora), 8000);

      // Hacer scroll al elemento
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", tabBitacora);
      await driver.sleep(400);

      // Intentar clic normal, y si falla usar clic por JavaScript
      try {
        await tabBitacora.click();
      } catch {
        await driver.executeScript("arguments[0].click();", tabBitacora);
      }

      await driver.sleep(3000); // breve espera para que se cargue el contenido de la pestaña
      console.log("✅ Paso 4: Pestaña 'Bitácora' clickeada correctamente.");

    } catch (error) {
      throw new Error(`❌ Paso 4: No se pudo dar clic en la pestaña 'Bitácora': ${error.message}`);
    }

    // === Paso 5: Clic en el botón "Actualizar" dentro del modal 'Registro de la orden' ===
    try {
      // 1️⃣ Localizar el modal principal de "Registro de la orden"
      const modalRegistroOrden = await driver.wait(
        until.elementLocated(
          By.xpath('//*[@id="widget-dialog-open-dialog-604576-5524-orderViewerGestor2"]/div/div')
        ),
        15000
      );
      await driver.wait(until.elementIsVisible(modalRegistroOrden), 10000);

      // 2️⃣ Localizar el contenedor del CRUD dentro del modal
      const contenedorCrud = await modalRegistroOrden.findElement(
        By.xpath('.//*[@id="crud-crud-binnacle"]/div/div[1]')
      );
      await driver.wait(until.elementIsVisible(contenedorCrud), 5000);

      // 3️⃣ Localizar el botón "Refrescar" dentro del contenedor
      const btnActualizar = await contenedorCrud.findElement(By.xpath('.//*[@id="crud-refresh-btn"]'));
      await driver.wait(until.elementIsVisible(btnActualizar), 5000);
      await driver.wait(until.elementIsEnabled(btnActualizar), 5000);

      // 4️⃣ Scroll hacia el botón y clic (con fallback a JS)
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnActualizar);
      await driver.sleep(400);
      try {
        await btnActualizar.click();
      } catch {
        await driver.executeScript("arguments[0].click();", btnActualizar);
      }

      console.log("✅ Paso 5: Botón 'Actualizar' dentro del modal 'Registro de la orden' presionado correctamente.");
      await driver.sleep(4000); // Espera de cortesía mientras recarga la tabla

    } catch (error) {
      throw new Error(
        `❌ Paso 5: No se pudo presionar el botón 'Actualizar' dentro del modal 'Registro de la orden': ${error.message}`
      );
    }

    // === Paso 6: Clic en el botón "Cerrar" dentro del modal "Registro de la orden" ===
    try {
      // 1️⃣ Localizar el modal principal (Registro de la orden)
      const modalRegistroOrden = await driver.wait(
        until.elementLocated(
          By.xpath('//*[@id="widget-dialog-open-dialog-604576-5524-orderViewerGestor2"]/div/div')
        ),
        15000
      );
      await driver.wait(until.elementIsVisible(modalRegistroOrden), 8000);

      // 2️⃣ Localizar el botón "Cerrar"
      const btnCerrar = await modalRegistroOrden.findElement(
        By.xpath('.//*[@id="widget-button-cancel-confirm-selected"]/div')
      );
      await driver.wait(until.elementIsVisible(btnCerrar), 5000);

      // 3️⃣ Scroll y clic (con fallback por seguridad)
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnCerrar);
      await driver.sleep(400);
      try {
        await btnCerrar.click();
        await driver.sleep(2000);
      } catch {
        await driver.executeScript("arguments[0].click();", btnCerrar);
      }

      // 4️⃣ Esperar a que el modal se oculte o cierre completamente
      await driver.wait(async () => {
        const visible = await modalRegistroOrden.isDisplayed().catch(() => false);
        return !visible;
      }, 10000);

      console.log("✅ Paso 6: Modal 'Registro de la orden' cerrado correctamente.");

    } catch (error) {
      throw new Error(
        `❌ Paso 6: No se pudo cerrar el modal 'Registro de la orden': ${error.message}`
      );
    }


  } catch(error) {
    console.error(`❌ Error en el caso de prueba CP_GESORD_005: ${error.message}`);

    throw error;
  }
  // =====================================================
  // CP_GESORD_006 – Ver información técnica asociada
  // x pasos
  // =====================================================
  async verInfomacionTecnicaAsociada(caseName = "CP_GESORD_006", idDeal) {
    const driver = this.driver;

    try {
      // Paso 1: Seleccionar cliente
      await this.seleccionarClientePorIdDeal(idDeal);

      // Paso 2: Abrir menú de opciones
      const btnOpciones = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="btn-options"]')),
        10000
      );
      await driver.wait(until.elementIsVisible(btnOpciones), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", btnOpciones);
      await driver.sleep(300);
      await driver.executeScript("arguments[0].click();", btnOpciones);
      await driver.sleep(1000);

      console.log("✅ Paso 2: Botón 'Opciones' presionado correctamente.");
    } catch (error) {
      throw new Error(`❌ Paso 2: Error al intentar presionar el botón 'opciones': ${error.message}`);
    }

    // === Paso 3: Seleccionar opción "Ver información técnica asociada" ===
    try {
      const opcionverInfomacionTecnicaAsociadaXpath = '//*[@id="1103"]/div';


      // 1️⃣ Esperar a que la opción esté disponible en el DOM
      const opcionverInfomacionTecnicaAsociada = await driver.wait(
        until.elementLocated(By.xpath(opcionverInfomacionTecnicaAsociadaXpath)),
        15000
      );

      // 2️⃣ Esperar a que sea visible e interactuable
      await driver.wait(until.elementIsVisible(opcionverInfomacionTecnicaAsociada), 9000);
      await driver.wait(until.elementIsEnabled(opcionverInfomacionTecnicaAsociada), 9000);

      // 3️⃣ Scroll y clic
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", opcionverInfomacionTecnicaAsociada);
      await driver.sleep(300);

      try {
        await opcionverInfomacionTecnicaAsociada.click();
      } catch {
        await driver.executeScript("arguments[0].click();", opcionverInfomacionTecnicaAsociada);
      }

      await driver.sleep(5000); // espera por la apertura del modal o acción
      console.log("✅ Paso 3: Opción 'Ver información técnica asociada' seleccionada correctamente.");

    } catch (error) {
      throw new Error(`❌ Paso 3: No se pudo seleccionar la opción 'Ver información técnica asociada': ${error.message}`);
    }

    // === Paso 4: Clic en el botón "Cerrar" dentro del modal "Ver información técnica asociada" ===
    try {
      // 1️⃣ Localizar el modal activo de "Ver información técnica"
      const modalInfoTecnica = await driver.wait(
        until.elementLocated(
          By.xpath('//*[@id="widget-dialog-open-dialog-604576-5524-orderViewerGestor2"]/div/div')
        ),
        15000
      );
      await driver.wait(until.elementIsVisible(modalInfoTecnica), 8000);

      // 2️⃣ Localizar el botón "Cerrar" dentro del modal
      const btnCerrar = await modalInfoTecnica.findElement(
        By.xpath('.//*[@id="widget-button-cancel-confirm-selected"]/div')
      );
      await driver.wait(until.elementIsVisible(btnCerrar), 5000);

      // 3️⃣ Hacer scroll y clic (con fallback JS)
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnCerrar);
      await driver.sleep(400);
      try {
        await btnCerrar.click();
      } catch {
        await driver.executeScript("arguments[0].click();", btnCerrar);
      }

      // 4️⃣ Esperar que el modal se oculte
      await driver.wait(async () => {
        const visible = await modalInfoTecnica.isDisplayed().catch(() => false);
        return !visible;
      }, 10000);

      console.log("✅ Paso 4: Modal 'Ver información técnica asociada' cerrado correctamente.");

    } catch (error) {
      throw new Error(
        `❌ Paso 4: No se pudo cerrar el modal 'Ver información técnica asociada': ${error.message}`
      );
    }


  } catch(error) {
    console.error(`❌ Error en el caso de prueba CP_GESORD_006: ${error.message}`);

    throw error;
  }


  // =====================================================
  // CP_GESORD_007 – Ejecutar orden venta e instalación (cliente simulado)
  // x pasos
  // =====================================================
  async ejecutarOrdenVentaInstalacion(caseName = "CP_GESORD_007", idDeal) {
    const driver = this.driver;

    try {
      // Paso 1: Seleccionar cliente
      await this.seleccionarClientePorIdDeal(idDeal);

      // Paso 2: Abrir menú de opciones
      const btnOpciones = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="btn-options"]')),
        10000
      );
      await driver.wait(until.elementIsVisible(btnOpciones), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", btnOpciones);
      await driver.sleep(300);
      await driver.executeScript("arguments[0].click();", btnOpciones);
      await driver.sleep(1000);

      console.log("✅ Paso 2: Botón 'Opciones' presionado correctamente.");

      // Paso 3: Seleccionar opción "Ejecutar orden" ===

      const opcionEjecutarXpath = '//*[@id="1094"]/div';

      // Esperar a que la opción esté visible en el menú
      const opcionEjecutar = await driver.wait(
        until.elementLocated(By.xpath(opcionEjecutarXpath)),
        15000
      );
      await driver.wait(until.elementIsVisible(opcionEjecutar), 5000);

      // Desplazar y hacer clic (con fallback a JS)
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", opcionEjecutar);
      await driver.sleep(500);

      try {
        await opcionEjecutar.click();
      } catch {
        await driver.executeScript("arguments[0].click();", opcionEjecutar);

      }

      await driver.sleep(3000);
      console.log("✅ Paso 3: Opción 'Ejecutar orden' seleccionada correctamente.");

      // === Paso 4: Clic en el botón "Número de Serial"===
      try {
        const btnNumeroSerialXpath = '//*[@id="widget-dialog-open-dialog-604576-5524-orderViewerGestor2"]/div/div/div[2]/div/div/div[1]/div[2]/div/div';
        const progressXpath = '//*[@id="progress-progress-crudgestor"]/div/div/div[1]';

        // Localizar el botón y asegurarse de que esté visible
        const btnNumeroSerial = await driver.wait(
          until.elementLocated(By.xpath(btnNumeroSerialXpath)),
          20000
        );
        await driver.wait(until.elementIsVisible(btnNumeroSerial), 10000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnNumeroSerial);
        await driver.sleep(500);

        // Clic en el botón (fallback con JS)
        try {
          await btnNumeroSerial.click();
        } catch {
          await driver.executeScript("arguments[0].click();", btnNumeroSerial);
        }

        console.log("✅ Paso 4: Botón 'Número de Serial' presionado correctamente.");

        // === Esperar el progress de ejecución ===
        const progress = await driver.wait(
          until.elementLocated(By.xpath(progressXpath)),
          20000
        );

        await driver.wait(until.elementIsVisible(progress), 10000);
        console.log("⏳ Paso 4: Proceso iniciado, esperando finalización...");

        // Esperar hasta que el progress desaparezca o deje de estar visible (máximo 120s)
        await driver.wait(async () => {
          try {
            return !(await progress.isDisplayed());
          } catch {
            // Si ya no está en el DOM, lo consideramos finalizado
            return true;
          }
        }, 120000);

        await driver.sleep(3000); // pequeña espera adicional por estabilidad
        console.log("✅ Paso 4: Proceso completado correctamente (progress finalizado).");

      } catch (error) {
        throw new Error(`❌ Paso 4: Error en clic o espera del progress 'Número de Serial': ${error.message}`);
      }

      // === Paso 5: Clic en el botón "SIGUIENTE" ===
      try {
        const btnSiguienteXpath = '//div[@type="button" and contains(@class,"btn-primary") and normalize-space(text())="SIGUIENTE"]';

        // 1️⃣ Esperar a que el botón aparezca en el DOM
        const btnSiguiente = await driver.wait(
          until.elementLocated(By.xpath(btnSiguienteXpath)),
          20000
        );

        // 2️⃣ Esperar a que esté visible y habilitado
        await driver.wait(until.elementIsVisible(btnSiguiente), 10000);
        await driver.wait(until.elementIsEnabled(btnSiguiente), 10000);

        // 3️⃣ Scroll y clic
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnSiguiente);
        await driver.sleep(500);

        try {
          await btnSiguiente.click();
        } catch {
          await driver.executeScript("arguments[0].click();", btnSiguiente);
        }

        console.log("✅ Paso 5: Botón 'SIGUIENTE' presionado correctamente.");

        // 4️⃣ Pequeña espera por navegación o carga posterior
        await driver.sleep(3000);

      } catch (error) {
        throw new Error(`❌ Paso 5: Error al intentar presionar el botón 'SIGUIENTE': ${error.message}`);
      }

      // === Paso 6: Diligenciar campo "Potencia NAP" con el valor "17" ===
      try {
        const inputPotenciaNapXpath = '//*[@id="textfield-PotenciaNAP"]';

        // 1️⃣ Esperar a que el campo esté presente en el DOM
        const inputPotenciaNap = await driver.wait(
          until.elementLocated(By.xpath(inputPotenciaNapXpath)),
          15000
        );

        // 2️⃣ Esperar que sea visible y editable
        await driver.wait(until.elementIsVisible(inputPotenciaNap), 8000);
        await driver.wait(until.elementIsEnabled(inputPotenciaNap), 8000);

        // 3️⃣ Scroll hacia el campo
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", inputPotenciaNap);
        await driver.sleep(500);

        // 4️⃣ Limpiar campo y diligenciar con el valor "17"
        await inputPotenciaNap.clear();
        await driver.sleep(300);
        await inputPotenciaNap.sendKeys("17");
        await driver.sleep(500);

        console.log("✅ Paso 6: Campo 'Potencia NAP' diligenciado correctamente con el valor '17'.");

      } catch (error) {
        throw new Error(`❌ Paso 6: Error al diligenciar el campo 'Potencia NAP': ${error.message}`);
      }

      // === Paso 7: Clic en el botón "Siguiente" ===
      try {
        const btnSiguienteXpath = '//*[@id="widget-button-btn-next-step"]/div';

        // 1️⃣ Esperar que el botón esté en el DOM
        const btnSiguiente = await driver.wait(
          until.elementLocated(By.xpath(btnSiguienteXpath)),
          15000
        );

        // 2️⃣ Asegurar que esté visible y habilitado
        await driver.wait(until.elementIsVisible(btnSiguiente), 8000);
        await driver.wait(until.elementIsEnabled(btnSiguiente), 8000);

        // 3️⃣ Scroll al botón
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnSiguiente);
        await driver.sleep(500);

        // 4️⃣ Clic (con fallback a JavaScript)
        try {
          await btnSiguiente.click();
        } catch {
          await driver.executeScript("arguments[0].click();", btnSiguiente);
        }

        await driver.sleep(3000); // esperar navegación o carga posterior
        console.log("✅ Paso 7: Botón 'Siguiente' presionado correctamente.");

      } catch (error) {
        throw new Error(`❌ Paso 7: Error al presionar el botón 'Siguiente': ${error.message}`);
      }

      // === Paso 8: Diligenciar campo "Serial ONT" ===
      try {
        const inputSerialOntXpath = '//*[@id="textfield-SerialONT"]';

        // 1️⃣ Esperar que el campo esté presente en el DOM
        const inputSerialOnt = await driver.wait(
          until.elementLocated(By.xpath(inputSerialOntXpath)),
          15000
        );

        // 2️⃣ Esperar que sea visible y habilitado
        await driver.wait(until.elementIsVisible(inputSerialOnt), 8000);
        await driver.wait(until.elementIsEnabled(inputSerialOnt), 8000);

        // 3️⃣ Scroll y limpieza
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", inputSerialOnt);
        await driver.sleep(500);
        await inputSerialOnt.clear();

        // 4️⃣ Escribir el Serial ONT
        const serialONT = "485754435A27EBA6";
        await inputSerialOnt.sendKeys(serialONT);
        await driver.sleep(500);

        console.log(`✅ Paso 7: Campo 'Serial ONT' diligenciado con valor: ${serialONT}`);

      } catch (error) {
        throw new Error(`❌ Paso 7: No se pudo diligenciar el campo 'Serial ONT': ${error.message}`);
      }

      // === Paso 9: Clic en el botón "Siguiente" ===
      try {
        const btnSiguienteXpath = '//*[@id="widget-button-btn-next-step"]/div';

        // 1️⃣ Esperar que el botón esté en el DOM
        const btnSiguiente = await driver.wait(
          until.elementLocated(By.xpath(btnSiguienteXpath)),
          15000
        );

        // 2️⃣ Asegurar que esté visible y habilitado
        await driver.wait(until.elementIsVisible(btnSiguiente), 8000);
        await driver.wait(until.elementIsEnabled(btnSiguiente), 8000);

        // 3️⃣ Scroll al botón
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnSiguiente);
        await driver.sleep(500);

        // 4️⃣ Clic (con fallback a JavaScript)
        try {
          await btnSiguiente.click();
        } catch {
          await driver.executeScript("arguments[0].click();", btnSiguiente);
        }

        await driver.sleep(3000); // esperar navegación o carga posterior
        console.log("✅ Paso 9: Botón 'Siguiente' presionado correctamente.");

      } catch (error) {
        throw new Error(`❌ Paso 9: Error al presionar el botón 'Siguiente': ${error.message}`);
      }

      // === Paso 10: Clic en botón "Aprovisionar" y esperar finalización del proceso ===
      try {
        const btnAprovisionarXpath = '//*[@id="widget-button-btn-provisioning-order"]/div';
        const progressXpath = '//*[@id="progress-progress-crudgestor"]/div/div/div[1]'; // mismo progress que mencionaste antes

        // 1️⃣ Esperar el botón en el DOM
        const btnAprovisionar = await driver.wait(
          until.elementLocated(By.xpath(btnAprovisionarXpath)),
          20000
        );

        // 2️⃣ Esperar que sea visible y habilitado
        await driver.wait(until.elementIsVisible(btnAprovisionar), 15000);
        await driver.wait(until.elementIsEnabled(btnAprovisionar), 15000);

        // 3️⃣ Scroll y clic
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnAprovisionar);
        await driver.sleep(500);
        await driver.executeScript("arguments[0].click();", btnAprovisionar);

        console.log("✅ Paso 10: Botón 'Aprovisionar' presionado correctamente.");

        // 4️⃣ Esperar que aparezca el progress (inicio del proceso)
        const progress = await driver.wait(
          until.elementLocated(By.xpath(progressXpath)),
          10000
        );

        console.log("⏳ Paso 10: Proceso de aprovisionamiento iniciado... esperando que finalice.");

        // 5️⃣ Esperar hasta que desaparezca el progress (máx. 90 segundos)
        await driver.wait(async () => {
          try {
            return !(await progress.isDisplayed());
          } catch {
            return true; // si ya no está en el DOM
          }
        }, 120000);

        await driver.sleep(15000); // pequeña espera extra tras finalizar
        console.log("✅ Paso 10: Proceso de aprovisionamiento finalizado correctamente.");

      } catch (error) {
        throw new Error(`❌ Paso 10: Error durante el aprovisionamiento: ${error.message}`);
      }


      // === Paso 11: Clic en el botón "Siguiente" ===
      try {
        const btnSiguienteXpath = '//*[@id="widget-button-btn-next-step"]/div';

        // 1️⃣ Esperar que el botón esté presente en el DOM
        const btnSiguiente = await driver.wait(
          until.elementLocated(By.xpath(btnSiguienteXpath)),
          20000
        );

        // 2️⃣ Esperar que sea visible y habilitado
        await driver.wait(until.elementIsVisible(btnSiguiente), 10000);
        await driver.wait(until.elementIsEnabled(btnSiguiente), 10000);

        // 3️⃣ Scroll y clic (fallback con JS para garantizar ejecución)
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnSiguiente);
        await driver.sleep(500);

        try {
          await btnSiguiente.click();
        } catch {
          await driver.executeScript("arguments[0].click();", btnSiguiente);
        }

        await driver.sleep(2000);
        console.log("✅ Paso 11: Botón 'Siguiente' presionado correctamente.");

      } catch (error) {
        throw new Error(`❌ Paso 11: No se pudo presionar el botón 'Siguiente': ${error.message}`);
      }

      console.log(`✅ ${caseName}: Proceso 'ORDEN - VENTA E INSTALACIÓN' ejecutado con éxito.`);


      // === Paso 12: Diligenciar velocidades de subida y bajada ===
      try {
        // XPaths de los campos
        const inputVelocidadSubidaXpath = '//*[@id="textfield-VelocidadSubida"]';
        const inputVelocidadBajadaXpath = '//*[@id="textfield-VelocidadBajada"]';

        // 1️⃣ Esperar y diligenciar campo "Velocidad Subida"
        const inputVelocidadSubida = await driver.wait(
          until.elementLocated(By.xpath(inputVelocidadSubidaXpath)),
          20000
        );
        await driver.wait(until.elementIsVisible(inputVelocidadSubida), 5000);
        await driver.wait(until.elementIsEnabled(inputVelocidadSubida), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", inputVelocidadSubida);
        await driver.sleep(300);
        await inputVelocidadSubida.clear();
        await inputVelocidadSubida.sendKeys("800");
        console.log("✅ Campo 'Velocidad Subida' diligenciado con 800.");

        // 2️⃣ Esperar y diligenciar campo "Velocidad Bajada"
        const inputVelocidadBajada = await driver.wait(
          until.elementLocated(By.xpath(inputVelocidadBajadaXpath)),
          20000
        );
        await driver.wait(until.elementIsVisible(inputVelocidadBajada), 5000);
        await driver.wait(until.elementIsEnabled(inputVelocidadBajada), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", inputVelocidadBajada);
        await driver.sleep(300);
        await inputVelocidadBajada.clear();
        await inputVelocidadBajada.sendKeys("800");
        console.log("✅ Campo 'Velocidad Bajada' diligenciado con 800.");

        // 3️⃣ Pausa corta para asegurar render
        await driver.sleep(1000);

      } catch (error) {
        throw new Error(`❌ Paso 12: Error al diligenciar velocidades: ${error.message}`);
      }


      // === Paso 13: Clic en el botón "Siguiente" ===
      try {
        const btnSiguienteXpath = '//*[@id="widget-button-btn-next-step"]/div';

        // 1️⃣ Esperar que el botón esté presente en el DOM
        const btnSiguiente = await driver.wait(
          until.elementLocated(By.xpath(btnSiguienteXpath)),
          20000
        );

        // 2️⃣ Esperar que sea visible y habilitado
        await driver.wait(until.elementIsVisible(btnSiguiente), 10000);
        await driver.wait(until.elementIsEnabled(btnSiguiente), 10000);

        // 3️⃣ Scroll y clic (fallback con JS para garantizar ejecución)
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnSiguiente);
        await driver.sleep(500);

        try {
          await btnSiguiente.click();
        } catch {
          await driver.executeScript("arguments[0].click();", btnSiguiente);
        }

        await driver.sleep(2000);
        console.log("✅ Paso 13: Botón 'Siguiente' presionado correctamente.");

      } catch (error) {
        throw new Error(`❌ Paso 13: No se pudo presionar el botón 'Siguiente': ${error.message}`);
      }

      // === Paso 14: Clic en el botón "Configurar WiFi" ===
      try {
        const btnConfigurarWifiXpath = '//*[@id="widget-button-btn-configure-wifi-img"]/div';

        // 1️⃣ Esperar que el botón exista en el DOM
        const btnConfigurarWifi = await driver.wait(
          until.elementLocated(By.xpath(btnConfigurarWifiXpath)),
          20000
        );

        // 2️⃣ Esperar que sea visible y habilitado
        await driver.wait(until.elementIsVisible(btnConfigurarWifi), 5000);
        await driver.wait(until.elementIsEnabled(btnConfigurarWifi), 5000);

        // 3️⃣ Scroll hasta el botón
        await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", btnConfigurarWifi);
        await driver.sleep(500);

        // 4️⃣ Intentar clic normal, si falla usar JS
        try {
          await btnConfigurarWifi.click();
        } catch {
          await driver.executeScript("arguments[0].click();", btnConfigurarWifi);
        }

        // 5️⃣ Pausa para permitir que cargue el modal de configuración WiFi
        await driver.sleep(3000);

        console.log("✅ Paso 14: Botón 'Configurar WiFi' presionado correctamente.");
      } catch (error) {
        throw new Error(`❌ Paso 14: No se pudo presionar el botón 'Configurar WiFi': ${error.message}`);
      }

      // === Paso 15: Configurar WiFi ===
      try {
        // 1️⃣ Clic en el check "Compartir contraseña"
        const checkCompartirXpath = '//*[@id="widget-checkbox-check-step-validation-wifi"]/label';
        const checkCompartir = await driver.wait(
          until.elementLocated(By.xpath(checkCompartirXpath)),
          20000
        );
        await driver.wait(until.elementIsVisible(checkCompartir), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", checkCompartir);
        await driver.sleep(500);

        try {
          await checkCompartir.click();
        } catch {
          await driver.executeScript("arguments[0].click();", checkCompartir);
        }
        console.log("✅ Check 'Compartir contraseña' marcado correctamente.");
        await driver.sleep(800);

        // 2️⃣ Diligenciar campo SSID 2.4 GHz
        const inputSsidXpath = '//*[@id="textfield-SSID"]';
        const inputSsid = await driver.wait(
          until.elementLocated(By.xpath(inputSsidXpath)),
          20000
        );
        await driver.wait(until.elementIsVisible(inputSsid), 5000);
        await inputSsid.clear();
        await driver.sleep(300);
        await inputSsid.sendKeys("test wifi");
        console.log("✅ Campo 'SSID 2.4 GHz' diligenciado correctamente.");
        await driver.sleep(500);

        // 3️⃣ Diligenciar campo Contraseña SSID 2.4 GHz
        const inputPasswordXpath = '//*[@id="textfield-PasswordOneSSID"]';
        const inputPassword = await driver.wait(
          until.elementLocated(By.xpath(inputPasswordXpath)),
          20000
        );
        await driver.wait(until.elementIsVisible(inputPassword), 5000);
        await inputPassword.clear();
        await driver.sleep(300);
        await inputPassword.sendKeys("wifiTest123");
        console.log("✅ Campo 'Contraseña SSID 2.4 GHz' diligenciado correctamente.");
        await driver.sleep(1000);

        console.log("✅ Paso 15: Configuración WiFi completada con éxito.");
      } catch (error) {
        throw new Error(`❌ Paso 15: Error al configurar WiFi: ${error.message}`);
      }

      // === Paso 16: Clic en botón "Confirmar" y esperar proceso ===
      try {
        const btnConfirmarXpath = '//*[@id="widget-button-btn-confirm-dialog"]/div';
        const progressXpath = '//*[@id="progress-progress-crudgestor"]/div/div/div[1]';

        // 1️⃣ Esperar el botón "Confirmar"
        const btnConfirmar = await driver.wait(
          until.elementLocated(By.xpath(btnConfirmarXpath)),
          20000
        );
        await driver.wait(until.elementIsVisible(btnConfirmar), 10000);
        await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", btnConfirmar);
        await driver.sleep(500);

        // 2️⃣ Clic en el botón
        try {
          await btnConfirmar.click();
        } catch {
          await driver.executeScript("arguments[0].click();", btnConfirmar);
        }
        console.log("✅ Paso 16: Botón 'Confirmar' presionado correctamente.");

        // 3️⃣ Esperar aparición del progress (máx 10s)
        let progressVisible = false;
        try {
          const progress = await driver.wait(
            until.elementLocated(By.xpath(progressXpath)),
            10000
          );
          await driver.wait(until.elementIsVisible(progress), 5000);
          progressVisible = true;
          console.log("⏳ Proceso iniciado... esperando que finalice.");
        } catch {
          console.log("⚠️ Progress no visible, continuando con espera general...");
        }

        // 4️⃣ Si apareció, esperar hasta que desaparezca (máx 60s)
        if (progressVisible) {
          const progress = await driver.findElement(By.xpath(progressXpath));
          await driver.wait(async () => {
            try {
              return !(await progress.isDisplayed());
            } catch {
              return true; // progress desapareció del DOM
            }
          }, 60000);
        }

        await driver.sleep(2000);
        console.log("✅ Paso 16: Proceso posterior a Confirmar completado correctamente.");
      } catch (error) {
        throw new Error(`❌ Paso 16: Error al confirmar configuración WiFi: ${error.message}`);
      }

      // === Paso 17: Clic en botón "Completar" y esperar proceso ===
      try {
        const btnCompletarXpath = '//*[@id="widget-button-complet-process"]/div';
        const progressXpath = '//*[@id="progress-progress-crudgestor"]/div/div/div[1]';

        // 1️⃣ Esperar el botón "Completar"
        const btnCompletar = await driver.wait(
          until.elementLocated(By.xpath(btnCompletarXpath)),
          20000
        );
        await driver.wait(until.elementIsVisible(btnCompletar), 10000);
        await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", btnCompletar);
        await driver.sleep(500);

        // 2️⃣ Clic con fallback
        try {
          await btnCompletar.click();
        } catch {
          await driver.executeScript("arguments[0].click();", btnCompletar);
        }
        console.log("✅ Paso 17: Botón 'Completar' presionado correctamente.");

        // 3️⃣ Esperar la aparición del progress (máx 10s)
        let progressVisible = false;
        try {
          const progress = await driver.wait(
            until.elementLocated(By.xpath(progressXpath)),
            10000
          );
          await driver.wait(until.elementIsVisible(progress), 5000);
          progressVisible = true;
          console.log("⏳ Proceso de 'Completar' iniciado... esperando que finalice.");
        } catch {
          console.log("⚠️ Progress no visible, continuando con espera general...");
        }

        // 4️⃣ Esperar a que el progress desaparezca (máx 60s)
        if (progressVisible) {
          const progress = await driver.findElement(By.xpath(progressXpath));
          await driver.wait(async () => {
            try {
              return !(await progress.isDisplayed());
            } catch {
              return true; // desapareció del DOM
            }
          }, 60000);
        }

        await driver.sleep(2000);
        console.log("✅ Paso 17: Proceso 'Completar' finalizado correctamente.");
      } catch (error) {
        throw new Error(`❌ Paso 17: Error al ejecutar el paso 'Completar': ${error.message}`);
      }


      // === Paso 18: Clic en botón "Sí" en el modal de confirmación ===
      try {
        const btnConfirmYesXpath = '//*[@id="widget-button-btConfirmYes"]/div';
        const progressXpath = '//*[@id="progress-progress-crudgestor"]/div/div/div[1]';

        // 1️⃣ Esperar el botón del modal
        const btnConfirmYes = await driver.wait(
          until.elementLocated(By.xpath(btnConfirmYesXpath)),
          15000
        );

        // 2️⃣ Esperar a que sea visible e interactuable
        await driver.wait(until.elementIsVisible(btnConfirmYes), 8000);
        await driver.wait(until.elementIsEnabled(btnConfirmYes), 8000);

        // 3️⃣ Scroll y clic (con fallback por JS)
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnConfirmYes);
        await driver.sleep(300);
        try {
          await btnConfirmYes.click();
        } catch {
          await driver.executeScript("arguments[0].click();", btnConfirmYes);
        }
        console.log("✅ Paso 18: Botón 'Sí' del modal presionado correctamente.");

        // 4️⃣ Esperar progress si aparece (máx 60s)
        try {
          const progress = await driver.wait(
            until.elementLocated(By.xpath(progressXpath)),
            8000
          );
          await driver.wait(until.elementIsVisible(progress), 5000);
          console.log("⏳ Procesando confirmación...");

          // Esperar a que el progress desaparezca
          await driver.wait(async () => {
            try {
              return !(await progress.isDisplayed());
            } catch {
              return true;
            }
          }, 60000);
          console.log("✅ Confirmación finalizada correctamente (progress cerrado).");
        } catch {
          console.log("⚠️ No se detectó progress, continuando normalmente...");
        }

        await driver.sleep(2000);
      } catch (error) {
        throw new Error(`❌ Paso 18: No se pudo confirmar la acción en el modal 'Sí': ${error.message}`);
      }

    } catch (error) {
      console.error(`❌ Error en el caso de prueba CP_GESORD_007: ${error.message}`);

      throw error;
    }
  }
  // =====================================================
  // CP_GESORD_00X: Ejecutar orden mantenimiento (cliente simulado) Actividad fisica
  // x pasos
  // =====================================================
  async ejecutarOrdenMantenimientoFisico(caseName = "CP_GESORD_00X", idDeal) {
    const driver = this.driver;

    try {
      // Paso 1: Seleccionar cliente
      await this.seleccionarClientePorIdDeal(idDeal);

      // Paso 2: Abrir menú de opciones
      const btnOpciones = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="btn-options"]')),
        10000
      );
      await driver.wait(until.elementIsVisible(btnOpciones), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", btnOpciones);
      await driver.sleep(300);
      await driver.executeScript("arguments[0].click();", btnOpciones);
      await driver.sleep(1000);

      console.log("✅ Paso 2: Botón 'Opciones' presionado correctamente.");

      // Paso 3: Seleccionar opción "Ejecutar orden" ===

      const opcionEjecutarXpath = '//*[@id="1094"]/div';

      // Esperar a que la opción esté visible en el menú
      const opcionEjecutar = await driver.wait(
        until.elementLocated(By.xpath(opcionEjecutarXpath)),
        15000
      );
      await driver.wait(until.elementIsVisible(opcionEjecutar), 5000);

      // Desplazar y hacer clic (con fallback a JS)
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", opcionEjecutar);
      await driver.sleep(500);

      try {
        await opcionEjecutar.click();
      } catch {
        await driver.executeScript("arguments[0].click();", opcionEjecutar);
      }

      await driver.sleep(3000);
      console.log("✅ Paso 3: Opción 'Ejecutar orden' seleccionada correctamente.");

      // === Paso 4: Clic en el botón "ONT" ===
      try {
        const btnONT = await driver.wait(
          until.elementLocated(
            By.xpath('//*[@id="widget-dialog-open-dialog-604576-5524-orderViewerGestor2"]/div/div/div[2]/div/div/div[1]/div[2]/div/div')
          ),
          15000
        );
        await driver.wait(until.elementIsVisible(btnONT), 8000);
        await driver.wait(until.elementIsEnabled(btnONT), 8000);

        // Scroll hasta el botón y clic
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnONT);
        await driver.sleep(300);

        try {
          await btnONT.click();
        } catch {
          await driver.executeScript("arguments[0].click();", btnONT);
        }

        console.log("✅ Paso 4: Botón 'ONT' presionado correctamente.");
        await driver.sleep(3000); // pequeña espera por la carga del proceso ONT

      } catch (error) {
        throw new Error(`❌ Paso 4: No se pudo presionar el botón 'ONT': ${error.message}`);
      }

      // === Paso 5: Clic en la opción "ADECUACIÓN FIBRA DROP" ===
      try {
        const opcionFibraDrop = await driver.wait(
          until.elementLocated(
            By.xpath('//*[@id="widget-dialog-view-process-child"]/div/div/div[2]/div/div/div/div[2]/div[3]/div[1]')
          ),
          20000
        );

        await driver.wait(until.elementIsVisible(opcionFibraDrop), 10000);
        await driver.wait(until.elementIsEnabled(opcionFibraDrop), 10000);

        // Hacer scroll hasta la opción y clic
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", opcionFibraDrop);
        await driver.sleep(500);

        try {
          await opcionFibraDrop.click();
        } catch {
          await driver.executeScript("arguments[0].click();", opcionFibraDrop);
        }

        console.log("✅ Paso 5: Opción 'ADECUACIÓN FIBRA DROP' seleccionada correctamente.");
        await driver.sleep(3000); // Espera breve por la acción

      } catch (error) {
        throw new Error(`❌ Paso 5: No se pudo seleccionar la opción 'ADECUACIÓN FIBRA DROP': ${error.message}`);
      }

      // === Paso 6: Clic en el subitem "ADECUACIÓN FIBRA DROP" desplegado ===
      try {
        const subItemFibraDrop = await driver.wait(
          until.elementLocated(
            By.xpath('//*[@id="widget-dialog-view-process-child"]/div/div/div[2]/div/div/div/div[2]/div[3]/div[1]/div[2]/div')
          ),
          20000
        );

        await driver.wait(until.elementIsVisible(subItemFibraDrop), 10000);
        await driver.wait(until.elementIsEnabled(subItemFibraDrop), 10000);

        // Hacer scroll hasta el subitem y clic
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", subItemFibraDrop);
        await driver.sleep(500);

        try {
          await subItemFibraDrop.click();
        } catch {
          await driver.executeScript("arguments[0].click();", subItemFibraDrop);
        }

        console.log("✅ Paso 6: Subitem 'ADECUACIÓN FIBRA DROP' seleccionado correctamente.");
        await driver.sleep(5000); // Espera breve por carga de la siguiente vista

      } catch (error) {
        throw new Error(`❌ Paso 6: No se pudo seleccionar el subitem 'ADECUACIÓN FIBRA DROP': ${error.message}`);
      }

      // === Paso 7: Clic en el botón "Siguiente" ===
      try {
        const btnSiguiente = await driver.wait(
          until.elementLocated(
            By.xpath('//*[@id="widget-button-btn-next-step"]/div')
          ),
          20000
        );

        await driver.wait(until.elementIsVisible(btnSiguiente), 10000);
        await driver.wait(until.elementIsEnabled(btnSiguiente), 10000);

        // Scroll al centro y clic
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnSiguiente);
        await driver.sleep(500);

        try {
          await btnSiguiente.click();
        } catch {
          await driver.executeScript("arguments[0].click();", btnSiguiente);
        }

        console.log("✅ Paso 7: Botón 'Siguiente' presionado correctamente.");
        await driver.sleep(4000); // Espera por carga del siguiente paso o modal

      } catch (error) {
        throw new Error(`❌ Paso 7: No se pudo presionar el botón 'Siguiente': ${error.message}`);
      }


      // === Paso 8: Diligenciar campo "Observaciones" ===
      try {
        const inputObservacionesXpath = '//*[@id="widget-textareafield-observation"]/textarea';

        // Esperar que el campo exista en el DOM
        const inputObservaciones = await driver.wait(
          until.elementLocated(By.xpath(inputObservacionesXpath)),
          20000
        );

        // Esperar que sea visible y habilitado
        await driver.wait(until.elementIsVisible(inputObservaciones), 10000);
        await driver.wait(until.elementIsEnabled(inputObservaciones), 10000);

        // Hacer scroll al campo
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", inputObservaciones);
        await driver.sleep(300);

        // Limpiar y diligenciar texto
        await inputObservaciones.clear();
        await driver.sleep(200);
        await inputObservaciones.sendKeys("test actividad fisica automatizacion");
        await driver.sleep(800);

        console.log("✅ Paso 8: Campo 'Observaciones' diligenciado correctamente.");

      } catch (error) {
        throw new Error(`❌ Paso 8: No se pudo diligenciar el campo 'Observaciones': ${error.message}`);
      }

      // === Paso 9: Clic en el botón "Guardar" ===
      try {
        const btnGuardarXpath = '//*[@id="widget-button-btn-save-report"]/div';

        // Esperar a que el botón exista
        const btnGuardar = await driver.wait(
          until.elementLocated(By.xpath(btnGuardarXpath)),
          20000
        );

        // Esperar que sea visible y habilitado
        await driver.wait(until.elementIsVisible(btnGuardar), 10000);
        await driver.wait(until.elementIsEnabled(btnGuardar), 10000);

        // Scroll y clic (con fallback por si falla)
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnGuardar);
        await driver.sleep(300);
        try {
          await btnGuardar.click();
        } catch {
          await driver.executeScript("arguments[0].click();", btnGuardar);
        }

        // Esperar posible progreso posterior
        console.log("✅ Paso 9: Botón 'Guardar' presionado correctamente. Esperando proceso...");
        await driver.sleep(5000);

      } catch (error) {
        throw new Error(`❌ Paso 9: No se pudo presionar el botón 'Guardar': ${error.message}`);
      }


      // === Paso 10: Clic en el botón "Siguiente" en el modal de mantenimiento ===
      try {
        const btnSiguienteXpath = '//*[@id="widget-button-complet-process"]/div';

        // 1️⃣ Esperar a que el botón exista y sea visible
        const btnSiguiente = await driver.wait(
          until.elementLocated(By.xpath(btnSiguienteXpath)),
          20000
        );
        await driver.wait(until.elementIsVisible(btnSiguiente), 10000);
        await driver.wait(until.elementIsEnabled(btnSiguiente), 10000);

        // 2️⃣ Scroll al botón y clic (fallback por si hay overlays)
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnSiguiente);
        await driver.sleep(300);
        try {
          await btnSiguiente.click();
        } catch {
          await driver.executeScript("arguments[0].click();", btnSiguiente);
        }

        console.log("✅ Paso 10: Botón 'Siguiente' presionado correctamente.");

        // // 3️⃣ Esperar posible progress posterior
        // try {
        //   const progressXpath = '//*[@id="progress-progress-crudgestor"]/div/div/div[1]';
        //   const progress = await driver.wait(
        //     until.elementLocated(By.xpath(progressXpath)),
        //     5000
        //   );
        //   await driver.wait(until.elementIsVisible(progress), 10000);
        //   console.log("⏳ Esperando a que finalice el proceso de mantenimiento...");
        //   await driver.wait(until.stalenessOf(progress), 5000);
        // } catch {
        //   console.log("⚠️ No se detectó progress visible después de presionar 'Siguiente'.");
        // }

        // await driver.sleep(2000);
        // console.log("✅ Paso 10: Proceso 'Siguiente' completado correctamente.");

      } catch (error) {
        throw new Error(`❌ Paso 10: No se pudo presionar el botón 'Siguiente' en el modal de mantenimiento: ${error.message}`);
      }

      // === Paso 11: Seleccionar opción "FALLA EN EQUIPOS DEL CLIENTE" ===
      try {
        const opcionFallaXpath = '//*[@id="widget-dialog-view-process-child"]/div/div/div[2]/div/div/div/div/div/div/div[2]/div[8]';

        // 1️⃣ Esperar que la opción exista en el DOM
        const opcionFalla = await driver.wait(
          until.elementLocated(By.xpath(opcionFallaXpath)),
          10000
        );
        await driver.wait(until.elementIsVisible(opcionFalla), 5000);

        // 2️⃣ Hacer scroll para que el elemento esté centrado
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", opcionFalla);
        await driver.sleep(2000);

        // 3️⃣ Intentar clic directo y con fallback JS
        try {
          await opcionFalla.click();
        } catch {
          await driver.executeScript("arguments[0].click();", opcionFalla);
        }

        await driver.sleep(1000);
        console.log("✅ Paso 11: Opción 'FALLA EN EQUIPOS DEL CLIENTE' seleccionada correctamente.");

      } catch (error) {
        throw new Error(`❌ Paso 11: No se pudo seleccionar la opción 'FALLA EN EQUIPOS DEL CLIENTE': ${error.message}`);
      }

      // === Paso 12: Clic en el botón "Completar" ===
      try {
        const btnCompletarXpath = '//*[@id="widget-button-complet-process"]/div';
        const progressXpath = '//*[@id="progress-progress-crudgestor"]/div/div/div[1]';

        // 1️⃣ Esperar que el botón exista y sea visible
        const btnCompletar = await driver.wait(
          until.elementLocated(By.xpath(btnCompletarXpath)),
          20000
        );
        await driver.wait(until.elementIsVisible(btnCompletar), 10000);
        await driver.wait(until.elementIsEnabled(btnCompletar), 10000);

        // 2️⃣ Scroll hasta el botón
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnCompletar);
        await driver.sleep(500);

        // 3️⃣ Clic directo con fallback JS
        try {
          await btnCompletar.click();
          await driver.sleep(5000);
        } catch {
          await driver.executeScript("arguments[0].click();", btnCompletar);
          await driver.sleep(5000);
        }

        console.log("✅ Paso 12: Botón 'Completar' presionado correctamente. Esperando posible progreso...");

        // // 4️⃣ Esperar aparición y finalización del progress (si existe)
        // try {
        //   const progress = await driver.wait(
        //     until.elementLocated(By.xpath(progressXpath)),
        //     10000
        //   );
        //   await driver.wait(until.elementIsVisible(progress), 10000);
        //   console.log("⏳ Progreso detectado. Esperando a que finalice...");

        //   await driver.wait(async () => {
        //     try {
        //       return !(await progress.isDisplayed());
        //     } catch {
        //       return true; // El progress ya desapareció del DOM
        //     }
        //   }, 60000);

        //   console.log("✅ Progreso completado correctamente.");
        // } catch {
        //   console.log("⚠️ No se detectó progress visible, continuando...");
        // }

        // await driver.sleep(2000);

      } catch (error) {
        throw new Error(`❌ Paso 12: No se pudo presionar el botón 'Completar': ${error.message}`);
      }


    } catch (error) {
      console.error(`❌ Error en el caso de prueba CP_GESORD_00X: ${error.message}`);

      throw error;
    }
  }

  // =====================================================
  // CP_GESORD_00X: Ejecutar orden mantenimiento (cliente simulado) Actividad lógica
  // x pasos
  // =====================================================
  async ejecutarOrdenMantenimientoLogico(caseName = "CP_GESORD_00X", idDeal) {
    const driver = this.driver;

    try {
      // Paso 1: Seleccionar cliente
      await this.seleccionarClientePorIdDeal(idDeal);

      // Paso 2: Abrir menú de opciones
      const btnOpciones = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="btn-options"]')),
        10000
      );
      await driver.wait(until.elementIsVisible(btnOpciones), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", btnOpciones);
      await driver.sleep(300);
      await driver.executeScript("arguments[0].click();", btnOpciones);
      await driver.sleep(1000);

      console.log("✅ Paso 2: Botón 'Opciones' presionado correctamente.");

      // Paso 3: Seleccionar opción "Ejecutar orden" ===

      const opcionEjecutarXpath = '//*[@id="1094"]/div';

      // Esperar a que la opción esté visible en el menú
      const opcionEjecutar = await driver.wait(
        until.elementLocated(By.xpath(opcionEjecutarXpath)),
        15000
      );
      await driver.wait(until.elementIsVisible(opcionEjecutar), 5000);

      // Desplazar y hacer clic (con fallback a JS)
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", opcionEjecutar);
      await driver.sleep(500);

      try {
        await opcionEjecutar.click();
      } catch {
        await driver.executeScript("arguments[0].click();", opcionEjecutar);
      }

      await driver.sleep(3000);
      console.log("✅ Paso 3: Opción 'Ejecutar orden' seleccionada correctamente.");

      // === Paso 4: Clic en el botón "ONT" ===
      try {
        const btnONT = await driver.wait(
          until.elementLocated(
            By.xpath('//*[@id="widget-dialog-open-dialog-604576-5524-orderViewerGestor2"]/div/div/div[2]/div/div/div[1]/div[2]/div/div')
          ),
          15000
        );
        await driver.wait(until.elementIsVisible(btnONT), 8000);
        await driver.wait(until.elementIsEnabled(btnONT), 8000);

        // Scroll hasta el botón y clic
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnONT);
        await driver.sleep(300);

        try {
          await btnONT.click();
        } catch {
          await driver.executeScript("arguments[0].click();", btnONT);
        }

        console.log("✅ Paso 4: Botón 'ONT' presionado correctamente.");
        await driver.sleep(3000); // pequeña espera por la carga del proceso ONT

      } catch (error) {
        throw new Error(`❌ Paso 4: No se pudo presionar el botón 'ONT': ${error.message}`);
      }


    } catch (error) {
      console.error(`❌ Error en el caso de prueba CP_GESORD_00X: ${error.message}`);

      throw error;
    }
  }

  // =====================================================
  // CP_GESORD_008 – Registro de materiales
  // x pasos
  // =====================================================
  async registroMateriales(caseName = "CP_GESORD_008", idDeal) {
    const driver = this.driver;

    try {
      // Paso 1: Seleccionar cliente
      await this.seleccionarClientePorIdDeal(idDeal);

      // Paso 2: Abrir menú de opciones
      const btnOpciones = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="btn-options"]')),
        10000
      );
      await driver.wait(until.elementIsVisible(btnOpciones), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", btnOpciones);
      await driver.sleep(300);
      await driver.executeScript("arguments[0].click();", btnOpciones);
      await driver.sleep(1000);

      console.log("✅ Paso 2: Botón 'Opciones' presionado correctamente.");
    } catch (error) {
      throw new Error(`❌ Paso 2: Error al intentar presionar el botón 'opciones': ${error.message}`);
    }

    // === Paso 3: Seleccionar opción "Registro de materiales" ===
    try {
      const opcionregistroMaterialesXpath = '//*[@id="1093"]/div';


      // 1️⃣ Esperar a que la opción esté disponible en el DOM
      const opcionregistroMateriales = await driver.wait(
        until.elementLocated(By.xpath(opcionregistroMaterialesXpath)),
        15000
      );

      // 2️⃣ Esperar a que sea visible e interactuable
      await driver.wait(until.elementIsVisible(opcionregistroMateriales), 9000);
      await driver.wait(until.elementIsEnabled(opcionregistroMateriales), 9000);

      // 3️⃣ Scroll y clic
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", opcionregistroMateriales);
      await driver.sleep(300);

      try {
        await opcionregistroMateriales.click();
      } catch {
        await driver.executeScript("arguments[0].click();", opcionregistroMateriales);
      }

      await driver.sleep(9000); // espera por la apertura del modal o acción
      console.log("✅ Paso 3: Opción 'Registro de materiales' seleccionada correctamente.");

    } catch (error) {
      throw new Error(`❌ Paso 3: No se pudo seleccionar la opción 'Registro de materiales': ${error.message}`);
    }

    //falta continuar los demás pasos....


  } catch(error) {
    console.error(`❌ Error en el caso de prueba CP_GESORD_008: ${error.message}`);

    throw error;
  }

  // =====================================================
  // CP_GESORD_009 – Revisar sesiones
  // x pasos
  // =====================================================
  async revisarSesiones(caseName = "CP_GESORD_009", idDeal) {
    const driver = this.driver;

    try {
      // Paso 1: Seleccionar cliente
      await this.seleccionarClientePorIdDeal(idDeal);

      // Paso 2: Abrir menú de opciones
      const btnOpciones = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="btn-options"]')),
        10000
      );
      await driver.wait(until.elementIsVisible(btnOpciones), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", btnOpciones);
      await driver.sleep(300);
      await driver.executeScript("arguments[0].click();", btnOpciones);
      await driver.sleep(1000);

      console.log("✅ Paso 2: Botón 'Opciones' presionado correctamente.");
    } catch (error) {
      throw new Error(`❌ Paso 2: Error al intentar presionar el botón 'opciones': ${error.message}`);
    }

    // === Paso 3: Seleccionar opción "Revisar sesiones" ===
    try {
      const opcionrevisarSesionesXpath = '//*[@id="1091"]/div';


      // 1️⃣ Esperar a que la opción esté disponible en el DOM
      const opcionrevisarSesiones = await driver.wait(
        until.elementLocated(By.xpath(opcionrevisarSesionesXpath)),
        15000
      );

      // 2️⃣ Esperar a que sea visible e interactuable
      await driver.wait(until.elementIsVisible(opcionrevisarSesiones), 9000);
      await driver.wait(until.elementIsEnabled(opcionrevisarSesiones), 9000);

      // 3️⃣ Scroll y clic
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", opcionrevisarSesiones);
      await driver.sleep(300);

      try {
        await opcionrevisarSesiones.click();
      } catch {
        await driver.executeScript("arguments[0].click();", opcionrevisarSesiones);
      }

      await driver.sleep(9000); // espera por la apertura del modal o acción
      console.log("✅ Paso 3: Opción 'Revisar sesiones' seleccionada correctamente.");

    } catch (error) {
      throw new Error(`❌ Paso 3: No se pudo seleccionar la opción 'Revisar sesiones': ${error.message}`);
    }

    // === Paso 4: Clic en el botón "Refrescar" dentro del modal "Revisar sesiones" ===
    try {
      // 1️⃣ Localizar el modal principal de "Revisar sesiones"
      const modalRevisarSesiones = await driver.wait(
        until.elementLocated(
          By.xpath('//*[@id="widget-dialog-open-dialog-604576-5524-orderViewerGestor2"]/div/div')
        ),
        15000
      );
      await driver.wait(until.elementIsVisible(modalRevisarSesiones), 8000);

      // 2️⃣ Buscar el botón de refrescar dentro del modal, con varios posibles niveles de jerarquía
      const posiblesRutas = [
        './/*[@id="crud-refresh-btn"]/i',
        './/*[@id="crud-refresh-btn"]',
        './/*[@id="crud-sessions-order"]/div/div[1]/div/div[2]',
        './/*[@id="crud-sessions-order"]/div/div[1]/div/div[2]/i'
      ];

      let btnRefrescar = null;
      for (const ruta of posiblesRutas) {
        try {
          btnRefrescar = await modalRevisarSesiones.findElement(By.xpath(ruta));
          if (btnRefrescar) break;
        } catch {
          continue;
        }
      }

      if (!btnRefrescar)
        throw new Error("No se encontró el botón 'Refrescar' dentro del modal 'Revisar sesiones'.");

      // 3️⃣ Esperar visibilidad y hacer clic
      await driver.wait(until.elementIsVisible(btnRefrescar), 6000);
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnRefrescar);
      await driver.sleep(400);

      try {
        await btnRefrescar.click();
      } catch {
        await driver.executeScript("arguments[0].click();", btnRefrescar);
      }

      // 4️⃣ Espera breve por recarga de datos
      await driver.sleep(4000);

      console.log("✅ Paso 4: Botón 'Refrescar' dentro del modal 'Revisar sesiones' presionado correctamente.");

    } catch (error) {
      throw new Error(
        `❌ Paso 4: No se pudo presionar el botón 'Refrescar' dentro del modal 'Revisar sesiones': ${error.message}`
      );
    }

    // === Paso 5: Clic en el botón "Reiniciar orden" ===
    try {
      const btnReiniciarOrdenXpath = '//*[@id="widget-button-btn-copy-raw-data"]/div';

      // 1️⃣ Esperar que el botón esté presente en el DOM
      const btnReiniciarOrden = await driver.wait(
        until.elementLocated(By.xpath(btnReiniciarOrdenXpath)),
        15000
      );

      // 2️⃣ Esperar que sea visible y esté habilitado
      await driver.wait(until.elementIsVisible(btnReiniciarOrden), 8000);
      await driver.wait(until.elementIsEnabled(btnReiniciarOrden), 8000);

      // 3️⃣ Scroll al botón y clic (con fallback)
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnReiniciarOrden);
      await driver.sleep(400);

      try {
        await btnReiniciarOrden.click();
      } catch {
        await driver.executeScript("arguments[0].click();", btnReiniciarOrden);
      }

      // 4️⃣ Esperar unos segundos por la ejecución del reinicio
      await driver.sleep(4000);

      console.log("✅ Paso 5: Botón 'Reiniciar orden' presionado correctamente.");

    } catch (error) {
      throw new Error(
        `❌ Paso 5: No se pudo presionar el botón 'Reiniciar orden': ${error.message}`
      );
    }


    // === Paso 6: Clic en el botón "Sí" en el modal de confirmación (con espera del progress) ===
    try {
      const btnConfirmarSiXpath = '//*[@id="widget-button-btConfirmYes"]/div';
      const progressXpath = '//*[contains(@id,"progress")]'; // detecta cualquier progress visible

      // 1️⃣ Esperar a que el botón esté presente y visible
      const btnConfirmarSi = await driver.wait(
        until.elementLocated(By.xpath(btnConfirmarSiXpath)),
        15000
      );
      await driver.wait(until.elementIsVisible(btnConfirmarSi), 8000);
      await driver.wait(until.elementIsEnabled(btnConfirmarSi), 8000);

      // 2️⃣ Hacer scroll y clic con fallback a JS
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", btnConfirmarSi);
      await driver.sleep(300);
      try {
        await btnConfirmarSi.click();
      } catch {
        await driver.executeScript("arguments[0].click();", btnConfirmarSi);
      }

      console.log("✅ Paso 6: Botón 'Sí' en el modal de confirmación presionado correctamente.");
      await driver.sleep(1000);

      // 3️⃣ Esperar a que aparezca el progress
      try {
        console.log("⏳ Esperando a que aparezca el progress...");
        const progressElem = await driver.wait(
          until.elementLocated(By.xpath(progressXpath)),
          10000
        );
        await driver.wait(until.elementIsVisible(progressElem), 10000);
        console.log("⚙️ Progress detectado. Esperando a que finalice...");

        // 4️⃣ Esperar hasta que desaparezca o deje de estar visible (máx. 60 s)
        await driver.wait(async () => {
          const elems = await driver.findElements(By.xpath(progressXpath));
          if (elems.length === 0) return true;
          const visible = await elems[0].isDisplayed().catch(() => false);
          return !visible;
        }, 60000);

        console.log("✅ Proceso completado. El progress ha desaparecido.");
      } catch {
        console.log("ℹ️ No se detectó progress visible tras confirmar, posible proceso rápido.");
      }

      await driver.sleep(1500);
    } catch (error) {
      throw new Error(`❌ Paso 6: Error al confirmar y esperar el progreso: ${error.message}`);
    }


    // === Paso 7: Clic en el botón "Desbloquear gestión" ===
    try {
      const btnDesbloquearXpath = '//*[@id="widget-button-btn-unlock-raw-data"]/div';

      // 1️⃣ Esperar que el botón exista y esté visible
      const btnDesbloquear = await driver.wait(
        until.elementLocated(By.xpath(btnDesbloquearXpath)),
        15000
      );
      await driver.wait(until.elementIsVisible(btnDesbloquear), 8000);
      await driver.wait(until.elementIsEnabled(btnDesbloquear), 8000);

      // 2️⃣ Scroll y clic (con fallback JS)
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnDesbloquear);
      await driver.sleep(500);

      try {
        await btnDesbloquear.click();
      } catch {
        await driver.executeScript("arguments[0].click();", btnDesbloquear);
      }

      console.log("✅ Paso 7: Botón 'Desbloquear gestión' presionado correctamente.");
      await driver.sleep(4000); // pequeña espera por acción posterior

    } catch (error) {
      throw new Error(`❌ Paso 7: No se pudo presionar el botón 'Desbloquear gestión': ${error.message}`);
    }


    // === Paso 8: Clic en "Sí" en el modal de confirmación ===
    try {
      const btnConfirmarYesXpath = '//*[@id="widget-button-btConfirmYes"]/div';
      const progressXpath = '//*[@id="progress-progress-crudgestor"]/div/div/div[1]'; // progress visible durante ejecución

      // 1️⃣ Esperar a que el botón "Sí" esté presente
      const btnConfirmarYes = await driver.wait(
        until.elementLocated(By.xpath(btnConfirmarYesXpath)),
        15000
      );
      await driver.wait(until.elementIsVisible(btnConfirmarYes), 8000);

      // 2️⃣ Scroll y clic (con fallback JS)
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnConfirmarYes);
      await driver.sleep(500);
      try {
        await btnConfirmarYes.click();
      } catch {
        await driver.executeScript("arguments[0].click();", btnConfirmarYes);
      }

      console.log("✅ Paso 8: Botón 'Sí' en el modal presionado correctamente. Esperando proceso...");

      // 3️⃣ Esperar que aparezca el progress (inicio del proceso)
      try {
        const progressElement = await driver.wait(
          until.elementLocated(By.xpath(progressXpath)),
          10000
        );
        await driver.wait(until.elementIsVisible(progressElement), 10000);
      } catch {
        console.log("⚠️ El progress no apareció visualmente, continuando...");
      }

      // 4️⃣ Esperar que el progress desaparezca (fin del proceso)
      try {
        await driver.wait(async () => {
          const progress = await driver.findElements(By.xpath(progressXpath));
          if (progress.length === 0) return true;
          const visible = await progress[0].isDisplayed().catch(() => false);
          return !visible;
        }, 60000); // hasta 1 minuto máximo
        console.log("✅ Proceso completado: progress finalizado.");
      } catch {
        console.log("⚠️ El progress no desapareció completamente tras 60s, continuando...");
      }

      await driver.sleep(1000);

    } catch (error) {
      throw new Error(`❌ Paso 8: No se pudo confirmar el modal con 'Sí' o falló el proceso: ${error.message}`);
    }


    // === Paso 9: Clic en el botón "Cerrar" ===
    try {
      const btnCerrarXpath = '//*[@id="widget-button-close-detail-process"]/div';

      // 1️⃣ Esperar que el botón exista en el DOM
      const btnCerrar = await driver.wait(
        until.elementLocated(By.xpath(btnCerrarXpath)),
        15000
      );

      // 2️⃣ Asegurar visibilidad y que esté habilitado
      await driver.wait(until.elementIsVisible(btnCerrar), 8000);
      await driver.wait(until.elementIsEnabled(btnCerrar), 8000);

      // 3️⃣ Scroll hacia el botón
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnCerrar);
      await driver.sleep(500);

      // 4️⃣ Intentar clic directo, fallback a JS si es necesario
      try {
        await btnCerrar.click();
      } catch {
        await driver.executeScript("arguments[0].click();", btnCerrar);
      }

      console.log("✅ Paso 9: Botón 'Cerrar' presionado correctamente.");

      // 5️⃣ Esperar brevemente para permitir el cierre del modal o proceso
      await driver.sleep(3000);

    } catch (error) {
      throw new Error(`❌ Paso 9: No se pudo presionar el botón 'Cerrar': ${error.message}`);
    }




  } catch(error) {
    console.error(`❌ Error en el caso de prueba CP_GESORD_009: ${error.message}`);

    throw error;
  }
  // =====================================================
  // CP_GESORD_010 – Reabrir orden
  // x pasos
  // =====================================================
  async reabrirOrden(caseName = "CP_GESORD_010", idDeal) {
    const driver = this.driver;

    try {
      // Paso 1: Seleccionar cliente
      await this.seleccionarClientePorIdDeal(idDeal);

      // Paso 2: Abrir menú de opciones
      const btnOpciones = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="btn-options"]')),
        10000
      );
      await driver.wait(until.elementIsVisible(btnOpciones), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", btnOpciones);
      await driver.sleep(300);
      await driver.executeScript("arguments[0].click();", btnOpciones);
      await driver.sleep(1000);

      console.log("✅ Paso 2: Botón 'Opciones' presionado correctamente.");
    } catch (error) {
      throw new Error(`❌ Paso 2: Error al intentar presionar el botón 'opciones': ${error.message}`);
    }

    // === Paso 3: Seleccionar opción "Reabrir orden" ===
    try {
      const opcionreabrirOrdenXpath = '//*[@id="1092"]/div';


      // 1️⃣ Esperar a que la opción esté disponible en el DOM
      const opcionreabrirOrden = await driver.wait(
        until.elementLocated(By.xpath(opcionreabrirOrdenXpath)),
        15000
      );

      // 2️⃣ Esperar a que sea visible e interactuable
      await driver.wait(until.elementIsVisible(opcionreabrirOrden), 9000);
      await driver.wait(until.elementIsEnabled(opcionreabrirOrden), 9000);

      // 3️⃣ Scroll y clic
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", opcionreabrirOrden);
      await driver.sleep(300);

      try {
        await opcionreabrirOrden.click();
      } catch {
        await driver.executeScript("arguments[0].click();", opcionreabrirOrden);
      }

      await driver.sleep(9000); // espera por la apertura del modal o acción
      console.log("✅ Paso 3: Opción 'Reabrir orden' seleccionada correctamente.");

    } catch (error) {
      throw new Error(`❌ Paso 3: No se pudo seleccionar la opción 'Reabrir orden': ${error.message}`);
    }

    //falta continuar los demás pasos....


  } catch(error) {
    console.error(`❌ Error en el caso de prueba CP_GESORD_010: ${error.message}`);

    throw error;
  }
}




