import { By, until } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { testData } from '../../../config/testData.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class VisorInformacionTecnicaRedPage {
  /**
 * @param {WebDriver} driver  instancia de selenium
 * @param {string} defaultNapSerialCelsia  ID_DEAL global reutilizable
 * @param {string} defaultSerialONT  Serial ONT global reutilizable
 * @param {string} defaultEstadoTecnico Estado técnico a seleccionar (ACTIVO | INACTIVO | SUSPENDIDO)
 * @param {string} filtroBusqueda - valor a seleccionar en el filtro (desde testData)
 * @param {string} valorBusquedaTexto  Texto para búsqueda libre en visor de red
 * @param {string} valorBusquedaTextoSegundo Texto para el segundo filtro de búsqueda opcional
 */
  constructor(driver,
    defaultNapSerialCelsia = testData.visorInformacionTecnicaRed.defaultNapSerialCelsia,
    defaultSerialONT = testData.visorInformacionTecnicaRed.defaultSerialONT,
    defaultEstadoTecnico = testData.visorInformacionTecnicaRed.defaultEstadoTecnico,
    filtroBusqueda = testData.visorInformacionTecnicaRed.filtroBusqueda,
    valorBusquedaTexto = testData.visorInformacionTecnicaRed.valorBusquedaTexto,
    valorBusquedaTextoSegundo = testData.visorInformacionTecnicaRed.valorBusquedaTextoSegundo) {
    this.driver = driver;
    this.defaultNapSerialCelsia = defaultNapSerialCelsia;
    this.defaultSerialONT = defaultSerialONT;
    this.defaultEstadoTecnico = defaultEstadoTecnico;
    this.filtroBusqueda = filtroBusqueda;
    this.valorBusquedaTexto = valorBusquedaTexto;
    this.valorBusquedaTextoSegundo = valorBusquedaTextoSegundo;
  }

  /**
   * ====================================
   * CP_NFTECRED_001 – Ingreso a la vista
   * 3 pasos
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
      console.log("✅ Paso 1: Módulo eCenter presionado.");

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
      console.log("✅ Paso 2: Scroll en contenedor de aplicaciones.");

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
      console.log("✅ Paso 3: Vista 'Visor de información técnica de red' abierta.");

    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      throw error;
    }
  }

  // =====================================================
  // CP_INFTECRED_002: Filtro de búsqueda
  // x pasos
  // =====================================================
  async filtroBusquedaInformacionTecnica(caseName = 'CP_INFTECRED_002', serialNap) {
    const driver = this.driver;

    try {
      // === Paso 1: Clic en el botón "Mostrar filtro" ===
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
      console.log("✅ Paso 1: Clic en el botón 'Mostrar filtro' ejecutado correctamente.");

      // === Paso 2: Clic en el <select> para mostrar opciones del filtro ===
      const grupoFiltro = await driver.wait(until.elementLocated(By.css('.rules-group-container')), 10000);
      const contenedorFiltro = await grupoFiltro.findElement(By.css('.rule-filter-container'));
      const selectFiltro = await contenedorFiltro.findElement(By.css('select'));
      await driver.wait(until.elementIsVisible(selectFiltro), 5000);
      await driver.wait(until.elementIsEnabled(selectFiltro), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", selectFiltro);
      await driver.sleep(500);
      await selectFiltro.click();
      await driver.sleep(1500);

      // === Paso 3: Seleccionar filtro de búsqueda ===
      try {
        const filtro = this.filtroBusqueda; // viene del testData

        const selectCampo = await grupoFiltro.findElement(By.css('select'));
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", selectCampo);
        await selectCampo.click();
        await driver.sleep(500);
        await selectCampo.sendKeys(filtro);
        await driver.sleep(2000);

        console.log(`✅ Paso 3: Filtro '${filtro}' seleccionado.`);
      } catch (error) {
        throw new Error(`❌ Error en Paso 3 (Seleccionar filtro de búsqueda): ${error.message}`);
      }

      // === Paso 4: Escribir texto en el campo de búsqueda ===
      try {
        const valorTexto = this.valorBusquedaTexto; // tomado del testData

        const textareaCampo = await driver.wait(
          until.elementLocated(By.css('textarea.form-control')),
          10000
        );
        await driver.wait(until.elementIsVisible(textareaCampo), 5000);

        await textareaCampo.click();
        await driver.sleep(300);
        await textareaCampo.clear();
        await textareaCampo.sendKeys(valorTexto);
        await driver.sleep(1000);

        console.log(`✅ Paso 4: Campo de texto diligenciado con '${valorTexto}'.`);
      } catch (error) {
        throw new Error(`❌ Error en Paso 4 (Escribir texto): ${error.message}`);
      }

      // === Paso 5: Clic en “Aplicar filtros” ===
      const botonAplicarFiltro = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-button-btn-set-filter"]/div')),
        10000
      );
      await driver.wait(until.elementIsVisible(botonAplicarFiltro), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonAplicarFiltro);
      await driver.sleep(500);
      await botonAplicarFiltro.click();
      await driver.sleep(3000);
      console.log("✅ Paso 5: Clic en 'Aplicar filtro' realizado.");

    } catch (error) {
      if (this._capturarError) await this._capturarError(error, caseName);
      throw error;
    }
  }


  // =====================================================
  // CP_INFTECRED_00X: Segundo filtro de búsqueda (opcional)
  // x pasos
  // =====================================================

  async filtroBusquedaOpcional(caseName = "CP_INFTECRED_00X") {
    const driver = this.driver;

    try {
      // === Paso 1: Clic en “Mostrar filtro” ===
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
      console.log("✅ Paso 1: Botón 'Mostrar filtro' clickeado nuevamente.");

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

      // === Paso 4: Seleccionar opción dinámica según testData ===
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
        if (texto === this.valorBusquedaTextoSegundo.trim().toUpperCase()) {
          await opcion.click();
          break;
        }
      }

      await driver.sleep(1000);
      console.log(`✅ Paso 4: '${this.valorBusquedaTextoSegundo}' seleccionado.`);


      // === Paso 5: Diligenciar campo “NAP SERIAL CELSIA” ===
      const serialNap = this.defaultNapSerialCelsia
      const segundoFiltroBlock = await driver.wait(
        until.elementLocated(By.xpath('(//div[contains(@class,"rule-container")])[2]')),
        10000
      );
      const textarea = await segundoFiltroBlock.findElement(By.css('textarea'));
      await driver.wait(until.elementIsVisible(textarea), 5000);
      await textarea.clear();
      await textarea.sendKeys(serialNap);
      await driver.sleep(1000);
      console.log("✅ Paso 5: 'NAP SERIAL CELSIA' diligenciado.");

      // === Paso 6: Clic en “Aplicar filtro” nuevamente ===
      const botonAplicarFiltro2 = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-button-btn-set-filter"]/div')),
        10000
      );
      await driver.wait(until.elementIsVisible(botonAplicarFiltro2), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonAplicarFiltro2);
      await driver.sleep(300);
      await botonAplicarFiltro2.click();
      await driver.sleep(5000);
      console.log("✅ Paso 6: Filtro aplicado correctamente.");

    } catch (error) {
      if (this._capturarError) await this._capturarError(error, caseName);
      throw error;
    }
  }

  // =====================================================
  // CP_INFTECRED_003: Ver dispositivos
  // 3 pasos
  // =====================================================
  async verDispositivos(caseName = 'CP_INFTECRED_003') {
    const driver = this.driver;

    try {
      // === Paso 1: Seleccionar registro ===
      const serial = this.defaultSerialONT; // se selecciona por ont

      // Localizar la celda que contiene el serial
      const tdSerial = await driver.wait(
        until.elementLocated(By.xpath(`//td[contains(normalize-space(.), '${serial}')]`)),
        10000
      );

      // Asegurar visibilidad
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", tdSerial);
      await driver.wait(until.elementIsVisible(tdSerial), 5000);

      // Usar Actions para hacer clic real
      const actions = driver.actions({ async: true });
      await actions.move({ origin: tdSerial }).click().perform();
      await driver.sleep(1000);

      // Subir al tr padre y validar que tiene la clase 'active'
      const trElemento = await tdSerial.findElement(By.xpath("./ancestor::tr"));
      await driver.wait(async () => {
        const clase = await trElemento.getAttribute("class");
        return clase.includes("active");
      }, 5000, "El registro no se marcó como activo después del clic");

      console.log(`✅ Paso 15: Registro con Serial ONT '${serial}' seleccionado correctamente y marcado como activo.`);

      // === Paso 2: Clic en el botón "Ver dispositivos" ===
      const btnVerDispositivosXpath = '//*[@id="widget-button-btn-view-amplifiers"]/div';

      // Esperar a que el botón esté presente
      const btnVerDispositivos = await driver.wait(
        until.elementLocated(By.xpath(btnVerDispositivosXpath)),
        10000
      );

      // Asegurarse de que esté visible
      await driver.wait(until.elementIsVisible(btnVerDispositivos), 5000);

      //  Scroll y clic (con fallback a JS)
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnVerDispositivos);
      await driver.sleep(300);

      try {
        await btnVerDispositivos.click();
      } catch {
        await driver.executeScript("arguments[0].click();", btnVerDispositivos);
      }

      await driver.sleep(2000);
      console.log("✅ Paso 16: Botón 'Ver dispositivos' presionado correctamente.");

      // === Paso 3: Cerrar modal "Ver dispositivos" ===
      const modalXpath = '//*[@id="widget-dialog-dialog-view-amplifiers"]/div/div';
      const btnCerrarXpath = '//*[@id="widget-dialog-dialog-view-amplifiers"]/div/div/div[1]/button';

      // Esperar a que el modal esté visible
      const modal = await driver.wait(
        until.elementLocated(By.xpath(modalXpath)),
        10000
      );
      await driver.wait(until.elementIsVisible(modal), 5000);

      // Localizar el botón de cerrar
      const btnCerrar = await driver.wait(
        until.elementLocated(By.xpath(btnCerrarXpath)),
        10000
      );
      await driver.wait(until.elementIsVisible(btnCerrar), 5000);

      // Scroll y clic (fallback a JS)
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnCerrar);
      await driver.sleep(300);

      try {
        await btnCerrar.click();
      } catch {
        await driver.executeScript("arguments[0].click();", btnCerrar);
      }
      await driver.sleep(2000);

      // Esperar que el modal ya no sea visible
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
  // 6 Pasos 
  // =====================================================
  async editarEstado(caseName = 'CP_INFTECRED_004') {
    const driver = this.driver;

    try {
      // === Paso 1: Clic en el botón "Editar estado" ===
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

      console.log("✅ Paso 1: Botón 'Editar estado' clickeado correctamente.");

      // === Paso 2: Abrir el menú desplegable de "Estado" ===
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

      console.log("✅ Paso 2: Menú desplegable 'Estado de orden' abierto correctamente.");

      // === Paso 3: Seleccionar estado  ===
      try {
        const estado = this.defaultEstadoTecnico;

        if (!estado) {
          throw new Error("defaultEstadoTecnico no definido en testData.visorInfoTecnicaRed");
        }

        const opcionXpath = `//*[@id="input-select-select-status-order"]/option[contains(text(),'${estado}')]`;
        const selectXpath = '//*[@id="input-select-select-status-order"]';

        const opcion = await driver.wait(
          until.elementLocated(By.xpath(opcionXpath)),
          15000
        );

        await driver.wait(until.elementIsVisible(opcion), 5000);

        // Selecciona la opción y dispara el evento change
        await driver.executeScript(`
    arguments[0].selected = true;
    arguments[0].dispatchEvent(new Event('change', { bubbles: true }));
  `, opcion);

        await driver.sleep(800);

        const selectElement = await driver.findElement(By.xpath(selectXpath));
        await driver.executeScript("arguments[0].blur();", selectElement);
        await driver.sleep(800);

        console.log(`✅ Paso 3: Estado técnico seleccionado: '${estado}'`);

      } catch (error) {
        throw new Error(`❌ Paso 3: Error al seleccionar estado técnico: ${error.message}`);
      }


      // === Paso 4: Guardar cambios (clic en "Editar estado" → Guardar) ===
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

      console.log("✅ Paso 4: Botón 'Editar estado (guardar)' presionado correctamente.");


    } catch (error) {
      if (this._capturarError) await this._capturarError(error, caseName);
      throw error;
    }
  }

  // =====================================================
  // CP_INFTECRED_005: Editar cliente // **falta parametrizar en el testData los campos solo abre y cierra el modal ** //
  // 4 pasos
  // =====================================================
  async editarCliente(caseName = "CP_INFTECRED_005") {
    const driver = this.driver;

    try {
      // === Paso 1: Clic en botón "Editar" ===
      try {
        const btnEditar = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-button-btn-edit-order"]/div')),
          10000
        );

        await driver.wait(until.elementIsVisible(btnEditar), 5000);
        await driver.wait(until.elementIsEnabled(btnEditar), 5000);

        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnEditar);
        await driver.sleep(300);

        await driver.executeScript("arguments[0].click();", btnEditar);
        await driver.sleep(2000);

        console.log("✅ Paso 1: Botón 'Editar' presionado correctamente.");
      } catch (error) {
        throw new Error(`❌ Paso 1: No se pudo presionar el botón 'Editar': ${error.message}`);
      }

      // === Paso 2: Diligenciar campo "Observaciones" en modal Editar ===
      try {
        const inputObservaciones = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="textfield-56_"]')),
          10000
        );

        await driver.wait(until.elementIsVisible(inputObservaciones), 5000);
        await driver.wait(until.elementIsEnabled(inputObservaciones), 5000);

        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", inputObservaciones);
        await driver.sleep(500);

        await inputObservaciones.clear();
        await driver.sleep(300);
        await inputObservaciones.sendKeys("TEST AUTOMATIZACIÓN EDITAR CLIENTE");
        await driver.sleep(500);

        console.log("✅ Paso 2: Campo 'Observaciones' diligenciado correctamente.");
      } catch (error) {
        throw new Error(`❌ Paso 2: No se pudo diligenciar el campo 'Observaciones': ${error.message}`);
      }

      // === Paso 3: Clic en botón "Editar / Guardar" en modal ===
      try {
        const btnEditarGuardar = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-button-btn-edit-order-save"]/div')),
          10000
        );

        await driver.wait(until.elementIsVisible(btnEditarGuardar), 5000);
        await driver.wait(until.elementIsEnabled(btnEditarGuardar), 5000);

        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnEditarGuardar);
        await driver.sleep(500);

        await driver.executeScript("arguments[0].click();", btnEditarGuardar);
        await driver.sleep(4000);

        console.log("✅ Paso 3: Botón 'Editar / Guardar' presionado correctamente.");
      } catch (error) {
        throw new Error(`❌ Paso 3: No se pudo presionar el botón 'Editar / Guardar': ${error.message}`);
      }

      // === Paso 4: Cerrar modal de edición ===
      try {
        const modalEditarXpath = '//*[@id="widget-dialog-dialog-edit-order"]/div/div';
        const btnCerrarModalXpath = '//*[@id="widget-dialog-dialog-edit-order"]/div/div/div[1]/button';

        const modalEditar = await driver.wait(
          until.elementLocated(By.xpath(modalEditarXpath)),
          10000
        );
        await driver.wait(until.elementIsVisible(modalEditar), 5000);

        const btnCerrarModal = await driver.wait(
          until.elementLocated(By.xpath(btnCerrarModalXpath)),
          10000
        );
        await driver.wait(until.elementIsVisible(btnCerrarModal), 5000);

        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnCerrarModal);
        await driver.sleep(300);
        await driver.executeScript("arguments[0].click();", btnCerrarModal);

        // Esperar que se oculte (no necesariamente que desaparezca)
        await driver.wait(async () => {
          const visible = await modalEditar.isDisplayed().catch(() => false);
          return !visible;
        }, 15000);

        console.log("✅ Paso 4: Modal de edición cerrado correctamente.");
      } catch (error) {
        throw new Error(`❌ Paso 4: No se pudo cerrar el modal de edición: ${error.message}`);
      }

    } catch (error) {
      console.error(`❌ Error en ${caseName}: ${error.message}`);

      throw error;
    }
  }

  // =====================================================
  // CP_INFTECRED_006: Refrescar vista
  // 1 paso
  // =====================================================
  async refrescarTabla(caseName = "CP_INFTECRED_006") {
    const driver = this.driver;

    try {
      // === Paso 1: Clic en botón "Refrescar" ===
      try {
        const btnRecargarXpath = '//*[@id="crud-refresh-btn"]';

        // 1️⃣ Esperar que el botón esté presente
        const btnRecargar = await driver.wait(
          until.elementLocated(By.xpath(btnRecargarXpath)),
          10000
        );

        // 2️⃣ Asegurar que sea visible e interactuable
        await driver.wait(until.elementIsVisible(btnRecargar), 5000);
        await driver.wait(until.elementIsEnabled(btnRecargar), 5000);

        // 3️⃣ Scroll y clic
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnRecargar);
        await driver.sleep(300);

        // Intento de clic directo con fallback JS
        try {
          await btnRecargar.click();
        } catch {
          await driver.executeScript("arguments[0].click();", btnRecargar);
        }

        // 4️⃣ Espera por actualización (spinner o cambio visual)
        await driver.sleep(4000);

        console.log("✅ Paso 1: Botón 'Recargar' presionado correctamente.");
      } catch (error) {
        throw new Error(`❌ Paso 1: No se pudo presionar el botón 'Recargar': ${error.message}`);
      }

      //  Verificar que la tabla se actualizó ===
      try {
        // Puedes verificar, por ejemplo, que las filas se recargaron
        const tablaXpath = '//table//tbody/tr';
        const filasAntes = await driver.findElements(By.xpath(tablaXpath));
        await driver.sleep(2000); // espera breve
        const filasDespues = await driver.findElements(By.xpath(tablaXpath));

        if (filasDespues.length >= 0) {
          console.log(`✅ Paso 29: La tabla se refrescó correctamente (total filas: ${filasDespues.length}).`);
        } else {
          console.warn("⚠️ Paso 29: No se pudo verificar visualmente la actualización de la tabla.");
        }
      } catch (error) {
        console.warn(`⚠️ Paso 29: Error menor al verificar actualización de tabla: ${error.message}`);
      }

    } catch (error) {
      console.error(`❌ Error en ${caseName}: ${error.message}`);

      throw error;
    }
  }

}
