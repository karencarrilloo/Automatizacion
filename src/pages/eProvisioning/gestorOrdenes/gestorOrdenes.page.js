import { By, until } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { testData } from "../../../config/testData.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class GestorOrdenesPage {
  /**
 * @param {WebDriver} driver  instancia de selenium
 * @param {string} defaultIdOrden ID ORDEN global reutilizable
 * @param {string} defaultSerialONT  Serial ONT global reutilizable
 */
  constructor(driver,defaultIdOrden = testData.gestorOrdenes.defaultIdOrden,defaultSerialONT = testData.gestorOrdenes.defaultSerialONT)  {
    this.driver = driver;
    this.defaultIdOrden = defaultIdOrden;
    this.defaultSerialONT = defaultSerialONT;
  }

  async seleccionarClientePorIdOrden(idOrden) {
    const driver = this.driver;
    const idBuscar = idOrden || this.defaultIdOrden;

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
      throw new Error(`❌ No se encontró cliente con ID ORDEN "${idBuscar}"`);

    // Scroll y clic
    await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', filaSeleccionada);
    await driver.sleep(300);
    try {
      await filaSeleccionada.click();
    } catch {
      await driver.executeScript('arguments[0].click();', filaSeleccionada);
    }

    await driver.sleep(800);
    console.log(`✅ Cliente con ID ORDEN "${idBuscar}" seleccionado correctamente.`);
  }


  //  ==================================================
  // CP_GESORD_001 - Ingreso al Gestor de Órdenes ===
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
      await driver.wait(until.elementIsVisible(targetApp), 14000);
      await driver.wait(until.elementIsEnabled(targetApp), 14000);
      await driver.executeScript("arguments[0].click();", targetApp);
      await driver.sleep(20000);

      console.log("✅ Ingreso exitoso a la vista 'Gestor de Órdenes'.");
    } catch (error) {
      console.error(`❌ [CP_GESORD_001] Error: ${error.message}`);
    }
  }

  //  ==================================================
  //  CP_GESORD_002 – Primer Filtro de búsqueda por ID ORDEN
  //  5 pasos
  //  ==================================================

  async filtrarPorIdOrden(caseName = 'CP_GESORD_002', idOrden) {
    const driver = this.driver;
    // 👇 Usa el ID global si no se envía argumento
    const idBuscar = idOrden || this.defaultIdOrden;

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

      // === Paso 3: Seleccionar "ID ORDEN" ===
      const selectCampo = await grupoFiltro.findElement(By.css('select'));
      await driver.wait(until.elementIsVisible(selectCampo), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", selectCampo);
      await selectCampo.click();
      await driver.sleep(500);
      await selectCampo.sendKeys("ID ORDEN");
      await driver.sleep(2000);

      // === Paso 4: Diligenciar el campo de ID ORDEN ===
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
      console.log(`✅ Filtro por ID ORDEN "${idBuscar}" diligenciado.`);


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

  // =====================================================
  // CP_GESORD_003 – RawData
  // x pasos
  // =====================================================
  async rawData(caseName = "CP_GESORD_00X", idOrden) {
    const driver = this.driver;

    try {
      // Paso 1: Seleccionar cliente
      await this.seleccionarClientePorIdOrden(idOrden);

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

    // === Paso 4: Hacer scroll hacia abajo dentro del contenedor RawData (xterm.js) ===
    try {
      // 1️⃣ Buscar el modal dinámico del Gestor de Órdenes
      const modalXpath = '//div[starts-with(@id,"widget-dialog-open-dialog-") and contains(@id,"orderViewerGestor2")]';
      const modal = await driver.wait(
        until.elementLocated(By.xpath(modalXpath)),
        15000
      );
      await driver.wait(until.elementIsVisible(modal), 8000);

      // 2️⃣ Buscar el contenedor visible de la terminal (xterm viewport)
      const viewport = await driver.wait(
        until.elementLocated(By.css('.xterm-viewport')),
        10000
      );
      await driver.wait(until.elementIsVisible(viewport), 5000);

      // 3️⃣ Hacer scroll real dentro del viewport de xterm
      await driver.executeScript(`
    const el = arguments[0];
    el.scrollTop = el.scrollHeight;
  `, viewport);

      // 4️⃣ Pausa para permitir el redibujado del canvas
      await driver.sleep(1500);

      console.log("✅ Paso 4: Scroll hacia abajo ejecutado correctamente en el contenedor RawData (xterm).");
    } catch (error) {
      throw new Error(`❌ Paso 4: No se pudo realizar scroll en RawData (xterm.js): ${error.message}`);
    }


    // === Paso 5: Clic en el botón "Copiar" ===
    try {
      // 1️⃣ Localizar el modal dinámicamente
      const modalXpath = '//div[starts-with(@id,"widget-dialog-open-dialog-") and contains(@id,"orderViewerGestor2")]';
      const modal = await driver.wait(
        until.elementLocated(By.xpath(modalXpath)),
        15000
      );
      await driver.wait(until.elementIsVisible(modal), 8000);

      // 2️⃣ Buscar dentro del modal el contenedor del icono de copiar
      const btnCopiar = await driver.wait(
        until.elementLocated(By.css('.container-icon-duplicate')),
        10000
      );
      await driver.wait(until.elementIsVisible(btnCopiar), 5000);

      // 3️⃣ Scroll hasta el botón
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", btnCopiar);
      await driver.sleep(500);

      // 4️⃣ Intentar clic directo o fallback JS
      try {
        await btnCopiar.click();
      } catch {
        const iconoCopiar = await btnCopiar.findElement(By.css('span.glyphicon-duplicate'));
        await driver.executeScript("arguments[0].click();", iconoCopiar);
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
  async Adjuntos(caseName = "CP_GESORD_00X", idOrden) {
    const driver = this.driver;

    try {
      // Paso 1: Seleccionar cliente
      await this.seleccionarClientePorIdOrden(idOrden);

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
      // 1️⃣ Localizar dinámicamente el modal activo de Adjuntos
      const modalAdjuntosXpath = '//div[starts-with(@id,"widget-dialog-open-dialog-") and contains(@id,"orderViewerGestor2")]';
      const modalAdjuntos = await driver.wait(
        until.elementLocated(By.xpath(modalAdjuntosXpath)),
        15000
      );
      await driver.wait(until.elementIsVisible(modalAdjuntos), 8000);

      // 2️⃣ Buscar el botón de refrescar por su ID estable dentro del modal
      const btnRefrescarModal = await modalAdjuntos.findElement(By.id('crud-refresh-btn'));
      await driver.wait(until.elementIsVisible(btnRefrescarModal), 8000);
      await driver.wait(until.elementIsEnabled(btnRefrescarModal), 8000);

      // 3️⃣ Scroll y clic
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
  async registroOrden(caseName = "CP_GESORD_005", idOrden) {
    const driver = this.driver;

    try {
      // Paso 1: Seleccionar cliente
      await this.seleccionarClientePorIdOrden(idOrden);

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
      // 1️⃣ Buscar el modal dinámico activo
      const modalXpath = '//div[starts-with(@id,"widget-dialog-open-dialog-") and contains(@id,"orderViewerGestor2")]';
      const modal = await driver.wait(until.elementLocated(By.xpath(modalXpath)), 15000);
      await driver.wait(until.elementIsVisible(modal), 8000);

      // 2️⃣ Buscar la pestaña "Bitácora" dentro del modal por su clase fija
      const tabBitacora = await modal.findElement(By.css('li.nav-containerBinnacle'));
      await driver.wait(until.elementIsVisible(tabBitacora), 8000);
      await driver.wait(until.elementIsEnabled(tabBitacora), 8000);

      // 3️⃣ Hacer scroll al elemento
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", tabBitacora);
      await driver.sleep(400);

      // 4️⃣ Clic normal o fallback por JS
      try {
        await tabBitacora.click();
      } catch {
        await driver.executeScript("arguments[0].click();", tabBitacora);
      }

      await driver.sleep(3000);
      console.log("✅ Paso 4: Pestaña 'Bitácora' clickeada correctamente.");

    } catch (error) {
      throw new Error(`❌ Paso 4: No se pudo dar clic en la pestaña 'Bitácora': ${error.message}`);
    }


    // === Paso 5: Clic en el botón "Actualizar" dentro del modal 'Registro de la orden' ===
    try {
      // 1️⃣ Localizar el modal de forma dinámica (sin depender del ID numérico)
      const modalXpath = '//div[starts-with(@id,"widget-dialog-open-dialog-") and contains(@id,"orderViewerGestor2")]';
      const modalRegistroOrden = await driver.wait(
        until.elementLocated(By.xpath(modalXpath)),
        15000
      );
      await driver.wait(until.elementIsVisible(modalRegistroOrden), 10000);

      // 2️⃣ Buscar el contenedor del CRUD dentro del modal
      const contenedorCrud = await modalRegistroOrden.findElement(
        By.xpath('.//div[@id="crud-crud-binnacle"]')
      );
      await driver.wait(until.elementIsVisible(contenedorCrud), 5000);

      // 3️⃣ Buscar el botón "Refrescar" (Actualizar) dentro del contenedor
      const btnActualizar = await contenedorCrud.findElement(By.id('crud-refresh-btn'));
      await driver.wait(until.elementIsVisible(btnActualizar), 5000);
      await driver.wait(until.elementIsEnabled(btnActualizar), 5000);

      // 4️⃣ Scroll hacia el botón y clic (con fallback JS si falla el clic directo)
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnActualizar);
      await driver.sleep(400);
      try {
        await btnActualizar.click();
      } catch {
        await driver.executeScript("arguments[0].click();", btnActualizar);
      }

      console.log("✅ Paso 5: Botón 'Actualizar' dentro del modal 'Registro de la orden' presionado correctamente.");
      await driver.sleep(4000); // Espera mientras recarga la tabla

    } catch (error) {
      throw new Error(
        `❌ Paso 5: No se pudo presionar el botón 'Actualizar' dentro del modal 'Registro de la orden': ${error.message}`
      );
    }

    // === Paso 6: Clic en el botón "Cerrar" dentro del modal "Registro de la orden" ===
    try {
      // 1️⃣ Localizar el modal de manera dinámica
      const modalXpath = '//div[starts-with(@id,"widget-dialog-open-dialog-") and contains(@id,"orderViewerGestor2")]';
      const modalRegistroOrden = await driver.wait(
        until.elementLocated(By.xpath(modalXpath)),
        15000
      );
      await driver.wait(until.elementIsVisible(modalRegistroOrden), 8000);

      // 2️⃣ Localizar el botón "Cerrar" dentro del modal
      const btnCerrar = await modalRegistroOrden.findElement(
        By.xpath('.//div[@id="widget-button-cancel-confirm-selected"]/div')
      );
      await driver.wait(until.elementIsVisible(btnCerrar), 5000);
      await driver.wait(until.elementIsEnabled(btnCerrar), 5000);

      // 3️⃣ Scroll y clic (con fallback por seguridad)
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnCerrar);
      await driver.sleep(400);
      try {
        await btnCerrar.click();
      } catch {
        await driver.executeScript("arguments[0].click();", btnCerrar);
      }

      // 4️⃣ Esperar a que el modal se cierre completamente
      await driver.wait(async () => {
        try {
          return !(await modalRegistroOrden.isDisplayed());
        } catch {
          return true; // si el modal ya no existe en el DOM, se considera cerrado
        }
      }, 10000);

      console.log("✅ Paso 6: Modal 'Registro de la orden' cerrado correctamente.");

    } catch (error) {
      throw new Error(`❌ Paso 6: No se pudo cerrar el modal 'Registro de la orden': ${error.message}`);
    }



  } catch(error) {
    console.error(`❌ Error en el caso de prueba CP_GESORD_005: ${error.message}`);

    throw error;
  }
  // =====================================================
  // CP_GESORD_006 – Ver información técnica asociada
  // x pasos
  // =====================================================
  async verInfomacionTecnicaAsociada(caseName = "CP_GESORD_006", idOrden) {
    const driver = this.driver;

    try {
      // Paso 1: Seleccionar cliente
      await this.seleccionarClientePorIdOrden(idOrden);

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
      // 1️⃣ Localizar el modal de manera dinámica (sin depender del número en el ID)
      const modalXpath = '//div[starts-with(@id,"widget-dialog-open-dialog-") and contains(@id,"orderViewerGestor2")]';
      const modalInfoTecnica = await driver.wait(
        until.elementLocated(By.xpath(modalXpath)),
        15000
      );
      await driver.wait(until.elementIsVisible(modalInfoTecnica), 8000);

      // 2️⃣ Localizar el botón "Cerrar" dentro del modal
      const btnCerrar = await modalInfoTecnica.findElement(
        By.xpath('.//div[@id="widget-button-cancel-confirm-selected"]/div')
      );
      await driver.wait(until.elementIsVisible(btnCerrar), 5000);
      await driver.wait(until.elementIsEnabled(btnCerrar), 5000);

      // 3️⃣ Scroll y clic (con fallback JS si hay overlays)
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnCerrar);
      await driver.sleep(400);
      try {
        await btnCerrar.click();
      } catch {
        await driver.executeScript("arguments[0].click();", btnCerrar);
      }

      // 4️⃣ Esperar que el modal se cierre completamente
      await driver.wait(async () => {
        try {
          return !(await modalInfoTecnica.isDisplayed());
        } catch {
          return true; // el modal ya no existe → cerrado
        }
      }, 10000);

      console.log("✅ Paso 4: Modal 'Ver información técnica asociada' cerrado correctamente.");

    } catch (error) {
      throw new Error(`❌ Paso 4: No se pudo cerrar el modal 'Ver información técnica asociada': ${error.message}`);
    }



  } catch(error) {
    console.error(`❌ Error en el caso de prueba CP_GESORD_006: ${error.message}`);

    throw error;
  }

  // =====================================================
  // CP_GESORD_007 – Ejecutar orden venta e instalación (cliente simulado)
  // x pasos
  // =====================================================
  async ejecutarOrdenVentaInstalacion(caseName = "CP_GESORD_007", idOrden) {
    const driver = this.driver;

    try {
      // Paso 1: Seleccionar cliente
      await this.seleccionarClientePorIdOrden(idOrden);

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

      // === Paso 4: Clic en el botón "Número de Serial" ===
      try {
        const btnNumeroSerialXpath =
          '//div[contains(@class,"device") and .//div[contains(@class,"serial-label") and normalize-space(text())="Número de serial"]]';
        const progressXpath = '//*[contains(@id,"progress-progress-crudgestor") or contains(@id,"progress")]';

        // Localizar el botón dinámicamente
        const btnNumeroSerial = await driver.wait(
          until.elementLocated(By.xpath(btnNumeroSerialXpath)),
          20000
        );
        await driver.wait(until.elementIsVisible(btnNumeroSerial), 10000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnNumeroSerial);
        await driver.sleep(500);

        // Intentar clic directo con fallback JS
        try {
          await btnNumeroSerial.click();
        } catch {
          await driver.executeScript("arguments[0].click();", btnNumeroSerial);
        }

        console.log("✅ Paso 4: Botón 'Número de Serial' presionado correctamente.");

        // Esperar opcionalmente el progress (si aparece)
        let progressVisible = false;
        try {
          const progress = await driver.wait(
            until.elementLocated(By.xpath(progressXpath)),
            10000
          );
          await driver.wait(until.elementIsVisible(progress), 5000);
          progressVisible = true;
          console.log("⏳ Paso 4: Proceso de aprovisionamiento iniciado...");

          // Esperar que desaparezca o que el modal cambie (máx 60s)
          await driver.wait(async () => {
            try {
              return !(await progress.isDisplayed());
            } catch {
              // Si el elemento desaparece o el modal se cierra, lo consideramos finalizado
              return true;
            }
          }, 60000);
        } catch {
          console.log("⚠️ Paso 4: No se detectó progress visible, continuando.");
        }

        await driver.sleep(2000); // pausa por estabilidad
        console.log(progressVisible
          ? "✅ Paso 4: Proceso completado correctamente (progress finalizado)."
          : "✅ Paso 4: Proceso completado (sin progress visible).");

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

        // 4️⃣ Escribir el Serial ONT usando la variable global
        const serialONT = this.defaultSerialONT; // 👈 Usa el valor global
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
        // 1️⃣ Clic opcional en el check "Compartir contraseña"
        const checkCompartirXpath = '//*[@id="widget-checkbox-check-step-validation-wifi"]/label';
        const elementosCheck = await driver.findElements(By.xpath(checkCompartirXpath));

        if (elementosCheck.length > 0) {
          const checkCompartir = elementosCheck[0];
          await driver.wait(until.elementIsVisible(checkCompartir), 5000);
          await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", checkCompartir);
          await driver.sleep(300);
          try {
            await checkCompartir.click();
          } catch {
            await driver.executeScript("arguments[0].click();", checkCompartir);
          }
          console.log("✅ Check 'Compartir contraseña' marcado correctamente.");
        } else {
          console.log("ℹ️ Check 'Compartir contraseña' no disponible (ONT solo 2.4 GHz), continuando sin marcar.");
        }

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
  async ejecutarOrdenMantenimientoFisico(caseName = "CP_GESORD_00X", idOrden) {
    const driver = this.driver;

    try {
      // Paso 1: Seleccionar cliente
      await this.seleccionarClientePorIdOrden(idOrden);

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

      // === Paso 4: Clic en el botón "Número de Serial" ===
      try {
        const btnNumeroSerialXpath =
          '//div[contains(@class,"device") and .//div[contains(@class,"serial-label") and normalize-space(text())="Número de serial"]]';
        const progressXpath = '//*[contains(@id,"progress-progress-crudgestor") or contains(@id,"progress")]';

        // Localizar el botón dinámicamente
        const btnNumeroSerial = await driver.wait(
          until.elementLocated(By.xpath(btnNumeroSerialXpath)),
          20000
        );
        await driver.wait(until.elementIsVisible(btnNumeroSerial), 10000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnNumeroSerial);
        await driver.sleep(500);

        // Intentar clic directo con fallback JS
        try {
          await btnNumeroSerial.click();
        } catch {
          await driver.executeScript("arguments[0].click();", btnNumeroSerial);
        }

        console.log("✅ Paso 4: Botón 'Número de Serial' presionado correctamente.");

        // Esperar opcionalmente el progress (si aparece)
        let progressVisible = false;
        try {
          const progress = await driver.wait(
            until.elementLocated(By.xpath(progressXpath)),
            10000
          );
          await driver.wait(until.elementIsVisible(progress), 5000);
          progressVisible = true;
          console.log("⏳ Paso 4: Proceso de aprovisionamiento iniciado...");

          // Esperar que desaparezca o que el modal cambie (máx 60s)
          await driver.wait(async () => {
            try {
              return !(await progress.isDisplayed());
            } catch {
              // Si el elemento desaparece o el modal se cierra, lo consideramos finalizado
              return true;
            }
          }, 60000);
        } catch {
          console.log("⚠️ Paso 4: No se detectó progress visible, continuando.");
        }

        await driver.sleep(2000); // pausa por estabilidad
        console.log(progressVisible
          ? "✅ Paso 4: Proceso completado correctamente (progress finalizado)."
          : "✅ Paso 4: Proceso completado (sin progress visible).");

      } catch (error) {
        throw new Error(`❌ Paso 4: Error en clic o espera del progress 'Número de Serial': ${error.message}`);
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

      // === Paso 12: Clic en el botón "Completar" dentro del modal ===
      try {
        // Aseguramos que el modal esté visible
        const modalMantenimiento = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-dialog-view-process-child"]/div/div')),
          10000
        );
        await driver.wait(until.elementIsVisible(modalMantenimiento), 5000);

        // Buscar el botón dentro del modal (no fuera de él)
        const botonCompletar = await modalMantenimiento.findElement(
          By.xpath('.//*[@id="widget-button-complet-process"]/div')
        );

        // Asegurar que es visible en pantalla y habilitado
        await driver.wait(until.elementIsVisible(botonCompletar), 5000);
        await driver.wait(until.elementIsEnabled(botonCompletar), 5000);

        // Hacer scroll hasta el botón para asegurar visibilidad
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonCompletar);
        await driver.sleep(500);

        // Verificar que el botón no esté cubierto por otro elemento
        const isDisplayed = await botonCompletar.isDisplayed();
        if (!isDisplayed) throw new Error("El botón 'Completar' está oculto o tapado por otro elemento.");

        // Ejecutar clic con fallback por JS (por si Selenium detecta overlay)
        try {
          await botonCompletar.click();
        } catch {
          await driver.executeScript("arguments[0].click();", botonCompletar);
        }

        console.log("✅ Paso 12: Botón 'Completar' presionado correctamente dentro del modal.");
        await driver.sleep(3000);
      } catch (error) {
        throw new Error(`❌ Paso 12: No se pudo presionar el botón 'Completar': ${error.message}`);
      }

      // === Paso 13: Confirmar acción en el modal ("Sí") ===
      try {
        // Esperar a que el modal de confirmación aparezca
        const modalConfirmacion = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-button-btConfirmYes"]/div')),
          15000
        );

        await driver.wait(until.elementIsVisible(modalConfirmacion), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", modalConfirmacion);
        await driver.sleep(500);

        // Antes de hacer clic, verificar si hay un overlay o progress activo
        try {
          const overlay = await driver.findElement(By.css('.ui-progress-overlay, .progress, .loading'));
          const visible = await overlay.isDisplayed().catch(() => false);
          if (visible) {
            console.log("⏳ Esperando a que finalice el progreso antes de confirmar...");
            await driver.wait(async () => !(await overlay.isDisplayed().catch(() => false)), 15000);
          }
        } catch {
          // No hay overlay, continuar
        }

        // Intentar hacer clic normalmente
        try {
          await modalConfirmacion.click();
        } catch {
          // Si falla, forzar clic con JS
          await driver.executeScript("arguments[0].click();", modalConfirmacion);
        }

        console.log("✅ Paso 13: Confirmación 'Sí' seleccionada correctamente.");
        await driver.sleep(3000);
      } catch (error) {
        throw new Error(`❌ Paso 13: No se pudo confirmar con 'Sí': ${error.message}`);
      }


    } catch (error) {
      console.error(`❌ Error en el caso de prueba CP_GESORD_00X: ${error.message}`);

      throw error;
    }
  }

  // =====================================================
  // CP_GESORD_00X: Ejecutar orden mantenimiento (cliente simulado) Actividad lógica **PENDIENTE**
  // x pasos
  // =====================================================
  async ejecutarOrdenMantenimientoLogico(caseName = "CP_GESORD_00X", idOrden) {
    const driver = this.driver;

    try {
      // Paso 1: Seleccionar cliente
      await this.seleccionarClientePorIdOrden(idOrden);

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
  // CP_GESORD_00X: Ejecutar orden terminacion (opción entrega de equipos en oficina)
  // x pasos
  // =====================================================

  async ejecutarOrdenTerminacion(caseName = "CP_GESORD_00X", idOrden) {
    const driver = this.driver;

    try {
      // Paso 1: Seleccionar cliente
      await this.seleccionarClientePorIdOrden(idOrden);

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

      // === Paso 4: Clic en el botón "Número de Serial" ===
      try {
        const btnNumeroSerialXpath =
          '//div[contains(@class,"device") and .//div[contains(@class,"serial-label") and normalize-space(text())="Número de serial"]]';
        const progressXpath = '//*[contains(@id,"progress-progress-crudgestor") or contains(@id,"progress")]';

        // Localizar el botón dinámicamente
        const btnNumeroSerial = await driver.wait(
          until.elementLocated(By.xpath(btnNumeroSerialXpath)),
          20000
        );
        await driver.wait(until.elementIsVisible(btnNumeroSerial), 10000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnNumeroSerial);
        await driver.sleep(500);

        // Intentar clic directo con fallback JS
        try {
          await btnNumeroSerial.click();
        } catch {
          await driver.executeScript("arguments[0].click();", btnNumeroSerial);
        }

        console.log("✅ Paso 4: Botón 'Número de Serial' presionado correctamente.");

        // Esperar opcionalmente el progress (si aparece)
        let progressVisible = false;
        try {
          const progress = await driver.wait(
            until.elementLocated(By.xpath(progressXpath)),
            10000
          );
          await driver.wait(until.elementIsVisible(progress), 5000);
          progressVisible = true;
          console.log("⏳ Paso 4: Proceso de aprovisionamiento iniciado...");

          // Esperar que desaparezca o que el modal cambie (máx 60s)
          await driver.wait(async () => {
            try {
              return !(await progress.isDisplayed());
            } catch {
              // Si el elemento desaparece o el modal se cierra, lo consideramos finalizado
              return true;
            }
          }, 60000);
        } catch {
          console.log("⚠️ Paso 4: No se detectó progress visible, continuando.");
        }

        await driver.sleep(2000); // pausa por estabilidad
        console.log(progressVisible
          ? "✅ Paso 4: Proceso completado correctamente (progress finalizado)."
          : "✅ Paso 4: Proceso completado (sin progress visible).");

      } catch (error) {
        throw new Error(`❌ Paso 4: Error en clic o espera del progress 'Número de Serial': ${error.message}`);
      }

      // === Paso 5: Clic en el botón "Siguiente" dentro del modal de terminación ===
      try {
        const botonSiguiente = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-button-btn-next-step"]/div')),
          15000
        );

        await driver.wait(until.elementIsVisible(botonSiguiente), 8000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonSiguiente);
        await driver.sleep(500);

        try {
          await botonSiguiente.click();
        } catch {
          await driver.executeScript("arguments[0].click();", botonSiguiente);
        }

        console.log("✅ Paso 5: Botón 'Siguiente' del modal de terminación presionado correctamente.");
        await driver.sleep(3000); // espera para que cargue el siguiente bloque
      } catch (error) {
        throw new Error(`❌ Paso 5: No se pudo presionar el botón 'Siguiente' del modal de terminación: ${error.message}`);
      }

      // === Paso 6: Clic en el botón "Siguiente" dentro del modal de escanear ONT ===
      try {
        const botonSiguienteOnt = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-button-btn-next-step"]/div')),
          15000
        );

        await driver.wait(until.elementIsVisible(botonSiguienteOnt), 8000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonSiguienteOnt);
        await driver.sleep(500);

        try {
          await botonSiguienteOnt.click();
          await driver.sleep(10000);
        } catch {
          await driver.executeScript("arguments[0].click();", botonSiguienteOnt);
        }

        console.log("✅ Paso 6: Botón 'Siguiente' dentro del modal de escanear ONT presionado correctamente.");

        // // Esperar si aparece un progress/loading
        // try {
        //   const progressXpath = '//*[contains(@class, "widget-progress") or contains(@class, "loading") or contains(@role, "progressbar")]';
        //   await driver.wait(
        //     until.elementLocated(By.xpath(progressXpath)),
        //     5000
        //   );
        //   console.log("⏳ Progress detectado, esperando a que finalice...");

        //   // Esperar a que el progress desaparezca (hasta 60 segundos)
        //   await driver.wait(
        //     async () => {
        //       const elements = await driver.findElements(By.xpath(progressXpath));
        //       return elements.length === 0;
        //     },
        //     60000,
        //     "El progress no desapareció después de 60s."
        //   );
        //   console.log("✅ Progress finalizado correctamente.");
        // } catch {
        //   console.log("ℹ️ No se detectó progress, continuando con el flujo.");
        // }

        await driver.sleep(2000); // Pequeña espera adicional
      } catch (error) {
        throw new Error(`❌ Paso 6: No se pudo presionar el botón 'Siguiente' dentro del modal de escanear ONT: ${error.message}`);
      }



    } catch (error) {
      console.error(`❌ Error en el caso de prueba CP_GESORD_00X: ${error.message}`);

      throw error;
    }
  }

  // =====================================================
  // CP_GESORD_00X: Completar orden
  // x pasos
  // =====================================================

  async completarOrden(caseName = "CP_GESORD_00X", idOrden) {
    const driver = this.driver;

    try {
      // Paso 1: Seleccionar cliente
      await this.seleccionarClientePorIdOrden(idOrden);

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

      // === Paso 4: Clic en el botón "Completar" ===
      try {
        const botonCompletar = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-button-complet-process"]/div')),
          15000
        );
        await driver.wait(until.elementIsVisible(botonCompletar), 8000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonCompletar);
        await driver.sleep(500);

        try {
          await botonCompletar.click();
        } catch {
          await driver.executeScript("arguments[0].click();", botonCompletar);
        }

        console.log("✅ Paso 4: Botón 'Completar' presionado correctamente.");


        await driver.sleep(2000); // Espera adicional para estabilidad
      } catch (error) {
        throw new Error(`❌ Paso 4: No se pudo presionar el botón 'Completar': ${error.message}`);
      }

      // === Paso 5: Clic en el botón "Sí" en el modal de confirmación ===
      try {
        const botonConfirmarSi = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-button-btConfirmYes"]/div')),
          15000
        );
        await driver.wait(until.elementIsVisible(botonConfirmarSi), 8000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonConfirmarSi);
        await driver.sleep(500);

        try {
          await botonConfirmarSi.click();
        } catch {
          await driver.executeScript("arguments[0].click();", botonConfirmarSi);
        }

        console.log("✅ Paso 5: Botón 'Sí' en el modal de confirmación presionado correctamente.");

        // Esperar si aparece un progress después del clic
        try {
          const progressXpath = '//*[contains(@class,"widget-progress") or contains(@class,"loading") or contains(@role,"progressbar")]';
          await driver.wait(
            until.elementLocated(By.xpath(progressXpath)),
            5000
          );
          console.log("⏳ Progress detectado después de confirmar. Esperando que finalice...");

          // Esperar hasta que desaparezca el progress (máx. 60s)
          await driver.wait(
            async () => {
              const elementos = await driver.findElements(By.xpath(progressXpath));
              return elementos.length === 0;
            },
            20000,
            "El progress no desapareció después de 60 segundos."
          );

          console.log("✅ Progress finalizado correctamente después del clic en 'Sí'.");
        } catch {
          console.log("ℹ️ No se detectó progress después del clic en 'Sí'.");
        }

        await driver.sleep(2000); // Espera adicional para estabilidad
      } catch (error) {
        throw new Error(`❌ Paso 5: No se pudo presionar el botón 'Sí' en el modal de confirmación: ${error.message}`);
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
  async registroMateriales(caseName = "CP_GESORD_008", idOrden) {
    const driver = this.driver;

    try {
      // Paso 1: Seleccionar cliente
      await this.seleccionarClientePorIdOrden(idOrden);

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

    // === Paso 4: Diligenciar los campos del modal 'Registro de materiales' ===
    try {
      // Función auxiliar para generar un número aleatorio entre 1 y 100
      const randomValue = () => Math.floor(Math.random() * 100) + 1;

      // Lista de XPaths de los campos del modal
      const camposMateriales = [
        '//*[@id="widget-textareafield-PATCHCORDSC_APC-SC_APC"]/textarea',
        '//*[@id="widget-textareafield-CABLEDROP1G657"]/textarea',
        '//*[@id="widget-textareafield-CONECTORESSC_APC"]/textarea',
        '//*[@id="widget-textareafield-ROSETAFTB-506"]/textarea'
      ];

      // Iterar sobre los campos y diligenciarlos con valores aleatorios
      for (const [index, xpathCampo] of camposMateriales.entries()) {
        try {
          const campo = await driver.wait(until.elementLocated(By.xpath(xpathCampo)), 15000);
          await driver.wait(until.elementIsVisible(campo), 8000);
          await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", campo);
          await driver.sleep(300);
          await campo.clear();

          const valor = randomValue();
          await campo.sendKeys(valor.toString());
          console.log(`✅ Campo ${index + 1} diligenciado con valor aleatorio: ${valor}`);
          await driver.sleep(500);
        } catch (errCampo) {
          console.warn(`⚠️ No se pudo diligenciar el campo ${index + 1}: ${errCampo.message}`);
        }
      }

      console.log("✅ Paso 4: Todos los campos del modal 'Registro de materiales' diligenciados correctamente.");

    } catch (error) {
      throw new Error(`❌ Paso 4: No se pudo diligenciar los campos del modal 'Registro de materiales': ${error.message}`);
    }


    // === Paso 5: Clic en el botón "Guardar" en el modal 'Registro de materiales' ===
    try {
      const btnGuardarXpath = '//*[@id="widget-button-cahnge-state-appointment"]/div';

      // 1️⃣ Esperar a que el botón esté presente en el DOM
      const btnGuardar = await driver.wait(
        until.elementLocated(By.xpath(btnGuardarXpath)),
        15000
      );

      // 2️⃣ Asegurar que sea visible y habilitado
      await driver.wait(until.elementIsVisible(btnGuardar), 8000);
      await driver.wait(until.elementIsEnabled(btnGuardar), 8000);

      // 3️⃣ Desplazar hacia el botón
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnGuardar);
      await driver.sleep(400);

      // 4️⃣ Intentar clic normal, y si falla usar JS
      try {
        await btnGuardar.click();
      } catch {
        await driver.executeScript("arguments[0].click();", btnGuardar);
      }

      console.log("✅ Paso 5: Botón 'Guardar' en el modal 'Registro de materiales' presionado correctamente.");

      // 5️⃣ Esperar un pequeño tiempo por confirmaciones o progresos
      await driver.sleep(4000);

    } catch (error) {
      throw new Error(`❌ Paso 5: No se pudo presionar el botón 'Guardar' en el modal 'Registro de materiales': ${error.message}`);
    }



  } catch(error) {
    console.error(`❌ Error en el caso de prueba CP_GESORD_008: ${error.message}`);

    throw error;
  }

  // =====================================================
  // CP_GESORD_009 – Revisar sesiones
  // x pasos
  // =====================================================
  async revisarSesiones(caseName = "CP_GESORD_009", idOrden) {
    const driver = this.driver;

    try {
      // Paso 1: Seleccionar cliente
      await this.seleccionarClientePorIdOrden(idOrden);

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

    // === Paso 4: Clic en el botón "Refrescar" dentro del modal 'Revisar sesiones' ===
    try {
      // 1️⃣ Localizar el modal de manera dinámica (ID cambia en cada ejecución)
      const modalXpath = '//div[starts-with(@id,"widget-dialog-open-dialog-") and contains(@id,"orderViewerGestor2")]';
      const modalRevisarSesiones = await driver.wait(
        until.elementLocated(By.xpath(modalXpath)),
        15000
      );
      await driver.wait(until.elementIsVisible(modalRevisarSesiones), 8000);

      // 2️⃣ Intentar localizar el botón "Refrescar" por varias rutas posibles
      const posiblesRutas = [
        './/*[@id="crud-refresh-btn"]',
        './/*[@id="crud-refresh-btn"]/i',
        './/*[@id="crud-sessions-order"]//div[@id="crud-refresh-btn"]',
        './/*[@id="crud-sessions-order"]//i[contains(@class,"glyphicon-refresh")]'
      ];

      let btnRefrescar = null;
      for (const ruta of posiblesRutas) {
        try {
          const elemento = await modalRevisarSesiones.findElement(By.xpath(ruta));
          if (elemento) {
            btnRefrescar = elemento;
            break;
          }
        } catch {
          continue;
        }
      }

      if (!btnRefrescar)
        throw new Error("No se encontró el botón 'Refrescar' dentro del modal 'Revisar sesiones'.");

      // 3️⃣ Esperar visibilidad y clic
      await driver.wait(until.elementIsVisible(btnRefrescar), 6000);
      await driver.wait(until.elementIsEnabled(btnRefrescar), 6000);
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnRefrescar);
      await driver.sleep(400);

      try {
        await btnRefrescar.click();
      } catch {
        await driver.executeScript("arguments[0].click();", btnRefrescar);
      }

      // 4️⃣ Espera breve para permitir refrescar los datos
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
  async reabrirOrden(caseName = "CP_GESORD_010", idOrden) {
    const driver = this.driver;

    try {
      // Paso 1: Seleccionar cliente
      await this.seleccionarClientePorIdOrden(idOrden);

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




