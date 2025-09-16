import { By, Key, until } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class VisorInformacionTecnicaRedPage {
  constructor(driver) {
    this.driver = driver;
  }

  async ejecutarVisorInformacionTecnicaRed() {
    const driver = this.driver;
    try {
      //  Paso 1: Clic en módulo eCenter ===
      const eCenterBtn = await driver.wait(
        until.elementLocated(By.xpath("//div[@id='118' and contains(@class, 'item-module')]")),
        10000
      );
      await driver.executeScript("arguments[0].click();", eCenterBtn);
      await driver.sleep(1000);

      //  Paso 2: Scroll en el contenedor de aplicaciones ===
      const scrollContainer = await driver.wait(
        until.elementLocated(By.css('.container-applications')),
        10000
      );
      await driver.executeScript(
        "arguments[0].scrollTop = arguments[0].scrollHeight;",
        scrollContainer
      );
      await driver.sleep(1000);

      // Paso 3: Clic en "Visor de información técnica de red" ===
      try {
        const visorInfoTecnica = await driver.wait(
          until.elementLocated(
            By.xpath('//div[@class="application-item" and @title="Visor de información técnica de red" and @data-name="Active_ports"]')
          ),
          10000
        );

        await driver.wait(until.elementIsVisible(visorInfoTecnica), 5000);
        await driver.wait(until.elementIsEnabled(visorInfoTecnica), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", visorInfoTecnica);
        await driver.sleep(500);
        await visorInfoTecnica.click();
        await driver.sleep(2000);

        console.log("✅ Paso 3 Clic en 'Visor de información técnica de red' realizado correctamente.");
      } catch (error) {
        throw new Error(`❌ Error en Paso 3 (clic en visor de información técnica de red): ${error.message}`);
      }

      // ===  Paso 4: Clic en el botón "Mostrar filtro" ===
      try {
        // Esperar a que aparezca el botón por ID directamente
        const botonMostrarFiltro = await driver.wait(
          until.elementLocated(By.id("widget-button-btn-show-filter")),
          10000
        );

        // Esperar a que sea visible y habilitado
        await driver.wait(until.elementIsVisible(botonMostrarFiltro), 5000);
        await driver.wait(until.elementIsEnabled(botonMostrarFiltro), 5000);

        // Scroll y clic
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonMostrarFiltro);
        await driver.sleep(500);
        await botonMostrarFiltro.click();
        await driver.sleep(1000);

        console.log("✅ Paso 4:: Clic en el botón Mostrar filtro.");
      } catch (error) {
        throw new Error(`❌ Error en Paso 4: Clic en el botón "Mostrar filtro": ${error.message}`);
      }


      // Paso 5: Clic en el <select> para mostrar opciones del filtro ===
      try {
        // Esperar el contenedor principal del grupo de reglas
        const grupoFiltro = await driver.wait(
          until.elementLocated(By.css('.rules-group-container')),
          10000
        );

        // Esperar el contenedor específico del filtro (columna select)
        const contenedorFiltro = await grupoFiltro.findElement(
          By.css('.rule-filter-container')
        );

        // Localizar el <select> dentro del contenedor
        const selectFiltro = await contenedorFiltro.findElement(By.css('select'));

        // Asegurar que sea visible e interactuable
        await driver.wait(until.elementIsVisible(selectFiltro), 5000);
        await driver.wait(until.elementIsEnabled(selectFiltro), 5000);

        // Scroll y clic sobre el select
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", selectFiltro);
        await driver.sleep(500);
        await selectFiltro.click();
        await driver.sleep(2000);

        //console.log("✅ Paso 5: Select del filtro desplegado correctamente.");
      } catch (error) {
        throw new Error(`❌ Error en Paso 5: Clic en el <select> para mostrar opciones del filtro: ${error.message}`);
      }


      // === Paso 6: Seleccionar "CENTRO POBLADO" correctamente ===
      try {
        // Esperar contenedor de grupo de reglas
        const contenedorGrupo = await driver.wait(
          until.elementLocated(By.css('.rules-group-container')),
          10000
        );

        // Localizar el select de campos (dropdown)
        const selectCampo = await contenedorGrupo.findElement(By.css('select'));

        // Clic manual para abrir el desplegable
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", selectCampo);
        await selectCampo.click();
        await driver.sleep(500); // Breve espera por apertura

        // Simular escritura de opción "CENTRO POBLADO"
        await selectCampo.sendKeys("CENTRO POBLADO");
        await driver.sleep(3000);

        await driver.sleep(2000); // Breve espera por render

        //console.log("✅ Opción 'CENTRO POBLADO' seleccionada correctamente.");
      } catch (error) {
        throw new Error(`❌ Error en Paso 6: Seleccionar "CENTRO POBLADO" correctamente: ${error.message}`);
      }

      //  Paso 7: Escribir “PALMIRA” en el campo de texto asociado.
      try {

        const textareaCampo = await driver.wait(
          until.elementLocated(By.css('textarea.form-control')),
          10000
        );

        await driver.wait(until.elementIsVisible(textareaCampo), 5000);

        // Clic, limpiar y escribir "PALMIRA"
        await textareaCampo.click();
        await driver.sleep(300);
        await textareaCampo.clear();
        await textareaCampo.sendKeys("PALMIRA");
        await driver.sleep(1500);

        //console.log("✅ Paso 7 completado: Se diligenció el campo con 'PALMIRA'.");

      } catch (error) {
        throw new Error(`❌ Error en CP_VISORTECRED_004 Paso 1: Escribir “PALMIRA” en el campo de texto asociado: ${error.message}`);
      }

      try {
       
        // Paso 8: Clic en “Aplicar filtros”.

        // Localizar el botón por XPath
        const botonAplicarFiltro = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-button-btn-set-filter"]/div')),
          10000
        );

        // Esperar a que esté visible y habilitado
        await driver.wait(until.elementIsVisible(botonAplicarFiltro), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonAplicarFiltro);
        await driver.sleep(500);

        // Hacer clic
        await botonAplicarFiltro.click();
        await driver.sleep(3000); // esperar que cargue la nueva tabla filtrada

        // console.log("✅ Paso 8 completado: Se hizo clic en 'Aplicar filtro'.");

      } catch (error) {
        throw new Error(`❌ Error en Paso 8: Clic en “Aplicar filtros”: ${error.message}`);
      }
      
      // === Paso 9: Clic en el botón Mostrar filtro. ===
      try {
        // Esperar a que aparezca el botón por ID directamente
        const botonMostrarFiltro = await driver.wait(
          until.elementLocated(By.id("widget-button-btn-show-filter")),
          10000
        );

        // Esperar a que sea visible y habilitado
        await driver.wait(until.elementIsVisible(botonMostrarFiltro), 5000);
        await driver.wait(until.elementIsEnabled(botonMostrarFiltro), 5000);

        // Scroll y clic
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonMostrarFiltro);
        await driver.sleep(500);
        await botonMostrarFiltro.click();
        await driver.sleep(1000);

        //console.log("✅ Paso 9: Botón 'Mostrar filtro' clickeado correctamente.");
      } catch (error) {
        throw new Error(`❌ Paso 9: Clic en el botón Mostrar filtro: ${error.message}`);
      }

      try {
        // Paso 10: Clic en el botón + Add rule.
        const botonAddRule = await driver.wait(
          until.elementLocated(By.xpath('//button[@data-add="rule"]')),
          10000
        );

        // Esperar a que el botón sea visible e interactuable
        await driver.wait(until.elementIsVisible(botonAddRule), 5000);
        await driver.wait(until.elementIsEnabled(botonAddRule), 5000);

        // Scroll al botón y clic
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonAddRule);
        await driver.sleep(500);
        await botonAddRule.click();
        await driver.sleep(2500);

        // console.log("✅ Paso 10 completado: Se hizo clic en '+ Add rule'.");
      } catch (error) {
        throw new Error(`❌ Error Paso 10: Clic en el botón + Add rule: ${error.message}`);
      }
      
      // === Paso 11: Clic en select del segundo filtro. ===
      try {
        // Esperar el contenedor principal del grupo de reglas
        const grupoFiltro = await driver.wait(
          until.elementLocated(By.css('.rules-group-container')),
          10000
        );

        // Esperar el contenedor específico del filtro (columna select)
        const contenedorFiltro = await grupoFiltro.findElement(
          By.css('.rule-filter-container')
        );

        // Localizar el <select> dentro del contenedor
        const selectFiltro = await contenedorFiltro.findElement(By.css('select'));

        // Asegurar que sea visible e interactuable
        await driver.wait(until.elementIsVisible(selectFiltro), 5000);
        await driver.wait(until.elementIsEnabled(selectFiltro), 5000);

        // Scroll y clic sobre el select
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", selectFiltro);
        await driver.sleep(500);
        await selectFiltro.click();
        await driver.sleep(2000);

        //console.log("✅ Paso 5: Select del filtro desplegado correctamente.");
      } catch (error) {
        throw new Error(`❌ Error en Paso 11:Clic en select del segundo filtro: ${error.message}`);
      }

      // === Paso 12: Seleccionar “NAP SERIAL CELSIA”. ===
      try {
        // Esperar todos los contenedores de filtros (rules)
        const contenedoresFiltro = await driver.wait(
          until.elementsLocated(By.css('.rule-container')),
          10000
        );

        if (contenedoresFiltro.length < 2) {
          throw new Error("No se encontró el segundo filtro para aplicar 'NAP SERIAL CELSIA'.");
        }

        // Obtener el segundo contenedor
        const segundoFiltro = contenedoresFiltro[1];

        // Localizar el select de campo dentro del segundo filtro
        const selectCampo = await segundoFiltro.findElement(By.css('.rule-filter-container select'));

        await driver.wait(until.elementIsVisible(selectCampo), 5000);
        await driver.wait(until.elementIsEnabled(selectCampo), 5000);

        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", selectCampo);
        await selectCampo.click();
        await driver.sleep(300);

        // Seleccionar usando las opciones del DOM (más fiable que sendKeys)
        const opciones = await selectCampo.findElements(By.css('option'));
        let opcionEncontrada = false;
        for (let opcion of opciones) {
          const texto = await opcion.getText();
          if (texto.trim().toUpperCase() === "NAP SERIAL CELSIA") {
            await opcion.click();
            opcionEncontrada = true;
            break;
          }
        }

        if (!opcionEncontrada) {
          throw new Error("Opción 'NAP SERIAL CELSIA' no encontrada en el segundo filtro.");
        }

        // Esperar a que se renderice el textarea como efecto del cambio
        await driver.wait(
          until.elementLocated(By.css('.rule-value-container textarea')),
          5000
        );

        await driver.sleep(1000); // Espera adicional para asegurar render completo

        //console.log("✅ Paso 12: 'NAP SERIAL CELSIA' seleccionado y textarea visible.");

      } catch (error) {
        throw new Error(`❌ Error en Paso 12: Seleccionar “NAP SERIAL CELSIA”: ${error.message}`);
      }


      // === Paso 13: Diligenciar el campo con “3241009”. ===
      try {
        // Esperar al segundo bloque de regla (filtro)
        const segundoFiltro = await driver.wait(
          until.elementLocated(By.xpath('(//div[contains(@class,"rule-container")])[2]')),
          10000
        );

        // Buscar el textarea dentro de ese contenedor
        const textarea = await segundoFiltro.findElement(By.css('textarea'));

        // Asegurarse que el campo esté visible y habilitado
        await driver.wait(until.elementIsVisible(textarea), 5000);
        await driver.wait(until.elementIsEnabled(textarea), 5000);

        // Scroll y escritura
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", textarea);
        await driver.sleep(500);
        await textarea.clear();
        await textarea.sendKeys("3241009");
        await driver.sleep(1000);

        console.log("✅ Paso 13: Valor ingresado correctamente.");
      } catch (error) {
        throw new Error(`❌ Error en Paso 13: (Diligenciar el campo con “3001385”): ${error.message}`);
      }

     
      // === Paso 14: Clic en el botón Aplicar filtro. ===
      try {
        // Esperar el botón por XPath
        const botonAplicarFiltro = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-button-btn-set-filter"]/div')),
          10000
        );

        // Esperar que sea visible e interactuable
        await driver.wait(until.elementIsVisible(botonAplicarFiltro), 5000);
        await driver.wait(until.elementIsEnabled(botonAplicarFiltro), 5000);

        // Scroll al botón y clic
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonAplicarFiltro);
        await driver.sleep(300);
        await botonAplicarFiltro.click();
        await driver.sleep(5000);

        console.log("✅ Paso 14: Se hizo Clic en el botón Aplicar filtro.");

      } catch (error) {
        throw new Error(`❌ Error en Paso 14: (Clic en el botón Aplicar filtro'): ${error.message}`);
      }

      // === Paso 15: Seleccionar registro por Serial ONT (con Actions) ===
      try {
        const serial = "48575443702166A5";

        // 1. Localizar la celda que contiene el serial
        const tdSerial = await driver.wait(
          until.elementLocated(By.xpath(`//td[contains(normalize-space(.), '${serial}')]`)),
          10000
        );

        // 2. Asegurar visibilidad
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", tdSerial);
        await driver.wait(until.elementIsVisible(tdSerial), 5000);

        // 3. Usar Actions para hacer clic real
        const actions = driver.actions({ async: true });
        await actions.move({ origin: tdSerial }).click().perform();
        await driver.sleep(1000);

        // 4. Subir al tr padre y validar que tiene la clase 'active'
        const trElemento = await tdSerial.findElement(By.xpath("./ancestor::tr"));
        await driver.wait(async () => {
          const clase = await trElemento.getAttribute("class");
          return clase.includes("active");
        }, 5000, "El registro no se marcó como activo después del clic");

        console.log(`✅ Paso 15: Registro con Serial ONT '${serial}' seleccionado correctamente y marcado como activo.`);

      } catch (error) {
        throw new Error(`❌ Paso 15: No se pudo seleccionar el registro con Serial ONT: ${error.message}`);
      }


      // === Paso 16: Clic en el botón "Ver dispositivos" ===
      try {
        const btnVerDispositivosXpath = '//*[@id="widget-button-btn-view-amplifiers"]/div';

        // 1. Esperar a que el botón esté presente
        const btnVerDispositivos = await driver.wait(
          until.elementLocated(By.xpath(btnVerDispositivosXpath)),
          10000
        );

        // 2. Asegurarse de que esté visible
        await driver.wait(until.elementIsVisible(btnVerDispositivos), 5000);

        // 3. Scroll y clic (con fallback a JS)
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnVerDispositivos);
        await driver.sleep(300);

        try {
          await btnVerDispositivos.click();
        } catch {
          await driver.executeScript("arguments[0].click();", btnVerDispositivos);
        }

        await driver.sleep(2000);
        console.log("✅ Paso 16: Botón 'Ver dispositivos' presionado correctamente.");

      } catch (error) {
        throw new Error(`❌ Paso 16: No se pudo presionar el botón 'Ver dispositivos': ${error.message}`);
      }

      // === Paso 17: Cerrar modal "Ver dispositivos" ===
      try {
        const modalXpath = '//*[@id="widget-dialog-dialog-view-amplifiers"]/div/div';
        const btnCerrarXpath = '//*[@id="widget-dialog-dialog-view-amplifiers"]/div/div/div[1]/button';

        // 1. Esperar a que el modal esté visible
        const modal = await driver.wait(
          until.elementLocated(By.xpath(modalXpath)),
          10000
        );
        await driver.wait(until.elementIsVisible(modal), 5000);

        // 2. Localizar el botón de cerrar
        const btnCerrar = await driver.wait(
          until.elementLocated(By.xpath(btnCerrarXpath)),
          10000
        );
        await driver.wait(until.elementIsVisible(btnCerrar), 5000);

        // 3. Scroll y clic (fallback a JS)
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnCerrar);
        await driver.sleep(300);

        try {
          await btnCerrar.click();
        } catch {
          await driver.executeScript("arguments[0].click();", btnCerrar);
        }
        await driver.sleep(2000);

        // 4. Esperar que el modal ya no sea visible
        await driver.wait(async () => {
          const isDisplayed = await modal.isDisplayed().catch(() => false);
          return !isDisplayed;
        }, 10000);

        console.log("✅ Paso 17: Modal 'Ver dispositivos' cerrado correctamente.");

      } catch (error) {
        throw new Error(`❌ Paso 17: No se pudo cerrar el modal 'Ver dispositivos': ${error.message}`);
      }

      // === Paso 18: Clic en el botón "Editar estado" ===
      try {
        const btnEditarEstadoXpath = '//*[@id="widget-button-btn-edit-status"]/div';

        // 1. Esperar que el botón exista en el DOM
        const btnEditarEstado = await driver.wait(
          until.elementLocated(By.xpath(btnEditarEstadoXpath)),
          10000
        );

        // 2. Esperar que sea visible y habilitado
        await driver.wait(until.elementIsVisible(btnEditarEstado), 5000);
        await driver.wait(until.elementIsEnabled(btnEditarEstado), 5000);

        // 3. Scroll y clic (con fallback a JS)
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnEditarEstado);
        await driver.sleep(300);

        try {
          await btnEditarEstado.click();
          await driver.sleep(3000);
        } catch {
          await driver.executeScript("arguments[0].click();", btnEditarEstado);
          await driver.sleep(3000);
        }

        console.log("✅ Paso 18: Botón 'Editar estado' clickeado correctamente.");

      } catch (error) {
        throw new Error(`❌ Paso 18: No se pudo dar clic en el botón 'Editar estado': ${error.message}`);
      }

      // === Paso 19: Abrir el menú desplegable de "Estado" ===
      try {
        const selectEstadoXpath = '//*[@id="input-select-select-status-order"]';

        // 1. Esperar que el <select> exista en el DOM
        const selectEstado = await driver.wait(
          until.elementLocated(By.xpath(selectEstadoXpath)),
          10000
        );

        // 2. Esperar que sea visible y habilitado
        await driver.wait(until.elementIsVisible(selectEstado), 5000);
        await driver.wait(until.elementIsEnabled(selectEstado), 5000);

        // 3. Scroll y clic para abrir opciones
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", selectEstado);
        await driver.sleep(300);

        await selectEstado.click();
        await driver.sleep(1000); // Breve pausa para desplegar opciones

        console.log("✅ Paso 19: Menú desplegable 'Estado de orden' abierto correctamente.");

      } catch (error) {
        throw new Error(`❌ Paso 19: No se pudo abrir el menú desplegable 'Estado de orden': ${error.message}`);
      }

      // === Paso 20: Seleccionar opción "Suspendido" en el menú desplegable ===
      try {
        const opcionSuspendidoXpath = '//*[@id="input-select-select-status-order"]/option[4]';
        const selectXpath = '//*[@id="input-select-select-status-order"]';

        // 1. Esperar que el <option> esté presente
        const opcionSuspendido = await driver.wait(
          until.elementLocated(By.xpath(opcionSuspendidoXpath)),
          10000
        );

        await driver.wait(until.elementIsVisible(opcionSuspendido), 5000);

        // 2. Clic sobre la opción "Suspendido"
        await opcionSuspendido.click();
        await driver.sleep(800);

        // 3. Forzar que el select se cierre
        const selectElement = await driver.findElement(By.xpath(selectXpath));
        await driver.executeScript("arguments[0].blur();", selectElement); // quita el foco
        await driver.sleep(800);

        console.log("✅ Paso 20: Opción 'Suspendido' seleccionada y desplegable cerrado.");

      } catch (error) {
        throw new Error(`❌ Error Paso 20: No se pudo seleccionar la opción 'Suspendido': ${error.message}`);
      }

      
      // === Paso 21: Guardar cambios en el estado (clic en botón "Editar estado") ===
      try {
        const btnGuardarXpath = '//*[@id="widget-button-btn-edit-status-save"]/div';

        // 1. Esperar que el botón esté presente
        const btnGuardar = await driver.wait(
          until.elementLocated(By.xpath(btnGuardarXpath)),
          10000
        );

        // 2. Esperar que sea visible
        await driver.wait(until.elementIsVisible(btnGuardar), 5000);

        // 3. Forzar scroll al centro y clic
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnGuardar);
        await driver.sleep(300);
        await driver.executeScript("arguments[0].click();", btnGuardar);

        // 4. Pequeña espera por acción posterior (puedes ajustarla)
        await driver.sleep(3000);

        console.log("✅ Paso 21: Botón 'Editar estado (guardar)' presionado correctamente.");
      } catch (error) {
        throw new Error(`❌ Error en Paso 21: No se pudo presionar el botón 'Editar estado (guardar)': ${error.message}`);
      }

      // === Paso 22: Clic en el botón "Editar estado" ===
      try {
        const btnEditarEstadoXpath = '//*[@id="widget-button-btn-edit-status"]/div';

        // 1. Esperar que el botón exista en el DOM
        const btnEditarEstado = await driver.wait(
          until.elementLocated(By.xpath(btnEditarEstadoXpath)),
          10000
        );

        // 2. Esperar que sea visible y habilitado
        await driver.wait(until.elementIsVisible(btnEditarEstado), 5000);
        await driver.wait(until.elementIsEnabled(btnEditarEstado), 5000);

        // 3. Scroll y clic (con fallback a JS)
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnEditarEstado);
        await driver.sleep(300);

        try {
          await btnEditarEstado.click();
          await driver.sleep(3000);
        } catch {
          await driver.executeScript("arguments[0].click();", btnEditarEstado);
          await driver.sleep(3000);
        }

        console.log("✅ Paso 22: Botón 'Editar estado' clickeado correctamente.");

      } catch (error) {
        throw new Error(`❌ Error Paso 22: No se pudo dar clic en el botón 'Editar estado': ${error.message}`);
      }

      // === Paso 23: Guardar cambios en el estado (clic en botón "Editar estado" Activo) ===
      try {
        const btnGuardarXpath = '//*[@id="widget-button-btn-edit-status-save"]/div';

        // 1. Esperar que el botón esté presente
        const btnGuardar = await driver.wait(
          until.elementLocated(By.xpath(btnGuardarXpath)),
          10000
        );

        // 2. Esperar que sea visible
        await driver.wait(until.elementIsVisible(btnGuardar), 5000);

        // 3. Forzar scroll al centro y clic
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnGuardar);
        await driver.sleep(300);
        await driver.executeScript("arguments[0].click();", btnGuardar);

        // 4. Pequeña espera por acción posterior (puedes ajustarla)
        await driver.sleep(3000);

        console.log("✅ Paso 23: Botón 'Editar estado (guardar)' presionado correctamente.");
      } catch (error) {
        throw new Error(`❌ Error en Paso 23: No se pudo presionar el botón 'Editar estado (guardar)': ${error.message}`);
      }

      // === Paso 24: Clic en botón "Editar" ===
      try {
        const btnEditar = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-button-btn-edit-order"]/div')),
          10000
        );

        await driver.wait(until.elementIsVisible(btnEditar), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnEditar);
        await driver.sleep(300);

        // Usamos clic con JS para evitar que algo lo bloquee
        await driver.executeScript("arguments[0].click();", btnEditar);
        await driver.sleep(2000);

        console.log("✅ Paso 24: Botón 'Editar' presionado correctamente.");
      } catch (error) {
        throw new Error(`❌ Paso 24: No se pudo presionar el botón 'Editar': ${error.message}`);
      }

      // === Paso 25: Diligenciar campo "Observaciones" en modal Editar ===
      try {
        const inputObservaciones = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="textfield-56_"]')),
          10000
        );

        await driver.wait(until.elementIsVisible(inputObservaciones), 5000);
        await driver.wait(until.elementIsEnabled(inputObservaciones), 5000);

        // Hacer scroll hasta el campo
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", inputObservaciones);
        await driver.sleep(500);

        // Limpiar el campo antes de escribir
        await inputObservaciones.clear();
        await driver.sleep(300);

        // Escribir el texto
        await inputObservaciones.sendKeys("test automatizacion editar");
        await driver.sleep(500);

        console.log("✅ Paso 25: Campo 'Observaciones' diligenciado correctamente.");
      } catch (error) {
        throw new Error(`❌ Paso 25: No se pudo diligenciar el campo 'Observaciones': ${error.message}`);
      }


      // === Paso 26: Clic en botón "Editar / Guardar" en modal ===
      try {
        const btnEditarGuardar = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-button-btn-edit-order-save"]/div')),
          10000
        );

        await driver.wait(until.elementIsVisible(btnEditarGuardar), 5000);
        await driver.wait(until.elementIsEnabled(btnEditarGuardar), 5000);

        // Hacer scroll al botón
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnEditarGuardar);
        await driver.sleep(500);

        // Forzar clic con JS (más seguro en modales)
        await driver.executeScript("arguments[0].click();", btnEditarGuardar);
        await driver.sleep(3000);

        console.log("✅ Paso 26: Botón 'Editar / Guardar' presionado correctamente.");
      } catch (error) {
        throw new Error(`❌ Paso 26: No se pudo presionar el botón 'Editar / Guardar': ${error.message}`);
      }


      // === Paso 27: Cerrar modal de edición ===
      try {
        const modalEditar = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-dialog-dialog-edit-order"]/div/div')),
          10000
        );
        await driver.wait(until.elementIsVisible(modalEditar), 5000);

        const btnCerrarModal = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-dialog-dialog-edit-order"]/div/div/div[1]/button')),
          10000
        );
        await driver.wait(until.elementIsVisible(btnCerrarModal), 5000);

        // Scroll y clic forzado
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnCerrarModal);
        await driver.sleep(300);
        await driver.executeScript("arguments[0].click();", btnCerrarModal);

        // ✅ Ajuste: esperar que el modal se oculte (pero no necesariamente desaparezca del DOM)
        await driver.wait(until.elementIsNotVisible(modalEditar), 15000);

        console.log("✅ Paso 27: Modal de edición cerrado correctamente.");
      } catch (error) {
        throw new Error(`❌ Paso 27: No se pudo cerrar el modal de edición: ${error.message}`);
      }


      // === Paso 28: Clic en botón "Recargar" ===
      try {
        const btnRecargar = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="crud-refresh-btn"]')),
          10000
        );

        await driver.wait(until.elementIsVisible(btnRecargar), 5000);
        await driver.wait(until.elementIsEnabled(btnRecargar), 5000);

        // Scroll y clic
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnRecargar);
        await driver.sleep(300);
        await driver.executeScript("arguments[0].click();", btnRecargar);

        // Pequeña espera por la recarga de la tabla
        await driver.sleep(4000);

        console.log("✅ Paso 28: Botón 'Recargar' presionado correctamente.");
      } catch (error) {
        throw new Error(`❌ Paso 28: No se pudo presionar el botón 'Recargar': ${error.message}`);
      }



    } catch (error) {
      console.error('❌ Error en Puertos Activos:', error.message);
      const screenshot = await driver.takeScreenshot();
      const erroresPath = path.resolve(__dirname, '../errores');
      if (!fs.existsSync(erroresPath)) {
        fs.mkdirSync(erroresPath);
      }
      fs.writeFileSync(
        path.join(erroresPath, `error_visorInformacionTecnicaRed_${Date.now()}.png`),
        screenshot,
        'base64'
      );
      throw error;
    }
  }
}