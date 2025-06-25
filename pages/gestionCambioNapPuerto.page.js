import { By, until } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class GestionCambioNapPuertoPage {
  constructor(driver) {
    this.driver = driver;
  }

  async ejecutarCambioNapPuerto() {
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

      // === Paso 3: Clic en "Gestión cambio de NAP y puerto" ===
      const cambioNapBtn = await driver.wait(
        until.elementLocated(By.xpath("//div[contains(@class,'legend-application') and contains(text(),'Gestión cambio de NAP y puerto')]")),
        10000
      );
      await driver.executeScript("arguments[0].scrollIntoView({behavior:'smooth', block:'center'});", cambioNapBtn);
      await driver.wait(until.elementIsVisible(cambioNapBtn), 10000);
      await driver.wait(until.elementIsEnabled(cambioNapBtn), 10000);
      await driver.sleep(1000);
      await driver.executeScript("arguments[0].click();", cambioNapBtn);
      await driver.sleep(5000);

      // Aquí continuarías con pasos adicionales si aplican

    } catch (error) {
      console.error("❌ Error en gestión cambio de NAP y puerto:", error.message);
      const screenshot = await driver.takeScreenshot();
      const carpetaErrores = path.resolve(__dirname, '../errores');
      if (!fs.existsSync(carpetaErrores)) fs.mkdirSync(carpetaErrores);
      const filePath = path.join(carpetaErrores, `error_cambioNap_${Date.now()}.png`);
      fs.writeFileSync(filePath, screenshot, 'base64');
      throw error;
    }
  }
}
