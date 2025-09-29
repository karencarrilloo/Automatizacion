import { By, until } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class GestionActivosPage {
  constructor(driver) {
    this.driver = driver;
  }


  //  ====================================
  //  CP_GESTION_ACTIVOS_001 – Acceso al la vista Gestión de Activos
  //  pasos3
  //  ====================================


  async ingresarVistaGestionActivos(caseName = 'CP_GESTION_ACTIVOS_001') {
    const driver = this.driver;

    try {
      // === Paso 1: Clic en módulo eCenter ===
      const eCenterBtn = await driver.wait(
        until.elementLocated(By.xpath("//div[@id='118' and contains(@class, 'item-module')]")),
        10000
      );
      await driver.executeScript("arguments[0].click();", eCenterBtn);
      await driver.sleep(1000);

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

      // === Paso 3: Clic en "Gestión de Activos" ===
      const gestionActivosBtn = await driver.wait(
        until.elementLocated(
          By.css('div.application-item[title="Gestion de Activos"]')
        ),
        10000
      );
      await driver.executeScript("arguments[0].scrollIntoView({behavior:'smooth', block:'center'});", gestionActivosBtn);
      await driver.wait(until.elementIsVisible(gestionActivosBtn), 10000);
      await driver.wait(until.elementIsEnabled(gestionActivosBtn), 10000);
      await driver.sleep(1000);
      await driver.executeScript("arguments[0].click();", gestionActivosBtn);
      await driver.sleep(5000);


    } catch (error) {
      console.error(`❌ CP_GESTION_ACTIVOS_001 Error: ${error.message}`);
      throw error;
    }
    //  ====================================
    //  CP_GESTION_ACTIVOS_002 – Filtrar ont por estado en "FAILED"
    //  pasos7
    //  ====================================

  }
  async filtraOnt(caseName = 'CP_GESACT_002') {
    const driver = this.driver;

    try {
      // === Paso 4: Clic en botón "Seleccionar entidad" ===
      const entidadBtn = await driver.wait(
        until.elementLocated(
          By.xpath("//div[contains(text(), 'Seleccionar entidad') and contains(@class, 'btn-primary')]")
        ),
        20000
      );
      await driver.wait(until.elementIsVisible(entidadBtn), 10000);
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", entidadBtn);
      await driver.sleep(1000);
      await driver.executeScript("arguments[0].click();", entidadBtn);
      await driver.sleep(5000);
      console.log("✅ Paso 4: Botón 'Seleccionar entidad' presionado.");

      // === Paso 5: Seleccionar la fila que contiene el texto "elemento secundario" ===
      {
        const tabla = await driver.wait(
          until.elementLocated(By.css('div.modal-body table tbody')),
          10000
        );
        const filas = await tabla.findElements(By.css('tr'));
        let encontrado = false;

        for (const fila of filas) {
          const celdas = await fila.findElements(By.css('td'));
          for (const celda of celdas) {
            const texto = (await celda.getText()).trim().toLowerCase();
            if (texto.includes('elemento secundario')) {
              await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", celda);
              await driver.sleep(500);
              await driver.executeScript("arguments[0].click();", celda);
              encontrado = true;
              break;
            }
          }
          if (encontrado) break;
        }

        if (!encontrado) throw new Error("No se encontró ninguna opción que contenga 'elemento secundario'.");
        console.log("✅ Paso 5: Se seleccionó 'elemento secundario'.");
      }

      // === Paso 6: Clic en botón "Siguiente" ===
      {
        const botonSeleccionar = await driver.wait(
          until.elementLocated(By.css('#widget-button-btn-next-step .btn.btn-primary')),
          10000
        );
        await driver.wait(async () => (await botonSeleccionar.getAttribute('disabled')) === null, 10000);
        await botonSeleccionar.click();
        await driver.sleep(3000);
        console.log("✅ Paso 6: Botón 'Siguiente' presionado después de 'elemento secundario'.");
      }

      // === Paso 7: Seleccionar "ont" ===
      {
        const tabla = await driver.wait(
          until.elementLocated(By.css('div.modal-body table tbody')),
          10000
        );
        const filas = await tabla.findElements(By.css('tr'));
        let encontrado = false;

        for (const fila of filas) {
          const celdas = await fila.findElements(By.css('td'));
          for (const celda of celdas) {
            const texto = (await celda.getText()).trim().toLowerCase();
            if (texto.includes('ont')) {
              await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", celda);
              await driver.sleep(500);
              await driver.executeScript("arguments[0].click();", celda);
              encontrado = true;
              break;
            }
          }
          if (encontrado) break;
        }

        if (!encontrado) throw new Error("No se encontró ninguna opción que contenga 'ont'.");
        console.log("✅ Paso 7: Se seleccionó 'ont'.");
      }

      // === Paso 8: Clic en botón "Siguiente" ===
      {
        const botonSeleccionar = await driver.wait(
          until.elementLocated(By.css('#widget-button-btn-next-step .btn.btn-primary')),
          10000
        );
        await driver.wait(async () => (await botonSeleccionar.getAttribute('disabled')) === null, 10000);
        await botonSeleccionar.click();
        await driver.sleep(3000);
        console.log("✅ Paso 8: Botón 'Siguiente' presionado después de 'ont'.");
      }

      // === Paso 9: Seleccionar fila con ID 9 "FAILED" ===
      {
        const cuerpoTabla = await driver.wait(
          until.elementLocated(
            By.xpath('//*[@id="grid-table-crud-grid-crud-select-device"]/div/div[2]/table/tbody')
          ),
          10000
        );
        const filaFailed = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="row-9"]')),
          5000
        );
        await driver.wait(until.elementIsVisible(filaFailed), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", filaFailed);
        await driver.sleep(300);
        await filaFailed.click();
        await driver.sleep(1000);
        console.log("✅ Paso 9: Fila con ID 9 (FAILED) seleccionada correctamente.");
      }

      // === Paso 10: Clic en botón "FINALIZAR" ===
      {
        const contenedorFooter = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-dialog-wizard-dialog"]/div/div/div[3]')),
          10000
        );
        const botonFinalizar = await contenedorFooter.findElement(
          By.xpath('//*[@id="widget-button-btn-next-step"]/div')
        );
        await driver.wait(until.elementIsVisible(botonFinalizar), 5000);
        await driver.wait(until.elementIsEnabled(botonFinalizar), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", botonFinalizar);
        await driver.sleep(300);
        await botonFinalizar.click();
        console.log("✅ Paso 10: clic en 'FINALIZAR' realizado.");

        // Espera dinámica por barra de progreso
        try {
          const progressBar = await driver.wait(
            until.elementLocated(By.css('.progress-bar')),
            8000
          );
          await driver.wait(until.stalenessOf(progressBar), 15000);
          console.log("✅ Espera dinámica: Progress finalizó correctamente.");
        } catch {
          console.log("⚠️ No se detectó barra de progreso o ya había desaparecido.");
        }
      }


    } catch (error) {
      console.error(`❌ Error en ${caseName}:`, error);
      throw error;
    }
  }

  //  ====================================
  //  CP_GESTION_ACTIVOS_003:
  //  Actualizar estado de la ONT de FAILED a LOST
  //  ====================================

  async ActualizarOnt(caseName = 'CP_GESTION_ACTIVOS_003') {
    const driver = this.driver;

    try {
      // === Paso 11: Seleccionar el primer registro de la tabla ===
      const cuerpoTabla = await driver.wait(
        until.elementLocated(
          By.xpath('//*[@id="grid-table-grid-reports"]/div/div[2]/table/tbody')
        ),
        10000
      );

      const filas = await cuerpoTabla.findElements(By.xpath('./tr'));
      if (filas.length === 0) throw new Error("No se encontraron filas en la tabla de ONTs.");

      const primeraFila = filas[0];
      await driver.wait(until.elementIsVisible(primeraFila), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", primeraFila);
      await driver.sleep(300);

      const celdas = await primeraFila.findElements(By.css('td'));
      const factorySerialSeleccionado = await celdas[2].getText(); // Ajustar índice si es necesario
      console.log(`📌 FACTORYSERIAL capturado: ${factorySerialSeleccionado}`);
      this.factorySerialSeleccionado = factorySerialSeleccionado;

      await primeraFila.click();
      await driver.sleep(1000);
      console.log("✅ Paso 11: Primer registro dinámico seleccionado y FACTORYSERIAL capturado.");

      // === Paso 12: Clic en el botón "Actualizar estado operativo" ===
      const botonActualizar = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-button-button1"]/div')),
        10000
      );
      await driver.wait(until.elementIsVisible(botonActualizar), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", botonActualizar);
      await driver.sleep(300);
      await botonActualizar.click();
      await driver.sleep(2000);
      console.log("✅ Paso 12: Botón 'Actualizar estado operativo' presionado correctamente.");

      // === Paso 13: Clic en select de estado operativo ===
      const selectEstado = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="input-select-select-Operational"]')),
        10000
      );
      await driver.wait(until.elementIsVisible(selectEstado), 5000);
      await driver.wait(until.elementIsEnabled(selectEstado), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", selectEstado);
      await driver.sleep(300);
      await selectEstado.click();
      await driver.sleep(2000);
      console.log("✅ Paso 13: Select de estado operativo desplegado correctamente.");

      // === Paso 14: Seleccionar la opción "LOST" ===
      const opcionLost = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="input-select-select-Operational"]/option[3]')),
        10000
      );
      await driver.wait(until.elementIsVisible(opcionLost), 5000);
      await opcionLost.click();
      await driver.sleep(1000);
      console.log("✅ Paso 14: Opción 'LOST' seleccionada correctamente.");

      // === Paso 15: Diligenciar comentario ===
      const textareaComentario = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-textareafield-inputComment"]/textarea')),
        10000
      );
      await driver.wait(until.elementIsVisible(textareaComentario), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", textareaComentario);
      await textareaComentario.clear();
      await textareaComentario.sendKeys("test automatización");
      await driver.sleep(2000);
      console.log("✅ Paso 15: Comentario ingresado correctamente.");

      // === Paso 16: Clic en botón "Guardar" y esperar cierre de modal ===
      const btnGuardar = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-button-btnUpdateOperational"]/div')),
        10000
      );
      await driver.wait(until.elementIsVisible(btnGuardar), 5000);
      await driver.wait(until.elementIsEnabled(btnGuardar), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", btnGuardar);
      await btnGuardar.click();

      const modal = await driver.wait(
        until.elementLocated(
          By.xpath('//*[@id="widget-dialog-dialog-update-Operational"]/div/div')
        ),
        10000
      );
      await driver.wait(until.elementIsNotVisible(modal), 18000);
      console.log("✅ Paso 16: Botón 'Guardar' presionado y modal cerrado correctamente.");

    } catch (error) {
      console.error(`❌ Error en ${caseName}:`, error);
      throw error;
    }
  }

  /**
   * Caso de prueba CP_GESACT_004
   * Filtrar la ONT previamente actualizada a estado LOST
   */
  async filtrarOntLost(factorySerial) {
    const driver = this.driver;

    // === Paso 17: Clic en botón "Seleccionar entidad" ===
    const btnSeleccionarEntidad = await driver.wait(
      until.elementLocated(By.xpath('//*[@id="widget-button-button4"]/div')),
      15000
    );
    await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", btnSeleccionarEntidad);
    await driver.sleep(500);

    // Esperar que desaparezca progress si existe
    try {
      const progress = await driver.findElement(
        By.xpath('//*[contains(@class,"container-loading-iptotal") and contains(@style,"display: block")]')
      );
      const isVisible = await progress.isDisplayed().catch(() => false);
      if (isVisible) await driver.wait(until.stalenessOf(progress), 20000);
    } catch {/* sin progress */}

    await driver.wait(until.elementIsVisible(btnSeleccionarEntidad), 10000);
    await driver.wait(until.elementIsEnabled(btnSeleccionarEntidad), 5000);
    await btnSeleccionarEntidad.click();
    await driver.sleep(1000);
    console.log('✅ Paso 17: Botón "Seleccionar entidad" presionado.');

    // === Paso 18: Seleccionar la fila "elemento secundario" ===
    const tablaEntidad = await driver.wait(
      until.elementLocated(By.css('div.modal-body table tbody')), 10000);
    const filasEntidad = await tablaEntidad.findElements(By.css('tr'));
    let encontrado = false;

    for (const fila of filasEntidad) {
      const celdas = await fila.findElements(By.css('td'));
      for (const celda of celdas) {
        const texto = (await celda.getText()).trim().toLowerCase();
        if (texto.includes('elemento secundario')) {
          await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", celda);
          await driver.sleep(500);
          await driver.executeScript("arguments[0].click();", celda);
          encontrado = true;
          break;
        }
      }
      if (encontrado) break;
    }
    if (!encontrado) throw new Error("❌ Paso 18: No se encontró 'elemento secundario'");
    console.log('✅ Paso 18: "elemento secundario" seleccionado.');

    // === Paso 19: Botón "Siguiente" ===
    const btnNext1 = await driver.wait(
      until.elementLocated(By.css('#widget-button-btn-next-step .btn.btn-primary')),
      10000
    );
    await driver.wait(async () => (await btnNext1.getAttribute('disabled')) === null, 10000);
    await btnNext1.click();
    await driver.sleep(3000);
    console.log('✅ Paso 19: Botón "Siguiente" presionado.');

    // === Paso 20: Seleccionar "ont" ===
    const tablaOnt = await driver.wait(
      until.elementLocated(By.css('div.modal-body table tbody')), 10000);
    const filasOnt = await tablaOnt.findElements(By.css('tr'));
    encontrado = false;

    for (const fila of filasOnt) {
      const celdas = await fila.findElements(By.css('td'));
      for (const celda of celdas) {
        const texto = (await celda.getText()).trim().toLowerCase();
        if (texto.includes('ont')) {
          await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", celda);
          await driver.sleep(500);
          await driver.executeScript("arguments[0].click();", celda);
          encontrado = true;
          break;
        }
      }
      if (encontrado) break;
    }
    if (!encontrado) throw new Error("❌ Paso 20: No se encontró 'ont'");
    console.log('✅ Paso 20: "ont" seleccionado.');

    // === Paso 21: Botón "Siguiente" ===
    const btnNext2 = await driver.wait(
      until.elementLocated(By.css('#widget-button-btn-next-step .btn.btn-primary')),
      10000
    );
    await driver.wait(async () => (await btnNext2.getAttribute('disabled')) === null, 10000);
    await btnNext2.click();
    await driver.sleep(3000);
    console.log('✅ Paso 21: Botón "Siguiente" presionado.');

    // === Paso 22: Seleccionar fila ID 10 LOST ===
    await driver.wait(
      until.elementLocated(By.xpath('//*[@id="grid-table-crud-grid-crud-select-device"]/div/div[2]/table/tbody')),
      10000
    );
    const filaLost = await driver.wait(
      until.elementLocated(By.xpath('//*[@id="row-10"]')),
      5000
    );
    await driver.wait(until.elementIsVisible(filaLost), 5000);
    await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", filaLost);
    await driver.sleep(300);
    await filaLost.click();
    await driver.sleep(1000);
    console.log('✅ Paso 22: Fila LOST seleccionada.');

    // === Paso 23: Clic en FINALIZAR ===
    const footer = await driver.wait(
      until.elementLocated(By.xpath('//*[@id="widget-dialog-wizard-dialog"]/div/div/div[3]')),
      10000
    );
    const btnFinalizar = await footer.findElement(By.xpath('//*[@id="widget-button-btn-next-step"]/div'));
    await driver.wait(until.elementIsVisible(btnFinalizar), 5000);
    await driver.wait(until.elementIsEnabled(btnFinalizar), 5000);
    await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", btnFinalizar);
    await driver.sleep(300);
    await btnFinalizar.click();
    console.log('✅ Paso 23: Clic en FINALIZAR.');

    try {
      const progressBar = await driver.wait(until.elementLocated(By.css('.progress-bar')), 8000);
      await driver.wait(until.stalenessOf(progressBar), 15000);
    } catch { console.warn('⚠️ Sin barra de progreso visible.'); }

    // === Paso 24: Mostrar filtro ===
    await driver.wait(async () => {
      const loading = await driver.findElements(By.id('progress-id-progress-ONT'));
      if (loading.length === 0) return true;
      const visible = await loading[0].isDisplayed().catch(() => false);
      return !visible;
    }, 15000);
    const btnMostrarFiltro = await driver.wait(
      until.elementLocated(By.xpath('//*[@id="widget-button-btn-show-filter"]/div')),
      10000
    );
    await driver.wait(until.elementIsVisible(btnMostrarFiltro), 5000);
    await driver.wait(until.elementIsEnabled(btnMostrarFiltro), 5000);
    await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", btnMostrarFiltro);
    await driver.sleep(300);
    await btnMostrarFiltro.click();
    await driver.sleep(1000);
    console.log('✅ Paso 24: Botón "Mostrar filtro" presionado.');

    // === Paso 25: Seleccionar FACTORYSERIAL ===
    const selectCampo = await driver.wait(
      until.elementLocated(By.xpath('//*[@id="container-builder-filter_rule_0"]/div[3]/select')),
      10000
    );
    await driver.wait(until.elementIsVisible(selectCampo), 5000);
    await driver.wait(until.elementIsEnabled(selectCampo), 5000);
    await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", selectCampo);
    await selectCampo.click();
    await driver.sleep(300);
    await selectCampo.sendKeys("FACTORYSERIAL");
    await driver.sleep(2000);
    console.log('✅ Paso 25: "FACTORYSERIAL" seleccionado en el filtro.');

    // === Paso 26: Diligenciar el serial capturado ===
    const contenedorFiltro = await driver.wait(
      until.elementLocated(By.xpath('//*[@id="container-builder-filter_rule_0"]')),
      10000
    );
    const campoTexto = await contenedorFiltro.findElement(By.xpath('./div[5]/textarea'));
    await driver.wait(until.elementIsVisible(campoTexto), 5000);
    await driver.wait(until.elementIsEnabled(campoTexto), 5000);
    await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", campoTexto);
    await campoTexto.clear();
    await campoTexto.sendKeys(factorySerial);
    await driver.sleep(3000);
    console.log(`✅ Paso 26: Serial "${factorySerial}" diligenciado.`);

    // === Paso 27: Aplicar filtro ===
    const btnAplicarFiltro = await driver.wait(
      until.elementLocated(By.xpath('//*[@id="widget-button-btn-set-filter"]/div')),
      10000
    );
    await driver.wait(until.elementIsVisible(btnAplicarFiltro), 5000);
    await driver.wait(until.elementIsEnabled(btnAplicarFiltro), 5000);
    await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", btnAplicarFiltro);
    await driver.sleep(500);
    await btnAplicarFiltro.click();

    try {
      const progress = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="progress-id-filter"]')),
        5000
      );
      const visible = await progress.isDisplayed().catch(() => false);
      if (visible) await driver.wait(until.stalenessOf(progress), 20000);
    } catch { /* no progress */ }

    await driver.sleep(3000);
    console.log('✅ Paso 27: Botón "Aplicar filtro" presionado.');
  }
}


