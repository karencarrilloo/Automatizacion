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
      // === Paso 1: Clic en módulo eCenter ===
      const eCenterBtn = await driver.wait(
        until.elementLocated(By.xpath("//div[@id='118' and contains(@class, 'item-module')]")),
        10000
      );
      await driver.executeScript("arguments[0].click();", eCenterBtn);
      await driver.sleep(1000);

      // === Paso 2: Scroll contenedor apps ===
      const scrollContainer = await driver.wait(
        until.elementLocated(By.css('.container-applications')),
        10000
      );
      await driver.executeScript(
        "arguments[0].scrollTop = arguments[0].scrollHeight;",
        scrollContainer
      );
      await driver.sleep(1000);

      // === Paso 3: Clic en "Visor de información técnica de red" ===
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

        console.log("✅ Clic en 'Visor de información técnica de red' realizado correctamente.");
      } catch (error) {
        throw new Error(`❌ Error en paso 3 (clic en visor de información técnica de red): ${error.message}`);
      }

      // === Paso 4: Clic en el botón "Mostrar filtro" ===
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

        //console.log("✅ Paso 4: Botón 'Mostrar filtro' clickeado correctamente.");
      } catch (error) {
        throw new Error(`❌ Error en paso 4 (clic en 'Mostrar filtro'): ${error.message}`);
      }


      // === Paso 5: Clic en el <select> para mostrar opciones del filtro ===
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
        throw new Error(`❌ Error en paso 5 (clic en select de filtro): ${error.message}`);
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
        throw new Error(`❌ Error en paso 6 (selección de 'CENTRO POBLADO'): ${error.message}`);
      }

      try {

        // Paso 7: Esperar a que el <textarea> sea visible y diligenciar con la palabra "PALMIRA"
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
        throw new Error(`❌ Error en paso 7 (textarea): ${error.message}`);
      }

      try {
        // Paso 8 – Clic en el botón "Aplicar filtro": 
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
        throw new Error(`❌ Error en paso 8 (clic en 'Aplicar filtro'): ${error.message}`);
      }

      // === Paso 9: Clic Nuevamente en el botón "Mostrar filtro" en Puertos Activos ===
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
        throw new Error(`❌ Error en paso 4 (clic en 'Mostrar filtro'): ${error.message}`);
      }

      try {
        // Paso 10: Localizar el botón "+ Add rule" usando atributo estable
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
        throw new Error(`❌ Error en paso 10 (clic en '+ Add rule'): ${error.message}`);
      }

      // === Paso 11: Clic nuevamente en el <select> para mostrar opciones del filtro ===
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
        throw new Error(`❌ Error en paso 5 (clic en select de filtro): ${error.message}`);
      }

      // === Paso 12: Seleccionar "NAP SERIAL CELSIA" correctamente en segundo filtro ===
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
        throw new Error(`❌ Error en paso 12 (selección de 'NAP SERIAL CELSIA'): ${error.message}`);
      }


      // === Paso 13: Ingresar número en segundo filtro (por jerarquía DOM) ===
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
        await textarea.sendKeys("3001385");
        await driver.sleep(1000);

        //console.log("✅ Paso 13: Valor ingresado correctamente.");
      } catch (error) {
        throw new Error(`❌ Error en paso 13 (ingreso de valor en segundo filtro): ${error.message}`);
      }

      // === Paso 14: Clic en "Aplicar filtro" ===
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

        console.log("✅ Paso 14 completado: Se hizo clic en 'Aplicar filtro'.");

      } catch (error) {
        throw new Error(`❌ Error en paso 14 (clic en 'Aplicar filtro'): ${error.message}`);
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