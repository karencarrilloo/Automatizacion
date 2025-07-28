import { By, until } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import loginTest from './login.page.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class GestionActivosPage {
  constructor(driver) {
    this.driver = driver;
  }

  async ejecutarGestionActivos() {
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


      // === Paso 3: Clic en "Gestion de Activos" ===
      const gestionActivosBtn = await driver.wait(
        until.elementLocated(By.css('div.application-item[title="Gestion de Activos"]')),
        10000
      );
      await driver.executeScript("arguments[0].scrollIntoView({behavior:'smooth', block:'center'});", gestionActivosBtn);
      await driver.wait(until.elementIsVisible(gestionActivosBtn), 10000);
      await driver.wait(until.elementIsEnabled(gestionActivosBtn), 10000);
      await driver.sleep(1000);
      await driver.executeScript("arguments[0].click();", gestionActivosBtn);
      await driver.sleep(5000);

      // Paso 4: Clic en botón "Seleccionar entidad"
      try {
        const entidadBtn = await driver.wait(
          until.elementLocated(By.xpath("//div[contains(text(), 'Seleccionar entidad') and contains(@class, 'btn-primary')]")),
          20000
        );
        await driver.wait(until.elementIsVisible(entidadBtn), 10000);
        await driver.executeScript("arguments[0].scrollIntoView({behavior:'smooth', block:'center'});", entidadBtn);
        await driver.sleep(1000);
        await driver.executeScript("arguments[0].click();", entidadBtn);
        await driver.sleep(5000);
        console.log("✅ Paso 4: Botón 'Seleccionar entidad' presionado.");
      } catch (error) {
        throw new Error(`❌ Error en Paso 4 (clic en 'Seleccionar entidad'): ${error.message}`);
      }

      // Paso 5: Seleccionar "elemento secundario"
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

        console.log("✅ Paso 5: Se seleccionó 'elemento secundario'.");
      } catch (error) {
        throw new Error(`❌ Error en Paso 5 (selección de 'elemento secundario'): ${error.message}`);
      }

      // Paso 6: Clic en botón "Siguiente"
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
        console.log("✅ Paso 6: Botón 'Siguiente' presionado después de 'elemento secundario'.");
      } catch (error) {
        throw new Error(`❌ Error en Paso 6 (clic en 'Siguiente' después de 'elemento secundario'): ${error.message}`);
      }

      // Paso 7: Seleccionar "ont"
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

        console.log("✅ Paso 7: Se seleccionó 'ont'.");
      } catch (error) {
        throw new Error(`❌ Error en Paso 7 (selección de 'ont'): ${error.message}`);
      }

      // Paso 8: Clic en botón "Siguiente"
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
        console.log("✅ Paso 8: Botón 'Siguiente' presionado después de 'ont'.");
      } catch (error) {
        throw new Error(`❌ Error en Paso 8 (clic en 'Siguiente' después de 'ont'): ${error.message}`);
      }


      // === Paso 9: Seleccionar fila con ID 9 (FAILED) ===
      try {
        // Esperar que el tbody del grid esté disponible
        const cuerpoTabla = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="grid-table-crud-grid-crud-select-device"]/div/div[2]/table/tbody')),
          10000
        );

        // Esperar específicamente la fila con ID 9
        const filaFailed = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="row-9"]')),
          5000
        );

        // Asegurar visibilidad y hacer scroll
        await driver.wait(until.elementIsVisible(filaFailed), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", filaFailed);
        await driver.sleep(300);

        // Hacer clic sobre la fila
        await filaFailed.click();
        await driver.sleep(1000);

        console.log("✅ Paso 9 completado: Fila con ID 9 (FAILED) seleccionada correctamente.");

      } catch (error) {
        throw new Error(`❌ Error en paso 9 (selección de fila 'FAILED'): ${error.message}`);
      }


      // === Paso 10: Hacer clic en el botón "FINALIZAR" ===
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

        console.log("✅ Paso 6: clic en 'FINALIZAR' realizado.");

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
        throw new Error(`❌ Error en paso 10 (clic en botón 'FINALIZAR'): ${error.message}`);
      }

      // === Paso 11: Seleccionar primer registro dinámicamente de la tabla ONTs ===
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

        // Esperar que sea visible e interactuable
        await driver.wait(until.elementIsVisible(primeraFila), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", primeraFila);
        await driver.sleep(300); // Espera breve

        // Clic sobre la fila
        await primeraFila.click();
        await driver.sleep(1000);

        console.log("✅ Paso 11: Primer registro dinámico de ONTs seleccionado correctamente.");
      } catch (error) {
        throw new Error(`❌ Error en paso 11 (selección dinámica de primer registro): ${error.message}`);
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
        throw new Error(`❌ Error en paso 12 (clic en botón 'Actualizar estado operativo'): ${error.message}`);
      }

      // === Paso 13: Clic en el <select> para mostrar las opciones de estado ===
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
        throw new Error(`❌ Error en paso 13 (clic en select de estado operativo): ${error.message}`);
      }


      // === Paso 14: Seleccionar la opción "LOST" en el <select> de estado operativo ===
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
        throw new Error(`❌ Error en paso 14 (selección de opción 'LOST'): ${error.message}`);
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
        throw new Error(`❌ Error en paso 15 (ingreso de comentario): ${error.message}`);
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

        console.log("✅ Paso 16: Botón 'Guardar' presionado y modal cerrado correctamente.");
      } catch (error) {
        throw new Error(`❌ Error en paso 16 (clic en botón 'Guardar'): ${error.message}`);
      }


      // === Paso 17: Clic en el botón "Mostrar filtro" ===
      try {
        // 1. Esperar que desaparezca el progreso (evita bloqueo visual)
        await driver.wait(async () => {
          const loadingDiv = await driver.findElements(By.id("progress-id-progress-ONT"));
          if (loadingDiv.length === 0) return true;

          const isDisplayed = await loadingDiv[0].isDisplayed().catch(() => false);
          return !isDisplayed;
        }, 15000, "El progreso (progress-id-progress-ONT) no desapareció a tiempo.");

        // 2. Localizar el botón
        const botonMostrarFiltro = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-button-btn-show-filter"]/div')),
          10000
        );
        await driver.wait(until.elementIsVisible(botonMostrarFiltro), 5000);
        await driver.wait(until.elementIsEnabled(botonMostrarFiltro), 5000);

        // 3. Hacer scroll y clic
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonMostrarFiltro);
        await driver.sleep(300);
        await botonMostrarFiltro.click();
        await driver.sleep(1000);

        console.log("✅ Paso 17: Se hizo clic en el botón 'Mostrar filtro' correctamente.");
      } catch (error) {
        throw new Error(`❌ Error en paso 17 (clic en 'Mostrar filtro'): ${error.message}`);
      }



    } catch (error) {
      console.error("❌ Error en gestión de activos:", error.message);
      const screenshot = await driver.takeScreenshot();
      const carpetaErrores = path.resolve(__dirname, '../errores');
      if (!fs.existsSync(carpetaErrores)) fs.mkdirSync(carpetaErrores);
      const filePath = path.join(carpetaErrores, `error_gestionActivos_${Date.now()}.png`);
      fs.writeFileSync(filePath, screenshot, 'base64');
      throw error;
    }
  }

}