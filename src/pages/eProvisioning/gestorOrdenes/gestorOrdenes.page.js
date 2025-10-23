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
  constructor(driver, defaultIdDeal = '28006757991') {
    this.driver = driver;
    this.defaultIdDeal = defaultIdDeal; // 👈 ID_DEAL global reutilizable
  }

  /**
   * Selecciona un cliente por ID_DEAL.
   * Si no se envía `idDeal`, se usa el `defaultIdDeal` del constructor.
   */
  async seleccionarClientePorIdDeal(idDeal) {
    const driver = this.driver;
    const idBuscar = idDeal || this.defaultIdDeal; // 👈 Aquí se usa la propiedad global

    const gridTbodyXpath =
      '//div[contains(@id,"grid-table-crud-grid") and contains(@id,"CustomerManager")]//table/tbody';

    const cuerpoTabla = await driver.wait(
      until.elementLocated(By.xpath(gridTbodyXpath)),
      15000
    );
    await driver.wait(until.elementIsVisible(cuerpoTabla), 5000);

    const filas = await cuerpoTabla.findElements(By.xpath('./tr'));
    if (filas.length === 0) throw new Error('No se encontraron filas en la tabla.');

    let filaSeleccionada = null;
    for (const fila of filas) {
      try {
        const tdDeal = await fila.findElement(By.xpath('.//*[@id="cuentaCustomer"]'));
        const texto = (await tdDeal.getText()).trim();
        if (texto === idBuscar) {        // comparación exacta del ID_DEAL
          filaSeleccionada = fila;
          break;
        }
      } catch {
        continue;
      }
    }

    if (!filaSeleccionada) {
      throw new Error(`No se encontró cliente con ID_DEAL "${idBuscar}"`);
    }

    await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', filaSeleccionada);
    await driver.sleep(300);
    try {
      await filaSeleccionada.click();
    } catch {
      await driver.executeScript('arguments[0].click();', filaSeleccionada);
    }
    await driver.sleep(800);
    console.log(`✅ Cliente con ID_DEAL "${idBuscar}" seleccionado.`);
  }

  // === CP_GESORD_001 - Ingreso al Gestor de Órdenes ===
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


  // === CP_GESORD_003 - Orden Mantenimiento ===
  async ordenMantenimiento() {
    const driver = this.driver;

    try {
  // 🔹 Filtro inicial por tipo de orden
  await driver.findElement(By.xpath("//div[@id='widget-button-btn-add-filter']/div")).click();
  await driver.findElement(By.name("qb_80898_rule_0_filter")).click();
  await new Select(driver.findElement(By.name("qb_80898_rule_0_filter"))).selectByVisibleText("TIPO DE ORDEN");
  const tipoOrden = await driver.findElement(By.name("qb_80898_rule_0_value_0"));
  await tipoOrden.clear();
  await tipoOrden.sendKeys("ORDEN - MANTENIMIENTO");

  // 🔹 Filtro adicional por ID_DEAL
  await driver.findElement(By.xpath("//div[@id='qb_80898_group_0']/div/div/button")).click();
  await driver.findElement(By.name("qb_80898_rule_1_filter")).click();
  await new Select(driver.findElement(By.name("qb_80898_rule_1_filter"))).selectByVisibleText("ID_DEAL");
  const idDeal = await driver.findElement(By.name("qb_80898_rule_1_value_0"));
  await idDeal.clear();
  await idDeal.sendKeys("28006956314");

  await driver.findElement(By.xpath("//div[@id='widget-button-btn-apply-filter-element']/div")).click();

  // 🔹 Selección de orden y apertura de menú de opciones
  await driver.findElement(By.xpath("//td[@id='departamento']")).click();
  await driver.findElement(By.xpath("//td[@id='provisioningOrderId']")).click();
  await driver.findElement(By.xpath("(.//*[normalize-space(text()) and normalize-space(.)='RawData'])[1]/preceding::div[1]")).click();
  await driver.findElement(By.xpath("//li[@id='1094']/div")).click();

  // 🔹 Ejecución de varias acciones dentro del diálogo
  const acciones = [
    "//div[@id='widget-dialog-open-dialog-604172-5524-orderViewerGestor2']/div/div/div[2]/div/div/div/div[2]/div/div/div[3]",
    "//div[@id='widget-dialog-open-dialog-604172-5524-orderViewerGestor2']/div/div/div[2]/div/div/div/div[2]/div/div/div[2]",
    "//div[@id='widget-dialog-open-dialog-604172-5524-orderViewerGestor2']/div/div/div[2]/div/div/div/div[2]/div/div/div[4]"
  ];

  for (const accion of acciones) {
    await driver.findElement(By.xpath(accion)).click();
    await driver.findElement(By.xpath("//div[@id='widget-dialog-view-process-child']/div/div/div[2]/div/div/div/div[2]/div[3]/div/div/span")).click();
    await driver.findElement(By.xpath("//div[@id='widget-dialog-view-process-child']/div/div/div[2]/div/div/div/div[2]/div[3]/div/div[2]/div")).click();
    await driver.findElement(By.xpath("(.//*[normalize-space(text()) and normalize-space(.)='ATRÁS'])[1]/following::div[2]")).click();

    const obs = await driver.findElement(By.xpath("//div[@id='widget-textareafield-observation']/textarea"));
    await obs.clear();
    await obs.sendKeys("test");
    await driver.findElement(By.xpath("//div[@id='widget-button-btn-save-report']/div")).click();
  }

  // 🔹 Configuración de datos técnicos
  await driver.findElement(By.id("textfield-SerialONT")).clear();
  await driver.findElement(By.id("textfield-SerialONT")).sendKeys("485754435A2DBCA6");

  await driver.findElement(By.id("textfield-VelocidadSubida")).clear();
  await driver.findElement(By.id("textfield-VelocidadSubida")).sendKeys("100");

  await driver.findElement(By.id("textfield-VelocidadBajada")).clear();
  await driver.findElement(By.id("textfield-VelocidadBajada")).sendKeys("100");

  // 🔹 Configuración de WiFi
  await driver.findElement(By.xpath("//div[@id='widget-button-btn-configure-wifi-img']/div")).click();
  await driver.findElement(By.xpath("//div[@id='widget-checkbox-check-step-validation-wifi']/label")).click();
  await driver.findElement(By.id("textfield-SSID")).clear();
  await driver.findElement(By.id("textfield-SSID")).sendKeys("qweqw");
  await driver.findElement(By.id("textfield-PasswordOneSSID")).clear();
  await driver.findElement(By.id("textfield-PasswordOneSSID")).sendKeys("123123123");
  await driver.findElement(By.xpath("//div[@id='widget-button-btn-confirm-dialog']/div")).click();

  // 🔹 Potencia NAP
  const potencia = await driver.findElement(By.id("textfield-PotenciaNAP"));
  await potencia.clear();
  await potencia.sendKeys("12");

  // 🔹 Comentarios y cierre
  await driver.findElement(By.css("#widget-textareafield-Observations > textarea")).sendKeys("test");
  await driver.findElement(By.css("#widget-textareafield-observation > textarea")).sendKeys("tst");

  // 🔹 Confirmación final
  await driver.findElement(By.xpath("//div[@id='widget-button-btn-terminar']/div")).click();

    console.log("✅ Proceso 'ORDEN - VENTA E INSTALACION' ejecutado con éxito.");
  } catch (err) {
    console.error("❌ Error durante la ejecución:", err);
  } finally {
    await driver.quit();
  }
  }

//module.exports = { ordenVentaEInstalacion };

}
