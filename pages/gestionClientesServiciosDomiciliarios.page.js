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
      await driver.sleep(10000);

      // === Paso x: Abrir el modal de filtros ===
      try {
        const padreXpath = '//*[@id="widget-button-btn-add-filter"]';
        const hijoXpath = './div';

        // 1. Esperar el div padre
        const divPadre = await driver.wait(
          until.elementLocated(By.xpath(padreXpath)),
          10000
        );
        await driver.wait(until.elementIsVisible(divPadre), 5000);

        // 2. Buscar el div hijo dentro del padre
        const divHijo = await divPadre.findElement(By.xpath(hijoXpath));

        // 3. Scroll y clic con JS en el hijo
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", divHijo);
        await driver.executeScript("arguments[0].click();", divHijo);
        await driver.sleep(5000);

        // 4. Esperar que aparezca el contenedor de filtros (qb_xxx)
        const modalFiltrosXpath = '//*[starts-with(@id,"qb_")]';

        const modalFiltros = await driver.wait(
          until.elementLocated(By.xpath(modalFiltrosXpath)),
          15000
        );
        await driver.wait(until.elementIsVisible(modalFiltros), 5000);

        console.log("✅ Modal de filtros abierto y visible correctamente (Paso 42).");
      } catch (error) {
        console.error("❌ Error al intentar abrir el modal de filtros (Paso 42):", error.message);
        throw error;
      }


      // === Paso x: Clic en el <select> para mostrar opciones del filtro ===
      try {
        // 1. Esperar el contenedor principal del grupo de reglas dinámico (qb_xxx_rule_0)
        const grupoFiltro = await driver.wait(
          until.elementLocated(By.xpath('//*[starts-with(@id,"qb_") and contains(@id,"_rule_0")]')),
          10000
        );

        // 2. Buscar dentro el contenedor específico del filtro (columna del select)
        const contenedorFiltro = await grupoFiltro.findElement(
          By.css('.rule-filter-container')
        );

        // 3. Localizar el <select> dentro del contenedor
        const selectFiltro = await contenedorFiltro.findElement(By.css('select'));

        // 4. Asegurar que sea visible e interactuable
        await driver.wait(until.elementIsVisible(selectFiltro), 5000);
        await driver.wait(until.elementIsEnabled(selectFiltro), 5000);

        // 5. Hacer scroll y clic para desplegar las opciones
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", selectFiltro);
        await driver.sleep(500);
        await selectFiltro.click();
        await driver.sleep(2000);

        console.log("✅ Paso 43: Select de filtros desplegado correctamente.");
      } catch (error) {
        throw new Error(`❌ Error en Paso 43: Clic en el <select> de filtros -> ${error.message}`);
      }

      // === Paso x: Seleccionar "ID_DEAL" en el select del filtro ===
      try {
        // 1. Esperar contenedor de grupo de reglas
        const contenedorGrupo = await driver.wait(
          until.elementLocated(By.css('.rules-group-container')),
          10000
        );

        // 2. Localizar el <select>
        const selectCampo = await contenedorGrupo.findElement(By.css('select'));

        // 3. Asegurar visibilidad
        await driver.wait(until.elementIsVisible(selectCampo), 5000);

        // 4. Hacer scroll y clic para abrir
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", selectCampo);
        await selectCampo.click();
        await driver.sleep(500);

        // 5. Escribir "ID_DEAL" para seleccionar esa opción
        await selectCampo.sendKeys("ID_DEAL");
        await driver.sleep(2000); // darle tiempo a que se renderice el cambio

        console.log("✅ Paso 44: Opción 'ID_DEAL' seleccionada correctamente.");
      } catch (error) {
        throw new Error(`❌ Error en Paso 44: Seleccionar "ID_DEAL": ${error.message}`);
      }


      // === Paso x: Diligenciar el campo de ID_DEAL con "28006512626" ===
      try {
        // 1. Esperar el textarea del filtro activo
        const textareaCampo = await driver.wait(
          until.elementLocated(By.css('textarea.form-control')),
          10000
        );

        // 2. Esperar a que sea visible
        await driver.wait(until.elementIsVisible(textareaCampo), 5000);

        // 3. Clic, limpiar y escribir el valor
        await textareaCampo.click();
        await driver.sleep(300);
        await textareaCampo.clear();
        await textareaCampo.sendKeys("28006512626");
        await driver.sleep(1500);

        console.log("✅ Paso 45: Campo ID_DEAL diligenciado con '28006512626'.");
      } catch (error) {
        throw new Error(`❌ Error en Paso 45: Diligenciar campo ID_DEAL: ${error.message}`);
      }

      // === Paso 46: Clic en el botón "Aplicar filtros" ===
      try {
        // Localizar el botón por XPath
        const botonAplicarFiltro = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-button-btn-apply-filter-element"]/div')),
          10000
        );

        // Esperar que esté visible y habilitado
        await driver.wait(until.elementIsVisible(botonAplicarFiltro), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonAplicarFiltro);
        await driver.sleep(500);

        // Clic en el botón
        await botonAplicarFiltro.click();
        await driver.sleep(3000); // esperar que cargue la tabla filtrada

        console.log("✅ Paso 46: Se hizo clic en 'Aplicar filtros'.");
      } catch (error) {
        throw new Error(`❌ Error en Paso 46: Clic en 'Aplicar filtros': ${error.message}`);
      }


      // === Paso 4: Seleccionar cliente por NOMBRE (editable) ===
      try {
        const TARGET_NAME = 'HAROLD AGUIRRE'; // <- Cambia este valor para seleccionar otro cliente
        const gridTbodyXpath = '//div[contains(@id,"grid-table-crud-grid") and contains(@id,"CustomerManager")]//table/tbody';

        // 1) Esperar tbody de la grilla
        const cuerpoTabla = await driver.wait(
          until.elementLocated(By.xpath(gridTbodyXpath)),
          15000
        );
        await driver.wait(until.elementIsVisible(cuerpoTabla), 5000);

        // 2) Obtener filas
        const filas = await cuerpoTabla.findElements(By.xpath('./tr'));
        if (filas.length === 0) {
          throw new Error('No se encontraron filas en la tabla.');
        }

        // 3) Recorrer filas y buscar el td con id="nameCustomer"
        let filaSeleccionada = null;
        for (const fila of filas) {
          try {
            const tdName = await fila.findElement(By.xpath('.//*[@id="nameCustomer"]'));
            const texto = (await tdName.getText()).trim();
            console.log(`📌 Nombre fila: "${texto}"`);

            // Comparación insensible a mayúsculas
            if (texto.toUpperCase() === TARGET_NAME.toUpperCase()) {
              filaSeleccionada = fila;
              break;
            }
          } catch (errRow) {
            // si esa fila no tiene la celda, la saltamos
            continue;
          }
        }

        if (!filaSeleccionada) {
          throw new Error(`No se encontró ningún cliente con nombre "${TARGET_NAME}".`);
        }

        // 4) Click seguro en la fila encontrada
        await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", filaSeleccionada);
        await driver.sleep(300);
        try {
          await filaSeleccionada.click();
        } catch (errClick) {
          // fallback: click mediante JS si el click normal falla
          await driver.executeScript("arguments[0].click();", filaSeleccionada);
        }
        await driver.sleep(800);

        console.log(`✅ Cliente "${TARGET_NAME}" seleccionado correctamente.`);
      } catch (error) {
        throw new Error(`❌ Error al seleccionar cliente por nombre: ${error.message}`);
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



      // === Paso 12: Manejo de ejecución de reconfiguración SIMULADA (espera de checks y clic en Siguiente) ===
      let reconfigExitosa = false;

      try {
        const contentProcessXpath = '//*[@id="widget-dialog-open-dialog-603238-5522-CustomerManager"]/div/div/div[2]/div/div/div/div';
        const checkOkXpath = `${contentProcessXpath}//span[contains(@class,"glyphicon-ok")]`;
        const btnSiguienteXpath = '//*[@id="widget-button-btn-next"]/div';
        const btnCerrarModalErrorXpath =
          '//div[starts-with(@id,"widget-dialog-open-dialog") and contains(@id,"CustomerManager")]//button';

        console.log("⏳ Reconfiguración simulada: esperando que aparezcan los checks verdes...");

        // === Etapa 1: esperar a que todos los checks estén en verde dentro del content-process ===
        await driver.wait(async () => {
          const checks = await driver.findElements(By.xpath(checkOkXpath));
          console.log(`📌 Checks encontrados en verde: ${checks.length}`);
          return checks.length >= 5; // Ajusta si el número de pasos varía
        }, 60000, "❌ Los checks no se completaron en el tiempo esperado (1 min).");

        console.log("✅ Todos los checks están en verde.");

        // === Etapa 2: localizar botón Siguiente ===
        const btnSiguiente = await driver.wait(
          until.elementLocated(By.xpath(btnSiguienteXpath)),
          30000
        );

        // === Etapa 3: esperar que sea visible y habilitado ===
        await driver.wait(until.elementIsVisible(btnSiguiente), 10000);
        await driver.wait(until.elementIsEnabled(btnSiguiente), 20000);

        // === Etapa 4: scroll y clic con JS ===
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnSiguiente);
        await driver.sleep(500);
        await driver.executeScript("arguments[0].click();", btnSiguiente);

        console.log("✅ Reconfiguración simulada finalizada: botón 'Siguiente' presionado.");

        reconfigExitosa = true;

      } catch (e) {
        console.log("ℹ️ No se detectó éxito, verificando modal de error...");
        try {
          const btnCerrarModalError = await driver.wait(
            until.elementLocated(By.xpath(btnCerrarModalErrorXpath)),
            10000
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

      // ✅ Guardamos el estado global
      this.reconfiguracionExitosa = reconfigExitosa;
      await driver.sleep(2000);






      // // === Paso 12: Manejo de ejecución de reconfiguración no simulado (éxito o fallo)  === 
      // let reconfigExitosa = false; // ✅ Declarar aquí para que exista en todo el bloque

      // try {
      //   const btnSiguienteXpath = '//*[@id="widget-button-btn-next"]/div';
      //   const btnCerrarModalErrorXpath = '//div[starts-with(@id,"widget-dialog-open-dialog") and contains(@id,"CustomerManager")]//button';
      //   const checkOkXpath = '//*[@id="widget-dialog-open-dialog-602818-5522-CustomerManager"]//span[contains(@class,"glyphicon-ok")]';

      //   console.log("⏳ Esperando que se complete la reconfiguración...");

      //   // === Etapa 1: Esperar a que aparezcan todos los checks ===
      //   await driver.wait(async () => {
      //     const checks = await driver.findElements(By.xpath(checkOkXpath));
      //     console.log(`📌 Checks encontrados: ${checks.length}`);
      //     return checks.length >= 5; // Ajusta según número esperado
      //   }, 600000, "❌ Los checks no se completaron en el tiempo esperado (10 min).");

      //   console.log("✅ Todos los pasos de reconfiguración completados.");

      //   // === Etapa 2: Presionar botón Siguiente ===
      //   const btnSiguiente = await driver.wait(
      //     until.elementLocated(By.xpath(btnSiguienteXpath)),
      //     120000
      //   );
      //   await driver.wait(until.elementIsVisible(btnSiguiente), 20000);
      //   await driver.wait(until.elementIsEnabled(btnSiguiente), 20000);
      //   await driver.executeScript("arguments[0].click();", btnSiguiente);
      //   console.log("✅ Reconfiguración finalizada: botón 'Siguiente' presionado.");

      //   reconfigExitosa = true;

      // } catch (e) {
      //   console.log("ℹ️ No se detectó éxito, verificando modal de error...");
      //   try {
      //     const btnCerrarModalError = await driver.wait(
      //       until.elementLocated(By.xpath(btnCerrarModalErrorXpath)),
      //       15000
      //     );
      //     await driver.wait(until.elementIsVisible(btnCerrarModalError), 5000);
      //     await driver.executeScript("arguments[0].click();", btnCerrarModalError);
      //     await driver.sleep(2000);
      //     console.log("⚠️ Reconfiguración fallida: modal cerrado correctamente.");
      //   } catch {
      //     console.log("❌ No apareció modal de error durante la reconfiguración.");
      //   }
      //   reconfigExitosa = false;
      // }

      // // ✅ Siempre asignamos el resultado al estado global
      // this.reconfiguracionExitosa = reconfigExitosa;

      // await driver.sleep(3000);


      // === Paso 13: Reutilizar datos WiFi (opcional en cliente simulado) ===
      try {
        const btnConfigurarXpath = '//*[@id="widget-button-btn-config-wifi-data"]/div';
        const progressXpath = '//*[@class="progress-bar"]'; // ⚠️ Ajusta si tu progress es distinto
        await driver.sleep(5000);

        console.log("⏳ Verificando si aparece opción de 'Reutilizar datos WiFi'...");

        let btnConfigurar;
        try {
          // Intentar localizar el botón "Configurar WiFi"
          btnConfigurar = await driver.wait(
            until.elementLocated(By.xpath(btnConfigurarXpath)),
            10000 // si no aparece en 10 seg, asumimos que no aplica
          );
        } catch {
          console.log("⚠️ Botón 'Configurar WiFi' no apareció (cliente simulado). Continuando flujo...");
          return; // Salir del paso sin error
        }

        // Si aparece, ejecutamos el flujo normal
        await driver.wait(until.elementIsVisible(btnConfigurar), 5000);
        await driver.executeScript("arguments[0].click();", btnConfigurar);
        console.log("✅ Botón 'Configurar WiFi' presionado.");

        // Esperar progress
        let progress;
        try {
          progress = await driver.wait(
            until.elementLocated(By.xpath(progressXpath)),
            10000
          );
          await driver.wait(until.elementIsVisible(progress), 5000);
          console.log("⏳ Progress de configuración WiFi detectado...");
          await driver.wait(until.stalenessOf(progress), 60000);
          console.log("✅ Configuración WiFi completada.");
        } catch {
          console.log("⚠️ No se detectó progress de WiFi, continuando...");
        }

      } catch (err) {
        throw new Error(`❌ Error en paso Reutilizar datos WiFi: ${err.message}`);
      }



      // === Paso 14: Seleccionar nuevamente cliente por NOMBRE (editable) ===
      try {
        const TARGET_NAME = 'HAROLD AGUIRRE'; // <- Cambia este valor para seleccionar otro cliente
        const gridTbodyXpath = '//div[contains(@id,"grid-table-crud-grid") and contains(@id,"CustomerManager")]//table/tbody';

        // 1) Esperar tbody de la grilla
        const cuerpoTabla = await driver.wait(
          until.elementLocated(By.xpath(gridTbodyXpath)),
          15000
        );
        await driver.wait(until.elementIsVisible(cuerpoTabla), 5000);

        // 2) Obtener filas
        const filas = await cuerpoTabla.findElements(By.xpath('./tr'));
        if (filas.length === 0) {
          throw new Error('No se encontraron filas en la tabla.');
        }

        // 3) Recorrer filas y buscar el td con id="nameCustomer"
        let filaSeleccionada = null;
        for (const fila of filas) {
          try {
            const tdName = await fila.findElement(By.xpath('.//*[@id="nameCustomer"]'));
            const texto = (await tdName.getText()).trim();
            console.log(`📌 Nombre fila: "${texto}"`);

            // Comparación insensible a mayúsculas
            if (texto.toUpperCase() === TARGET_NAME.toUpperCase()) {
              filaSeleccionada = fila;
              break;
            }
          } catch (errRow) {
            // si esa fila no tiene la celda, la saltamos
            continue;
          }
        }

        if (!filaSeleccionada) {
          throw new Error(`No se encontró ningún cliente con nombre "${TARGET_NAME}".`);
        }

        // 4) Click seguro en la fila encontrada
        await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", filaSeleccionada);
        await driver.sleep(300);
        try {
          await filaSeleccionada.click();
        } catch (errClick) {
          // fallback: click mediante JS si el click normal falla
          await driver.executeScript("arguments[0].click();", filaSeleccionada);
        }
        await driver.sleep(800);

        console.log(`✅ Cliente "${TARGET_NAME}" seleccionado correctamente.`);
      } catch (error) {
        throw new Error(`❌ Error al seleccionar cliente por nombre: ${error.message}`);
      }



      // === Paso 15: Seleccionar botón Opciones ===
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
        throw new Error(`❌ Paso 15: (clic en botón Opciones): ${error.message}`);
      }

      // === Paso 16: Seleccionar opción "Ver dispositivos" ===
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


      // === Paso 17: Cerrar el modal "Ver dispositivos" (dinámico y tolerante) ===
      try {
        const btnCerrarModalXpath =
          '//div[starts-with(@id,"widget-dialog-open-dialog-") and contains(@id,"CustomerManager")]/div/div/div[1]/button';

        // Esperar el botón de cerrar del modal dinámico
        const btnCerrarModal = await driver.wait(
          until.elementLocated(By.xpath(btnCerrarModalXpath)),
          15000
        );

        await driver.wait(until.elementIsVisible(btnCerrarModal), 5000);

        // Scroll al botón
        await driver.executeScript(
          "arguments[0].scrollIntoView({block: 'center'});",
          btnCerrarModal
        );
        await driver.sleep(300);

        // Clic con JS para evitar interceptados
        await driver.executeScript("arguments[0].click();", btnCerrarModal);
        console.log("✅ Botón 'Cerrar' del modal presionado.");

        // Intentar esperar a que deje de ser visible
        try {
          await driver.wait(async () => {
            const visible = await btnCerrarModal.isDisplayed().catch(() => false);
            return !visible;
          }, 8000);
          console.log("✅ Modal 'Ver dispositivos' cerrado correctamente.");
        } catch {
          console.log("⚠️ Modal no desapareció completamente, continuando de todas formas...");
        }

        await driver.sleep(1500); // margen de seguridad
      } catch (error) {
        throw new Error(`❌ Paso 16: Error al cerrar modal 'Ver dispositivos': ${error.message}`);
      }


      // === Paso 18: Seleccionar botón Opciones ===
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

      // === Paso 19: Seleccionar opción "Ver documentos" ===
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

      //  // === Paso 19: Enviar Acta de instalación al correo ===
      //   try {
      //     const filaActaXpath = '//*[@id="68b898e99877e54d10da4634"]'; // Fila Acta de Instalación
      //     //*[@id="68b898e99877e54d10da4634"]/div[3]
      //     const btnEnviarCorreoXpath = `${filaActaXpath}/div[3]`; // Botón dentro de la columna OPCIONES

      //     // 1. Esperar a que aparezca la fila del acta
      //     const filaActa = await driver.wait(
      //       until.elementLocated(By.xpath(filaActaXpath)),
      //       20000
      //     );
      //     await driver.wait(until.elementIsVisible(filaActa), 5000);

      //     // 2. Esperar y dar clic en el botón de enviar al correo
      //     const btnEnviarCorreo = await driver.wait(
      //       until.elementLocated(By.xpath(btnEnviarCorreoXpath)),
      //       10000
      //     );
      //     await driver.wait(until.elementIsVisible(btnEnviarCorreo), 5000);

      //     await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnEnviarCorreo);
      //     await driver.sleep(500);

      //     await driver.executeScript("arguments[0].click();", btnEnviarCorreo);
      //     await driver.sleep(3000); // espera para simular envío

      //     console.log("✅ Paso 17: Acta enviada al correo correctamente.");
      //   } catch (error) {
      //     throw new Error(`❌ Paso 17: Error al enviar el acta al correo: ${error.message}`);
      //   }


      //   // === Paso 20: Ver documento del Acta de instalación ===
      //   try {
      //     const filaActaXpath = '//*[@id="68b898e99877e54d10da4634"]'; // Fila Acta de Instalación
      //     const btnVerDocumentoXpath = `${filaActaXpath}/div[4]`; // Botón Ver documento

      //     // 1. Esperar a que la fila del acta esté presente
      //     const filaActa = await driver.wait(
      //       until.elementLocated(By.xpath(filaActaXpath)),
      //       20000
      //     );
      //     await driver.wait(until.elementIsVisible(filaActa), 5000);

      //     // 2. Localizar el botón "Ver documento"
      //     const btnVerDocumento = await driver.wait(
      //       until.elementLocated(By.xpath(btnVerDocumentoXpath)),
      //       10000
      //     );
      //     await driver.wait(until.elementIsVisible(btnVerDocumento), 5000);

      //     // 3. Hacer scroll y clic
      //     await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnVerDocumento);
      //     await driver.sleep(500);

      //     await driver.executeScript("arguments[0].click();", btnVerDocumento);
      //     await driver.sleep(5000); // Espera a que cargue el documento

      //     console.log("✅ Paso 18: Opción 'Ver documento' seleccionada correctamente.");
      //   } catch (error) {
      //     throw new Error(`❌ Paso 18: Error al seleccionar la opción 'Ver documento': ${error.message}`);
      //   }

      //   // === Paso 21: Cerrar modal de Ver Documento ===
      //   try {
      //     const btnCerrarModalDocXpath = '//*[@id="widget-dialog-contract-dialog"]/div/div/div[1]/button';

      //     // 1. Esperar a que aparezca el botón de cerrar
      //     const btnCerrarModalDoc = await driver.wait(
      //       until.elementLocated(By.xpath(btnCerrarModalDocXpath)),
      //       15000
      //     );
      //     await driver.wait(until.elementIsVisible(btnCerrarModalDoc), 5000);

      //     // 2. Hacer scroll hasta el botón
      //     await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnCerrarModalDoc);
      //     await driver.sleep(500);

      //     // 3. Dar clic en el botón de cerrar
      //     await driver.executeScript("arguments[0].click();", btnCerrarModalDoc);
      //     await driver.sleep(2000); // esperar a que el modal se cierre

      //     console.log("✅ Paso 19: Modal de Ver Documento cerrado correctamente.");
      //   } catch (error) {
      //     throw new Error(`❌ Paso 19: Error al cerrar modal de Ver Documento: ${error.message}`);
      //   }


      //   // === Paso 22: Descargar documento del Acta de instalación ===
      //   try {
      //     const filaActaXpath = '//*[@id="68b898e99877e54d10da4634"]'; // Fila Acta de Instalación
      //     const btnDescargarXpath = `${filaActaXpath}/div[5]`; // Botón Descargar documento

      //     // 1. Esperar a que la fila del acta esté presente
      //     const filaActa = await driver.wait(
      //       until.elementLocated(By.xpath(filaActaXpath)),
      //       20000
      //     );
      //     await driver.wait(until.elementIsVisible(filaActa), 5000);

      //     // 2. Localizar el botón "Descargar"
      //     const btnDescargar = await driver.wait(
      //       until.elementLocated(By.xpath(btnDescargarXpath)),
      //       10000
      //     );
      //     await driver.wait(until.elementIsVisible(btnDescargar), 5000);

      //     // 3. Hacer scroll y clic
      //     await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnDescargar);
      //     await driver.sleep(500);

      //     await driver.executeScript("arguments[0].click();", btnDescargar);
      //     await driver.sleep(5000); // Espera a que el navegador inicie la descarga

      //     console.log("✅ Paso 19: Documento descargado correctamente.");
      //   } catch (error) {
      //     throw new Error(`❌ Paso 19: Error al descargar el documento: ${error.message}`);
      //   }

      //   // === Paso 23: Enviar documento Contrato al correo ===
      //   try {
      //     const filaContratoXpath = '//*[@id="68b898e99877e54d10da4634"]'; // Fila Contrato
      //     const btnEnviarCorreoContratoXpath = `${filaContratoXpath}/div[3]`; // Botón Enviar al correo

      //     // 1. Esperar a que la fila del contrato esté presente
      //     const filaContrato = await driver.wait(
      //       until.elementLocated(By.xpath(filaContratoXpath)),
      //       20000
      //     );
      //     await driver.wait(until.elementIsVisible(filaContrato), 5000);

      //     // 2. Localizar el botón "Enviar al correo"
      //     const btnEnviarCorreoContrato = await driver.wait(
      //       until.elementLocated(By.xpath(btnEnviarCorreoContratoXpath)),
      //       10000
      //     );
      //     await driver.wait(until.elementIsVisible(btnEnviarCorreoContrato), 5000);

      //     // 3. Hacer scroll y clic
      //     await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnEnviarCorreoContrato);
      //     await driver.sleep(500);

      //     await driver.executeScript("arguments[0].click();", btnEnviarCorreoContrato);
      //     await driver.sleep(4000); // Tiempo para que se procese el envío

      //     console.log("✅ Paso 20: Documento Contrato enviado al correo correctamente.");
      //   } catch (error) {
      //     throw new Error(`❌ Paso 20: Error al enviar documento Contrato al correo: ${error.message}`);
      //   }

      //   // === Paso 24: Seleccionar opción "Ver Documento (Contrato)" ===
      //   try {
      //     const opcionVerContratoXpath = '//*[@id="68b898e99877e54d10da4634"]/div[4]';

      //     // 1. Esperar a que aparezca la opción de Ver Documento (Contrato)
      //     const opcionVerContrato = await driver.wait(
      //       until.elementLocated(By.xpath(opcionVerContratoXpath)),
      //       15000
      //     );
      //     await driver.wait(until.elementIsVisible(opcionVerContrato), 5000);

      //     // 2. Hacer scroll hasta la opción
      //     await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", opcionVerContrato);
      //     await driver.sleep(500);

      //     // 3. Dar clic en la opción
      //     await driver.executeScript("arguments[0].click();", opcionVerContrato);
      //     await driver.sleep(3000); // esperar a que cargue el modal del contrato

      //     console.log("✅ Paso 20: Opción 'Ver Documento (Contrato)' seleccionada correctamente.");
      //   } catch (error) {
      //     throw new Error(`❌ Paso 20: Error al seleccionar 'Ver Documento (Contrato)': ${error.message}`);
      //   }

      //   // === Paso 25: Cerrar modal "Ver Documento (Contrato)" ===
      //   try {
      //     const btnCerrarModalContratoXpath = '//*[@id="widget-dialog-contract-dialog"]/div/div/div[1]/button';

      //     // 1. Esperar a que aparezca el botón de cerrar
      //     const btnCerrarModalContrato = await driver.wait(
      //       until.elementLocated(By.xpath(btnCerrarModalContratoXpath)),
      //       15000
      //     );
      //     await driver.wait(until.elementIsVisible(btnCerrarModalContrato), 5000);

      //     // 2. Scroll hasta el botón por seguridad
      //     await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnCerrarModalContrato);
      //     await driver.sleep(300);

      //     // 3. Clic en el botón cerrar
      //     await driver.executeScript("arguments[0].click();", btnCerrarModalContrato);
      //     await driver.sleep(2000); // espera a que el modal se cierre

      //     console.log("✅ Paso 21: Modal 'Ver Documento (Contrato)' cerrado correctamente.");
      //   } catch (error) {
      //     throw new Error(`❌ Paso 21: Error al cerrar modal 'Ver Documento (Contrato)': ${error.message}`);
      //   }

      //   // === Paso 26: Seleccionar opción "Descargar Documento (Contrato)" ===
      //   try {
      //     const opcionDescargarContratoXpath = '//*[@id="68b898e99877e54d10da4634"]/div[5]';

      //     // 1. Esperar a que aparezca la opción Descargar Documento (Contrato)
      //     const opcionDescargarContrato = await driver.wait(
      //       until.elementLocated(By.xpath(opcionDescargarContratoXpath)),
      //       15000
      //     );
      //     await driver.wait(until.elementIsVisible(opcionDescargarContrato), 5000);

      //     // 2. Hacer scroll hasta la opción
      //     await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", opcionDescargarContrato);
      //     await driver.sleep(500);

      //     // 3. Dar clic en la opción
      //     await driver.executeScript("arguments[0].click();", opcionDescargarContrato);
      //     await driver.sleep(4000); // espera extra porque puede tardar la descarga

      //     console.log("✅ Paso 21: Opción 'Descargar Documento (Contrato)' ejecutada correctamente.");
      //   } catch (error) {
      //     throw new Error(`❌ Paso 21: Error al seleccionar 'Descargar Documento (Contrato)': ${error.message}`);
      //   }

      // === Paso 27: Cerrar el modal "Ver Documentos" ===
      try {
        const btnCerrarModalXpath =
          '//div[starts-with(@id,"widget-dialog-open-dialog-") and contains(@id,"CustomerManager")]//button[contains(@class,"close")]';

        // Esperar el botón dinámico de cerrar
        const btnCerrarModal = await driver.wait(
          until.elementLocated(By.xpath(btnCerrarModalXpath)),
          15000
        );

        await driver.wait(until.elementIsVisible(btnCerrarModal), 5000);

        // Scroll y clic
        await driver.executeScript(
          "arguments[0].scrollIntoView({block: 'center'});",
          btnCerrarModal
        );
        await driver.sleep(300);
        await driver.executeScript("arguments[0].click();", btnCerrarModal);
        console.log("✅ Botón 'Cerrar' del modal presionado.");

        // En lugar de esperar staleness, validamos si el botón desaparece o se oculta
        try {
          await driver.wait(async () => {
            const visible = await btnCerrarModal.isDisplayed().catch(() => false);
            return !visible;
          }, 8000);
          console.log("✅ Modal 'Ver Documentos' cerrado correctamente.");
        } catch {
          console.log("⚠️ Modal 'Ver Documentos' no desapareció completamente, pero se hizo clic en cerrar.");
        }

        await driver.sleep(1500);
      } catch (error) {
        throw new Error(`❌ Paso 27: Error al cerrar modal 'Ver Documentos': ${error.message}`);
      }


      // // === Paso 28: Seleccionar opción "Detalle del proceso" ===
      // try {
      //   const btnOpcionesXpath = '//*[@id="btn-options"]';
      //   const ulOpcionesXpath = '//*[@id="container-general-crud"]/div[4]/div[2]/div[1]/div/div/div/ul';
      //   const liDetalleProceso = '//*[@id="1084"]';
      //   const modalGenericoXpath = '//div[starts-with(@id,"widget-dialog") and contains(@id,"CustomerManager")]';

      //   // 1) Abrir el menú Opciones
      //   const btnOpciones = await driver.wait(
      //     until.elementLocated(By.xpath(btnOpcionesXpath)),
      //     20000
      //   );
      //   await driver.wait(until.elementIsVisible(btnOpciones), 6000);
      //   await driver.executeScript("arguments[0].click();", btnOpciones);
      //   await driver.sleep(500);

      //   // 2) Esperar el UL del menú y la opción "Detalle del proceso"
      //   const menuOpciones = await driver.wait(
      //     until.elementLocated(By.xpath(ulOpcionesXpath)),
      //     10000
      //   );
      //   await driver.wait(until.elementIsVisible(menuOpciones), 5000);

      //   const opcionDetalle = await menuOpciones.findElement(By.xpath('.//li[@id="1084"]'));
      //   await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", opcionDetalle);
      //   await driver.sleep(250);
      //   await driver.executeScript("arguments[0].click();", opcionDetalle);

      //   // 3) Esperar que el modal se abra después del progress dinámico
      //   const modalDetalle = await driver.wait(
      //     until.elementLocated(By.xpath(modalGenericoXpath)),
      //     20000
      //   );
      //   await driver.wait(until.elementIsVisible(modalDetalle), 15000);

      //   console.log("✅ Opción 'Detalle del proceso' abierta correctamente.");
      // } catch (error) {
      //   throw new Error(`❌ Error al abrir 'Detalle del proceso': ${error.message}`);
      // }

      // // === Paso 29: Cerrar modal "Detalle del proceso" ===
      // try {
      //   const btnCerrarModalXpath =
      //     '//div[starts-with(@id,"widget-dialog-open-dialog-") and contains(@id,"CustomerManager")]//button[contains(@class,"close")]';

      //   // Esperar el botón de cerrar dentro del modal
      //   const btnCerrarModal = await driver.wait(
      //     until.elementLocated(By.xpath(btnCerrarModalXpath)),
      //     15000
      //   );
      //   await driver.wait(until.elementIsVisible(btnCerrarModal), 6000);

      //   // Scroll y clic forzado
      //   await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", btnCerrarModal);
      //   await driver.sleep(300);
      //   await driver.executeScript("arguments[0].click();", btnCerrarModal);

      //   // Validar que el modal desapareció
      //   try {
      //     await driver.wait(async () => {
      //       const visible = await btnCerrarModal.isDisplayed().catch(() => false);
      //       return !visible;
      //     }, 8000);
      //     console.log("✅ Modal 'Detalle del proceso' cerrado correctamente.");
      //   } catch {
      //     console.log("⚠️ Modal 'Detalle del proceso' no desapareció del todo, pero se presionó cerrar.");
      //   }

      //   await driver.sleep(1000);
      // } catch (error) {
      //   throw new Error(`❌ Paso 29: Error al cerrar modal 'Detalle del proceso': ${error.message}`);
      // }


      // === Paso 30: Seleccionar botón Opciones ===
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

        console.log("✅ Paso 30: Botón Opciones seleccionado correctamente.");
      } catch (error) {
        throw new Error(`❌ Paso 30: (clic en botón Opciones): ${error.message}`);
      }

      // === Paso 31: Seleccionar opción "Suspensión" ===
      try {
        const ulOpcionesXpath = '//*[@id="container-general-crud"]/div[4]/div[2]/div[1]/div/div/div/ul';
        const opcionSuspensionXpath = '//*[@id="1083"]';
        const modalSuspensionXpath = '//div[starts-with(@id,"widget-dialog-open-dialog") and contains(@id,"CustomerManager")]';

        // 1. Esperar que el menú UL esté visible
        const menuOpciones = await driver.wait(
          until.elementLocated(By.xpath(ulOpcionesXpath)),
          10000
        );
        await driver.wait(until.elementIsVisible(menuOpciones), 5000);

        // 2. Seleccionar LI de suspensión
        const opcionSuspension = await driver.wait(
          until.elementLocated(By.xpath(opcionSuspensionXpath)),
          10000
        );
        await driver.wait(until.elementIsVisible(opcionSuspension), 5000);

        await driver.actions({ bridge: true }).move({ origin: opcionSuspension }).click().perform();
        console.log("✅ Clic real en opción 'Suspensión'.");

        // 3. Esperar modal de suspensión
        await driver.sleep(3000);
        const modalSuspension = await driver.wait(
          until.elementLocated(By.xpath(modalSuspensionXpath)),
          15000
        );
        await driver.wait(until.elementIsVisible(modalSuspension), 8000);

        console.log("✅ Modal 'Suspensión' abierto correctamente.");
      } catch (error) {
        throw new Error(`❌ Paso 31: (clic en opción Suspensión): ${error.message}`);
      }



      // === Paso 32: Seleccionar "SUSPENSION POR NO PAGO" en Motivo de Suspensión ===
      try {
        const selectXpath = '//*[@id="input-select-suspension-type-select"]';

        // Localizamos el <select> real (aunque esté oculto)
        const selectElement = await driver.wait(
          until.elementLocated(By.xpath(selectXpath)),
          10000
        );

        // Usamos JavaScript para asignar directamente el valor de la opción
        await driver.executeScript(`
          const select = arguments[0];
          select.value = select.options[1].value; // Opción index 1 = "SUSPENSION POR NO PAGO"
          select.dispatchEvent(new Event('change', { bubbles: true }));
        `, selectElement);

        console.log("✅ Motivo de suspensión seleccionado: 'SUSPENSION POR NO PAGO'");
        await driver.sleep(2000);
      } catch (error) {
        throw new Error(`❌ Paso X: No se pudo seleccionar motivo de suspensión: ${error.message}`);
      }

      // === Paso 33: Diligenciar comentario ===
      try {
        const comentarioXpath = '//*[@id="textfield-input-data-comment"]';

        // Localizar input de comentario
        const inputComentario = await driver.wait(
          until.elementLocated(By.xpath(comentarioXpath)),
          10000
        );

        await driver.wait(until.elementIsVisible(inputComentario), 5000);

        // Limpiar por si hay texto previo y escribir
        await inputComentario.clear();
        await inputComentario.sendKeys("test automatizacion");

        console.log("✅ Comentario diligenciado correctamente: 'test automatizacion'");
        await driver.sleep(1000);
      } catch (error) {
        throw new Error(`❌ Paso X: No se pudo diligenciar el comentario: ${error.message}`);
      }

      // === Paso 34: Cancelar suspensión correctamente dentro del modal ===
      try {
        const modalXpath = '//*[@id="widget-dialog-open-dialog-new-5522-CustomerManager"]/div/div';
        const btnCancelarXpath = './/*[@id="widget-button-cancel-confirm-selected"]/div';
        const progressXpath = '//*[@class="progress-bar"]';

        // 1. Esperar modal visible
        const modal = await driver.wait(
          until.elementLocated(By.xpath(modalXpath)),
          10000
        );
        await driver.wait(until.elementIsVisible(modal), 5000);

        // 2. Buscar botón "Cancelar" dentro del modal
        const btnCancelar = await modal.findElement(By.xpath(btnCancelarXpath));
        await driver.wait(until.elementIsVisible(btnCancelar), 5000);

        // 3. Forzar clic con JS
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnCancelar);
        await driver.sleep(300);
        await driver.executeScript("arguments[0].click();", btnCancelar);
        console.log("✅ Botón 'Cancelar' presionado dentro del modal.");

        // 4. Esperar si aparece un progress
        try {
          const progress = await driver.wait(
            until.elementLocated(By.xpath(progressXpath)),
            5000
          );
          await driver.wait(until.stalenessOf(progress), 20000); // esperar que desaparezca
          console.log("⏳ Progress detectado y completado.");
        } catch {
          console.log("⚠️ No apareció progress después de cancelar.");
        }

        // 5. Esperar a que modal se oculte (no necesariamente desaparece del DOM)
        await driver.wait(until.elementIsNotVisible(modal), 20000);
        console.log("✅ Paso X: Cancelar suspensión ejecutado correctamente, modal oculto.");
      } catch (error) {
        throw new Error(`❌ Paso X: No se pudo cancelar la suspensión correctamente: ${error.message}`);
      }


      // === Paso 35: Seleccionar botón Opciones ===
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

      // === Paso 36: Seleccionar opción "Reconexión" ===
      try {
        // 1. Esperar que el menú UL de opciones esté visible
        const menuOpciones = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="container-general-crud"]/div[4]/div[2]/div[1]/div/div/div/ul')),
          10000
        );
        await driver.wait(until.elementIsVisible(menuOpciones), 5000);

        // 2. Buscar el LI con id=1081 (Reconexión)
        const opcionReconexion = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="1081"]')),
          10000
        );

        // 3. Asegurar visibilidad y hacer clic
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", opcionReconexion);
        await driver.sleep(300);
        await driver.executeScript("arguments[0].click();", opcionReconexion);
        await driver.sleep(3000); // esperar carga del modal

        console.log("✅ Paso X: Opción 'Reconexión' seleccionada correctamente.");
      } catch (error) {
        throw new Error(`❌ Paso X: Error al seleccionar la opción 'Reconexión': ${error.message}`);
      }

      // === Paso 37: Diligenciar comentario en Reconexión ===
      try {
        const comentarioXpath = '//*[@id="textfield-input-data-comment"]';

        // 1. Esperar a que el campo comentario esté disponible
        const inputComentario = await driver.wait(
          until.elementLocated(By.xpath(comentarioXpath)),
          10000
        );
        await driver.wait(until.elementIsVisible(inputComentario), 5000);

        // 2. Limpiar por si hay texto previo
        await inputComentario.clear();

        // 3. Escribir el comentario
        await inputComentario.sendKeys("test automatizacion");
        console.log("✅ Paso X: Comentario 'test automatizacion' diligenciado correctamente en Reconexión.");

        await driver.sleep(2000); // pequeña espera para asegurar persistencia

      } catch (error) {
        throw new Error(`❌ Paso X: No se pudo diligenciar el comentario en Reconexión: ${error.message}`);
      }

      // === Paso 38: Cancelar Reconexión ===
      try {
        const modalXpath = '//*[@id="widget-dialog-open-dialog-new-5522-CustomerManager"]/div/div';
        const btnCancelarXpath = './/*[@id="widget-button-cancel-confirm-selected"]/div';
        const progressXpath = '//*[@class="progress-bar"]';

        // 1. Esperar a que el modal esté presente
        const modal = await driver.wait(
          until.elementLocated(By.xpath(modalXpath)),
          10000
        );
        await driver.wait(until.elementIsVisible(modal), 5000);

        // 2. Buscar el botón "Cancelar" dentro del modal
        const btnCancelar = await modal.findElement(By.xpath(btnCancelarXpath));
        await driver.wait(until.elementIsVisible(btnCancelar), 5000);

        // 3. Forzar scroll y clic en "Cancelar"
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnCancelar);
        await driver.sleep(300);
        await driver.executeScript("arguments[0].click();", btnCancelar);
        console.log("✅ Paso X: Botón 'Cancelar' presionado en modal de Reconexión.");

        // 4. Verificar si aparece un progress
        try {
          const progress = await driver.wait(
            until.elementLocated(By.xpath(progressXpath)),
            5000
          );
          await driver.wait(until.stalenessOf(progress), 20000);
          console.log("⏳ Progress de Reconexión detectado y finalizado.");
        } catch {
          console.log("ℹ️ No apareció progress después de cancelar Reconexión.");
        }

        // 5. Validar que el modal se oculte
        await driver.wait(until.elementIsNotVisible(modal), 20000);
        console.log("✅ Paso X: Modal de Reconexión cerrado correctamente.");
      } catch (error) {
        throw new Error(`❌ Paso X: No se pudo cancelar la Reconexión: ${error.message}`);
      }


      // === Paso 39: Seleccionar opción "Cambio de plan" ===
      try {
        const btnOpcionesXpath = '//*[@id="btn-options"]';
        const menuOpcionesXpath = '//*[@id="container-general-crud"]/div[4]/div[2]/div[1]/div/div/div/ul';
        const opcionCambioPlanXpath = '//*[@id="1082"]';

        // 1. Clic en botón Opciones
        const btnOpciones = await driver.wait(
          until.elementLocated(By.xpath(btnOpcionesXpath)),
          10000
        );
        await driver.wait(until.elementIsVisible(btnOpciones), 5000);
        await driver.executeScript("arguments[0].click();", btnOpciones);
        console.log("✅ Botón 'Opciones' presionado correctamente.");

        // 2. Esperar menú desplegado
        const menuOpciones = await driver.wait(
          until.elementLocated(By.xpath(menuOpcionesXpath)),
          10000
        );
        await driver.wait(until.elementIsVisible(menuOpciones), 5000);

        // 3. Seleccionar "Cambio de plan"
        const opcionCambioPlan = await driver.wait(
          until.elementLocated(By.xpath(opcionCambioPlanXpath)),
          10000
        );
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", opcionCambioPlan);
        await driver.sleep(300);
        await driver.executeScript("arguments[0].click();", opcionCambioPlan);
        await driver.sleep(3000);

        console.log("✅ Paso X: Opción 'Cambio de plan' seleccionada correctamente.");
      } catch (error) {
        throw new Error(`❌ Paso X: Error al seleccionar la opción 'Cambio de plan': ${error.message}`);
      }


      // === Paso 40: Seleccionar botón "Nuevo plan comercial" en modal de Cambio de plan ===
      try {
        const btnNuevoPlanXpath = '//*[@id="widget-pickview-pick-data-change-plan"]/div[1]/span[2]/button';

        // 1. Esperar a que el botón esté presente
        const btnNuevoPlan = await driver.wait(
          until.elementLocated(By.xpath(btnNuevoPlanXpath)),
          10000
        );
        await driver.wait(until.elementIsVisible(btnNuevoPlan), 5000);

        // 2. Scroll y clic en el botón
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnNuevoPlan);
        await driver.sleep(300);
        await driver.executeScript("arguments[0].click();", btnNuevoPlan);
        console.log("✅ Paso X: Botón 'Nuevo plan comercial' presionado correctamente.");

        await driver.sleep(2000); // pequeña espera para carga de datos

      } catch (error) {
        throw new Error(`❌ Paso X: No se pudo presionar el botón 'Nuevo plan comercial': ${error.message}`);
      }


      // === Paso 41: Seleccionar el plan "PLAN 600 MEGAS FC 2025 V" ===
      try {
        const tbodyXpath = '//*[@id="widget-dialog-pickview-pick-data-change-plan"]/div/div/div[2]/div/div[1]/div[2]/div[1]/div[2]/div[2]/div[2]/table/tbody';
        const nombrePlan = "PLAN 600 MEGAS FC 2025 V"; // 🔹 Cambia aquí el plan cuando quieras probar otro

        // 1. Esperar el tbody
        const tbodyPlanes = await driver.wait(
          until.elementLocated(By.xpath(tbodyXpath)),
          15000
        );
        await driver.wait(until.elementIsVisible(tbodyPlanes), 5000);

        // 2. Buscar todas las filas dentro del tbody
        const filas = await tbodyPlanes.findElements(By.xpath("./tr"));
        if (filas.length === 0) {
          throw new Error("❌ No se encontraron planes comerciales en la tabla.");
        }

        let planEncontrado = false;
        for (const fila of filas) {
          const textoFila = (await fila.getText()).trim();
          console.log(`📌 Fila encontrada: ${textoFila}`);

          // 3. Verificar si la fila corresponde al plan deseado
          if (textoFila.includes(nombrePlan)) {
            const btnMas = await fila.findElement(By.xpath("./td[4]/div/button"));
            await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnMas);
            await driver.sleep(300);
            await driver.executeScript("arguments[0].click();", btnMas);
            await driver.sleep(3000); // pequeña espera para carga de datos

            console.log(`✅ Plan '${nombrePlan}' agregado correctamente.`);
            planEncontrado = true;
            break;
          }
        }

        if (!planEncontrado) {
          throw new Error(`❌ No se encontró el plan '${nombrePlan}' en la tabla.`);
        }

      } catch (error) {
        throw new Error(`❌ Paso X: No se pudo agregar el plan: ${error.message}`);
      }

      // === Paso 42: Confirmar selección del plan (botón "Seleccionar") ===
      try {
        const btnSeleccionarXpath = '//*[@id="widget-button-select-pick-data-change-plan"]/div';

        // Esperar que el botón esté presente y visible
        const btnSeleccionar = await driver.wait(
          until.elementLocated(By.xpath(btnSeleccionarXpath)),
          15000
        );
        await driver.wait(until.elementIsVisible(btnSeleccionar), 5000);
        await driver.wait(until.elementIsEnabled(btnSeleccionar), 5000);

        // Clic en el botón Seleccionar
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnSeleccionar);
        await driver.sleep(300);
        await driver.executeScript("arguments[0].click();", btnSeleccionar);

        console.log("✅ Botón 'Seleccionar' presionado correctamente.");

        // Espera breve para que se procese la acción
        await driver.sleep(3000);

      } catch (error) {
        throw new Error(`❌ Paso X: No se pudo presionar el botón 'Seleccionar': ${error.message}`);
      }

      // === Paso 43: Diligenciar número PQ con un número aleatorio de 10 dígitos ===
      try {
        const inputNumeroPqXpath = '//*[@id="textfield-input-data-number-pq"]';

        // Esperar a que el input esté presente y visible
        const inputNumeroPq = await driver.wait(
          until.elementLocated(By.xpath(inputNumeroPqXpath)),
          15000
        );
        await driver.wait(until.elementIsVisible(inputNumeroPq), 5000);

        // Generar número aleatorio de 10 dígitos
        const numeroAleatorio = Math.floor(Math.random() * 9000000000) + 1000000000; // siempre 10 dígitos

        // Diligenciar número en el campo
        await inputNumeroPq.clear();
        await inputNumeroPq.sendKeys(numeroAleatorio.toString());

        console.log(`✅ Número PQ diligenciado correctamente: ${numeroAleatorio}`);

        await driver.sleep(2000);

      } catch (error) {
        throw new Error(`❌ Paso X: No se pudo diligenciar el número PQ: ${error.message}`);
      }

      // === Paso 44: Diligenciar comentario ===
      try {
        const inputComentarioXpath = '//*[@id="textfield-input-data-comment"]';

        // Esperar a que el input esté presente y visible
        const inputComentario = await driver.wait(
          until.elementLocated(By.xpath(inputComentarioXpath)),
          15000
        );
        await driver.wait(until.elementIsVisible(inputComentario), 5000);

        // Limpiar y escribir el comentario
        await inputComentario.clear();
        await inputComentario.sendKeys("test automatizacion");

        console.log("✅ Comentario diligenciado correctamente: 'test automatizacion'");

        await driver.sleep(2000);

      } catch (error) {
        throw new Error(`❌ Paso X: No se pudo diligenciar el comentario: ${error.message}`);
      }

      // === Paso 45: Cancelar cambio de plan ===
      try {
        // Localizar dinámicamente el modal de CustomerManager
        const modalXpath = '//div[starts-with(@id,"widget-dialog-open-dialog") and contains(@id,"CustomerManager")]';
        const modal = await driver.wait(
          until.elementLocated(By.xpath(modalXpath)),
          15000
        );

        // Buscar el botón Cancelar dentro del modal
        const btnCancelarXpath = './/*[@id="widget-button-cancel-confirm-selected"]/div';
        const btnCancelar = await modal.findElement(By.xpath(btnCancelarXpath));

        await driver.wait(until.elementIsVisible(btnCancelar), 10000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnCancelar);
        await driver.sleep(300);

        // Dar clic en Cancelar
        await driver.executeScript("arguments[0].click();", btnCancelar);
        console.log("✅ Botón 'Cancelar' en cambio de plan presionado correctamente.");

        // Validar si el botón desapareció o quedó oculto
        try {
          await driver.wait(async () => {
            const visible = await btnCancelar.isDisplayed().catch(() => false);
            return !visible;
          }, 8000);
          console.log("✅ Modal de cambio de plan cerrado correctamente.");
        } catch {
          console.log("⚠️ El modal de cambio de plan no desapareció completamente, pero se hizo clic en Cancelar.");
        }

        await driver.sleep(1500);
      } catch (error) {
        throw new Error(`❌ Paso 45: No se pudo cancelar el cambio de plan: ${error.message}`);
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
