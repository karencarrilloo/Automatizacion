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
  //  CP_GESORD_002 – Filtro de búsqueda cliente por ID_DEAL
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

    } catch (error) {
      if (this._capturarError) await this._capturarError(error, caseName);
      throw error;
    }

  }

  // =====================================================
  // CP_GESORD_00X – Ejecutar orden venta e instalación
  // x pasos
  // =====================================================
  async ejecutarOrdenVentaInstalacion(caseName = "CP_GESORD_003", idDeal) {
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

      console.log(`✅ ${caseName}: Proceso 'ORDEN - VENTA E INSTALACIÓN' ejecutado con éxito.`);
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);

      throw error;
    }
  }

}
