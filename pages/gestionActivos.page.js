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
      // === CP_GESACT_001 - Validar el ingreso a la vista “Gestión de activos” se muestre la información correctamente ===

      // === CP_GESACT_001 Paso 1: Clic en módulo eCenter ===
      try {
        const eCenterBtn = await driver.wait(
          until.elementLocated(By.xpath("//div[@id='118' and contains(@class, 'item-module')]")),
          10000
        );
        await driver.executeScript("arguments[0].click();", eCenterBtn);
        await driver.sleep(1000);
        console.log("✅ CP_GESACT_001 Paso 1: Módulo eCenter presionado correctamente.");
      } catch (error) {
        throw new Error(`❌ CP_GESACT_001 Paso 1 (clic en módulo eCenter): ${error.message}`);
      }

      // === CP_GESACT_001 Paso 2: Scroll en el contenedor de aplicaciones ===
      try {
        const scrollContainer = await driver.wait(
          until.elementLocated(By.css('.container-applications')),
          10000
        );
        await driver.executeScript(
          "arguments[0].scrollTop = arguments[0].scrollHeight;",
          scrollContainer
        );
        await driver.sleep(1000);
        console.log("✅ CP_GESACT_001 Paso 2: Scroll en contenedor de aplicaciones realizado correctamente.");
      } catch (error) {
        throw new Error(`❌ CP_GESACT_001 Paso 2 (scroll en contenedor de aplicaciones): ${error.message}`);
      }

      // === CP_GESACT_001 Paso 3: Clic en 'Gestión de Activos' ===
      try {
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
        console.log("✅ CP_GESACT_001 Paso 3: Botón 'Gestión de Activos' presionado correctamente.");
      } catch (error) {
        throw new Error(`❌ CP_GESACT_001 Paso 3 (clic en 'Gestión de Activos'): ${error.message}`);
      }



      // === CP_GESACT_002 - Validar que se permita seleccionar la entidad "elemento secundario" desde el modal de entidades.
      // CP_GESACT_002 Paso 1: Clic en botón "Seleccionar entidad"
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
        console.log("✅ CP_GESACT_002 Paso 1: Botón 'Seleccionar entidad' presionado.");
      } catch (error) {
        throw new Error(`❌ CP_GESACT_002 Paso 1 (clic en 'Seleccionar entidad'): ${error.message}`);
      }

      // CP_GESACT_002 Paso 2: Seleccionar la fila que contiene el texto "elemento secundario".
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

        console.log("✅ CP_GESACT_002 Paso 2: Se seleccionó 'elemento secundario'.");
      } catch (error) {
        throw new Error(`❌ Error en CP_GESACT_002 Paso 2 (selección de 'elemento secundario'): ${error.message}`);
      }

      // CP_GESACT_002 Paso 3: Clic en botón "Siguiente"
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
        console.log("✅ CP_GESACT_002 Paso 3: Botón 'Siguiente' presionado después de 'elemento secundario'.");
      } catch (error) {
        throw new Error(`❌ Error en CP_GESACT_002 Paso 3: (clic en 'Siguiente' después de 'elemento secundario'): ${error.message}`);
      }

      // === CP_GESACT_003 - Validar que el usuario pueda seleccionar la opción "ont" como parte del flujo de selección.
      // CP_GESACT_003 Paso 1: Seleccionar "ont"
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

        console.log("✅ CP_GESACT_003 Paso 1: Se seleccionó 'ont'.");
      } catch (error) {
        throw new Error(`❌ CP_GESACT_003 Paso 1 (selección de 'ont'): ${error.message}`);
      }

      // CP_GESACT_003 Paso 2: Clic en botón "Siguiente"
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
        console.log("✅ CP_GESACT_003 Paso 2: Botón 'Siguiente' presionado después de 'ont'.");
      } catch (error) {
        throw new Error(`❌ CP_GESACT_003 Paso 2: (clic en 'Siguiente' después de 'ont'): ${error.message}`);
      }

      // === CP_GESACT_004 - Validar que el sistema cargue y muestre los dispositivos tras finalizar la selección de entidad.

      // === CP_GESACT_004 Paso 1: Seleccionar fila con ID 9 "FAILED"  ===
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

        console.log("✅ CP_GESACT_004 Paso 1: Fila con ID 9 (FAILED) seleccionada correctamente.");

      } catch (error) {
        throw new Error(`❌ Error CP_GESACT_004 Paso 1: (selección de fila 'FAILED'): ${error.message}`);
      }


      // === CP_GESACT_004 Paso 2: Hacer clic en el botón "FINALIZAR" ===
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

        console.log("✅ CP_GESACT_004 Paso 2: clic en 'FINALIZAR' realizado.");

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
        throw new Error(`❌ Error en CP_GESACT_004 paso 2 (clic en botón 'FINALIZAR'): ${error.message}`);
      }

      // === CP_GESACT_004 Paso 3:  Seleccionar el primer registro de la tabla. ===
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

        console.log("✅ CP_GESACT_004 Paso 3: Primer registro dinámico de ONTs seleccionado correctamente.");
      } catch (error) {
        throw new Error(`❌ Error en CP_GESACT_004 paso 3 (selección dinámica de primer registro): ${error.message}`);
      }

      // === CP_GESACT_005 - Actualizar estado del primer registro una ont a "LOST"
      // === CP_GESACT_005 Paso 1: Clic en el botón "Actualizar estado operativo" ===
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


        console.log("✅ CP_GESACT_005 Paso 1: Botón 'Actualizar estado operativo' presionado correctamente.");

      } catch (error) {
        throw new Error(`❌ Error en CP_GESACT_005 Paso 1: (clic en botón 'Actualizar estado operativo'): ${error.message}`);
      }

      // === CP_GESACT_005 Paso 2: Clic en el <select> para mostrar las opciones de estado ===
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

        console.log("✅ CP_GESACT_005 Paso 2: Select de estado operativo desplegado correctamente.");

      } catch (error) {
        throw new Error(`❌ Error en CP_GESACT_005 Paso 2 (clic en select de estado operativo): ${error.message}`);
      }


      // ===  CP_GESACT_005 Paso 3: Seleccionar la opción "LOST" en el <select> ===
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

        console.log("✅ CP_GESACT_005 Paso 3: Opción 'LOST' seleccionada correctamente.");

      } catch (error) {
        throw new Error(`❌ Error en CP_GESACT_005 Paso 3 (selección de opción 'LOST'): ${error.message}`);
      }


      // === CP_GESACT_005 Paso 4: Diligenciar el campo de comentario con "test automatización" ===
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

        console.log("✅ CP_GESACT_005 Paso 4: Comentario ingresado correctamente.");
      } catch (error) {
        throw new Error(`❌ Error en CP_GESACT_005 Paso 4 (ingreso de comentario): ${error.message}`);
      }
      // === CP_GESACT_005 Paso 5: Clic en botón "Guardar" para actualizar estado ont ===
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

        console.log("✅ CP_GESACT_005 Paso 5: Botón 'Guardar' presionado y modal cerrado correctamente.");
      } catch (error) {
        throw new Error(`❌ CP_GESACT_005 Paso 5 (clic en botón 'Guardar'): ${error.message}`);
      }

      // === CP_GESACT_006 - Realizar filtro de busqueda por el campo FACTORYSERIAL
      // === CP_GESACT_006 Paso 1: Clic en el botón "Mostrar filtro" ===
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

        console.log("✅ Paso 17: Se hizo clic en el botón 'Mostrar filtro' correctamente.");
      } catch (error) {
        throw new Error(`❌ Error en paso 17 (clic en 'Mostrar filtro'): ${error.message}`);
      }

      // === CP_GESACT_006 Paso 2: Clic en <select> para mostrar las opciones ===
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

        console.log("✅ CP_GESACT_006 Paso 2: Botón <select> presionado.");
      } catch (error) {
        throw new Error(`❌ CP_GESACT_006 Paso 2 (clic en <select>): ${error.message}`);
      }

      // === CP_GESACT_006 Paso 3: Seleccionar opción "FACTORYSERIAL" en el <select> ===
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

        console.log("✅ CP_GESACT_006 Paso 3: Opción 'FACTORYSERIAL' seleccionada correctamente.");
      } catch (error) {
        throw new Error(`❌ CP_GESACT_006 Paso 3 (selección de opción 'FACTORYSERIAL'): ${error.message}`);
      }

      // === CP_GESACT_006 Paso 4: Diligenciar campo de texto con serial ONT aleatorio ===
      try {
        const serialesONT = [
          "485754435A5AC5A6",
          "4857544370077AA5",
          "485754435A637DA6",
          "485754435A53E5A6",
          "485754436E8B28A5",
          "4857544370158EA5",
          "485754436E8246A5",
          "485754436EEDBFA5"
        ];
        const serialAleatorio = serialesONT[Math.floor(Math.random() * serialesONT.length)];

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

        // Hacer scroll al campo y escribir el serial aleatorio
        await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", campoTexto);
        await campoTexto.clear();
        await campoTexto.sendKeys(serialAleatorio);
        await driver.sleep(3000);

        console.log(`✅ CP_GESACT_006 Paso 4: Se digitó el serial aleatorio "${serialAleatorio}" correctamente.`);
      } catch (error) {
        throw new Error(`❌ CP_GESACT_006 Paso 4 (diligenciar serial ONT aleatorio): ${error.message}`);
      }

      // === CP_GESACT_006 Paso 5: Clic en botón "Aplicar filtro" ===
      try {
        const botonAplicarFiltro = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-button-btn-set-filter"]/div')),
          10000
        );

        await driver.wait(until.elementIsVisible(botonAplicarFiltro), 5000);
        await driver.wait(until.elementIsEnabled(botonAplicarFiltro), 5000);

        await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", botonAplicarFiltro);
        await driver.sleep(500);
        await botonAplicarFiltro.click();

        // === Espera dinámica a que desaparezca el progress ===
        try {
          const progress = await driver.wait(
            until.elementLocated(By.xpath('//*[@id="progress-id-filter"]')),
            5000
          );
          await driver.wait(until.stalenessOf(progress), 20000); // espera hasta que desaparezca
        } catch (progressError) {
          console.warn("⚠️ No se detectó el progress, se continúa.");
        }

        console.log("✅ CP_GESACT_006 Paso 5: Botón 'Aplicar filtro' presionado y espera dinámica completada.");
      } catch (error) {
        throw new Error(`❌ CP_GESACT_006 Paso 5 (clic en botón 'Aplicar filtro'): ${error.message}`);
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