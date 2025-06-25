import { By, until } from 'selenium-webdriver';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class GestionContratosPage {
  constructor(driver) {
    this.driver = driver;
  }

  async ejecutarGestionContratos() {
    const driver = this.driver;

    try {
      // === Paso 7: Click en módulo eContract ===
      const eContractBtn = await driver.wait(
        until.elementLocated(By.xpath("//div[@id='22' and contains(@class, 'item-module')]")),
        10000
      );
      await driver.executeScript("arguments[0].click();", eContractBtn);
      await driver.sleep(1000);

      // === Paso 8: Esperar contenedor scrollable ===
      const scrollContainer = await driver.wait(
        until.elementLocated(By.css('.container-applications')),
        10000
      );
      await driver.executeScript(
        "arguments[0].scrollTop = arguments[0].scrollHeight;",
        scrollContainer
      );
      await driver.sleep(1000);

      // === Paso 9: Click en vista "Gestión de contratos" ===
      const vistaGestionContratos = await driver.wait(
        until.elementLocated(By.xpath("//div[contains(@class,'legend-application') and normalize-space()='Gestión de contratos']")),
        10000
      );
      await driver.executeScript(
        "arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });",
        vistaGestionContratos
      );
      await driver.wait(until.elementIsVisible(vistaGestionContratos), 10000);
      await driver.wait(until.elementIsEnabled(vistaGestionContratos), 10000);
      await driver.sleep(1000);
      await driver.executeScript("arguments[0].click();", vistaGestionContratos);
      await driver.sleep(5000);

      console.log('✅ Vista "Gestión de contratos" abierta correctamente.');

    } catch (error) {
      console.error('❌ Error en Gestión de contratos:', error.message);

      const screenshot = await driver.takeScreenshot();
      const carpetaErrores = path.resolve(__dirname, '../errores');
      if (!fs.existsSync(carpetaErrores)) fs.mkdirSync(carpetaErrores);
      const ruta = path.join(carpetaErrores, `error_gestionContratos_${Date.now()}.png`);
      fs.writeFileSync(ruta, screenshot, 'base64');
      throw error;
    }
  }
}
