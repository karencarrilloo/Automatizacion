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

    //falta continuar los demás pasos....


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

    //falta continuar los demás pasos....


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

    //falta continuar los demás pasos....


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

      await driver.sleep(4000); // espera por la apertura del modal o acción
      console.log("✅ Paso 3: Opción 'Ver información técnica asociada' seleccionada correctamente.");

    } catch (error) {
      throw new Error(`❌ Paso 3: No se pudo seleccionar la opción 'Ver información técnica asociada': ${error.message}`);
    }

    //falta continuar los demás pasos....


  } catch(error) {
    console.error(`❌ Error en el caso de prueba CP_GESORD_006: ${error.message}`);

    throw error;
  }


  // =====================================================
  // CP_GESORD_007 – Ejecutar orden venta e instalación
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

        //falta continuar los demás pasos....


      } catch (error) {
        throw new Error(`❌ Paso 5: Error al intentar presionar el botón 'SIGUIENTE': ${error.message}`);
      }



      console.log(`✅ ${caseName}: Proceso 'ORDEN - VENTA E INSTALACIÓN' ejecutado con éxito.`);
    } catch (error) {
      console.error(`❌ Error en el caso de prueba CP_GESORD_007: ${error.message}`);

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

    //falta continuar los demás pasos....


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




