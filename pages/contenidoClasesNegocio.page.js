import { By, until } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class ContenidoClasesNegocioPage {
  constructor(driver) {
    this.driver = driver;
  }

  async ejecutarContenidoClasesNegocio() {
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

      // === Paso 3: Clic en "Contenido clases de negocio" ===
      const contenidoBtn = await driver.wait(
        until.elementLocated(By.xpath("//div[contains(@class,'legend-application') and contains(text(),'Contenido clases de negocio')]")),
        10000
      );
      await driver.executeScript("arguments[0].scrollIntoView({behavior:'smooth', block:'center'});", contenidoBtn);
      await driver.wait(until.elementIsVisible(contenidoBtn), 10000);
      await driver.wait(until.elementIsEnabled(contenidoBtn), 10000);
      await driver.sleep(1000);
      await driver.executeScript("arguments[0].click();", contenidoBtn);
      await driver.sleep(5000);

      // Aquí podrías continuar con otros pasos si aplica

    } catch (error) {
      console.error("❌ Error en contenido clases de negocio:", error.message);
      const screenshot = await driver.takeScreenshot();
      const carpetaErrores = path.resolve(__dirname, '../errores');
      if (!fs.existsSync(carpetaErrores)) fs.mkdirSync(carpetaErrores);
      const filePath = path.join(carpetaErrores, `error_contenidoClases_${Date.now()}.png`);
      fs.writeFileSync(filePath, screenshot, 'base64');
      throw error;
    }
  }
}
