import { By, until } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

export default class VisorInformacionTecnicaRedPage {
  constructor(driver) {
    this.driver = driver;
  }

  /**
   * ====================================
   * CP_VISOR_INFO_TECNICA_001 – Ingreso a la vista
   * ====================================
   * Pasos:
   *   1. Clic en módulo eCenter
   *   2. Scroll en contenedor de aplicaciones
   *   3. Clic en "Visor de información técnica de red"
   */
  async ingresarVistaVisorInformacion(caseName = 'CP_VISOR_INFO_TECNICA_001') {
    const driver = this.driver;

    try {
      // === Paso 1: Clic en módulo eCenter ===
      const eCenterBtn = await driver.wait(
        until.elementLocated(By.xpath("//div[@id='118' and contains(@class, 'item-module')]")),
        10000
      );
      await driver.executeScript("arguments[0].click();", eCenterBtn);
      await driver.sleep(1000);
      console.log("✅ [CP_VISOR_INFO_TECNICA_001] Paso 1: Módulo eCenter presionado.");

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
      console.log("✅ [CP_VISOR_INFO_TECNICA_001] Paso 2: Scroll en contenedor de aplicaciones.");

      // === Paso 3: Clic en "Visor de información técnica de red" ===
      const visorInfoTecnica = await driver.wait(
        until.elementLocated(
          By.xpath(
            '//div[@class="application-item" and @title="Visor de información técnica de red" and @data-name="Active_ports"]'
          )
        ),
        10000
      );

      await driver.wait(until.elementIsVisible(visorInfoTecnica), 5000);
      await driver.wait(until.elementIsEnabled(visorInfoTecnica), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", visorInfoTecnica);
      await driver.sleep(500);
      await visorInfoTecnica.click();
      await driver.sleep(3000);
      console.log("✅ [CP_VISOR_INFO_TECNICA_001] Paso 3: Vista 'Visor de información técnica de red' abierta.");

    } catch (error) {
      console.error(`❌ [CP_VISOR_INFO_TECNICA_001] Error: ${error.message}`);

      // Captura de pantalla en caso de fallo
      const screenshot = await driver.takeScreenshot();
      const errorsRoot = path.resolve(__dirname, '../../../../errors', 'visorInformacionTecnicaRed', caseName);
      fs.mkdirSync(errorsRoot, { recursive: true });
      const filePath = path.join(errorsRoot, `error_${Date.now()}.png`);
      fs.writeFileSync(filePath, screenshot, 'base64');

      throw error;
    }
  }
}
