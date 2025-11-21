import { By, until, Key } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { testData } from '../../../config/testData.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class OcupacionPuertosPage {
  /**
   * @param {WebDriver} driver Driver de Selenium
   * @param {string} defaultNapSerialCelsia Serial del NAP a consultar
   * @param {string} defaultCeo Serial CEO global reutilizable
   */
  constructor(driver,
    defaultNapSerialCelsia = testData.ocupacionPuertos.defaultNapSerialCelsia,
    defaultCeo = testData.ocupacionPuertos.defaultCeo
  ) {
    this.driver = driver;
    this.defaultNapSerialCelsia = defaultNapSerialCelsia;
    this.defaultCeo = defaultCeo;
  }

  /**
   * ====================================
   * CP_OCUPUERT_001 – Ingreso a la vista
   * x pasos
   * ====================================
   * 
   */

  async ingresarOcupacionPuertos(caseName = 'CP_OCUPUERT_001') {
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

      // === Paso 3: Clic en "Ocupación de puertos" ===
      const targetApp = await driver.wait(
        until.elementLocated(By.xpath("//div[contains(@class,'legend-application') and normalize-space()='Ocupación de puertos']")),
        10000
      );
      await driver.executeScript("arguments[0].scrollIntoView({behavior:'smooth', block:'center'});", targetApp);
      await driver.wait(until.elementIsVisible(targetApp), 10000);
      await driver.wait(until.elementIsEnabled(targetApp), 10000);
      await driver.sleep(1000);
      await driver.executeScript("arguments[0].click();", targetApp);
      await driver.sleep(5000);

    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      throw error;
    }
  }
  /**
 * ====================================
 * CP_OCUPUERT_002: Consultar Nap
 * x pasos
 * ====================================
 */

  async consultarNap(caseName = 'CP_OCUPUERT_002') {
    const driver = this.driver;

    try {
      console.log("=== CP_OCUPUERT_002: Consultar Nap ===");

      // === Paso 1: Seleccionar "SERIAL NAP" ===
      const labelNap = await driver.wait(
        until.elementLocated(By.xpath("//div[contains(text(),'SERIAL NAP')]")),
        15000
      );

      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", labelNap);
      await driver.wait(until.elementIsVisible(labelNap), 5000);

      try {
        await labelNap.click();
      } catch {
        await driver.executeScript("arguments[0].click();", labelNap);
      }

      await driver.sleep(900);
      console.log("🎯 Paso 1: Clic en 'SERIAL NAP' realizado.");

      // Validar cambio visual del estado (cuadro azul)
      const cuadradoNap = await driver.findElement(By.css(".ser-nap-squar"));
      const clase = await cuadradoNap.getAttribute("class");

      if (!clase.includes("active")) {
        throw new Error("El recuadro 'SERIAL NAP' no se marcó (falta clase 'active')");
      }

      console.log("🔵 Validación: Recuadro 'SERIAL NAP' activo correctamente.");

      // Aquí continuarán los próximos pasos del caso 😊
      console.log("🚀 CP_OCUPUERT_002: Paso inicial completado.");

    } catch (error) {
      console.error("❌ Error Paso 1: No se pudo clickear el check:", error);
      throw error;
    }


    // === Paso 2: Ingresar Serial NAP ===
    try {
      const inputNap = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="textfield-enum-finder"]')),
        10000
      );

      await driver.wait(until.elementIsVisible(inputNap), 5000);
      await inputNap.click();
      await driver.sleep(300);
      await inputNap.clear();
      await inputNap.sendKeys(this.defaultNapSerialCelsia);
      await driver.sleep(800);

      // === Presionar ENTER para buscar ===
      await inputNap.sendKeys(Key.ENTER);
      await driver.sleep(5000);

      console.log("✅ Paso 2: Serial NAP ingresado y búsqueda ejecutada con ENTER.");



      console.log(`🟦 Paso 2: Serial NAP ingresado: ${this.defaultNapSerialCelsia}`);
    } catch (error) {
      console.error("❌ Error Paso 2: No se pudo escribir el Serial NAP:", error);
      throw error;
    }


  } catch(error) {
    console.error(`❌ Error en ${caseName}: ${error.message}`);

    throw error;
  }

  /**
* ====================================
* CP_OCUPUERT_003: Consultar Ceo
* x pasos
* ====================================
*/

  async consultarCeo(caseName = 'CP_OCUPUERT_003') {
    const driver = this.driver;

    try {
      // === Paso 1: Seleccionar checkbox "SERIAL CEO" ===
      const serialCeoCheckbox = await driver.wait(
        until.elementLocated(By.css('.ser-ceo-squar')),
        10000
      );

      await driver.wait(until.elementIsVisible(serialCeoCheckbox), 5000);
      await driver.wait(until.elementIsEnabled(serialCeoCheckbox), 5000);
      await driver.executeScript(
        "arguments[0].scrollIntoView({block: 'center'});",
        serialCeoCheckbox
      );
      await driver.sleep(300);
      await serialCeoCheckbox.click();
      console.log("☑️ Paso 1: Checkbox 'SERIAL CEO' seleccionado.");
      await driver.sleep(800);

      // === Paso 2: Diligenciar serial CEO y presionar ENTER ===
      const inputSerialCeo = await driver.wait(
        until.elementLocated(By.id("textfield-enum-finder")),
        10000
      );

      await driver.wait(until.elementIsVisible(inputSerialCeo), 5000);
      await inputSerialCeo.click();
      await driver.sleep(300);
      await inputSerialCeo.clear();
      await inputSerialCeo.sendKeys(this.defaultCeo);
      await driver.sleep(500);
      await inputSerialCeo.sendKeys(Key.ENTER);
      console.log(`📝 Paso 2: Campo diligenciado con CEO '${this.defaultCeo}' + ENTER ejecutado.`);

      await driver.sleep(5000);

    } catch (error) {
      if (this._capturarError) await this._capturarError(error, caseName);
      throw error;
    }
  }
}