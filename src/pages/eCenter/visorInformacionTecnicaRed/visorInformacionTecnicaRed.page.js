import { By, until } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

export default class VisorInformacionTecnicaRedPage {
  constructor(driver) {
    this.driver = driver;
  }

  /**
   * ====================================
   * CP_NFTECRED_001 – Ingreso a la vista
   * ====================================
   * 
   */
  async ingresarVistaVisorInformacion(caseName = 'CP_VISOR_INFO_TECNICA_001') {
    const driver = this.driver;

    try {
      // === Paso 1: Clic en módulo eCenter ===
      const eCenterBtn = await driver.wait(
        until.elementLocated(By.xpath("//div[@id='118' and contains(@class, 'item-module')]")),
        10000
      );
      await driver.executeScript("arguments[0].click();", eCenterBtn);
      await driver.sleep(1000);
      console.log("✅ [CP_VISOR_INFO_TECNICA_001] Paso 1: Módulo eCenter presionado.");

      // === Paso 2: Scroll en el contenedor de aplicaciones ===
      const scrollContainer = await driver.wait(
        until.elementLocated(By.css('.container-applications')),
        10000
      );
      await driver.executeScript(
        "arguments[0].scrollTop = arguments[0].scrollHeight;",
        scrollContainer
      );
      await driver.sleep(1000);
      console.log("✅ [CP_VISOR_INFO_TECNICA_001] Paso 2: Scroll en contenedor de aplicaciones.");

      // === Paso 3: Clic en "Visor de información técnica de red" ===
      const visorInfoTecnica = await driver.wait(
        until.elementLocated(
          By.xpath(
            '//div[@class="application-item" and @title="Visor de información técnica de red" and @data-name="Active_ports"]'
          )
        ),
        10000
      );

      await driver.wait(until.elementIsVisible(visorInfoTecnica), 5000);
      await driver.wait(until.elementIsEnabled(visorInfoTecnica), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", visorInfoTecnica);
      await driver.sleep(500);
      await visorInfoTecnica.click();
      await driver.sleep(3000);
      console.log("✅ [CP_VISOR_INFO_TECNICA_001] Paso 3: Vista 'Visor de información técnica de red' abierta.");

    } catch (error) {
      console.error(`❌ [CP_VISOR_INFO_TECNICA_001] Error: ${error.message}`);

      // // Captura de pantalla en caso de fallo
      // const screenshot = await driver.takeScreenshot();
      // const errorsRoot = path.resolve(__dirname, '../../../../errors', 'visorInformacionTecnicaRed', caseName);
      // fs.mkdirSync(errorsRoot, { recursive: true });
      // const filePath = path.join(errorsRoot, `error_${Date.now()}.png`);
      // fs.writeFileSync(filePath, screenshot, 'base64');
      throw error;
    }
  }

  // =====================================================
// CP_INFTECRED_002: Filtro de búsqueda
// =====================================================
async filtroBusquedaInformacionTecnica(caseName = 'CP_INFTECRED_002') {
  const driver = this.driver;

  try {
    // === Paso 4: Clic en el botón "Mostrar filtro" ===
    const botonMostrarFiltro = await driver.wait(
      until.elementLocated(By.id("widget-button-btn-show-filter")),
      10000
    );
    await driver.wait(until.elementIsVisible(botonMostrarFiltro), 5000);
    await driver.wait(until.elementIsEnabled(botonMostrarFiltro), 5000);
    await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonMostrarFiltro);
    await driver.sleep(500);
    await botonMostrarFiltro.click();
    await driver.sleep(1000);
    console.log("✅ Paso 4: Clic en el botón 'Mostrar filtro' ejecutado correctamente.");

    // === Paso 5: Clic en el <select> para mostrar opciones del filtro ===
    const grupoFiltro = await driver.wait(until.elementLocated(By.css('.rules-group-container')), 10000);
    const contenedorFiltro = await grupoFiltro.findElement(By.css('.rule-filter-container'));
    const selectFiltro = await contenedorFiltro.findElement(By.css('select'));
    await driver.wait(until.elementIsVisible(selectFiltro), 5000);
    await driver.wait(until.elementIsEnabled(selectFiltro), 5000);
    await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", selectFiltro);
    await driver.sleep(500);
    await selectFiltro.click();
    await driver.sleep(1500);

    // === Paso 6: Seleccionar "CENTRO POBLADO" ===
    const selectCampo = await grupoFiltro.findElement(By.css('select'));
    await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", selectCampo);
    await selectCampo.click();
    await driver.sleep(500);
    await selectCampo.sendKeys("CENTRO POBLADO");
    await driver.sleep(2000);
    console.log("✅ Paso 6: Filtro 'CENTRO POBLADO' seleccionado.");

    // === Paso 7: Escribir “PALMIRA” en el campo de texto ===
    const textareaCampo = await driver.wait(until.elementLocated(By.css('textarea.form-control')), 10000);
    await driver.wait(until.elementIsVisible(textareaCampo), 5000);
    await textareaCampo.click();
    await driver.sleep(300);
    await textareaCampo.clear();
    await textareaCampo.sendKeys("PALMIRA");
    await driver.sleep(1000);
    console.log("✅ Paso 7: Campo de texto diligenciado con 'PALMIRA'.");

    // === Paso 8: Clic en “Aplicar filtros” ===
    const botonAplicarFiltro = await driver.wait(
      until.elementLocated(By.xpath('//*[@id="widget-button-btn-set-filter"]/div')),
      10000
    );
    await driver.wait(until.elementIsVisible(botonAplicarFiltro), 5000);
    await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonAplicarFiltro);
    await driver.sleep(500);
    await botonAplicarFiltro.click();
    await driver.sleep(3000);
    console.log("✅ Paso 8: Clic en 'Aplicar filtro' realizado.");

    // === Paso 9: Clic nuevamente en “Mostrar filtro” ===
    const botonMostrarFiltro2 = await driver.wait(
      until.elementLocated(By.id("widget-button-btn-show-filter")),
      10000
    );
    await driver.wait(until.elementIsVisible(botonMostrarFiltro2), 5000);
    await driver.wait(until.elementIsEnabled(botonMostrarFiltro2), 5000);
    await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonMostrarFiltro2);
    await driver.sleep(500);
    await botonMostrarFiltro2.click();
    await driver.sleep(1000);
    console.log("✅ Paso 9: Botón 'Mostrar filtro' clickeado nuevamente.");

    // === Paso 10: Clic en el botón "+ Add rule" ===
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
    console.log("✅ Paso 10: Botón '+ Add rule' presionado.");

    // === Paso 11: Clic en select del segundo filtro ===
    const grupoFiltro2 = await driver.wait(until.elementLocated(By.css('.rules-group-container')), 10000);
    const contenedorFiltro2 = await grupoFiltro2.findElement(By.css('.rule-filter-container'));
    const selectFiltro2 = await contenedorFiltro2.findElement(By.css('select'));
    await driver.wait(until.elementIsVisible(selectFiltro2), 5000);
    await driver.wait(until.elementIsEnabled(selectFiltro2), 5000);
    await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", selectFiltro2);
    await driver.sleep(500);
    await selectFiltro2.click();
    await driver.sleep(1500);
    console.log("✅ Paso 11: Select del segundo filtro abierto.");

    // === Paso 12: Seleccionar “NAP SERIAL CELSIA” ===
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
      if (texto === "NAP SERIAL CELSIA") {
        await opcion.click();
        break;
      }
    }
    await driver.sleep(1000);
    console.log("✅ Paso 12: 'NAP SERIAL CELSIA' seleccionado.");

    // === Paso 13: Diligenciar campo “3241009” ===
    const segundoFiltroBlock = await driver.wait(
      until.elementLocated(By.xpath('(//div[contains(@class,"rule-container")])[2]')),
      10000
    );
    const textarea = await segundoFiltroBlock.findElement(By.css('textarea'));
    await driver.wait(until.elementIsVisible(textarea), 5000);
    await textarea.clear();
    await textarea.sendKeys("3241009");
    await driver.sleep(1000);
    console.log("✅ Paso 13: Valor '3241009' diligenciado.");

    // === Paso 14: Clic en “Aplicar filtro” nuevamente ===
    const botonAplicarFiltro2 = await driver.wait(
      until.elementLocated(By.xpath('//*[@id="widget-button-btn-set-filter"]/div')),
      10000
    );
    await driver.wait(until.elementIsVisible(botonAplicarFiltro2), 5000);
    await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonAplicarFiltro2);
    await driver.sleep(300);
    await botonAplicarFiltro2.click();
    await driver.sleep(5000);
    console.log("✅ Paso 14: Filtro aplicado correctamente.");

  } catch (error) {
    if (this._capturarError) await this._capturarError(error, caseName);
    throw error;
  }
}

// =====================================================
// CP_INFTECRED_003: Ver dispositivos
// =====================================================
async verDispositivos(caseName = 'CP_INFTECRED_003') {
  const driver = this.driver;

  try {
    // === Paso 15: Seleccionar registro por Serial ONT (con Actions) ===
    const serial = "48575443702166A5";

    // 1. Localizar la celda que contiene el serial
    const tdSerial = await driver.wait(
      until.elementLocated(By.xpath(`//td[contains(normalize-space(.), '${serial}')]`)),
      10000
    );

    // 2. Asegurar visibilidad
    await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", tdSerial);
    await driver.wait(until.elementIsVisible(tdSerial), 5000);

    // 3. Usar Actions para hacer clic real
    const actions = driver.actions({ async: true });
    await actions.move({ origin: tdSerial }).click().perform();
    await driver.sleep(1000);

    // 4. Subir al tr padre y validar que tiene la clase 'active'
    const trElemento = await tdSerial.findElement(By.xpath("./ancestor::tr"));
    await driver.wait(async () => {
      const clase = await trElemento.getAttribute("class");
      return clase.includes("active");
    }, 5000, "El registro no se marcó como activo después del clic");

    console.log(`✅ Paso 15: Registro con Serial ONT '${serial}' seleccionado correctamente y marcado como activo.`);

    // === Paso 16: Clic en el botón "Ver dispositivos" ===
    const btnVerDispositivosXpath = '//*[@id="widget-button-btn-view-amplifiers"]/div';

    // 1. Esperar a que el botón esté presente
    const btnVerDispositivos = await driver.wait(
      until.elementLocated(By.xpath(btnVerDispositivosXpath)),
      10000
    );

    // 2. Asegurarse de que esté visible
    await driver.wait(until.elementIsVisible(btnVerDispositivos), 5000);

    // 3. Scroll y clic (con fallback a JS)
    await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnVerDispositivos);
    await driver.sleep(300);

    try {
      await btnVerDispositivos.click();
    } catch {
      await driver.executeScript("arguments[0].click();", btnVerDispositivos);
    }

    await driver.sleep(2000);
    console.log("✅ Paso 16: Botón 'Ver dispositivos' presionado correctamente.");

    // === Paso 17: Cerrar modal "Ver dispositivos" ===
    const modalXpath = '//*[@id="widget-dialog-dialog-view-amplifiers"]/div/div';
    const btnCerrarXpath = '//*[@id="widget-dialog-dialog-view-amplifiers"]/div/div/div[1]/button';

    // 1. Esperar a que el modal esté visible
    const modal = await driver.wait(
      until.elementLocated(By.xpath(modalXpath)),
      10000
    );
    await driver.wait(until.elementIsVisible(modal), 5000);

    // 2. Localizar el botón de cerrar
    const btnCerrar = await driver.wait(
      until.elementLocated(By.xpath(btnCerrarXpath)),
      10000
    );
    await driver.wait(until.elementIsVisible(btnCerrar), 5000);

    // 3. Scroll y clic (fallback a JS)
    await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnCerrar);
    await driver.sleep(300);

    try {
      await btnCerrar.click();
    } catch {
      await driver.executeScript("arguments[0].click();", btnCerrar);
    }
    await driver.sleep(2000);

    // 4. Esperar que el modal ya no sea visible
    await driver.wait(async () => {
      const isDisplayed = await modal.isDisplayed().catch(() => false);
      return !isDisplayed;
    }, 10000);

    console.log("✅ Paso 17: Modal 'Ver dispositivos' cerrado correctamente.");

  } catch (error) {
    if (this._capturarError) await this._capturarError(error, caseName);
    throw error;
  }
}

// =====================================================
// CP_INFTECRED_004: Editar estado
// Pasos 18 a 23
// =====================================================
async editarEstado(caseName = 'CP_INFTECRED_004') {
  const driver = this.driver;

  try {
    // === Paso 18: Clic en el botón "Editar estado" ===
    const btnEditarEstadoXpath = '//*[@id="widget-button-btn-edit-status"]/div';

    const btnEditarEstado = await driver.wait(
      until.elementLocated(By.xpath(btnEditarEstadoXpath)),
      10000
    );
    await driver.wait(until.elementIsVisible(btnEditarEstado), 5000);
    await driver.wait(until.elementIsEnabled(btnEditarEstado), 5000);

    await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnEditarEstado);
    await driver.sleep(300);

    try {
      await btnEditarEstado.click();
      await driver.sleep(3000);
    } catch {
      await driver.executeScript("arguments[0].click();", btnEditarEstado);
      await driver.sleep(3000);
    }

    console.log("✅ Paso 18: Botón 'Editar estado' clickeado correctamente.");

    // === Paso 19: Abrir el menú desplegable de "Estado" ===
    const selectEstadoXpath = '//*[@id="input-select-select-status-order"]';
    const selectEstado = await driver.wait(
      until.elementLocated(By.xpath(selectEstadoXpath)),
      10000
    );

    await driver.wait(until.elementIsVisible(selectEstado), 5000);
    await driver.wait(until.elementIsEnabled(selectEstado), 5000);

    await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", selectEstado);
    await driver.sleep(300);
    await selectEstado.click();
    await driver.sleep(1000);

    console.log("✅ Paso 19: Menú desplegable 'Estado de orden' abierto correctamente.");

    // === Paso 20: Seleccionar opción "Suspendido" ===
    const opcionSuspendidoXpath = '//*[@id="input-select-select-status-order"]/option[4]';
    const selectXpath = '//*[@id="input-select-select-status-order"]';

    const opcionSuspendido = await driver.wait(
      until.elementLocated(By.xpath(opcionSuspendidoXpath)),
      10000
    );
    await driver.wait(until.elementIsVisible(opcionSuspendido), 5000);

    await opcionSuspendido.click();
    await driver.sleep(800);

    const selectElement = await driver.findElement(By.xpath(selectXpath));
    await driver.executeScript("arguments[0].blur();", selectElement);
    await driver.sleep(800);

    console.log("✅ Paso 20: Opción 'Suspendido' seleccionada y desplegable cerrado.");

    // === Paso 21: Guardar cambios (clic en "Editar estado" → Guardar) ===
    const btnGuardarXpath = '//*[@id="widget-button-btn-edit-status-save"]/div';
    const btnGuardar = await driver.wait(
      until.elementLocated(By.xpath(btnGuardarXpath)),
      10000
    );

    await driver.wait(until.elementIsVisible(btnGuardar), 5000);
    await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnGuardar);
    await driver.sleep(300);
    await driver.executeScript("arguments[0].click();", btnGuardar);
    await driver.sleep(3000);

    console.log("✅ Paso 21: Botón 'Editar estado (guardar)' presionado correctamente.");

    // === Paso 22: Clic nuevamente en el botón "Editar estado" ===
    const btnEditarEstado2 = await driver.wait(
      until.elementLocated(By.xpath(btnEditarEstadoXpath)),
      10000
    );
    await driver.wait(until.elementIsVisible(btnEditarEstado2), 5000);
    await driver.wait(until.elementIsEnabled(btnEditarEstado2), 5000);

    await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnEditarEstado2);
    await driver.sleep(300);

    try {
      await btnEditarEstado2.click();
      await driver.sleep(3000);
    } catch {
      await driver.executeScript("arguments[0].click();", btnEditarEstado2);
      await driver.sleep(3000);
    }

    console.log("✅ Paso 22: Botón 'Editar estado' (segundo clic) ejecutado correctamente.");

    // === Paso 23: Guardar cambios (volver a estado Activo) ===
    const btnGuardar2 = await driver.wait(
      until.elementLocated(By.xpath(btnGuardarXpath)),
      10000
    );
    await driver.wait(until.elementIsVisible(btnGuardar2), 5000);

    await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnGuardar2);
    await driver.sleep(300);
    await driver.executeScript("arguments[0].click();", btnGuardar2);
    await driver.sleep(3000);

    console.log("✅ Paso 23: Estado restaurado correctamente (Activo).");

  } catch (error) {
    if (this._capturarError) await this._capturarError(error, caseName);
    throw error;
  }
}

  
  
}
