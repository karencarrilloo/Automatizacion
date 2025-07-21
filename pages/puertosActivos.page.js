import { By, Key, until } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class PuertosActivosPage {
  constructor(driver) {
    this.driver = driver;
  }

  async ejecutarPuertosActivos() {
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

      // === Paso 3: Clic en "Puertos Activos" ===
      const puertosActivosBtn = await driver.wait(
        until.elementLocated(By.css('div.application-item[title="Puertos activos"]')),
        10000
      );
      await driver.executeScript(
        "arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });",
        puertosActivosBtn
      );
      await driver.wait(until.elementIsVisible(puertosActivosBtn), 10000);
      await driver.wait(until.elementIsEnabled(puertosActivosBtn), 10000);
      await driver.sleep(1000);
      await driver.executeScript("arguments[0].click();", puertosActivosBtn);
      await driver.sleep(5000);
      // === Paso 4: Clic en el botón "Mostrar filtro" en Puertos Activos ===
      try {
        // Esperar que el contenedor que contiene el botón esté presente
        const contenedorBotonFiltro = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="crud-4043-Active_ports_without_buttons"]/div/div[1]')),
          10000
        );

        // Buscar el botón "Mostrar filtro"
        const botonMostrarFiltro = await contenedorBotonFiltro.findElement(
          By.xpath('//*[@id="widget-button-btn-show-filter"]/div')
        );

        // Asegurarse que el botón esté visible y habilitado
        await driver.wait(until.elementIsVisible(botonMostrarFiltro), 5000);
        await driver.wait(until.elementIsEnabled(botonMostrarFiltro), 5000);

        // Hacer scroll al botón y hacer clic
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonMostrarFiltro);
        await driver.sleep(500);
        await botonMostrarFiltro.click();
        await driver.sleep(1000); // Espera breve tras acción

        //console.log("✅ Paso 4: Se hizo clic en el botón 'Mostrar filtro' correctamente.");
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
        // Esperar contenedor de filtros
        const contenedorGrupo = await driver.wait(
          until.elementLocated(By.css('.rules-group-container')),
          10000
        );

        // Localizar el select de campos (dropdown)
        const selectCampo = await contenedorGrupo.findElement(By.css('select'));

        // Clic manual para abrir la lista de opciones
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", selectCampo);
        await selectCampo.click();
        await driver.sleep(500); // Esperar que se despliegue

        // Enviar teclas con texto de la opción (simula uso real del teclado)
        await selectCampo.sendKeys("CENTRO POBLADO");
        await driver.sleep(3000);
        // await selectCampo.sendKeys(Key.ENTER); // Confirma la selección

        await driver.sleep(2000); // Esperar render

        //console.log("✅ Opción 'CENTRO POBLADO' seleccionada con eventos correctamente.");
      } catch (error) {
        throw new Error(`❌ Error en paso 6 (selección real de 'CENTRO POBLADO'): ${error.message}`);
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

        console.log("✅ Paso 8 completado: Se hizo clic en 'Aplicar filtro'.");

      } catch (error) {
        throw new Error(`❌ Error en paso 8 (clic en 'Aplicar filtro'): ${error.message}`);
      }

      // === Paso 9: Clic Nuevamente en el botón "Mostrar filtro" en Puertos Activos ===
      try {
        // Esperar que el contenedor que contiene el botón esté presente
        const contenedorBotonFiltro = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="crud-4043-Active_ports_without_buttons"]/div/div[1]')),
          10000
        );

        // Buscar el botón "Mostrar filtro"
        const botonMostrarFiltro = await contenedorBotonFiltro.findElement(
          By.xpath('//*[@id="widget-button-btn-show-filter"]/div')
        );

        // Asegurarse que el botón esté visible y habilitado
        await driver.wait(until.elementIsVisible(botonMostrarFiltro), 5000);
        await driver.wait(until.elementIsEnabled(botonMostrarFiltro), 5000);

        // Hacer scroll al botón y hacer clic
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonMostrarFiltro);
        await driver.sleep(500);
        await botonMostrarFiltro.click();
        await driver.sleep(1000); // Espera breve tras acción

        //console.log("✅ Paso 9: Se hizo clic en el botón nuevamente 'Mostrar filtro' correctamente.");
      } catch (error) {
        throw new Error(`❌ Error en paso 9 (clic en 'Mostrar filtro'): ${error.message}`);
      }

      try {
        // Paso 10: Localizar el botón "+ Add rule" por XPath y dar clic sobre él
        const botonAddRule = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="qb_40640_group_0"]/div[1]/div[1]/button[1]')),
          10000
        );

        // Esperar a que el botón sea visible
        await driver.wait(until.elementIsVisible(botonAddRule), 5000);

        // Scroll al botón y clic
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonAddRule);
        await driver.sleep(500);
        await botonAddRule.click();

        console.log("✅ Paso 10 completado: Se hizo clic en '+ Add rule'.");

      } catch (error) {
        throw new Error(`❌ Error en paso 10 (clic en '+ Add rule'): ${error.message}`);

      }

    } catch (error) {
      console.error('❌ Error en Puertos Activos:', error.message);
      const screenshot = await driver.takeScreenshot();
      const erroresPath = path.resolve(__dirname, '../errores');
      if (!fs.existsSync(erroresPath)) {
        fs.mkdirSync(erroresPath);
      }
      fs.writeFileSync(
        path.join(erroresPath, `error_puertosActivos_${Date.now()}.png`),
        screenshot,
        'base64'
      );
      throw error;
    }
  }
}