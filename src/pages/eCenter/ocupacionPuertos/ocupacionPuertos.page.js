import { By, until } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { testData } from '../../../config/testData.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class OcupacionPuertosPage {
  constructor(driver) {
    this.driver = driver;
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
    if (this._capturarError) await this._capturarError(error, caseName);
    throw new Error(`❌ Error en CP_OCUPUERT_002: ${error.message}`);
  }
}
}