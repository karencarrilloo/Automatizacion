import { By, until } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class TareasProgramadasAutodiagnosticoPage {
  constructor(driver) {
    this.driver = driver;
  }

  async ingresarTareasProgramadasAutodiagnostico() {
    const driver = this.driver;

    try {
      // === Paso 1: Clic en módulo eCenter ===
      const eCenterBtn = await driver.wait(
        until.elementLocated(
          By.xpath("//div[@id='118' and contains(@class, 'item-module')]")
        ),
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

      // === Paso 3: Clic en "Tareas Programadas Autodiagnóstico" ===
      const targetApp = await driver.wait(
        until.elementLocated(
          By.xpath(
            "//div[contains(@class,'legend-application') and text()='Tareas Programadas Autodiagnóstico']"
          )
        ),
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

      // === Paso 4: Clic en el botón principal de la vista (id 6789) ===
      const tareasBtn = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="6789"]')),
        10000
      );
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", tareasBtn);
      await driver.wait(until.elementIsVisible(tareasBtn), 5000);
      await driver.wait(until.elementIsEnabled(tareasBtn), 5000);
      await driver.sleep(500);
      await driver.executeScript("arguments[0].click();", tareasBtn);
      await driver.sleep(3000);

      console.log("✅ Ingreso exitoso a 'Tareas Programadas Autodiagnóstico'.");

    } catch (error) {
      console.error("❌ Error en Tareas Programadas Autodiagnóstico:", error.message);
      const screenshot = await driver.takeScreenshot();
      const carpetaErrores = path.resolve(__dirname, '../errores');
      if (!fs.existsSync(carpetaErrores)) fs.mkdirSync(carpetaErrores);
      const filePath = path.join(
        carpetaErrores,
        `error_tareasAutodiagnostico_${Date.now()}.png`
      );
      fs.writeFileSync(filePath, screenshot, 'base64');
      throw error;
    }
  }
}
