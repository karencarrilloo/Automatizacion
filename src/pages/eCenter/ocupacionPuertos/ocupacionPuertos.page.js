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

    const contenedorVista = '//*[@id="container-mainframe"]/div[4]/div[2]/div/div/div[1]';
    const xpathCheck = '//*[@id="container-mainframe"]/div[4]/div[2]/div/div/div[1]/div[1]/div[2]/div[2]';

    try {
        console.log(`=== ${caseName}: Consultar Nap ===`);

        // Esperar que cargue el bloque de la vista
        await driver.wait(
            until.elementLocated(By.xpath(contenedorVista)),
            25000
        );

        // Esperar un tiempo extra mientras la lista renderiza
        await driver.sleep(3000);

        const checkElemento = await driver.wait(
            until.elementLocated(By.xpath(xpathCheck)),
            15000
        );

        await driver.wait(until.elementIsVisible(checkElemento), 10000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", checkElemento);

        try {
            await checkElemento.click();
        } catch {
            await driver.executeScript("arguments[0].click();", checkElemento);
        }

        console.log("✔ Check seleccionado correctamente");

    } catch (error) {
        console.error(`❌ Error en ${caseName}: `, error);
        throw error;
    }
}

}