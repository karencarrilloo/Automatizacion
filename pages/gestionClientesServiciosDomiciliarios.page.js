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
      // === Manejo de ejecución de reconfiguración (éxito o fallo) ===
      let reconfigExitosa = false; // ✅ Declarar aquí para que exista en todo el bloque

      try {
        const btnSiguienteXpath = '//*[@id="widget-button-btn-next"]/div';
        const btnConfigWifiXpath = '//div[@id="widget-button-btn-config-wifi-data"] | //button[contains(.,"CONFIGURAR")]';
        const btnCerrarModalErrorXpath = '//div[starts-with(@id,"widget-dialog-open-dialog") and contains(@id,"CustomerManager")]//button';
        const btnOpcionesXpath = '//*[@id="btn-options"]';
        const opcionVerDispositivosXpath = '//*[@id="1088"]';
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

        // === Etapa 3: Intentar configurar WiFi (opcional) ===
        try {
          console.log("⏳ Esperando modal de configuración WiFi...");
          const btnConfigWifi = await driver.wait(
            until.elementLocated(By.xpath(btnConfigWifiXpath)),
            40000
          );
          await driver.wait(until.elementIsVisible(btnConfigWifi), 20000);
          await driver.executeScript("arguments[0].click();", btnConfigWifi);
          console.log("✅ Datos WiFi configurados correctamente.");
        } catch {
          console.log("⚠️ Botón 'Configurar WiFi' no apareció. Continuando con el flujo como éxito.");
        }

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

          // Fallback: abrir Opciones → Ver dispositivos
          const btnOpciones = await driver.wait(
            until.elementLocated(By.xpath(btnOpcionesXpath)),
            10000
          );
          await driver.wait(until.elementIsVisible(btnOpciones), 5000);
          await driver.executeScript("arguments[0].click();", btnOpciones);
          console.log("✅ Botón Opciones abierto.");

          const opcionVerDispositivos = await driver.wait(
            until.elementLocated(By.xpath(opcionVerDispositivosXpath)),
            10000
          );
          await driver.wait(until.elementIsVisible(opcionVerDispositivos), 5000);
          await driver.executeScript("arguments[0].click();", opcionVerDispositivos);
          console.log("✅ Opción 'Ver dispositivos' seleccionada como flujo alternativo.");
        } catch {
          console.log("❌ No apareció modal de error ni se pudo continuar con flujo alternativo.");
        }
        reconfigExitosa = false;

      }

      // ✅ Siempre asignamos el resultado al estado global
      this.reconfiguracionExitosa = reconfigExitosa;

      await driver.sleep(3000);


      // === Paso 12: Reutilizar datos WiFi ===
      try {
        const btnConfigurarXpath = '//*[@id="widget-button-btn-config-wifi-data"]/div';
        const progressXpath = '//*[@class="progress-bar"]'; // ⚠️ Ajusta al xpath exacto del progress WiFi

        // 1. Esperar que el botón "Configurar" sea visible
        const btnConfigurar = await driver.wait(
          until.elementLocated(By.xpath(btnConfigurarXpath)),
          30000 // puede tardar en aparecer
        );
        await driver.wait(until.elementIsVisible(btnConfigurar), 10000);

        // 2. Dar clic en "Configurar"
        await driver.executeScript("arguments[0].click();", btnConfigurar);
        console.log("✅ Reutilizar datos WiFi: botón 'Configurar' presionado correctamente.");

        // 3. Esperar a que aparezca el progress (inicio del proceso)
        console.log("⏳ Esperando inicio del proceso de configuración WiFi...");
        let progress;
        try {
          progress = await driver.wait(
            until.elementLocated(By.xpath(progressXpath)),
            20000 // espera a que aparezca el progress
          );
          await driver.wait(until.elementIsVisible(progress), 10000);
          console.log("✅ Progress de WiFi detectado, proceso en curso...");
        } catch {
          console.log("⚠️ No apareció progress de WiFi, continuando directamente...");
        }

        // 4. Esperar dinámicamente a que desaparezca el progress (fin del proceso)
        if (progress) {
          console.log("⏳ Esperando que finalice el progress...");
          await driver.wait(until.stalenessOf(progress), 300000); // hasta 5 minutos si es necesario
          console.log("✅ Proceso de configuración WiFi finalizado correctamente.");
        }

        // 5. Continuar con el siguiente paso: Opciones → Ver dispositivos
        const btnOpcionesXpath = '//*[@id="btn-options"]';
        const ulOpcionesXpath = '//*[@id="container-general-crud"]/div[4]/div[2]/div[1]/div/div/div/ul';
        const opcionVerDispositivosXpath = '//*[@id="1088"]';

        const btnOpciones = await driver.wait(
          until.elementLocated(By.xpath(btnOpcionesXpath)),
          20000
        );
        await driver.wait(until.elementIsVisible(btnOpciones), 5000);
        await driver.executeScript("arguments[0].click();", btnOpciones);
        console.log("✅ Botón Opciones presionado correctamente.");

        const ulOpciones = await driver.wait(
          until.elementLocated(By.xpath(ulOpcionesXpath)),
          10000
        );
        await driver.wait(until.elementIsVisible(ulOpciones), 5000);

        const opcionVerDispositivos = await driver.wait(
          until.elementLocated(By.xpath(opcionVerDispositivosXpath)),
          10000
        );
        await driver.wait(until.elementIsVisible(opcionVerDispositivos), 5000);
        await driver.executeScript("arguments[0].click();", opcionVerDispositivos);
        await driver.sleep(3000);
        console.log("✅ Opción 'Ver dispositivos' seleccionada correctamente.");

      } catch (err) {
        throw new Error(`❌ Error en paso Reutilizar datos WiFi y Ver dispositivos: ${err.message}`);
      }

      // paso  === Seleccionar nuevamente cliente RESIDENCIAL ACTIVO ===
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
        throw new Error(`❌ Error en CP_GESCLI_001 Paso 1: ${error.message}`);
      }



      // === Paso 13: Seleccionar botón Opciones ===
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

      // === Paso: Seleccionar opción "Ver dispositivos" ===
      try {
        const btnOpcionesXpath = '//*[@id="btn-options"]';
        const ulOpcionesXpath = '//*[@id="container-general-crud"]/div[4]/div[2]/div[1]/div/div/div/ul';
        const opcionVerDispositivosXpath = '//*[@id="1088"]';

        // 1. Esperar y hacer clic en el botón Opciones
        const btnOpciones = await driver.wait(
          until.elementLocated(By.xpath(btnOpcionesXpath)),
          10000
        );
        await driver.wait(until.elementIsVisible(btnOpciones), 5000);
        await driver.executeScript("arguments[0].click();", btnOpciones);
        console.log("✅ Botón Opciones presionado correctamente.");

        // 2. Esperar el UL del menú
        const ulOpciones = await driver.wait(
          until.elementLocated(By.xpath(ulOpcionesXpath)),
          10000
        );
        await driver.wait(until.elementIsVisible(ulOpciones), 5000);

        // 3. Seleccionar la opción "Ver dispositivos"
        const opcionVerDispositivos = await driver.wait(
          until.elementLocated(By.xpath(opcionVerDispositivosXpath)),
          10000
        );
        await driver.wait(until.elementIsVisible(opcionVerDispositivos), 5000);
        await driver.executeScript("arguments[0].click();", opcionVerDispositivos);
        console.log("✅ Opción 'Ver dispositivos' seleccionada correctamente.");

      } catch (error) {
        throw new Error(`❌ Error al seleccionar la opción 'Ver dispositivos': ${error.message}`);
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
