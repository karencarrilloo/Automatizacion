// src/pages/eCenter/autodiagnostico/autodiagnostico.page.js
import { By, until } from 'selenium-webdriver';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

export default class AutodiagnosticoPage {
  constructor(driver) {
    this.driver = driver;
  }

  // === Utilidad común para capturar pantallas de error ===
  async screenshotError(prefix) {
    const screenshot = await this.driver.takeScreenshot();
    const folder = path.resolve(__dirname, '../../../../errors/eCenter/autodiagnostico');
    fs.mkdirSync(folder, { recursive: true });
    const file = path.join(folder, `${prefix}_${Date.now()}.png`);
    fs.writeFileSync(file, screenshot, 'base64');
    return file;
  }

  // =======================
  // CP_AUTO_001: Ingreso a la vista Autodiagnóstico
  // Pasos 3
  // =======================
  async ingresarVistaAutodiagnostico() {
    const d = this.driver;
    try {
      // Paso 1: clic en módulo eCenter
      const eCenterBtn = await d.wait(
        until.elementLocated(By.xpath("//div[@id='118' and contains(@class,'item-module')]")),
        15000
      );
      await d.executeScript("arguments[0].click();", eCenterBtn);
      await d.sleep(1000);

      // Paso 2: scroll en contenedor
      const scrollContainer = await d.wait(
        until.elementLocated(By.css('.container-applications')),
        10000
      );
      await d.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight;", scrollContainer);
      await d.sleep(1000);

      // Paso 3: clic en módulo Autodiagnóstico
      const autoBtn = await d.wait(
        until.elementLocated(By.xpath('//*[@id="4240"]/div[2]')),
        15000
      );
      await d.executeScript("arguments[0].scrollIntoView({block:'center'});", autoBtn);
      await d.wait(until.elementIsVisible(autoBtn), 10000);
      await d.executeScript("arguments[0].click();", autoBtn);
      await d.sleep(5000);
    } catch (e) {
      await this.screenshotError('CP_AUTO_001');
      throw e;
    }
  }

  // =======================
  // CP_AUTO_002: Consulta del cliente por ID DEAL
  // Pasos 3
  // =======================
  async consultarClientePorID(idDeal = '28007172679') {
    const d = this.driver;
    try {
      // Paso 1: clic en botón ID DEAL
      const botonID = await d.wait(
        until.elementLocated(By.xpath('//*[@id="container-mainframe"]/div[4]/div/div/div/div[2]/div[2]/div[3]')),
        15000
      );
      await d.executeScript("arguments[0].scrollIntoView({block:'center'});", botonID);
      await d.executeScript("arguments[0].click();", botonID);
      await d.sleep(2000);

      // Paso 2: Ingresar número ID DEAL válido
      const inputID = await d.wait(
        until.elementLocated(By.xpath('//*[@id="textfield-input-consult-customer"]')),
        10000
      );
      await inputID.clear();
      await inputID.sendKeys(idDeal);
      await d.sleep(1000);

      // Paso 3: clic en Consultar cliente
      const btnConsultar = await d.wait(
        until.elementLocated(By.xpath('//*[@id="container-mainframe"]/div[4]/div/div/div/div[2]/div[3]/div[3]')),
        15000
      );
      await d.executeScript("arguments[0].scrollIntoView({block:'center'});", btnConsultar);
      await btnConsultar.click();

      // espera a que desaparezca loader si aparece
      try {
        const loader = await d.wait(
          until.elementLocated(By.css('div.container-loading-iptotal')),
          5000
        );
        await d.wait(until.stalenessOf(loader), 60000);
      } catch {
        // sin loader, continuar
      }
    } catch (e) {
      await this.screenshotError('CP_AUTO_002');
      throw e;
    }
  }

  // =======================
  // CP_AUTO_003: Editar configuración de WiFi
  // Pasos 11
  // =======================
  async editarConfiguracionWiFi() {
    const d = this.driver;
    try {
      // Paso 1: Clic en el boton OPCIONES
      const btnOpciones = await d.wait(until.elementLocated(By.xpath('//*[@id="btn-options"]')), 15000);
      await d.executeScript("arguments[0].click();", btnOpciones);
      await d.sleep(2000);

      // Paso 2: Clic en opción "Configuración WiFi"
      const opcionWifi = await d.wait(until.elementLocated(By.xpath('//*[@id="1200"]/div')), 15000);
      await d.executeScript("arguments[0].click();", opcionWifi);

    // === Paso 3: Seleccionar el campo "Nombre de red"
    const contenedorCampo = await d.wait(
      until.elementLocated(By.xpath('//*[@id="widget-textfield-2_4GHz-1"]')),
      20000
    );
    await d.wait(until.elementIsVisible(contenedorCampo), 10000);
    const inputNombreRed = await contenedorCampo.findElement(By.css('input'));
    await d.wait(until.elementIsVisible(inputNombreRed), 10000);
    await d.wait(until.elementIsEnabled(inputNombreRed), 10000);
    await d.executeScript("arguments[0].scrollIntoView({block: 'center'});", inputNombreRed);
    await d.sleep(500);
    await inputNombreRed.click();
    await d.executeScript("arguments[0].focus();", inputNombreRed);
    await d.sleep(500);

    // === Paso 4: Digitar nuevo nombre de red
    await inputNombreRed.clear();
    await d.sleep(500);
    await inputNombreRed.sendKeys("TEST_EDICION");
    await d.sleep(2000);

    // === Paso 5: Clic en el select CANAL
    const selectCanal = await d.wait(
      until.elementLocated(By.xpath('//*[@id="input-select-select-2_4GHz3"]')),
      10000
    );
    await d.wait(until.elementIsVisible(selectCanal), 5000);
    await d.wait(until.elementIsEnabled(selectCanal), 5000);
    await d.executeScript("arguments[0].scrollIntoView({block:'center'});", selectCanal);
    await d.sleep(300);
    await selectCanal.click();
    await d.sleep(1000);

    // === Paso 6: Selección aleatoria de canal
    const opcionesCanal = await selectCanal.findElements(By.css('option'));
    const canalesValidos = [];
    for (const opt of opcionesCanal) {
      const txt = (await opt.getText()).trim();
      if (txt && txt !== 'Seleccionar') canalesValidos.push(opt);
    }
    if (!canalesValidos.length) throw new Error("Sin opciones válidas en CANAL");
    const canalElegido = canalesValidos[Math.floor(Math.random() * canalesValidos.length)];
    const txtCanal = await canalElegido.getText();
    await d.executeScript(
      `arguments[0].selected = true; arguments[0].dispatchEvent(new Event('change',{bubbles:true}));`,
      canalElegido
    );
    await d.sleep(1500);

    // === Paso 7: Clic en select ANCHO BANDA CANAL
    const selectAncho = await d.wait(
      until.elementLocated(By.xpath('//*[@id="input-select-select-2_4GHz4"]')),
      10000
    );
    await d.wait(until.elementIsVisible(selectAncho), 5000);
    await d.wait(until.elementIsEnabled(selectAncho), 5000);
    await d.executeScript("arguments[0].scrollIntoView({block:'center'});", selectAncho);
    await d.sleep(300);
    await selectAncho.click();
    await d.sleep(1000);

    // === Paso 8: Selección aleatoria de ancho de banda
    const opcionesAncho = await selectAncho.findElements(By.css('option'));
    const anchosValidos = [];
    for (const opt of opcionesAncho) {
      const txt = (await opt.getText()).trim();
      if (txt && txt !== 'Seleccionar') anchosValidos.push(opt);
    }
    if (!anchosValidos.length) throw new Error("Sin opciones válidas en ANCHO BANDA");
    const anchoElegido = anchosValidos[Math.floor(Math.random() * anchosValidos.length)];
    const txtAncho = await anchoElegido.getText();
    await d.executeScript(
      `arguments[0].selected = true; arguments[0].dispatchEvent(new Event('change',{bubbles:true}));`,
      anchoElegido
    );
    await d.sleep(1500);

    // === Paso 9: Marcar checkbox 'Unsecured'
    const labelUnsecured = await d.wait(
      until.elementLocated(By.xpath('//*[@id="widget-checkbox-checklist-data2_4GHz1"]/label')),
      10000
    );
    await d.wait(until.elementIsVisible(labelUnsecured), 5000);
    await d.executeScript("arguments[0].scrollIntoView({block:'center'});", labelUnsecured);
    await d.sleep(300);
    await d.executeScript("arguments[0].click();", labelUnsecured);
    await d.sleep(800);

    // === Paso 10: Clic en botón ENVIAR y esperar progress
    const btnEnviar = await d.wait(
      until.elementLocated(By.xpath('//*[@id="widget-button-send-info"]/div')),
      10000
    );
    await d.wait(until.elementIsVisible(btnEnviar), 5000);
    await d.wait(until.elementIsEnabled(btnEnviar), 5000);
    await d.executeScript("arguments[0].scrollIntoView({block:'center'});", btnEnviar);
    await d.sleep(300);
    try { await btnEnviar.click(); } catch { await d.executeScript("arguments[0].click();", btnEnviar); }
   

    // Esperar progress si aparece
    try {
      const progress = await d.wait(until.elementLocated(By.xpath('//*[@class="progress-bar"]')), 5000);
      await d.wait(until.stalenessOf(progress), 30000);
    } catch { }

    // === Paso 11: Cerrar modal de Configuración WiFi
    const closeBtn = await d.wait(
      until.elementLocated(By.xpath('//*[@id="widget-dialog-open-dialog-603378-undefined"]/div/div/div[1]/button')),
      10000
    );
    await d.wait(until.elementIsVisible(closeBtn), 5000);
    await d.executeScript("arguments[0].scrollIntoView({block:'center'});", closeBtn);
    await d.sleep(200);
    try { await closeBtn.click(); } catch { await d.executeScript("arguments[0].click();", closeBtn); }

    await d.wait(async () => {
      try {
        const modal = await d.findElement(By.xpath('//*[@id="widget-dialog-open-dialog-603378-undefined"]/div/div'));
        return !(await modal.isDisplayed());
      } catch { return true; }
    }, 15000);


    } catch (e) {
      await this.screenshotError('CP_AUTO_003');
      throw e;
    }
  }

  /**
   * ===========================
   * CP_AUTO_004 – Redirigir ONT
   * ===========================
   * 
   */
  async ejecutarRedirigirONT(caseName = 'CP_AUTO_004') {
    const driver = this.driver;

    try {
      // Paso 1: Clic en botón "Opciones"
      const btnOpciones = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="btn-options"]')),
        10000
      );
      await driver.wait(until.elementIsVisible(btnOpciones), 5000);
      await driver.wait(until.elementIsEnabled(btnOpciones), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", btnOpciones);
      await driver.sleep(500);
      await btnOpciones.click();
      await driver.sleep(3000);

      // Paso 2: Clic en opción "Redirigir ONT"
      const opcionRedirigir = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="1201"]')),
        15000
      );
      await driver.wait(until.elementIsVisible(opcionRedirigir), 5000);
      await driver.wait(until.elementIsEnabled(opcionRedirigir), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", opcionRedirigir);
      await driver.sleep(500);
      await opcionRedirigir.click();

      // Esperar loader (opcional)
      const loaderXPath = '//*[contains(@id,"progress-id-progress")]';
      try {
        const loader = await driver.wait(
          until.elementLocated(By.xpath(loaderXPath)),
          5000
        );
        await driver.wait(until.stalenessOf(loader), 20000);
        
      } catch {
  
      }

      const modalXPath = "//*[contains(text(),'Desea ser redirigido a la pagina de la ONT')]";
      const modal = await driver.wait(
        until.elementLocated(By.xpath(modalXPath)),
        20000
      );
      await driver.wait(until.elementIsVisible(modal), 6000);

      // Paso 3: Clic en el botón "NO" del modal de confirmación
      const btnNo = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-button-btConfirmNo"]/div')),
        10000
      );
      await driver.wait(until.elementIsVisible(btnNo), 5000);
      await driver.wait(until.elementIsEnabled(btnNo), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", btnNo);
      await driver.sleep(1000);
      await btnNo.click().catch(() =>
        driver.executeScript("arguments[0].click();", btnNo)
      );

      // Confirmar que el modal desapareció
      await driver.wait(async () => {
        const modales = await driver.findElements(
          By.xpath("//div[contains(@id,'widget-dialog-open-dialog') and contains(., 'Desea ser redirigido')]")
        );
        if (modales.length === 0) return true;
        const visible = await modales[0].isDisplayed().catch(() => false);
        return !visible;
      }, 15000);
      await driver.sleep(500);


    } catch (error) {
      console.error(`❌ [CP_AUTO_004] Error: ${error.message}`);

      throw error;
    }
  }

  // =======================
  // CP_AUTO_005 – Creación de órdenes
  // =======================
  async crearOrdenes(caseName = "CP_AUTO_005") {
    const driver = this.driver;

    // === Paso 1: Clic en botón "Opciones" ===
    try {
      const btnOpciones = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="btn-options"]')),
        10000
      );
      await driver.wait(until.elementIsVisible(btnOpciones), 5000);
      await driver.wait(until.elementIsEnabled(btnOpciones), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", btnOpciones);
      await driver.sleep(500);
      await btnOpciones.click();
      await driver.sleep(3000);

      console.log("✅ Paso 1: Botón 'Opciones' presionado correctamente.");
    } catch (error) {
      throw new Error(`❌ Error en Paso 1 (clic en botón 'Opciones'): ${error.message}`);
    }

    // === Paso 2: Clic en opción "Creación de órdenes" ===
    try {
      const opcionCreacion = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="1202"]')),
        15000
      );
      await driver.wait(until.elementIsVisible(opcionCreacion), 5000);
      await driver.wait(until.elementIsEnabled(opcionCreacion), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", opcionCreacion);
      await driver.sleep(300);
      try {
        await opcionCreacion.click();
      } catch {
        await driver.executeScript("arguments[0].click();", opcionCreacion);
      }

      // Loader opcional
      try {
        const loaderXPath = "//*[contains(@id,'progress-id-progress')]";
        const progressElem = await driver.wait(
          until.elementLocated(By.xpath(loaderXPath)),
          5000
        );
        await driver.wait(until.stalenessOf(progressElem), 20000);
      } catch {
        console.log("ℹ️ No se detectó loader tras seleccionar 'Creación de órdenes'.");
      }

      console.log("✅ Paso 2: Opción 'Creación de órdenes' seleccionada correctamente.");
    } catch (error) {
      throw new Error(`❌ Error en Paso 2 (clic en opción 'Creación de órdenes'): ${error.message}`);
    }

    // === Paso 3: Clic en el select "Tipo de orden" ===
    try {
      const selectTipoOrden = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="input-select-selectType"]')),
        15000
      );
      await driver.wait(until.elementIsVisible(selectTipoOrden), 5000);
      await driver.wait(until.elementIsEnabled(selectTipoOrden), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", selectTipoOrden);
      await driver.sleep(300);
      await selectTipoOrden.click();
      await driver.sleep(3000);

      console.log("✅ Paso 3: Clic en el select 'Tipo de orden' realizado correctamente.");
    } catch (error) {
      throw new Error(`❌ Error en Paso 3 (clic en select 'Tipo de orden'): ${error.message}`);
    }

    // === Paso 4: Seleccionar opción "Orden de mantenimiento" ===
    try {
      const opcionMantenimiento = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="input-select-selectType"]/option[2]')),
        5000
      );
      const textoOpcion = await opcionMantenimiento.getText();
      await driver.executeScript(`
        arguments[0].selected = true;
        arguments[0].dispatchEvent(new Event('change', { bubbles: true }));
      `, opcionMantenimiento);
      await driver.sleep(1000);

      console.log(`✅ Paso 4: Opción '${textoOpcion}' seleccionada en 'Tipo de orden'.`);
    } catch (error) {
      throw new Error(`❌ Error en Paso 4 (selección opción 'Orden de mantenimiento'): ${error.message}`);
    }

    // === Paso 5: Clic en el select "Posible falla" ===
    try {
      const selectPosibleFalla = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="input-select-selectTypeDiagnosis"]')),
        10000
      );
      await driver.wait(until.elementIsVisible(selectPosibleFalla), 5000);
      await driver.wait(until.elementIsEnabled(selectPosibleFalla), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", selectPosibleFalla);
      await driver.sleep(300);
      await selectPosibleFalla.click();
      await driver.sleep(1000);

      console.log("✅ Paso 5: Clic en el select 'Posible falla' realizado correctamente.");
    } catch (error) {
      throw new Error(`❌ Error en Paso 5 (clic en select 'Posible falla'): ${error.message}`);
    }

    // === Paso 6: Seleccionar opción aleatoria en "Posible falla" ===
    try {
      const selectElement = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="input-select-selectTypeDiagnosis"]')),
        10000
      );
      const options = await selectElement.findElements(By.css("option"));
      const validOptions = [];
      for (let opt of options) {
        const text = await opt.getText();
        if (text && text.trim().toLowerCase() !== "seleccionar") {
          validOptions.push(opt);
        }
      }
      if (validOptions.length === 0) {
        throw new Error("⚠️ No se encontraron opciones válidas en 'Posible falla'.");
      }
      const randomIndex = Math.floor(Math.random() * validOptions.length);
      const opcionSeleccionada = validOptions[randomIndex];
      const textoSeleccionado = await opcionSeleccionada.getText();

      await driver.executeScript(`
        arguments[0].selected = true;
        arguments[0].dispatchEvent(new Event('change', { bubbles: true }));
      `, opcionSeleccionada);
      await driver.sleep(1000);

      console.log(`✅ Paso 6: Opción '${textoSeleccionado}' seleccionada en 'Posible falla'.`);
    } catch (error) {
      throw new Error(`❌ Error en Paso 6 (selección de opción en 'Posible falla'): ${error.message}`);
    }

    // === Paso 7: Diligenciar campo "Observaciones" ===
    try {
      const observacionesInput = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-textareafield-observations"]/textarea')),
        10000
      );
      await driver.wait(until.elementIsVisible(observacionesInput), 5000);
      await driver.wait(until.elementIsEnabled(observacionesInput), 5000);
      await observacionesInput.clear();
      await observacionesInput.sendKeys("test creacion ordenes");
      await driver.sleep(3000);

      console.log("✅ Paso 7: Campo 'Observaciones' diligenciado correctamente.");
    } catch (error) {
      throw new Error(`❌ Error en Paso 7 (diligenciar campo 'Observaciones'): ${error.message}`);
    }

    // === Paso 8: Clic en botón "Generar orden" ===
    try {
      const btnGenerarOrden = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-button-create-order"]/div')),
        10000
      );
      await driver.wait(until.elementIsVisible(btnGenerarOrden), 5000);
      await driver.wait(until.elementIsEnabled(btnGenerarOrden), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", btnGenerarOrden);
      await driver.sleep(300);
      await driver.executeScript("arguments[0].click();", btnGenerarOrden);
      await driver.sleep(2000);

      console.log("✅ Paso 8: Botón 'Generar orden' presionado correctamente.");
    } catch (error) {
      throw new Error(`❌ Error en Paso 8 (clic en botón 'Generar orden'): ${error.message}`);
    }

    // === Paso 9: Clic en botón "Sí" del modal de confirmación ===
    try {
      const btnConfirmYes = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-button-btConfirmYes"]/div')),
        15000
      );
      await driver.wait(until.elementIsVisible(btnConfirmYes), 5000);
      await driver.wait(until.elementIsEnabled(btnConfirmYes), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", btnConfirmYes);
      await driver.sleep(300);
      await driver.executeScript("arguments[0].click();", btnConfirmYes);
      await driver.sleep(10000);

      console.log("✅ Paso 9: Botón 'Sí' de confirmación presionado correctamente.");
    } catch (error) {
      throw new Error(`❌ Error en Paso 9 (clic en botón 'Sí'): ${error.message}`);
    }
  }

  // =======================
  // CP_AUTO_006 – funcion UPnP(opcion click boton cancelar)
  // =======================

  async funcionUPnP() {
    const driver = this.driver;

    // Paso 1: Clic en botón "Opciones"
    try {
      const btnOpciones = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="btn-options"]')),
        10000
      );
      await driver.wait(until.elementIsVisible(btnOpciones), 5000);
      await driver.wait(until.elementIsEnabled(btnOpciones), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnOpciones);
      await driver.sleep(500);
      await btnOpciones.click();
      await driver.sleep(3000);
      console.log("✅ Paso 1: Botón 'Opciones' presionado correctamente.");
    } catch (error) {
      throw new Error(`❌ Error en Paso 1 (clic en botón 'Opciones'): ${error.message}`);
    }

    // Paso 2: Clic en opción "funcion UPnP"
    try {
      const opcionUPnP = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="1203"]')),
        15000
      );
      await driver.wait(until.elementIsVisible(opcionUPnP), 5000);
      await driver.wait(until.elementIsEnabled(opcionUPnP), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", opcionUPnP);
      await driver.sleep(300);
      await driver.executeScript("arguments[0].click();", opcionUPnP);
      console.log("✅ Paso 2: Opción 'Función UPnP' seleccionada correctamente.");

      // Progress opcional
      try {
        const progressXpath = '//*[@class="progress-bar"]';
        const progressElem = await driver.wait(until.elementLocated(By.xpath(progressXpath)), 5000);
        console.log("⏳ Progress detectado tras seleccionar 'Función UPnP'...");
        await driver.wait(until.stalenessOf(progressElem), 30000);
        console.log("✅ Progress completado después de seleccionar 'Función UPnP'.");
      } catch {
        console.log("ℹ️ No se detectó progress, se continúa.");
      }
    } catch (error) {
      throw new Error(`❌ Error en Paso 30 (clic en opción 'Función UPnP'): ${error.message}`);
    }

    // Paso 3: Clic en Botón Cancelar
    try {
      const btnCancelar = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-button-cancel-open-dialog"]/div')),
        15000
      );
      await driver.wait(until.elementIsVisible(btnCancelar), 5000);
      await driver.wait(until.elementIsEnabled(btnCancelar), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", btnCancelar);
      await driver.sleep(300);
      await driver.executeScript("arguments[0].click();", btnCancelar);
      console.log("✅ Paso 3: Botón 'Cancelar' clickeado correctamente.");

      try {
        const modalXpath = '//*[@id="widget-dialog-open-dialog"]';
        const modalElem = await driver.findElements(By.xpath(modalXpath));
        if (modalElem.length > 0) {
          await driver.wait(until.stalenessOf(modalElem[0]), 15000);
          console.log("✅ Modal cerrado correctamente.");
        }
      } catch {
        console.log("ℹ️ No se detectó modal para cierre.");
      }
    } catch (error) {
      throw new Error(`❌ Error en Paso 31 (clic en botón 'Cancelar'): ${error.message}`);
    }
  }
   // =======================
  // CP_AUTO_007: funcion DMZ(opcion click boton cancelar)
  // =======================
  async funcionDMZ() {
    const driver = this.driver;

    // Paso 1: Clic en Botón Opciones
    try {
      const btnOpciones = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="btn-options"]')),
        10000
      );
      await driver.wait(until.elementIsVisible(btnOpciones), 5000);
      await driver.wait(until.elementIsEnabled(btnOpciones), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnOpciones);
      await driver.sleep(500);
      await btnOpciones.click();
      await driver.sleep(3000);
      console.log("✅ Paso 1: Botón 'Opciones' presionado correctamente.");
    } catch (error) {
      throw new Error(`❌ Error en Paso 1 (clic en botón 'Opciones'): ${error.message}`);
    }

    // Paso 2: Clic en Opción DMZ
    try {
      const opcionDMZ = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="1204"]/div')),
        15000
      );
      await driver.wait(until.elementIsVisible(opcionDMZ), 5000);
      await driver.wait(until.elementIsEnabled(opcionDMZ), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", opcionDMZ);
      await driver.sleep(300);
      await driver.executeScript("arguments[0].click();", opcionDMZ);
      console.log("✅ Paso 2: Opción 'Función DMZ' seleccionada correctamente.");

      try {
        const loaderXpath = '//*[@id="progress-id-progress-DMZ"]';
        const loader = await driver.wait(until.elementLocated(By.xpath(loaderXpath)), 5000);
        await driver.wait(until.stalenessOf(loader), 15000);
        console.log("ℹ️ Loader DMZ finalizado.");
      } catch {
        console.log("ℹ️ No se detectó loader DMZ.");
      }
    } catch (error) {
      throw new Error(`❌ Error en Paso 33 (clic en opción 'Función DMZ'): ${error.message}`);
    }

    // Paso 3: Clic casilla Habilitar DMZ
    try {
      const labelHabilitarDMZ = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-checkbox-checklist-1"]/label')),
        15000
      );
      await driver.wait(until.elementIsVisible(labelHabilitarDMZ), 5000);
      await driver.wait(until.elementIsEnabled(labelHabilitarDMZ), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", labelHabilitarDMZ);
      await driver.sleep(300);
      await driver.executeScript("arguments[0].click();", labelHabilitarDMZ);
      await driver.sleep(1000);
      console.log("✅ Paso 3: Casilla 'Habilitar DMZ' marcada correctamente.");
    } catch (error) {
      throw new Error(`❌ Error en Paso 3 (marcar casilla 'Habilitar DMZ'): ${error.message}`);
    }

    // Paso 4: Diligenciar IP aleatoria
    try {
      const randomIPv4 = Array.from({ length: 4 }, () => Math.floor(Math.random() * 254) + 1).join('.');
      const ipField = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="textfield-textfield-2"]')),
        15000
      );
      await driver.wait(until.elementIsVisible(ipField), 5000);
      await driver.wait(until.elementIsEnabled(ipField), 5000);
      await ipField.clear();
      await ipField.sendKeys(randomIPv4);
      await driver.sleep(1000);
      console.log(`✅ Paso 4: Dirección IPv4 '${randomIPv4}' diligenciada correctamente.`);
    } catch (error) {
      throw new Error(`❌ Error en Paso 4 (diligenciar dirección IPv4): ${error.message}`);
    }

    // Paso 5: Clic en Botón Refrescar
    try {
      const btnRefrescar = await driver.wait(
        until.elementLocated(
          By.xpath('//*[@id="widget-dialog-open-dialog-603378-undefined"]/div/div/div[2]/div/div/div/div[2]/div[1]/div/span')
        ),
        15000
      );
      await driver.wait(until.elementIsVisible(btnRefrescar), 5000);
      await driver.wait(until.elementIsEnabled(btnRefrescar), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnRefrescar);
      await driver.sleep(300);
      await btnRefrescar.click();
      console.log("✅ Paso 5: Botón 'Refrescar' clicado correctamente.");
    } catch (error) {
      throw new Error(`❌ Error en Paso 5 (clic en botón 'Refrescar'): ${error.message}`);
    }

    // Paso 6: Clic en Botón Cancelar
    try {
      const btnCancelar = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-button-cancel-open-dialog"]/div')),
        15000
      );
      await driver.wait(until.elementIsVisible(btnCancelar), 5000);
      await driver.wait(until.elementIsEnabled(btnCancelar), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnCancelar);
      await driver.sleep(300);
      await btnCancelar.click();

      try {
        const modalElem = await driver.findElement(By.xpath('//*[@id="widget-button-cancel-open-dialog"]/div'));
        await driver.wait(until.stalenessOf(modalElem), 10000);
        console.log("✅ Paso 6: Botón 'Cancelar' clicado y modal cerrado.");
      } catch {
        console.log("⚠️ Paso 6: El modal pudo cerrarse sin esperar staleness.");
      }
    } catch (error) {
      throw new Error(`❌ Error en Paso 6 (clic en botón 'Cancelar'): ${error.message}`);
    }
  }
   // =======================
  // CP_AUTO_008: ipv4 port Mapping(opcion click boton cancelar)
  // =======================

async funcionIPv4PortMapping() {
    const driver = this.driver;

    // === Paso 1: Botón "Opciones" ===
    try {
        const modalXpath = '//*[@id="widget-dialog-open-dialog-603378-undefined"]';
        try {
            const modales = await driver.findElements(By.xpath(modalXpath));
            if (modales.length > 0) {
                console.log("⏳ Se detectó modal abierto, esperando a que se cierre...");
                await driver.wait(until.stalenessOf(modales[0]), 20000);
                console.log("✅ Modal cerrado, continuando con el clic en 'Opciones'.");
            } else {
                console.log("ℹ️ No se encontró modal abierto, continuando directo.");
            }
        } catch {
            console.log("ℹ️ No se detectó modal activo, seguimos.");
        }

        const btnOpciones = await driver.wait(
            until.elementLocated(By.xpath('//*[@id="btn-options"]')),
            10000
        );

        await driver.wait(until.elementIsVisible(btnOpciones), 5000);
        await driver.wait(until.elementIsEnabled(btnOpciones), 5000);

        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnOpciones);
        await driver.sleep(500);

        await driver.executeScript("arguments[0].click();", btnOpciones);
        await driver.sleep(2000);

        console.log("✅ Paso 1: Botón 'Opciones' presionado correctamente.");
    } catch (error) {
        throw new Error(`❌ Error en Paso 1 (clic en botón 'Opciones'): ${error.message}`);
    }

    // === Paso 2: Opción "IPv4 Port Mapping" ===
    try {
        const opcionIPv4PortMapping = await driver.wait(
            until.elementLocated(By.xpath('//*[@id="1205"]')),
            15000
        );

        await driver.wait(until.elementIsVisible(opcionIPv4PortMapping), 5000);
        await driver.wait(until.elementIsEnabled(opcionIPv4PortMapping), 5000);

        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", opcionIPv4PortMapping);
        await driver.sleep(300);
        await opcionIPv4PortMapping.click();

        const loaderXPath = '//*[@id="progress-id-progress-PORTMAPPING"]';
        try {
            const loader = await driver.wait(until.elementLocated(By.xpath(loaderXPath)), 5000);
            await driver.wait(until.stalenessOf(loader), 15000);
        } catch {
            console.log("ℹ️ No se encontró loader para 'IPv4 Port Mapping', continuando…");
        }

        console.log("✅ Paso 2: Opción 'IPv4 Port Mapping' seleccionada correctamente.");
    } catch (error) {
        throw new Error(`❌ Error en Paso 2: (clic en opción 'IPv4 Port Mapping'): ${error.message}`);
    }

    // === Paso 3: Clic en el campo "Protocolo" ===
    try {
        const selectProtocolo = await driver.wait(
            until.elementLocated(By.xpath('//*[@id="input-select-select-3"]')),
            15000
        );

        await driver.wait(until.elementIsVisible(selectProtocolo), 5000);
        await driver.wait(until.elementIsEnabled(selectProtocolo), 5000);

        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", selectProtocolo);
        await driver.sleep(300);
        await selectProtocolo.click();
        await driver.sleep(1000);

        console.log("✅ Paso 3: Clic en el campo 'Protocolo' realizado correctamente.");
    } catch (error) {
        throw new Error(`❌ Error en Paso 3: (clic en campo 'Protocolo'): ${error.message}`);
    }

    // === Paso 4: Seleccionar opción aleatoria en "Protocolo" ===
    try {
        const selectProtocolo = await driver.wait(
            until.elementLocated(By.xpath('//*[@id="input-select-select-3"]')),
            15000
        );

        const opciones = await selectProtocolo.findElements(By.css('option'));
        let opcionesValidas = [];
        for (const opt of opciones) {
            const texto = await opt.getText();
            if (texto && texto.trim() !== 'Seleccionar') {
                opcionesValidas.push(opt);
            }
        }

        if (opcionesValidas.length === 0) {
            throw new Error("⚠️ No se encontraron opciones válidas en el select de Protocolo.");
        }

        const randomIndex = Math.floor(Math.random() * opcionesValidas.length);
        const opcionSeleccionada = opcionesValidas[randomIndex];
        const textoSeleccionado = await opcionSeleccionada.getText();

        await driver.executeScript(`
          arguments[0].selected = true;
          arguments[0].dispatchEvent(new Event('change', { bubbles: true }));
        `, opcionSeleccionada);

        await driver.sleep(1500);
        console.log(`✅ Paso 4: Opción '${textoSeleccionado}' seleccionada correctamente en el select 'Protocolo'.`);
    } catch (error) {
        throw new Error(`❌ Error en Paso 4: (selección aleatoria en select 'Protocolo'): ${error.message}`);
    }

    // === Paso 5: Diligenciar campo "Dirección IP" con una IPv4 aleatoria ===
    try {
        function generarIPv4() {
            const octeto = () => Math.floor(Math.random() * 254) + 1;
            return `${octeto()}.${octeto()}.${octeto()}.${octeto()}`;
        }
        const ipAleatoria = generarIPv4();

        const campoIP = await driver.wait(
            until.elementLocated(By.xpath('//*[@id="textfield-textfield-4"]')),
            15000
        );

        await driver.wait(until.elementIsVisible(campoIP), 5000);
        await driver.wait(until.elementIsEnabled(campoIP), 5000);

        await campoIP.clear();
        await campoIP.sendKeys(ipAleatoria);

        console.log(`✅ Paso 5: Dirección IP '${ipAleatoria}' diligenciada correctamente.`);
    } catch (error) {
        throw new Error(`❌ Error en Paso 5: (diligenciar Dirección IP aleatoria): ${error.message}`);
    }

    // === Paso 6: Clic en botón "Refrescar" ===
    try {
        const btnRefrescar = await driver.wait(
            until.elementLocated(By.xpath('//*[@id="widget-dialog-open-dialog-603378-undefined"]/div/div/div[2]/div/div/div/div[2]/div[1]/div')),
            15000
        );

        await driver.wait(until.elementIsVisible(btnRefrescar), 5000);
        await driver.wait(until.elementIsEnabled(btnRefrescar), 5000);

        await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", btnRefrescar);
        await driver.sleep(1000);
        await driver.executeScript("arguments[0].click();", btnRefrescar);
        await driver.sleep(1000);

        console.log("✅ Paso 6: Botón 'Refrescar' presionado correctamente.");
    } catch (error) {
        throw new Error(`❌ Error en Paso 6: (clic en botón 'Refrescar'): ${error.message}`);
    }

    // === Paso 7: Clic en botón "Cancelar" ===
    try {
        const btnCancelar = await driver.wait(
            until.elementLocated(By.xpath('//*[@id="widget-button-cancel-open-dialog"]/div')),
            15000
        );

        await driver.wait(until.elementIsVisible(btnCancelar), 5000);
        await driver.wait(until.elementIsEnabled(btnCancelar), 5000);

        await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", btnCancelar);
        await driver.sleep(300);
        await driver.executeScript("arguments[0].click();", btnCancelar);

        const modalXpath = '//*[@id="widget-dialog-open-dialog-603378-undefined"]/div/div';
        try {
            const modal = await driver.findElement(By.xpath(modalXpath));
            await driver.wait(until.stalenessOf(modal), 15000);
        } catch {
            console.log("ℹ️ El modal ya estaba cerrado o no se encontró para esperar su cierre.");
        }

        console.log("✅ Paso 7: Botón 'Cancelar' presionado y modal cerrado correctamente.");
    } catch (error) {
        throw new Error(`❌ Error en Paso 7: (clic en botón 'Cancelar'): ${error.message}`);
    }
  }

    // =======================
  // CP_AUTO_009: reserva DHCP(opcion click boton cancelar)
  // =======================
async funcionReservaDHCP() {
    const driver = this.driver;

    // === Paso 1: Clic en botón "Opciones" ===
    try {
        const btnOpciones = await driver.wait(
            until.elementLocated(By.xpath('//*[@id="btn-options"]')),
            10000
        );

        await driver.wait(until.elementIsVisible(btnOpciones), 5000);
        await driver.wait(until.elementIsEnabled(btnOpciones), 5000);

        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnOpciones);
        await driver.sleep(500);
        await driver.executeScript("arguments[0].click();", btnOpciones);

        await driver.sleep(3000);
        console.log("✅ Paso 1: Botón 'Opciones' presionado correctamente.");
    } catch (error) {
        throw new Error(`❌ Error en Paso 1 (clic en botón 'Opciones'): ${error.message}`);
    }

    // === Paso 2: Clic en Opción "Reserva DHCP" ===
    try {
        const opcionReservaDHCP = await driver.wait(
            until.elementLocated(By.xpath('//*[@id="1206"]')),
            15000
        );

        await driver.wait(until.elementIsVisible(opcionReservaDHCP), 5000);
        await driver.wait(until.elementIsEnabled(opcionReservaDHCP), 5000);

        await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", opcionReservaDHCP);
        await driver.sleep(300);
        await driver.executeScript("arguments[0].click();", opcionReservaDHCP);

        // Espera opcional de loader
        try {
            const loaderXpath = '//*[@class="progress-bar"]';
            const loader = await driver.wait(until.elementLocated(By.xpath(loaderXpath)), 5000);
            await driver.wait(until.stalenessOf(loader), 15000);
            console.log("⏳ Loader detectado y completado.");
        } catch {
            console.log("ℹ️ No se detectó loader, continuando...");
        }

        console.log("✅ Paso 2: Opción 'Reserva DHCP' seleccionada correctamente.");
    } catch (error) {
        throw new Error(`❌ Error en Paso 2: (clic en opción 'Reserva DHCP'): ${error.message}`);
    }

    // === Paso 3: Diligenciar MAC aleatoria ===
    try {
        const randomMAC = Array.from({ length: 6 }, () =>
            Math.floor(Math.random() * 256).toString(16).padStart(2, "0")
        ).join(":");

        const macField = await driver.wait(
            until.elementLocated(By.xpath('//*[@id="textfield-textfield-1"]')),
            15000
        );

        await driver.wait(until.elementIsVisible(macField), 5000);
        await driver.wait(until.elementIsEnabled(macField), 5000);

        await macField.clear();
        await macField.sendKeys(randomMAC);

        console.log(`✅ Paso 3: Dirección MAC ingresada correctamente: ${randomMAC}`);
    } catch (error) {
        throw new Error(`❌ Error en Paso 3: (diligenciar dirección MAC): ${error.message}`);
    }

    // === Paso 4: Diligenciar IPv4 aleatoria ===
    try {
        const randomIPv4 = Array.from({ length: 4 }, () =>
            Math.floor(Math.random() * 254) + 1
        ).join(".");

        const ipField = await driver.wait(
            until.elementLocated(By.xpath('//*[@id="textfield-textfield-2"]')),
            15000
        );

        await driver.wait(until.elementIsVisible(ipField), 5000);
        await driver.wait(until.elementIsEnabled(ipField), 5000);

        await ipField.clear();
        await ipField.sendKeys(randomIPv4);

        console.log(`✅ Paso 4: Dirección IPv4 ingresada correctamente: ${randomIPv4}`);
    } catch (error) {
        throw new Error(`❌ Error en Paso 4: (diligenciar dirección IPv4): ${error.message}`);
    }

    // === Paso 5: Clic en botón "Refrescar" ===
    try {
        const refreshBtn = await driver.wait(
            until.elementLocated(
                By.xpath('//*[@id="widget-dialog-open-dialog-603378-undefined"]/div/div/div[2]/div/div/div/div[2]/div[1]/div/span')
            ),
            15000
        );

        await driver.wait(until.elementIsVisible(refreshBtn), 5000);
        await driver.wait(until.elementIsEnabled(refreshBtn), 5000);

        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", refreshBtn);
        await driver.sleep(300);
        await refreshBtn.click();

        try {
            const loaderXPath = '//*[@id="progress-id-progress-REFRESH"]';
            const loader = await driver.wait(until.elementLocated(By.xpath(loaderXPath)), 3000);
            await driver.wait(until.stalenessOf(loader), 15000);
        } catch {
            console.log("ℹ️ No se detectó loader de progreso, continuando...");
        }

        console.log("✅ Paso 5: Botón 'Refrescar' presionado correctamente.");
    } catch (error) {
        throw new Error(`❌ Error en Paso 5: (clic en botón Refrescar): ${error.message}`);
    }

    // === Paso 6: Clic en botón "Cancelar" ===
    try {
        const cancelBtn = await driver.wait(
            until.elementLocated(By.xpath('//*[@id="widget-button-cancel-open-dialog"]/div')),
            15000
        );

        await driver.wait(until.elementIsVisible(cancelBtn), 5000);
        await driver.wait(until.elementIsEnabled(cancelBtn), 5000);

        await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", cancelBtn);
        await driver.sleep(300);
        await cancelBtn.click();

        // Espera a que el modal desaparezca
        const modalXPath = '//*[@id="widget-dialog-open-dialog-603378-undefined"]';
        try {
            const modal = await driver.wait(until.elementLocated(By.xpath(modalXPath)), 5000);
            await driver.wait(until.stalenessOf(modal), 15000);
        } catch {
            console.log("ℹ️ No se encontró modal activo tras el clic, continuando...");
        }

        console.log("✅ Paso 6: Botón 'Cancelar' presionado y modal cerrado correctamente.");
    } catch (error) {
        throw new Error(`❌ Error en Paso 6: (clic en botón Cancelar): ${error.message}`);
    }
}

 // =======================
  // CP_AUTO_010: Dispositivos conectados
  // =======================

  // 📌 Función: Dispositivos Conectados
async funcionDispositivosConectados() {
    const driver = this.driver;

    // === Paso 1: Clic en botón "Opciones" ===
    try {
        const btnOpciones = await driver.wait(
            until.elementLocated(By.xpath('//*[@id="btn-options"]')),
            10000
        );

        await driver.wait(until.elementIsVisible(btnOpciones), 5000);
        await driver.wait(until.elementIsEnabled(btnOpciones), 5000);

        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnOpciones);
        await driver.sleep(500);
        await driver.executeScript("arguments[0].click();", btnOpciones);

        await driver.sleep(3000);
        console.log("✅ Paso 1: Botón 'Opciones' presionado correctamente.");
    } catch (error) {
        throw new Error(`❌ Error en Paso 1 (clic en botón 'Opciones'): ${error.message}`);
    }

    // === Paso 2: Opción "Dispositivos Conectados" ===
    try {
        const opcionDispositivos = await driver.wait(
            until.elementLocated(By.xpath('//*[@id="1208"]')),
            15000
        );

        await driver.wait(until.elementIsVisible(opcionDispositivos), 5000);
        await driver.wait(until.elementIsEnabled(opcionDispositivos), 5000);

        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", opcionDispositivos);
        await driver.sleep(300);
        await driver.executeScript("arguments[0].click();", opcionDispositivos);

        // Loader opcional
        const loaderXPath = '//*[@id="progress-id-progress-DEVICES"]';
        try {
            const loader = await driver.wait(until.elementLocated(By.xpath(loaderXPath)), 5000);
            await driver.wait(until.stalenessOf(loader), 15000);
        } catch {
            console.log("ℹ️ No se detectó loader visible, continuando...");
        }

        console.log("✅ Paso 2: Opción 'Dispositivos Conectados' seleccionada correctamente.");
    } catch (error) {
        throw new Error(`❌ Error en Paso 2: (clic en 'Dispositivos Conectados'): ${error.message}`);
    }

    // === Paso 3: Clic en flecha desplegable del primer dispositivo ===
    try {
        const flechaDispositivo = await driver.wait(
            until.elementLocated(By.xpath('//*[@id="widget-dialog-open-dialog-603378-undefined"]/div/div/div[2]/div/div/div[2]/div[1]/div[1]/div[2]')),
            15000
        );

        await driver.wait(until.elementIsVisible(flechaDispositivo), 5000);
        await driver.wait(until.elementIsEnabled(flechaDispositivo), 5000);

        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", flechaDispositivo);
        await driver.sleep(300);
        await flechaDispositivo.click();
        await driver.sleep(1500);

        console.log("✅ Paso 3: Flecha del primer dispositivo desplegada correctamente.");
    } catch (error) {
        throw new Error(`❌ Error en Paso 3 (clic en flecha primer dispositivo): ${error.message}`);
    }

    // === Paso 4: Clic en flecha desplegable del segundo dispositivo ===
    try {
        const flechaSegundoDispositivo = await driver.wait(
            until.elementLocated(By.xpath('//*[@id="widget-dialog-open-dialog-603378-undefined"]/div/div/div[2]/div/div/div[2]/div[2]/div[1]/div')),
            15000
        );

        await driver.wait(until.elementIsVisible(flechaSegundoDispositivo), 5000);
        await driver.wait(until.elementIsEnabled(flechaSegundoDispositivo), 5000);

        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", flechaSegundoDispositivo);
        await driver.sleep(300);
        await flechaSegundoDispositivo.click();
        await driver.sleep(1500);

        console.log("✅ Paso 4: Flecha del segundo dispositivo desplegada correctamente.");
    } catch (error) {
        throw new Error(`❌ Error en Paso 4 (clic en flecha segundo dispositivo): ${error.message}`);
    }

    // === Paso 5: Clic en botón "Recargar/Refrescar" ===
    try {
        const botonRecargar = await driver.wait(
            until.elementLocated(By.xpath('//*[@id="widget-dialog-open-dialog-603378-undefined"]/div/div/div[2]/div/div/div[1]/div/span')),
            15000
        );

        await driver.wait(until.elementIsVisible(botonRecargar), 5000);
        await driver.wait(until.elementIsEnabled(botonRecargar), 5000);

        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonRecargar);
        await driver.sleep(300);
        await botonRecargar.click();
        await driver.sleep(500);

        console.log("✅ Paso 5: Botón 'Recargar/Refrescar' clicado correctamente.");
    } catch (error) {
        throw new Error(`❌ Error en Paso 5 (clic en botón Recargar/Refrescar): ${error.message}`);
    }

    // === Paso 6: Cerrar modal "Dispositivos Conectados" ===
    try {
        // Esperar overlay si aparece
        const overlayXPath = '//*[@id="progress-progress_resultSelfDiagnosis"]';
        try {
            const overlay = await driver.wait(until.elementLocated(By.xpath(overlayXPath)), 5000);
            await driver.wait(until.elementIsNotVisible(overlay), 15000);
            console.log("ℹ️ Overlay oculto.");
        } catch {
            console.log("ℹ️ No se detectó overlay visible.");
        }

        // Header del modal
        const modalHeader = await driver.wait(
            until.elementLocated(By.xpath('//*[@id="widget-dialog-open-dialog-603378-undefined"]/div/div/div[1]')),
            15000
        );

        // Botón cerrar
        const btnCerrar = await modalHeader.findElement(By.css('button.close'));
        await driver.wait(until.elementIsVisible(btnCerrar), 5000);

        await driver.executeScript('arguments[0].click();', btnCerrar);
        console.log("ℹ️ Click forzado en botón Cerrar.");
        await driver.sleep(1000);

        // Validar que el modal se cierre
        const modalContainer = await driver.findElement(
            By.xpath('//*[@id="widget-dialog-open-dialog-603378-undefined"]')
        );
        await driver.wait(async () => {
            const display = await modalContainer.getCssValue('display');
            const hidden = await modalContainer.getAttribute('aria-hidden');
            return display === 'none' || hidden === 'true';
        }, 15000);

        console.log("✅ Paso 6: Modal 'Dispositivos Conectados' cerrado correctamente.");
    } catch (error) {
        throw new Error(`❌ Error en Paso 6 (cerrar modal Dispositivos Conectados): ${error.message}`);
    }
}




}



