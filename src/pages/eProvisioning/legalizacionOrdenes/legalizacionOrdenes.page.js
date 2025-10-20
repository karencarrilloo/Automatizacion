// archivo: pages/legalizacionOrdenes.page.js
import { By, until } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class LegalizacionOrdenesPage {
  constructor(driver) {
    this.driver = driver;
  }

  async ingresarLegalizacionOrdenes() {
    const driver = this.driver;

    try {
      // === Paso 1: Clic en módulo eProvisioning ===
      const eProvisioningBtn = await driver.wait(
        until.elementLocated(By.xpath("//div[@id='21' and contains(@class,'item-module')]")),
        10000
      );
      await driver.executeScript("arguments[0].click();", eProvisioningBtn);
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

      // === Paso 3: Clic en "Legalización Órdenes" ===
      const targetApp = await driver.wait(
        until.elementLocated(
          By.xpath("//div[@id='4540' and contains(@class,'legend-application')]")
        ),
        10000
      );
      await driver.executeScript("arguments[0].scrollIntoView({behavior:'smooth', block:'center'});", targetApp);
      await driver.wait(until.elementIsVisible(targetApp), 10000);
      await driver.wait(until.elementIsEnabled(targetApp), 10000);
      await driver.sleep(1000);
      await driver.executeScript("arguments[0].click();", targetApp);
      await driver.sleep(5000);

    } catch (error) {
      console.error("❌ Error en Legalización Órdenes:", error.message);

      // Captura de pantalla ante error
      const screenshot = await driver.takeScreenshot();
      const carpetaErrores = path.resolve(__dirname, '../errores');
      if (!fs.existsSync(carpetaErrores)) fs.mkdirSync(carpetaErrores);
      const filePath = path.join(carpetaErrores, `error_legalizacionOrdenes_${Date.now()}.png`);
      fs.writeFileSync(filePath, screenshot, 'base64');
      throw error;
    }
  }
}
