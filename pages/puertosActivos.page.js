import { By, until } from 'selenium-webdriver';
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

        console.log("✅ Paso 4: Se hizo clic en el botón 'Mostrar filtro' correctamente.");
      } catch (error) {
        throw new Error(`❌ Error en paso 4 (clic en 'Mostrar filtro'): ${error.message}`);
      }

      // === Paso 5: Clic en el <select> para mostrar opciones del filtro ===
      try {
        // Esperar el contenedor principal de grupo de reglas
        const grupoFiltro = await driver.wait(
          until.elementLocated(By.css('.rules-group-container')),
          10000
        );

        // Esperar el contenedor del filtro
        const contenedorFiltro = await grupoFiltro.findElement(
          By.css('.rule-filter-container')
        );

        // Localizar el select dentro del contenedor
        const selectFiltro = await contenedorFiltro.findElement(By.css('select'));

        // Asegurar que sea visible e interactuable
        await driver.wait(until.elementIsVisible(selectFiltro), 5000);
        await driver.wait(until.elementIsEnabled(selectFiltro), 5000);

        // Scroll y clic sobre el select
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", selectFiltro);
        await driver.sleep(500);
        await selectFiltro.click();
        await driver.sleep(2000);

        console.log("✅ Paso 5: Select del filtro desplegado correctamente.");
      } catch (error) {
        throw new Error(`❌ Error en paso 5 (clic en select de filtro): ${error.message}`);
      }

      // === Paso 6: Seleccionar la opción "CENTRO POBLADO" ===
      try {
        // Esperar el contenedor de grupo de reglas
        const grupoFiltro = await driver.wait(
          until.elementLocated(By.css('.rules-group-container')),
          10000
        );

        // Esperar el contenedor de filtro dentro del grupo
        const contenedorFiltro = await grupoFiltro.findElement(By.css('.rule-filter-container'));

        // Localizar el <select>
        const selectFiltro = await contenedorFiltro.findElement(By.css('select'));

        // Esperar a que el select sea interactuable
        await driver.wait(until.elementIsVisible(selectFiltro), 5000);
        await driver.wait(until.elementIsEnabled(selectFiltro), 5000);

        // Clic (por si aún no está abierto)
        await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", selectFiltro);
        await driver.sleep(500);

        // Crear objeto Select desde Selenium
        const { Select } = require('selenium-webdriver/lib/select');
        const select = new Select(selectFiltro);

        // Seleccionar la opción por texto visible
        await select.selectByVisibleText('CENTRO POBLADO');
        await driver.sleep(1000);

        console.log("✅ Paso 6: Opción 'CENTRO POBLADO' seleccionada correctamente.");
      } catch (error) {
        throw new Error(`❌ Error en paso 6 (seleccionar 'CENTRO POBLADO'): ${error.message}`);
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