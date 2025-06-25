import { By, until } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import loginTest from './login.page.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class GestionActivosPage {
  constructor(driver) {
    this.driver = driver;
  }

  async ejecutarGestionActivos() {
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

      // === Paso 3: Clic en "Gestion de Activos" ===
      const gestionActivosBtn = await driver.wait(
        until.elementLocated(By.css('div.application-item[title="Gestion de Activos"]')),
        10000
      );
      await driver.executeScript("arguments[0].scrollIntoView({behavior:'smooth', block:'center'});", gestionActivosBtn);
      await driver.wait(until.elementIsVisible(gestionActivosBtn), 10000);
      await driver.wait(until.elementIsEnabled(gestionActivosBtn), 10000);
      await driver.sleep(1000);
      await driver.executeScript("arguments[0].click();", gestionActivosBtn);
      await driver.sleep(5000);

      // === Paso 4: Seleccionar entidad ===
      const entidadBtn = await driver.wait(
        until.elementLocated(By.xpath("//div[contains(text(), 'Seleccionar entidad') and contains(@class, 'btn-primary')]")),
        20000
      );
      await driver.wait(until.elementIsVisible(entidadBtn), 10000);
      await driver.executeScript("arguments[0].scrollIntoView({behavior:'smooth', block:'center'});", entidadBtn);
      await driver.sleep(1000);
      await driver.executeScript("arguments[0].click();", entidadBtn);
      await driver.sleep(5000);

      await this.seleccionarEnTabla('elemento secundario');
      await this.clickBotonSeleccionar();

      await this.seleccionarEnTabla('ont');
      await this.clickBotonSeleccionar();

    } catch (error) {
      console.error("❌ Error en gestión de activos:", error.message);
      const screenshot = await driver.takeScreenshot();
      const carpetaErrores = path.resolve(__dirname, '../errores');
      if (!fs.existsSync(carpetaErrores)) fs.mkdirSync(carpetaErrores);
      const filePath = path.join(carpetaErrores, `error_gestionActivos_${Date.now()}.png`);
      fs.writeFileSync(filePath, screenshot, 'base64');
      throw error;
    }
  }

  async seleccionarEnTabla(valorBuscado) {
    const driver = this.driver;
    const tabla = await driver.wait(
      until.elementLocated(By.css('div.modal-body table tbody')),
      10000
    );
    const filas = await tabla.findElements(By.css('tr'));
    let encontrado = false;

    for (const fila of filas) {
      const celdas = await fila.findElements(By.css('td'));
      for (const celda of celdas) {
        const texto = (await celda.getText()).trim().toLowerCase();
        if (texto.includes(valorBuscado.toLowerCase())) {
          await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", celda);
          await driver.sleep(500);
          await driver.executeScript("arguments[0].click();", celda);
          console.log(`✅ Se encontró y seleccionó: "${valorBuscado}".`);
          encontrado = true;
          break;
        }
      }
      if (encontrado) break;
    }

    if (!encontrado) {
      throw new Error(`❌ No se encontró ninguna opción que contenga "${valorBuscado}".`);
    }
  }

  async clickBotonSeleccionar() {
    const driver = this.driver;
    const botonSeleccionar = await driver.wait(
      until.elementLocated(By.css('#widget-button-btn-next-step .btn.btn-primary')),
      10000
    );
    await driver.wait(async () => {
      const disabled = await botonSeleccionar.getAttribute('disabled');
      return disabled === null;
    }, 10000);
    await botonSeleccionar.click();
    await driver.sleep(3000);
  }
}
