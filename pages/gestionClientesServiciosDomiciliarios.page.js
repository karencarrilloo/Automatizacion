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


      // paso 4 === Seleccionar cliente RESIDENCIAL ACTIVO ===
      try {
        // Buscar dinámicamente el tbody de la tabla (sin ID fijo)
        const cuerpoTabla = await driver.wait(
          until.elementLocated(By.xpath('//div[contains(@id,"grid-table-crud-grid") and contains(@id,"CustomerManager")]//table/tbody')),
          15000
        );

        // Reintento: esperar hasta encontrar al menos una fila válida
        let filaSeleccionada = null;
        let intentos = 0;
        while (!filaSeleccionada && intentos < 5) {
          intentos++;
          console.log(`🔎 Intento ${intentos}: buscando cliente RESIDENCIAL ACTIVO...`);

          const filas = await cuerpoTabla.findElements(By.xpath('./tr'));
          if (filas.length === 0) {
            console.log("⚠️ No hay filas en la tabla, esperando...");
            await driver.sleep(2000);
            continue;
          }

          for (const fila of filas) {
            const celdas = await fila.findElements(By.css('td'));
            if (celdas.length < 15) continue; // Evitar errores si la fila no tiene todas las columnas

            const estadoCliente = (await celdas[9].getText()).trim().toUpperCase();   // Col 9 = Estado
            const tipoCliente = (await celdas[14].getText()).trim().toUpperCase();    // Col 14 = Tipo Cliente

            console.log(`   ➝ Estado=${estadoCliente}, TipoCliente=${tipoCliente}`);

            if (estadoCliente.includes("ACTIVO") && tipoCliente.includes("RESIDENCIAL")) {
              filaSeleccionada = fila;
              this.estadoClienteSeleccionado = estadoCliente;
              this.tipoClienteSeleccionado = tipoCliente;
              console.log(`✅ Cliente válido encontrado: Estado=${estadoCliente}, TipoCliente=${tipoCliente}`);
              break;
            }
          }

          if (!filaSeleccionada) {
            console.log("⚠️ No se encontró cliente válido, reintentando...");
            await driver.sleep(2000);
          }
        }

        if (!filaSeleccionada) {
          throw new Error("❌ No se encontró ningún cliente RESIDENCIAL ACTIVO después de varios intentos.");
        }

        // Seleccionar fila encontrada
        await driver.wait(until.elementIsVisible(filaSeleccionada), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", filaSeleccionada);
        await driver.sleep(300);
        await filaSeleccionada.click();
        await driver.sleep(1000);

        console.log("✅ Cliente RESIDENCIAL ACTIVO seleccionado correctamente.");
      } catch (error) {
        throw new Error(`❌ Error en paso 4: ${error.message}`);
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
        await driver.sleep(3000); // espera que cargue la vista

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

      // === Paso 12: Manejo de ejecución de reconfiguración (éxito o fallo) === 
      let reconfigExitosa = false; // ✅ Declarar aquí para que exista en todo el bloque

      try {
        const btnSiguienteXpath = '//*[@id="widget-button-btn-next"]/div';
        const btnCerrarModalErrorXpath = '//div[starts-with(@id,"widget-dialog-open-dialog") and contains(@id,"CustomerManager")]//button';
        const checkOkXpath = '//*[@id="widget-dialog-open-dialog-602818-5522-CustomerManager"]//span[contains(@class,"glyphicon-ok")]';

        console.log("⏳ Esperando que se complete la reconfiguración...");

        // === Etapa 1: Esperar a que aparezcan todos los checks ===
        await driver.wait(async () => {
          const checks = await driver.findElements(By.xpath(checkOkXpath));
          console.log(`📌 Checks encontrados: ${checks.length}`);
          return checks.length >= 5; // Ajusta según número esperado
        }, 600000, "❌ Los checks no se completaron en el tiempo esperado (10 min).");

        console.log("✅ Todos los pasos de reconfiguración completados.");

        // === Etapa 2: Presionar botón Siguiente ===
        const btnSiguiente = await driver.wait(
          until.elementLocated(By.xpath(btnSiguienteXpath)),
          120000
        );
        await driver.wait(until.elementIsVisible(btnSiguiente), 20000);
        await driver.wait(until.elementIsEnabled(btnSiguiente), 20000);
        await driver.executeScript("arguments[0].click();", btnSiguiente);
        console.log("✅ Reconfiguración finalizada: botón 'Siguiente' presionado.");

        reconfigExitosa = true;

      } catch (e) {
        console.log("ℹ️ No se detectó éxito, verificando modal de error...");
        try {
          const btnCerrarModalError = await driver.wait(
            until.elementLocated(By.xpath(btnCerrarModalErrorXpath)),
            15000
          );
          await driver.wait(until.elementIsVisible(btnCerrarModalError), 5000);
          await driver.executeScript("arguments[0].click();", btnCerrarModalError);
          await driver.sleep(2000);
          console.log("⚠️ Reconfiguración fallida: modal cerrado correctamente.");
        } catch {
          console.log("❌ No apareció modal de error durante la reconfiguración.");
        }
        reconfigExitosa = false;
      }

      // ✅ Siempre asignamos el resultado al estado global
      this.reconfiguracionExitosa = reconfigExitosa;

      await driver.sleep(3000);


      // === Paso 13: Reutilizar datos WiFi ===
      try {
        const btnConfigurarXpath = '//*[@id="widget-button-btn-config-wifi-data"]/div';
        const progressXpath = '//*[@id="widget-dialog-open-dialog-602818-5522-CustomerManager"]//div[contains(@class,"progress-bar")]';

        // 1. Esperar que el botón "Configurar" sea visible
        const btnConfigurar = await driver.wait(
          until.elementLocated(By.xpath(btnConfigurarXpath)),
          30000 // puede tardar en aparecer
        );
        await driver.wait(until.elementIsVisible(btnConfigurar), 10000);
        await driver.sleep(2000);

        // 2. Dar clic en "Configurar"
        await driver.executeScript("arguments[0].click();", btnConfigurar);
        console.log("✅ Reutilizar datos WiFi: botón 'Configurar' presionado correctamente.");

        // 3. Esperar a que aparezca el progress dinámicamente
        console.log("⏳ Esperando inicio del proceso de configuración WiFi...");
        let progress;
        try {
          progress = await driver.wait(
            until.elementLocated(By.xpath(progressXpath)),
            60000 // darle hasta 1 min para iniciar
          );
          await driver.wait(until.elementIsVisible(progress), 10000);
          console.log("✅ Progress de WiFi detectado, proceso en curso...");
        } catch {
          console.log("⚠️ No apareció progress de WiFi en el tiempo esperado, continuando...");
        }

        // 4. Esperar a que desaparezca (fin del proceso)
        if (progress) {
          console.log("⏳ Esperando que finalice el progress...");
          await driver.wait(until.stalenessOf(progress), 300000); // hasta 5 minutos
          console.log("✅ Proceso de configuración WiFi finalizado correctamente.");
        }

      } catch (err) {
        throw new Error(`❌ Error en paso Reutilizar datos WiFi: ${err.message}`);
      }


      // === Paso 14: Seleccionar botón Opciones ===
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

      // === Paso 15: Seleccionar opción "Ver dispositivos" ===
      try {
        // Esperar a que se despliegue el menú UL de opciones
        const menuOpciones = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="container-general-crud"]/div[4]/div[2]/div[1]/div/div/div/ul')),
          10000
        );
        await driver.wait(until.elementIsVisible(menuOpciones), 5000);

        // Buscar el LI con id=1088 dentro del menú
        const opcionVerDispositivos = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="1088"]')),
          10000
        );

        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", opcionVerDispositivos);
        await driver.sleep(300);

        await driver.executeScript("arguments[0].click();", opcionVerDispositivos);
        await driver.sleep(3000); // espera que cargue la vista o modal

        console.log("✅ Paso 15: Opción 'Ver dispositivos' seleccionada.");
      } catch (error) {
        throw new Error(`❌ Paso 15: (clic en opción Ver dispositivos): ${error.message}`);
      }


      // === Paso 16: Cerrar el modal "Ver dispositivos" === 
      try {
        const btnCerrarModalXpath = '//*[@id="widget-dialog-open-dialog-602818-5522-CustomerManager"]/div/div/div[1]/button';

        // Esperar que aparezca el botón de cerrar
        const btnCerrarModal = await driver.wait(
          until.elementLocated(By.xpath(btnCerrarModalXpath)),
          10000
        );

        // Esperar que sea visible
        await driver.wait(until.elementIsVisible(btnCerrarModal), 5000);

        // Hacer scroll hasta el botón
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnCerrarModal);
        await driver.sleep(300);

        // Clic forzado con JS (evita el click intercepted)
        await driver.executeScript("arguments[0].click();", btnCerrarModal);

        // Esperar a que el modal desaparezca
        await driver.sleep(2000);

        console.log("✅ Modal 'Ver dispositivos' cerrado correctamente.");
      } catch (error) {
        throw new Error(`❌ Error al cerrar el modal 'Ver dispositivos': ${error.message}`);
      }


      // === Paso 17: Seleccionar botón Opciones ===
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

      // === Paso 18: Seleccionar opción "Ver documentos" ===
      try {
        // Esperar a que se despliegue el menú UL de opciones
        const menuOpciones = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="container-general-crud"]/div[4]/div[2]/div[1]/div/div/div/ul')),
          10000
        );
        await driver.wait(until.elementIsVisible(menuOpciones), 5000);

        // Buscar el LI con id=1080 dentro del menú
        const opcionVerDocumentos = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="1080"]')),
          10000
        );

        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", opcionVerDocumentos);
        await driver.sleep(300);

        await driver.executeScript("arguments[0].click();", opcionVerDocumentos);
        await driver.sleep(3000); // espera que cargue la vista o modal

        console.log("✅ Paso 16: Opción 'Ver documentos' seleccionada.");
      } catch (error) {
        throw new Error(`❌ Paso 16: (clic en opción Ver documentos): ${error.message}`);
      }

      // === Paso 19: Enviar Acta de instalación al correo ===
      try {
        const filaActaXpath = '//*[@id="68937ad0eccd6c733ecd26ef"]'; // Fila Acta de Instalación
        const btnEnviarCorreoXpath = `${filaActaXpath}/div[3]`; // Botón dentro de la columna OPCIONES

        // 1. Esperar a que aparezca la fila del acta
        const filaActa = await driver.wait(
          until.elementLocated(By.xpath(filaActaXpath)),
          20000
        );
        await driver.wait(until.elementIsVisible(filaActa), 5000);

        // 2. Esperar y dar clic en el botón de enviar al correo
        const btnEnviarCorreo = await driver.wait(
          until.elementLocated(By.xpath(btnEnviarCorreoXpath)),
          10000
        );
        await driver.wait(until.elementIsVisible(btnEnviarCorreo), 5000);

        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnEnviarCorreo);
        await driver.sleep(500);

        await driver.executeScript("arguments[0].click();", btnEnviarCorreo);
        await driver.sleep(3000); // espera para simular envío

        console.log("✅ Paso 17: Acta enviada al correo correctamente.");
      } catch (error) {
        throw new Error(`❌ Paso 17: Error al enviar el acta al correo: ${error.message}`);
      }


      // === Paso 20: Ver documento del Acta de instalación ===
      try {
        const filaActaXpath = '//*[@id="68937ad0eccd6c733ecd26ef"]'; // Fila Acta de Instalación
        const btnVerDocumentoXpath = `${filaActaXpath}/div[4]`; // Botón Ver documento

        // 1. Esperar a que la fila del acta esté presente
        const filaActa = await driver.wait(
          until.elementLocated(By.xpath(filaActaXpath)),
          20000
        );
        await driver.wait(until.elementIsVisible(filaActa), 5000);

        // 2. Localizar el botón "Ver documento"
        const btnVerDocumento = await driver.wait(
          until.elementLocated(By.xpath(btnVerDocumentoXpath)),
          10000
        );
        await driver.wait(until.elementIsVisible(btnVerDocumento), 5000);

        // 3. Hacer scroll y clic
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnVerDocumento);
        await driver.sleep(500);

        await driver.executeScript("arguments[0].click();", btnVerDocumento);
        await driver.sleep(5000); // Espera a que cargue el documento

        console.log("✅ Paso 18: Opción 'Ver documento' seleccionada correctamente.");
      } catch (error) {
        throw new Error(`❌ Paso 18: Error al seleccionar la opción 'Ver documento': ${error.message}`);
      }

      // === Paso 21: Cerrar modal de Ver Documento ===
      try {
        const btnCerrarModalDocXpath = '//*[@id="widget-dialog-contract-dialog"]/div/div/div[1]/button';

        // 1. Esperar a que aparezca el botón de cerrar
        const btnCerrarModalDoc = await driver.wait(
          until.elementLocated(By.xpath(btnCerrarModalDocXpath)),
          15000
        );
        await driver.wait(until.elementIsVisible(btnCerrarModalDoc), 5000);

        // 2. Hacer scroll hasta el botón
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnCerrarModalDoc);
        await driver.sleep(500);

        // 3. Dar clic en el botón de cerrar
        await driver.executeScript("arguments[0].click();", btnCerrarModalDoc);
        await driver.sleep(2000); // esperar a que el modal se cierre

        console.log("✅ Paso 19: Modal de Ver Documento cerrado correctamente.");
      } catch (error) {
        throw new Error(`❌ Paso 19: Error al cerrar modal de Ver Documento: ${error.message}`);
      }


      // === Paso 22: Descargar documento del Acta de instalación ===
      try {
        const filaActaXpath = '//*[@id="68937ad0eccd6c733ecd26ef"]'; // Fila Acta de Instalación
        const btnDescargarXpath = `${filaActaXpath}/div[5]`; // Botón Descargar documento

        // 1. Esperar a que la fila del acta esté presente
        const filaActa = await driver.wait(
          until.elementLocated(By.xpath(filaActaXpath)),
          20000
        );
        await driver.wait(until.elementIsVisible(filaActa), 5000);

        // 2. Localizar el botón "Descargar"
        const btnDescargar = await driver.wait(
          until.elementLocated(By.xpath(btnDescargarXpath)),
          10000
        );
        await driver.wait(until.elementIsVisible(btnDescargar), 5000);

        // 3. Hacer scroll y clic
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnDescargar);
        await driver.sleep(500);

        await driver.executeScript("arguments[0].click();", btnDescargar);
        await driver.sleep(5000); // Espera a que el navegador inicie la descarga

        console.log("✅ Paso 19: Documento descargado correctamente.");
      } catch (error) {
        throw new Error(`❌ Paso 19: Error al descargar el documento: ${error.message}`);
      }

      // === Paso 23: Enviar documento Contrato al correo ===
      try {
        const filaContratoXpath = '//*[@id="68937687eccd6c733ecd2641"]'; // Fila Contrato
        const btnEnviarCorreoContratoXpath = `${filaContratoXpath}/div[3]`; // Botón Enviar al correo

        // 1. Esperar a que la fila del contrato esté presente
        const filaContrato = await driver.wait(
          until.elementLocated(By.xpath(filaContratoXpath)),
          20000
        );
        await driver.wait(until.elementIsVisible(filaContrato), 5000);

        // 2. Localizar el botón "Enviar al correo"
        const btnEnviarCorreoContrato = await driver.wait(
          until.elementLocated(By.xpath(btnEnviarCorreoContratoXpath)),
          10000
        );
        await driver.wait(until.elementIsVisible(btnEnviarCorreoContrato), 5000);

        // 3. Hacer scroll y clic
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnEnviarCorreoContrato);
        await driver.sleep(500);

        await driver.executeScript("arguments[0].click();", btnEnviarCorreoContrato);
        await driver.sleep(4000); // Tiempo para que se procese el envío

        console.log("✅ Paso 20: Documento Contrato enviado al correo correctamente.");
      } catch (error) {
        throw new Error(`❌ Paso 20: Error al enviar documento Contrato al correo: ${error.message}`);
      }

      // === Paso 24: Seleccionar opción "Ver Documento (Contrato)" ===
      try {
        const opcionVerContratoXpath = '//*[@id="68937687eccd6c733ecd2641"]/div[4]';

        // 1. Esperar a que aparezca la opción de Ver Documento (Contrato)
        const opcionVerContrato = await driver.wait(
          until.elementLocated(By.xpath(opcionVerContratoXpath)),
          15000
        );
        await driver.wait(until.elementIsVisible(opcionVerContrato), 5000);

        // 2. Hacer scroll hasta la opción
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", opcionVerContrato);
        await driver.sleep(500);

        // 3. Dar clic en la opción
        await driver.executeScript("arguments[0].click();", opcionVerContrato);
        await driver.sleep(3000); // esperar a que cargue el modal del contrato

        console.log("✅ Paso 20: Opción 'Ver Documento (Contrato)' seleccionada correctamente.");
      } catch (error) {
        throw new Error(`❌ Paso 20: Error al seleccionar 'Ver Documento (Contrato)': ${error.message}`);
      }

      // === Paso 25: Cerrar modal "Ver Documento (Contrato)" ===
      try {
        const btnCerrarModalContratoXpath = '//*[@id="widget-dialog-contract-dialog"]/div/div/div[1]/button';

        // 1. Esperar a que aparezca el botón de cerrar
        const btnCerrarModalContrato = await driver.wait(
          until.elementLocated(By.xpath(btnCerrarModalContratoXpath)),
          15000
        );
        await driver.wait(until.elementIsVisible(btnCerrarModalContrato), 5000);

        // 2. Scroll hasta el botón por seguridad
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnCerrarModalContrato);
        await driver.sleep(300);

        // 3. Clic en el botón cerrar
        await driver.executeScript("arguments[0].click();", btnCerrarModalContrato);
        await driver.sleep(2000); // espera a que el modal se cierre

        console.log("✅ Paso 21: Modal 'Ver Documento (Contrato)' cerrado correctamente.");
      } catch (error) {
        throw new Error(`❌ Paso 21: Error al cerrar modal 'Ver Documento (Contrato)': ${error.message}`);
      }

      // === Paso 26: Seleccionar opción "Descargar Documento (Contrato)" ===
      try {
        const opcionDescargarContratoXpath = '//*[@id="68937687eccd6c733ecd2641"]/div[5]';

        // 1. Esperar a que aparezca la opción Descargar Documento (Contrato)
        const opcionDescargarContrato = await driver.wait(
          until.elementLocated(By.xpath(opcionDescargarContratoXpath)),
          15000
        );
        await driver.wait(until.elementIsVisible(opcionDescargarContrato), 5000);

        // 2. Hacer scroll hasta la opción
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", opcionDescargarContrato);
        await driver.sleep(500);

        // 3. Dar clic en la opción
        await driver.executeScript("arguments[0].click();", opcionDescargarContrato);
        await driver.sleep(4000); // espera extra porque puede tardar la descarga

        console.log("✅ Paso 21: Opción 'Descargar Documento (Contrato)' ejecutada correctamente.");
      } catch (error) {
        throw new Error(`❌ Paso 21: Error al seleccionar 'Descargar Documento (Contrato)': ${error.message}`);
      }


      // === Paso 23: Cerrar modal "Ver Documentos" ===
      try {
        const btnCerrarModalDocsXpath = '//*[@id="widget-dialog-open-dialog-602818-5522-CustomerManager"]/div/div/div[1]/button';

        // 1. Esperar a que aparezca el botón de cerrar
        const btnCerrarModalDocs = await driver.wait(
          until.elementLocated(By.xpath(btnCerrarModalDocsXpath)),
          15000
        );
        await driver.wait(until.elementIsVisible(btnCerrarModalDocs), 5000);

        // 2. Scroll hasta el botón (por seguridad)
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnCerrarModalDocs);
        await driver.sleep(300);

        // 3. Hacer clic en el botón cerrar
        await driver.executeScript("arguments[0].click();", btnCerrarModalDocs);
        await driver.sleep(2000); // esperar a que el modal desaparezca

        console.log("✅ Paso 23: Modal 'Ver Documentos' cerrado correctamente.");
      } catch (error) {
        throw new Error(`❌ Paso 23: Error al cerrar modal 'Ver Documentos': ${error.message}`);
      }

      // === Paso 24: Seleccionar opción "Detalle del proceso" ===
      try {
        const btnOpcionesXpath = '//*[@id="btn-options"]';
        const ulOpcionesXpath = '//*[@id="container-general-crud"]/div[4]/div[2]/div[1]/div/div/div/ul';
        const liDetalleProceso = '//*[@id="1084"]';
        const modalGenericoXpath = '//div[starts-with(@id,"widget-dialog") and contains(@id,"CustomerManager")]';

        // 1) Abrir el menú Opciones
        const btnOpciones = await driver.wait(
          until.elementLocated(By.xpath(btnOpcionesXpath)),
          20000
        );
        await driver.wait(until.elementIsVisible(btnOpciones), 6000);
        await driver.executeScript("arguments[0].click();", btnOpciones);

        // 2) Esperar el UL del menú y la opción "Detalle del proceso"
        const menuOpciones = await driver.wait(
          until.elementLocated(By.xpath(ulOpcionesXpath)),
          10000
        );
        await driver.wait(until.elementIsVisible(menuOpciones), 5000);

        // Buscar el LI dentro del UL para evitar colisiones con otros menús
        const opcionDetalle = await menuOpciones.findElement(By.xpath('.//li[@id="1084"]'));
        await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", opcionDetalle);
        await driver.sleep(250);
        await driver.executeScript("arguments[0].click();", opcionDetalle);

        // 3) (Opcional) Confirmar que se abrió un modal
        await driver.wait(
          until.elementLocated(By.xpath(modalGenericoXpath)),
          15000
        );
        await driver.sleep(500);

        console.log("✅ Opción 'Detalle del proceso' abierta correctamente.");
      } catch (error) {
        throw new Error(`❌ Error al abrir 'Detalle del proceso': ${error.message}`);
      }


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
