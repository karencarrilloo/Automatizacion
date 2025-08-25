import { By, until } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import loginPage from './login.page.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class GestionClientesServiciosPage {
  constructor(driver) {
    this.driver = driver;
  }

  async ejecutarGestionClientesServicios() {
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

      // === Paso 3: Clic en "Gestión sobre clientes y servicios domiciliarios" ===
      const gestionClientesBtn = await driver.wait(
        until.elementLocated(By.xpath("//div[contains(@class,'legend-application') and contains(text(),'Gestión sobre clientes y servicios domiciliarios')]")),
        10000
      );
      await driver.executeScript("arguments[0].scrollIntoView({behavior:'smooth', block:'center'});", gestionClientesBtn);
      await driver.wait(until.elementIsVisible(gestionClientesBtn), 10000);
      await driver.wait(until.elementIsEnabled(gestionClientesBtn), 10000);
      await driver.sleep(1000);
      await driver.executeScript("arguments[0].click();", gestionClientesBtn);
      await driver.sleep(5000);


      // === Paso 4: Seleccionar cliente RESIDENCIAL ACTIVO ===
      try {
        const cuerpoTabla = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="grid-table-crud-grid-5522-CustomerManager"]/div/div[2]/table/tbody')),
          10000
        );

        const filas = await cuerpoTabla.findElements(By.xpath('./tr'));
        if (filas.length === 0) throw new Error("No se encontraron filas en la tabla.");

        let filaSeleccionada = null;

        // Buscar la primera fila con Estado ACTIVO y TipoCliente RESIDENCIAL
        for (const fila of filas) {
          const celdas = await fila.findElements(By.css('td'));
          const estadoCliente = (await celdas[9].getText()).trim().toUpperCase();     // Columna 9 = Estado
          const tipoCliente = (await celdas[14].getText()).trim().toUpperCase();      // Columna 14 = Tipo Cliente

          if (estadoCliente.includes("ACTIVO") && tipoCliente.includes("RESIDENCIAL")) {
            filaSeleccionada = fila;
            this.tipoClienteSeleccionado = tipoCliente;
            console.log(`✅ Fila encontrada: Estado=${estadoCliente}, TipoCliente=${tipoCliente}`);
            break;
          }
        }

        if (!filaSeleccionada) {
          throw new Error("❌ No se encontró ningún cliente RESIDENCIAL ACTIVO.");
        }

        // Seleccionar fila encontrada
        await driver.wait(until.elementIsVisible(filaSeleccionada), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", filaSeleccionada);
        await driver.sleep(300);
        await filaSeleccionada.click();
        await driver.sleep(1000);

        console.log("✅ Cliente RESIDENCIAL ACTIVO seleccionado correctamente.");
      } catch (error) {
        throw new Error(`❌ Error en CP_GESCLI_001 Paso 1: ${error.message}`);
      }


      // === Paso 5: Seleccionar botón Opciones ===
      try {
        const btnOpciones = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="btn-options"]')),
          10000
        );

        await driver.wait(until.elementIsVisible(btnOpciones), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnOpciones);
        await driver.sleep(300);

        await driver.executeScript("arguments[0].click();", btnOpciones);
        await driver.sleep(1000);

        console.log("✅ Paso 5: Botón Opciones seleccionado correctamente.");
      } catch (error) {
        throw new Error(`❌ Paso 5: (clic en botón Opciones): ${error.message}`);
      }

      // === Paso 6: Seleccionar opción "Ver información técnica asociada" ===
      try {
        // Esperar a que se despliegue el menú UL de opciones
        const menuOpciones = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="container-general-crud"]/div[4]/div[2]/div[1]/div/div/div/ul')),
          10000
        );

        await driver.wait(until.elementIsVisible(menuOpciones), 5000);

        // Buscar el LI con id=1090 dentro del menú
        const opcionVerInfo = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="1090"]')),
          10000
        );

        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", opcionVerInfo);
        await driver.sleep(300);

        await driver.executeScript("arguments[0].click();", opcionVerInfo);
        await driver.sleep(2000); // espera que cargue la vista

        console.log("✅ Paso 6: Opción 'Ver información técnica asociada' seleccionada.");
      } catch (error) {
        throw new Error(`❌ Paso 6: (clic en opción Ver información técnica asociada): ${error.message}`);
      }

      // === Paso 7: Cerrar el modal de información técnica ===
      try {
        const btnCerrarModal = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-button-cancel-confirm-selected"]/div')),
          10000
        );

        await driver.wait(until.elementIsVisible(btnCerrarModal), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnCerrarModal);
        await driver.sleep(300);

        await driver.executeScript("arguments[0].click();", btnCerrarModal);
        await driver.sleep(2000); // Espera a que el modal desaparezca

        console.log("✅ Paso 7: Modal cerrado correctamente.");
      } catch (error) {
        throw new Error(`❌ Paso 7: (cerrar modal): ${error.message}`);
      }

      // === Paso 8: Seleccionar botón Opciones ===
      try {
        const btnOpciones = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="btn-options"]')),
          10000
        );

        await driver.wait(until.elementIsVisible(btnOpciones), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnOpciones);
        await driver.sleep(300);

        await driver.executeScript("arguments[0].click();", btnOpciones);
        await driver.sleep(1000);

        console.log("✅ Paso 8: Botón Opciones seleccionado correctamente.");
      } catch (error) {
        throw new Error(`❌ Paso 8: (clic en botón Opciones): ${error.message}`);
      }


      // === Paso 9: Seleccionar opción "Reconfiguración" ===
      try {
        // Esperar que el menú UL esté disponible nuevamente
        const menuOpciones = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="container-general-crud"]/div[4]/div[2]/div[1]/div/div/div/ul')),
          10000
        );

        await driver.wait(until.elementIsVisible(menuOpciones), 5000);

        // Buscar el LI con id=1089 dentro del menú
        const opcionReconfig = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="1089"]')),
          10000
        );

        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", opcionReconfig);
        await driver.sleep(300);

        await driver.executeScript("arguments[0].click();", opcionReconfig);
        await driver.sleep(2000); // Espera que cargue la vista o modal de reconfiguración

        console.log("✅ Paso 9: Opción 'Reconfiguración' seleccionada correctamente.");
      } catch (error) {
        throw new Error(`❌ Paso 9: (clic en opción Reconfiguración): ${error.message}`);
      }

      // === Paso 10: Clic en botón "Reconfigurar" ===
      try {
        const btnReconfigurar = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-button-btn-reconfig"]/div')),
          10000
        );

        await driver.wait(until.elementIsVisible(btnReconfigurar), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnReconfigurar);
        await driver.sleep(300);

        await driver.executeScript("arguments[0].click();", btnReconfigurar);
        await driver.sleep(2000); // Espera que se procese la acción

        console.log("✅ Paso 10: 'Reconfigurar' presionado correctamente.");
      } catch (error) {
        throw new Error(`❌ Paso 10: (clic en botón Reconfigurar): ${error.message}`);
      }

      // === Paso 11: Confirmar con "Sí" en el modal ===
      try {
        const btnConfirmarSi = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-button-btConfirmYes"]/div')),
          10000
        );

        await driver.wait(until.elementIsVisible(btnConfirmarSi), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnConfirmarSi);
        await driver.sleep(300);

        await driver.executeScript("arguments[0].click();", btnConfirmarSi);
        await driver.sleep(3000); // espera a que la acción de reconfiguración inicie

        console.log("✅ CP_GESCLI_001: Confirmación 'Sí' en el modal ejecutada correctamente.");
      } catch (error) {
        throw new Error(`❌ Paso 11: (clic en 'Sí' del modal de confirmación): ${error.message}`);
      }

      // === Manejo de ejecución de reconfiguración ===
      try {
        const btnSiguienteXpath = '//*[@id="widget-button-btn-next"]/div';

        const pendingXpath = '//*[@id="widget-dialog-open-dialog-602818-5522-CustomerManager"]/div/div/div[2]/div/div/div/div/div[2]/span';
        const runningXpath = '//*[@id="widget-dialog-open-dialog-602818-5522-CustomerManager"]/div/div/div[2]/div/div/div/div/div[1]/div[3]/span';
        const processGeneralXpath = '//*[@id="widget-dialog-open-dialog-602818-5522-CustomerManager"]/div/div/div[2]/div/div/div/div/div[2]';
        const checkOkXpath = '//*[@id="widget-dialog-open-dialog-602818-5522-CustomerManager"]//span[contains(@class,"glyphicon-ok")]';

        console.log("⏳ Esperando inicio del proceso de reconfiguración (estado pending)...");

        // === Etapa 1: Pending (proceso aún no iniciado) ===
        const pendingEl = await driver.wait(
          until.elementLocated(By.xpath(pendingXpath)),
          60000
        );
        await driver.wait(until.elementIsVisible(pendingEl), 60000);
        console.log("✅ Proceso en estado PENDING detectado.");

        // === Etapa 2: Running (cuando el proceso comienza realmente) ===
        console.log("⏳ Esperando transición a RUNNING...");
        const runningEl = await driver.wait(
          until.elementLocated(By.xpath(runningXpath)),
          180000 // hasta 3 minutos
        );
        await driver.wait(until.elementIsVisible(runningEl), 180000);
        console.log("✅ Proceso RUNNING detectado, reconfiguración en curso...");

        // === Etapa 3: Esperar a que todos los checks (✔️) aparezcan ===
        console.log("⏳ Esperando que finalicen los pasos de la reconfiguración...");
        await driver.wait(async () => {
          const checks = await driver.findElements(By.xpath(checkOkXpath));
          console.log(`📌 Checks encontrados hasta ahora: ${checks.length}`);
          return checks.length >= 5; // Ajusta según número esperado de pasos
        }, 600000, "❌ Los checks no se completaron en el tiempo esperado (10 min).");

        console.log("✅ Todos los pasos de reconfiguración completados.");

        // === Etapa 4: Presionar botón Siguiente ===
        const btnSiguiente = await driver.wait(
          until.elementLocated(By.xpath(btnSiguienteXpath)),
          60000
        );
        await driver.wait(until.elementIsVisible(btnSiguiente), 60000);
        await driver.wait(until.elementIsEnabled(btnSiguiente), 60000);

        await driver.executeScript("arguments[0].click();", btnSiguiente);
        console.log("✅ Reconfiguración finalizada: botón 'Siguiente' presionado.");
        await driver.sleep(10000);

        this.reconfiguracionExitosa = true;

      } catch (err) {
        console.error(`❌ Error en ejecución de reconfiguración: ${err.message}`);
        this.reconfiguracionExitosa = false;
      }




      // === Paso 13: Seleccionar opción "Ver dispositivos" ===
      // try {
      //   // Reabrir el menú de opciones si es necesario

      //   const btnOpciones = await driver.wait(
      //     until.elementLocated(By.xpath('//*[@id="btn-options"]')),
      //     10000
      //   );
      //   await driver.executeScript("arguments[0].click();", btnOpciones);
      //   await driver.sleep(500);

      //   // Esperar que el menú UL esté disponible
      //   const menuOpciones = await driver.wait(
      //     until.elementLocated(By.xpath('//*[@id="container-general-crud"]/div[4]/div[2]/div[1]/div/div/div/ul')),
      //     8000
      //   );
      //   await driver.wait(until.elementIsVisible(menuOpciones), 5000);

      //   // Buscar el LI con id=1088
      //   const opcionVerDispositivos = await driver.wait(
      //     until.elementLocated(By.xpath('//*[@id="1088"]')),
      //     8000
      //   );

      //   await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", opcionVerDispositivos);
      //   await driver.sleep(300);

      //   await driver.executeScript("arguments[0].click();", opcionVerDispositivos);
      //   await driver.sleep(2000);

      //   console.log("✅ CP_GESCLI_001: Opción 'Ver dispositivos' seleccionada.");
      // } catch (error) {
      //   throw new Error(`❌ Error en CP_GESCLI_001 Paso 10 (clic en opción Ver dispositivos): ${error.message}`);
      // }

      // // === Paso 14: Cerrar modal de Ver dispositivos ===
      // try {
      //   const btnCerrarDispositivos = await driver.wait(
      //     until.elementLocated(By.xpath('//*[@id="widget-dialog-open-dialog-602940-5522-CustomerManager"]/div/div/div[1]/button')),
      //     10000
      //   );

      //   await driver.wait(until.elementIsVisible(btnCerrarDispositivos), 5000);
      //   await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnCerrarDispositivos);
      //   await driver.sleep(300);

      //   await driver.executeScript("arguments[0].click();", btnCerrarDispositivos);
      //   await driver.sleep(1500);

      //   console.log("✅ CP_GESCLI_001: Modal de Ver dispositivos cerrado correctamente.");
      // } catch (error) {
      //   throw new Error(`❌ Error en CP_GESCLI_001 Paso 11 (cerrar modal Ver dispositivos): ${error.message}`);
      // }


      // // Click en el botón de opciones
      // await driver.findElement(By.xpath("//button[@id='btn-options']/div")).click();

      // // Click en la opción Ver informacion tecnica de red
      // await driver.findElement(By.xpath("//li[@id='1090']/div")).click();

      // // Click en el botón Cerrar
      // await driver.findElement(By.xpath("//div[@id='widget-button-cancel-confirm-selected']/div")).click();

      // // === Paso 5: Clic sobre el registro y seleccionar opcion Reconfiguración" ===

      // // Click en uno de los registros
      // await driver.findElement(By.xpath("//tr[@id='row-602576']/td[8]")).click();

      // // Click en el botón de opciones
      // await driver.findElement(By.xpath("//button[@id='btn-options']/div")).click();

      // // Click en la opción Reconfiguración
      // await driver.findElement(By.xpath("//li[@id='1089']/div")).click();

      // // Validar que no es posible dar click al recuadro ONT
      // await driver.findElement(By.xpath("//div[@id='widget-dialog-open-dialog-602576-5522-CustomerManager']/div/div/div[2]/div/div/div/div/div/div[2]")).click();

      // // Click en botón Reconfigurar
      // await driver.findElement(By.xpath("//div[@id='widget-button-btn-reconfig']/div")).click();

      // // Click en botón Confirmar (Sí)
      // await driver.findElement(By.xpath("//div[@id='widget-button-btConfirmYes']/div")).click();

      // // Click en botón Siguiente
      // await driver.findElement(By.xpath("//div[@id='widget-button-btn-next']/div")).click();

      // // Click en botón Configurar WiFi
      // await driver.findElement(By.xpath("//div[@id='widget-button-btn-config-wifi-data']/div")).click();

      // // === Paso 6: Clic sobre el registro y seleccionar opcion Ver dispositivos" ===

      // // Click en uno de los registros
      // await driver.findElement(By.xpath("//tr[@id='row-602556']/td[8]")).click();

      // // Click en el botón de opciones
      // await driver.findElement(By.xpath("//button[@id='btn-options']/div")).click();

      // // Click en la opción Ver dispositivos
      // await driver.findElement(By.xpath("//li[@id='1088']/div")).click();

      // // Click en el botón cerrar
      // await driver.findElement(By.xpath("//div[@id='widget-dialog-open-dialog-602556-5522-CustomerManager']/div/div/div/button/span")).click();

      // // === Paso 7: Clic sobre el registro y seleccionar opcion Ver documentos" ===

      // // Click en uno de los registros
      // await driver.findElement(By.xpath("//td[@id='email']")).click();

      // // Click en botón de opciones
      // await driver.findElement(By.xpath("//button[@id='btn-options']/div")).click();

      // // Click en opción Ver documentos
      // await driver.findElement(By.xpath("//li[@id='1080']/div")).click();

      // // Click en la opcion Descargar contrato
      // await driver.findElement(By.xpath("//li[@id='6889268b8fe15a17bec49ae9']/div[5]/span")).click();

      // // Click en la opcion Ver documento
      // await driver.findElement(By.xpath("//li[@id='6889268b8fe15a17bec49ae9']/div[4]/span")).click();

      // // Click en la opcion Cerrar visor del contrato
      // await driver.findElement(By.xpath("//div[@id='widget-dialog-contract-dialog']/div/div/div/button/span")).click();

      // // Click en la opcion Enviar contrato
      // await driver.findElement(By.xpath("//li[@id='6889268b8fe15a17bec49ae9']/div[3]/span")).click();

      // // Click en botón cerrar visor de documentos
      // await driver.findElement(By.xpath("//div[@id='widget-dialog-open-dialog-602636-5522-CustomerManager']/div/div/div/button/span")).click();

      // // === Paso 8: Clic sobre el registro y seleccionar opcion Detalle del proceso" ===

      // // Click en uno de los registros
      // await driver.findElement(By.xpath("//td[@id='phone']")).click();

      // // Click en botón de opciones
      // await driver.findElement(By.xpath("//button[@id='btn-options']/div")).click();

      // // Click en opción Detalle del proceso
      // await driver.findElement(By.xpath("//li[@id='1084']/div")).click();

      // // Click en botón para cerrar detalle de proceso
      // await driver.findElement(By.xpath("//div[@id='widget-button-close-detail-process']/div")).click();

      // // === Paso 9: Clic sobre el registro y seleccionar opcion Suspensión" ===

      // // Click en uno de los registros
      // await driver.findElement(By.xpath("//tr[@id='row-602616']/td[8]")).click();

      // // Click en el botón de opciones
      // await driver.findElement(By.xpath("//button[@id='btn-options']/div")).click();

      // // Click en la opcion Suspensión
      // await driver.findElement(By.xpath("//li[@id='1083']/div")).click();

      // // Seleccionar en el dropdown "SUSPENSION POR NO PAGO"
      // const selectElement = await driver.findElement(By.id("input-select-suspension-type-select"));
      // await selectElement.click();
      // await selectElement.findElement(By.xpath("//option[normalize-space(.)='SUSPENSION POR NO PAGO']")).click();

      // // Escribir comentario en el campo de texto
      // const commentField1 = await driver.findElement(By.id("textfield-input-data-comment"));
      // await commentField1.click();
      // await commentField1.clear();
      // await commentField1.sendKeys("si");

      // // Click en botón de detalle de suspensión
      // await driver.findElement(By.xpath("//div[@id='widget-button-suspension-detail']/div")).click();

      // // Confirmar acción
      // await driver.findElement(By.xpath("//div[@id='widget-button-btConfirmYes']/div")).click();

      // // Click en botón Refrescar
      // await driver.findElement(By.xpath("//div[@id='process-detail-container']/div[2]/div[2]/button/span")).click();

      // // Cerrar detalles de proceso
      // await driver.findElement(By.xpath("//div[@id='widget-button-close-detail-process']/div")).click();

      // // === Paso 10: Clic sobre el registro y seleccionar opcion Reconexión" ===

      // // Click en uno de los registros
      // await driver.findElement(By.xpath("//tr[@id='row-602616']/td[8]")).click();

      // // Click en botón de opciones
      // await driver.findElement(By.xpath("//button[@id='btn-options']/div")).click();

      // // Click en la opción Reconexión
      // await driver.findElement(By.xpath("//li[@id='1081']/div")).click();

      // // Escribir comentario en el campo de texto
      // const commentField2 = await driver.findElement(By.id("textfield-input-data-comment"));
      // await commentField2.click();
      // await commentField2.clear();
      // await commentField2.sendKeys("comentario");

      // // Click en botón Confirmar
      // await driver.findElement(By.xpath("//div[@id='widget-button-suspension-detail']/div")).click();

      // // Confirmar acción
      // await driver.findElement(By.xpath("//div[@id='widget-button-btConfirmYes']/div")).click();

      // // Click en botón Refrescar
      // await driver.findElement(By.xpath("//div[@id='process-detail-container']/div[2]/div[2]/button/span")).click();

      // // Cerrar detalle de proceso
      // await driver.findElement(By.xpath("//div[@id='widget-button-close-detail-process']/div")).click();

      // // === Paso 11: Clic sobre el registro y seleccionar opcion Cambio de plan" ===

      // // Click en uno de los registros
      // await driver.findElement(By.xpath("//tr[@id='row-602616']/td[8]")).click();

      // // Click en botón de opciones
      // await driver.findElement(By.id("btn-options")).click();

      // // Click en la opción Cambio de plan
      // await driver.findElement(By.xpath("//li[@id='1082']/div")).click();

      // // Abrir selector de cambio de plan
      // await driver.findElement(By.xpath("//div[@id='widget-pickview-pick-data-change-plan']/div/span[2]/button/i")).click();

      // // Selección uno de los productos comerciales
      // await driver.findElement(By.xpath("//div[@id='widget-dialog-pickview-pick-data-change-plan']//tr[2]/td[4]/div/button/i")).click();
      // await driver.findElement(By.xpath("//div[@id='widget-dialog-pickview-pick-data-change-plan']//tr[16]/td/div/button/i")).click();
      // await driver.findElement(By.xpath("//div[@id='widget-dialog-pickview-pick-data-change-plan']//tr[17]/td[4]/div/button[2]/i")).click();

      // // Confirmar selección de plan
      // await driver.findElement(By.xpath("//div[@id='widget-button-select-pick-data-change-plan']/div")).click();

      // // Rellenar número PQ
      // const numberField = await driver.findElement(By.id("textfield-input-data-number-pq"));
      // await numberField.click();
      // await numberField.clear();
      // await numberField.sendKeys("123");

      // // Rellenar comentario
      // const commentField3 = await driver.findElement(By.id("textfield-input-data-comment"));
      // await commentField3.click();
      // await commentField3.clear();
      // await commentField3.sendKeys("comentario");

      // // Confirmar cambio de plan
      // await driver.findElement(By.xpath("//div[@id='widget-button-suspension-detail']/div")).click();

      // // Click en botón Refrescar
      // await driver.findElement(By.xpath("//div[@id='process-detail-container']/div[2]/div[2]/button")).click();

      // // Cerrar detalle de proceso
      // await driver.findElement(By.xpath("//div[@id='widget-button-close-detail-process']/div")).click();


      // === Paso 12: Clic sobre el registro y seleccionar opcion Configuración DirecTV" ===

      // Aquí puedes continuar con otros pasos si aplica

    } catch (error) {
      console.error("❌ Error en gestión de clientes y servicios domiciliarios:", error.message);
      const screenshot = await driver.takeScreenshot();
      const carpetaErrores = path.resolve(__dirname, '../errores');
      if (!fs.existsSync(carpetaErrores)) fs.mkdirSync(carpetaErrores);
      const filePath = path.join(carpetaErrores, `error_gestionClientes_${Date.now()}.png`);
      fs.writeFileSync(filePath, screenshot, 'base64');
      throw error;
    }
  }
}
