import { By, until } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class GestorOrdenesPage {
  constructor(driver) {
    this.driver = driver;
  }

  async ingresarGestorOrdenes() {
    const driver = this.driver;

    try {
      // === Paso 1: Clic en módulo eProvisioning ===
      const eProvisioningBtn = await driver.wait(
        until.elementLocated(
          By.xpath("//div[@id='21' and contains(@class, 'item-module')]")
        ),
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

      // === Paso 3: Clic en "Gestor de Órdenes" (id 5524) ===
      const targetApp = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="5524"]')),
        10000
      );
      await driver.executeScript(
        "arguments[0].scrollIntoView({behavior:'smooth', block:'center'});",
        targetApp
      );
      await driver.wait(until.elementIsVisible(targetApp), 10000);
      await driver.wait(until.elementIsEnabled(targetApp), 10000);
      await driver.sleep(1000);
      await driver.executeScript("arguments[0].click();", targetApp);
      await driver.sleep(5000);

      console.log("✅ Ingreso exitoso a la vista 'Gestor de Órdenes'.");

    } catch (error) {
      console.error("❌ Error en Gestor de Órdenes:", error.message);
      const screenshot = await driver.takeScreenshot();
      const carpetaErrores = path.resolve(__dirname, '../errores');
      if (!fs.existsSync(carpetaErrores)) fs.mkdirSync(carpetaErrores);
      const filePath = path.join(
        carpetaErrores,
        `error_gestorOrdenes_${Date.now()}.png`
      );
      fs.writeFileSync(filePath, screenshot, 'base64');
      throw error;
    }
  }
}
