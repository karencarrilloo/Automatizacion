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