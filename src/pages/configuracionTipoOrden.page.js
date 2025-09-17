import { By, until } from 'selenium-webdriver';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class ConfiguracionTipoOrdenPage {
  constructor(driver) {
    this.driver = driver;
  }

  async ejecutarConfiguracionTipoOrden() {
    const driver = this.driver;

    try {
      // === Paso 1: Click en módulo eWorkForce ===
      const eWorkForceBtn = await driver.wait(
        until.elementLocated(By.xpath("//div[@id='23' and contains(@class, 'item-module')]")),
        10000
      );
      await driver.executeScript("arguments[0].click();", eWorkForceBtn);
      await driver.sleep(1000);

      // === Paso 2: Esperar contenedor de aplicaciones y hacer scroll ===
      const scrollContainer = await driver.wait(
        until.elementLocated(By.css('.container-applications')),
        10000
      );
      await driver.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight;", scrollContainer);
      await driver.sleep(1000);

      // === Paso 3: Clic en vista "Configuración de tipo de orden" ===
      const appTarget = await driver.wait(
        until.elementLocated(By.xpath("//div[contains(@class,'legend-application') and normalize-space()='Configuración de tipo de orden']")),
        10000
      );
      await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", appTarget);
      await driver.wait(until.elementIsVisible(appTarget), 10000);
      await driver.wait(until.elementIsEnabled(appTarget), 10000);
      await driver.sleep(1000);
      await driver.executeScript("arguments[0].click();", appTarget);
      await driver.sleep(5000);

      console.log("✅ Vista 'Configuración de tipo de orden' abierta correctamente.");

    } catch (error) {
      console.error("❌ Error en Configuración de tipo de orden:", error.message);

      const screenshot = await driver.takeScreenshot();
      const carpetaErrores = path.resolve(__dirname, '../errores');
      if (!fs.existsSync(carpetaErrores)) fs.mkdirSync(carpetaErrores);
      const ruta = path.join(carpetaErrores, `error_configuracionTipoOrden_${Date.now()}.png`);
      fs.writeFileSync(ruta, screenshot, 'base64');
      throw error;
    }
  }
}
