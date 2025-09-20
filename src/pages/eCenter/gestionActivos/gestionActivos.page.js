import { By, until } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

export default class GestionActivosPage {
  constructor(driver) {
    this.driver = driver;
  }

  /**
   * ====================================
   * CP_GESTION_ACTIVOS_001 – Ingreso a vista
   * ====================================
   * Pasos:
   *   1. Clic en módulo eCenter
   *   2. Scroll en contenedor de aplicaciones
   *   3. Clic en "Gestión de Activos"
   */
  async ingresarVistaGestionActivos(caseName = 'CP_GESTION_ACTIVOS_001') {
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

      // === Paso 3: Clic en "Gestión de Activos" ===
      const gestionActivosBtn = await driver.wait(
        until.elementLocated(
          By.css('div.application-item[title="Gestion de Activos"]')
        ),
        10000
      );
      await driver.executeScript("arguments[0].scrollIntoView({behavior:'smooth', block:'center'});", gestionActivosBtn);
      await driver.wait(until.elementIsVisible(gestionActivosBtn), 10000);
      await driver.wait(until.elementIsEnabled(gestionActivosBtn), 10000);
      await driver.sleep(1000);
      await driver.executeScript("arguments[0].click();", gestionActivosBtn);
      await driver.sleep(5000);
    

    } catch (error) {
      console.error(`❌ [CP_GESTION_ACTIVOS_001] Error: ${error.message}`);

      // Captura de pantalla si falla
      const screenshot = await driver.takeScreenshot();
      const errorsRoot = path.resolve(__dirname, '../../../../errors', 'gestionActivos', caseName);
      fs.mkdirSync(errorsRoot, { recursive: true });
      const filePath = path.join(errorsRoot, `error_${Date.now()}.png`);
      fs.writeFileSync(filePath, screenshot, 'base64');

      throw error;
    }
  }
}
