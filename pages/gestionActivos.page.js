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
      await driver.sleep(5000);

      // === Paso 5: Seleccionar fila con ID 8 (OPERATIVE) ===
      try {
        // Esperar que el tbody del grid esté disponible
        const cuerpoTabla = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="grid-table-crud-grid-crud-select-device"]/div/div[2]/table/tbody')),
          10000
        );

        // Esperar específicamente la fila con ID 8
        const filaOperative = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="row-8"]')),
          5000
        );

        // Asegurar visibilidad y hacer scroll
        await driver.wait(until.elementIsVisible(filaOperative), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", filaOperative);
        await driver.sleep(300);

        // Hacer clic sobre la fila
        await filaOperative.click();
        await driver.sleep(1000);

        console.log("✅ Paso 5 completado: Fila con ID 8 seleccionada correctamente.");

      } catch (error) {
        throw new Error(`❌ Error en paso 5 (selección de fila 'OPERATIVE'): ${error.message}`);
      }

      // === Paso 6: Hacer clic en el botón "FINALIZAR" ===
      try {
        // Esperar contenedor del footer del wizard
        const contenedorFooter = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-dialog-wizard-dialog"]/div/div/div[3]')),
          10000
        );

        // Buscar botón "FINALIZAR"
        const botonFinalizar = await contenedorFooter.findElement(
          By.xpath('//*[@id="widget-button-btn-next-step"]/div')
        );

        // Esperar a que el botón sea visible e interactuable
        await driver.wait(until.elementIsVisible(botonFinalizar), 5000);
        await driver.wait(until.elementIsEnabled(botonFinalizar), 5000);

        // Scroll al botón y clic
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonFinalizar);
        await driver.sleep(300);
        await botonFinalizar.click();

        console.log("✅ Paso 6: clic en 'FINALIZAR' realizado.");

        // === Espera dinámica tras clic en "FINALIZAR" ===
        // Asumimos que aparece un progress bar o spinner que luego desaparece
        try {
          // Esperar hasta que el progress sea visible
          const progressBar = await driver.wait(
            until.elementLocated(By.css('.progress-bar')), // <- Ajustar clase si es otra
            5000
          );

          // Esperar hasta que desaparezca (máx. 15s)
          await driver.wait(
            until.stalenessOf(progressBar),
            15000
          );

          console.log("✅ Espera dinámica: Progress finalizó correctamente.");
        } catch (waitError) {
          console.warn("⚠️ Advertencia: No se detectó barra de progreso o ya había desaparecido.");
        }

      } catch (error) {
        throw new Error(`❌ Error en paso 6 (clic en botón 'FINALIZAR'): ${error.message}`);
      }



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
