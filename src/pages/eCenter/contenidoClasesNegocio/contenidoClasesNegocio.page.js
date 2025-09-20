import { By, until } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

export default class ContenidoClasesNegocioPage {
  constructor(driver) {
    this.driver = driver;
  }

  /**
   * ==================================
   * CP_CONTENIDO_001 – Ingreso a vista
   * ==================================
   * Pasos:
   *   1. Clic en módulo eCenter
   *   2. Scroll en contenedor de aplicaciones
   *   3. Clic en "Contenido clases de negocio"
   */
  async ingresarVistaContenidoClases(caseName = 'CP_CONTENIDO_001') {
    const driver = this.driver;

    try {
      // Paso 1: Módulo eCenter
      const eCenterBtn = await driver.wait(
        until.elementLocated(By.xpath("//div[@id='118' and contains(@class, 'item-module')]")),
        10000
      );
      await driver.executeScript("arguments[0].click();", eCenterBtn);
      await driver.sleep(1000);
      console.log("✅ [CP_CONTENIDO_001] Paso 1: Clic en módulo eCenter.");

      // Paso 2: Scroll en el contenedor de aplicaciones
      const scrollContainer = await driver.wait(
        until.elementLocated(By.css('.container-applications')),
        10000
      );
      await driver.executeScript(
        "arguments[0].scrollTop = arguments[0].scrollHeight;",
        scrollContainer
      );
      await driver.sleep(1000);
      console.log("✅ [CP_CONTENIDO_001] Paso 2: Scroll en contenedor de aplicaciones.");

      // Paso 3: Clic en "Contenido clases de negocio"
      const contenidoBtn = await driver.wait(
        until.elementLocated(
          By.xpath("//div[contains(@class,'legend-application') and contains(text(),'Contenido clases de negocio')]")
        ),
        15000
      );
      await driver.executeScript("arguments[0].scrollIntoView({behavior:'smooth', block:'center'});", contenidoBtn);
      await driver.wait(until.elementIsVisible(contenidoBtn), 10000);
      await driver.wait(until.elementIsEnabled(contenidoBtn), 10000);
      await driver.sleep(1000);
      await driver.executeScript("arguments[0].click();", contenidoBtn);
      await driver.sleep(5000);
      console.log("✅ [CP_CONTENIDO_001] Paso 3: Vista 'Contenido clases de negocio' abierta.");

    } catch (error) {
      console.error(`❌ [CP_CONTENIDO_001] Error: ${error.message}`);

      // Captura de pantalla en caso de error
      const screenshot = await driver.takeScreenshot();
      const errorsRoot = path.resolve(__dirname, '../../../../errors', 'contenidoClasesNegocio', caseName);
      fs.mkdirSync(errorsRoot, { recursive: true });
      const filePath = path.join(errorsRoot, `error_${Date.now()}.png`);
      fs.writeFileSync(filePath, screenshot, 'base64');

      throw error;
    }
  }
}
