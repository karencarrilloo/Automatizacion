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

  // =======================
// CP_GESACT_003: Actualiza ONT a LOST y valida filtrado por FACTORYSERIAL
// =======================
async ActualizarOntyFiltro(caseName = 'CP_GESACT_003') {
  const driver = this.driver;
  let factorySerialSeleccionado;

  // === Paso 11:  Seleccionar el primer registro de la tabla. ===
      try {
        // Esperar el <tbody> de la tabla
        const cuerpoTabla = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="grid-table-grid-reports"]/div/div[2]/table/tbody')),
          10000
        );

        // Obtener todas las filas visibles dentro del tbody
        const filas = await cuerpoTabla.findElements(By.xpath('./tr'));

        if (filas.length === 0) {
          throw new Error("No se encontraron filas en la tabla de ONTs.");
        }

        // Tomar la primera fila
        const primeraFila = filas[0];

        // Esperar visibilidad
        await driver.wait(until.elementIsVisible(primeraFila), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", primeraFila);
        await driver.sleep(300);

        // Capturar el texto de la celda FACTORYSERIAL (3ra columna, índice 2 si inicia en 0)
        const celdas = await primeraFila.findElements(By.css('td'));
        const factorySerialSeleccionado = await celdas[2].getText(); // Ajusta el índice si FACTORYSERIAL no está en la 3ra columna

        console.log(`📌 FACTORYSERIAL capturado: ${factorySerialSeleccionado}`);

        // Guardar en una variable global/contextual si la necesitas en otros pasos
        this.factorySerialSeleccionado = factorySerialSeleccionado;

        // Clic en la fila
        await primeraFila.click();
        await driver.sleep(1000);

        console.log("✅ Paso 11: Primer registro dinámico seleccionado y FACTORYSERIAL capturado.");
      } catch (error) {
        throw new Error(`❌ Error en Paso 11: (selección dinámica de primer registro): ${error.message}`);
      }

      // === Paso 12: Clic en el botón "Actualizar estado operativo" ===
      try {
        // Esperar que el botón esté presente
        const botonActualizar = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-button-button1"]/div')),
          10000
        );

        // Asegurar que sea visible e interactuable
        await driver.wait(until.elementIsVisible(botonActualizar), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonActualizar);
        await driver.sleep(300); // breve espera

        // Hacer clic en el botón
        await botonActualizar.click();
        await driver.sleep(2000);


        console.log("✅ Paso 12: Botón 'Actualizar estado operativo' presionado correctamente.");

      } catch (error) {
        throw new Error(`❌ Error en Paso 12: (clic en botón 'Actualizar estado operativo'): ${error.message}`);
      }

      // === Paso 13: Clic en estado para mostrar la lista opciones. ===
      try {
        // Esperar que el select esté presente dentro del modal
        const selectEstado = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="input-select-select-Operational"]')),
          10000
        );

        // Verificar que sea visible e interactuable
        await driver.wait(until.elementIsVisible(selectEstado), 5000);
        await driver.wait(until.elementIsEnabled(selectEstado), 5000);

        // Scroll y clic para desplegar las opciones
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", selectEstado);
        await driver.sleep(300);
        await selectEstado.click();
        await driver.sleep(2000);

        console.log("✅ Paso 13: Select de estado operativo desplegado correctamente.");

      } catch (error) {
        throw new Error(`❌ Error en Paso 13: (clic en select de estado operativo): ${error.message}`);
      }


      // ===  Paso 14: Seleccionar la opción "LOST" en el estado ===
      try {
        // Esperar que el <option> esté presente
        const opcionLost = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="input-select-select-Operational"]/option[3]')),
          10000
        );

        // Asegurar visibilidad
        await driver.wait(until.elementIsVisible(opcionLost), 5000);

        // Hacer clic sobre la opción
        await opcionLost.click();

        // Esperar un momento para que el valor se refleje
        await driver.sleep(1000);

        console.log("✅ Paso 14: Opción 'LOST' seleccionada correctamente.");

      } catch (error) {
        throw new Error(`❌ Error en Paso 14: (selección de opción 'LOST'): ${error.message}`);
      }


      // === Paso 15: Diligenciar el campo de comentario con "test automatización" ===
      try {
        // Esperar que el <textarea> esté presente y visible
        const textareaComentario = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-textareafield-inputComment"]/textarea')),
          10000
        );
        await driver.wait(until.elementIsVisible(textareaComentario), 5000);

        // Hacer scroll y escribir el comentario
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", textareaComentario);
        await textareaComentario.clear();
        await textareaComentario.sendKeys("test automatización");
        await driver.sleep(2000);

        console.log("✅ Paso 15: Comentario ingresado correctamente.");
      } catch (error) {
        throw new Error(`❌ Error en Paso 15: (ingreso de comentario): ${error.message}`);
      }


      // === Paso 16: Clic en botón "Guardar" para actualizar estado ont ===
      try {
        // Esperar a que el botón esté presente y visible
        const btnGuardar = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-button-btnUpdateOperational"]/div')),
          10000
        );
        await driver.wait(until.elementIsVisible(btnGuardar), 5000);
        await driver.wait(until.elementIsEnabled(btnGuardar), 5000);

        // Scroll y clic
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnGuardar);
        await btnGuardar.click();

        // Esperar que el modal se oculte (en lugar de eliminarse del DOM)
        const modal = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-dialog-dialog-update-Operational"]/div/div')),
          10000
        );
        await driver.wait(until.elementIsNotVisible(modal), 18000); // Esperar hasta que no sea visible

        console.log("✅ Paso 16:: Botón 'Guardar' presionado y modal cerrado correctamente.");
      } catch (error) {
        throw new Error(`❌ Paso 16: (clic en botón 'Guardar'): ${error.message}`);
      }
  
      // === Paso 17: Clic en botón "Seleccionar entidad" ===
      try {
        // Esperar dinámicamente a que el botón aparezca en el DOM (máx 15 seg)
        const btnSeleccionarEntidad = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-button-button4"]/div')),
          15000
        );

        // Scroll antes de validar visibilidad
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnSeleccionarEntidad);
        await driver.sleep(500);

        // Esperar a que cualquier progress desaparezca (si existe)
        try {
          const progress = await driver.findElement(By.xpath('//*[contains(@class,"container-loading-iptotal") and contains(@style,"display: block")]'));
          const isVisible = await progress.isDisplayed().catch(() => false);
          if (isVisible) {
            await driver.wait(until.stalenessOf(progress), 20000); // esperar a que desaparezca
          }
        } catch (e) {
          console.warn("⚠️ No se detectó progress, se continúa.");
        }

        // Esperar visibilidad y habilitación
        await driver.wait(until.elementIsVisible(btnSeleccionarEntidad), 10000);
        await driver.wait(until.elementIsEnabled(btnSeleccionarEntidad), 5000);

        // Clic en el botón
        await btnSeleccionarEntidad.click();
        await driver.sleep(1000);

        console.log("✅ Paso 17: Botón 'Seleccionar entidad' presionado correctamente.");
      } catch (error) {
        throw new Error(`❌ Paso 17:  (clic en 'Seleccionar entidad'): ${error.message}`);
      }

      // Paso 18: Seleccionar la fila que contiene el texto "elemento secundario".
      try {
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

        if (!encontrado) {
          throw new Error("No se encontró ninguna opción que contenga 'elemento secundario'.");
        }

        console.log("✅ Paso 18: Se seleccionó 'elemento secundario'.");
      } catch (error) {
        throw new Error(`❌ Error en Paso 18:  (selección de 'elemento secundario'): ${error.message}`);
      }

      // Paso 19: Clic en botón "Siguiente"
      try {
        const botonSeleccionar = await driver.wait(
          until.elementLocated(By.css('#widget-button-btn-next-step .btn.btn-primary')),
          10000
        );
        await driver.wait(async () => {
          const disabled = await botonSeleccionar.getAttribute('disabled');
          return disabled === null;
        }, 10000);
        await botonSeleccionar.click();
        await driver.sleep(3000);
        console.log("✅ Paso 19: Botón 'Siguiente' presionado después de 'elemento secundario'.");
      } catch (error) {
        throw new Error(`❌ Error en Paso 19: (clic en 'Siguiente' después de 'elemento secundario'): ${error.message}`);
      }

      // Paso 20: Seleccionar "ont"
      try {
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

        if (!encontrado) {
          throw new Error("No se encontró ninguna opción que contenga 'ont'.");
        }

        console.log("✅ Paso 20: Se seleccionó 'ont'.");
      } catch (error) {
        throw new Error(`❌ Error en Paso 20: (selección de 'ont'): ${error.message}`);
      }

      // Paso 21: Clic en botón "Siguiente"
      try {
        const botonSeleccionar = await driver.wait(
          until.elementLocated(By.css('#widget-button-btn-next-step .btn.btn-primary')),
          10000
        );
        await driver.wait(async () => {
          const disabled = await botonSeleccionar.getAttribute('disabled');
          return disabled === null;
        }, 10000);
        await botonSeleccionar.click();
        await driver.sleep(3000);
        console.log("✅ Paso 21: Botón 'Siguiente' presionado después de 'ont'.");
      } catch (error) {
        throw new Error(`❌ Paso 21: (clic en 'Siguiente' después de 'ont'): ${error.message}`);
      }

      // === Paso 22: Seleccionar fila con ID 10 "LOST"  ===
      try {
        // Esperar que el tbody del grid esté disponible
        const cuerpoTabla = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="grid-table-crud-grid-crud-select-device"]/div/div[2]/table/tbody')),
          10000
        );

        // Esperar específicamente la fila con ID 10
        const filaLost = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="row-10"]')),
          5000
        );

        // Asegurar visibilidad y hacer scroll
        await driver.wait(until.elementIsVisible(filaLost), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", filaLost);
        await driver.sleep(300);

        // Hacer clic sobre la fila
        await filaLost.click();
        await driver.sleep(1000);

        console.log("✅ Paso 22: Fila con ID 10 (LOST) seleccionada correctamente.");

      } catch (error) {
        throw new Error(`❌ Error Paso 22: (selección de fila 'LOST'): ${error.message}`);
      }

      // === Paso 23: Hacer clic en el botón "FINALIZAR" ===
      try {
        // Esperar contenedor del footer del wizard
        const contenedorFooter = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-dialog-wizard-dialog"]/div/div/div[3]')),
          10000
        );

        // Buscar botón "FINALIZAR"
        const botonFinalizar = await contenedorFooter.findElement(
          By.xpath('//*[@id="widget-button-btn-next-step"]/div')
        );

        // Esperar a que el botón sea visible e interactuable
        await driver.wait(until.elementIsVisible(botonFinalizar), 5000);
        await driver.wait(until.elementIsEnabled(botonFinalizar), 5000);

        // Scroll al botón y clic
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonFinalizar);
        await driver.sleep(300);
        await botonFinalizar.click();

        console.log("✅ Paso 23: : clic en 'FINALIZAR' realizado.");

        // === Espera dinámica tras clic en "FINALIZAR" ===
        // Asumimos que aparece un progress bar o spinner que luego desaparece
        try {
          // Esperar hasta que el progress sea visible
          const progressBar = await driver.wait(
            until.elementLocated(By.css('.progress-bar')), // <- Ajustar clase si es otra
            8000
          );

          // Esperar hasta que desaparezca (máx. 15s)
          await driver.wait(
            until.stalenessOf(progressBar),
            15000
          );

          console.log("✅ Espera dinámica: Progress finalizó correctamente.");
        } catch (waitError) {
          console.warn("⚠️ Advertencia: No se detectó barra de progreso o ya había desaparecido.");
        }

      } catch (error) {
        throw new Error(`❌ Error en Paso 23:  (clic en botón 'FINALIZAR'): ${error.message}`);
      }


      // === Paso 24: Clic en el botón "Mostrar filtro" ===
      try {
        // Esperar que desaparezca el progreso (evita bloqueo visual)
        await driver.wait(async () => {
          const loadingDiv = await driver.findElements(By.id("progress-id-progress-ONT"));
          if (loadingDiv.length === 0) return true;

          const isDisplayed = await loadingDiv[0].isDisplayed().catch(() => false);
          return !isDisplayed;
        }, 15000, "El progreso (progress-id-progress-ONT) no desapareció a tiempo.");

        // Localizar el botón
        const botonMostrarFiltro = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-button-btn-show-filter"]/div')),
          10000
        );
        await driver.wait(until.elementIsVisible(botonMostrarFiltro), 5000);
        await driver.wait(until.elementIsEnabled(botonMostrarFiltro), 5000);

        // Hacer scroll y clic
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonMostrarFiltro);
        await driver.sleep(300);
        await botonMostrarFiltro.click();
        await driver.sleep(1000);

        console.log("✅ Paso 24: Se hizo clic en el botón 'Mostrar filtro' correctamente.");
      } catch (error) {
        throw new Error(`❌ Error en Paso 24: (clic en 'Mostrar filtro'): ${error.message}`);
      }

      // === Paso 25: Clic en el estado para mostrar la lista de opciones. ===
      try {
        // Esperar el contenedor general que incluye el select
        const contenedorFiltro = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="container-builder-filter_group_0"]/div[2]')),
          10000
        );

        // Esperar y localizar el select dentro del contenedor
        const selectCampo = await contenedorFiltro.findElement(By.xpath('//*[@id="container-builder-filter_rule_0"]/div[3]/select'));

        // Esperar a que el <select> sea visible y habilitado
        await driver.wait(until.elementIsVisible(selectCampo), 5000);
        await driver.wait(until.elementIsEnabled(selectCampo), 5000);

        // Scroll hacia el elemento y clic
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", selectCampo);
        await driver.sleep(300);
        await selectCampo.click();
        await driver.sleep(1000);

        console.log("✅ Paso 24: Botón <select> presionado.");
      } catch (error) {
        throw new Error(`❌ Error en Paso 24: (clic en <select>): ${error.message}`);
      }

      // === Paso 25: Seleccionar opción "FACTORYSERIAL" en la lista de opciones ===
      try {
        // Esperar el <select> directamente
        const selectCampo = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="container-builder-filter_rule_0"]/div[3]/select')),
          10000
        );

        // Asegurar que sea visible e interactuable
        await driver.wait(until.elementIsVisible(selectCampo), 5000);
        await driver.wait(until.elementIsEnabled(selectCampo), 5000);

        // Scroll hacia el select y clic para desplegar
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", selectCampo);
        await selectCampo.click();
        await driver.sleep(300); // Espera por despliegue de opciones

        // Selección usando el texto visible
        await selectCampo.sendKeys("FACTORYSERIAL");
        await driver.sleep(2000); // Esperar el render

        console.log("✅ Paso 25: Opción 'FACTORYSERIAL' seleccionada correctamente.");
      } catch (error) {
        throw new Error(`❌ error en Paso 25: (selección de opción 'FACTORYSERIAL'): ${error.message}`);
      }

      // === Paso 26: Diligenciar campo de texto con serial ONT capturado previamente ===
      try {
        // Validar que la variable del paso anterior exista
        const serialCapturado = this.factorySerialSeleccionado;
        if (!serialCapturado) {
          throw new Error("No se encontró un serial ONT capturado previamente (FACTORYSERIAL).");
        }

        // Esperar contenedor del filtro
        const contenedorFiltro = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="container-builder-filter_rule_0"]')),
          10000
        );

        // Localizar el textarea dentro del contenedor
        const campoTexto = await contenedorFiltro.findElement(By.xpath('./div[5]/textarea'));

        // Asegurar que esté visible y habilitado
        await driver.wait(until.elementIsVisible(campoTexto), 5000);
        await driver.wait(until.elementIsEnabled(campoTexto), 5000);

        // Hacer scroll al campo y escribir el serial capturado
        await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", campoTexto);
        await campoTexto.clear();
        await campoTexto.sendKeys(serialCapturado);
        await driver.sleep(3000);

        console.log(`✅ Paso 26: Se digitó el serial capturado "${serialCapturado}" correctamente.`);
      } catch (error) {
        throw new Error(`❌ Error Paso 26: (diligenciar serial ONT capturado): ${error.message}`);
      }

      // === Paso 27 Clic en botón "Aplicar filtro" ===
      try {
        const botonAplicarFiltro = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-button-btn-set-filter"]/div')),
          10000
        );

        await driver.wait(until.elementIsVisible(botonAplicarFiltro), 5000);
        await driver.wait(until.elementIsEnabled(botonAplicarFiltro), 5000);

        await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", botonAplicarFiltro);
        await driver.sleep(5000);
        await botonAplicarFiltro.click();

        // === Espera dinámica robusta del progress ===
        try {
          const progress = await driver.wait(
            until.elementLocated(By.xpath('//*[@id="progress-id-filter"]')),
            5000
          );

          // Verifica si es visible antes de esperar su desaparición
          const visible = await progress.isDisplayed().catch(() => false);
          if (visible) {
            await driver.wait(until.stalenessOf(progress), 20000); // espera hasta que desaparezca
          } else {
            console.warn("⚠️ Progress localizado pero no visible.");
          }

        } catch (progressError) {
          console.warn("⚠️ No se detectó el progress, se continúa.");
        }

        // Pequeña espera extra por seguridad antes de continuar
        await driver.sleep(4000);

        console.log("✅ Paso 27 Botón 'Aplicar filtro' presionado y espera dinámica completada.");

    } catch (error) {
      throw new Error(`❌ Error en CP_GESACT_004: ${error.message}`);
    }
  }
}