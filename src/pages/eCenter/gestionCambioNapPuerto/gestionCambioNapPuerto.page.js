import { By, until } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class GestionCambioNapPuertoPage {
  constructor(driver) {
    this.driver = driver;
  }

  //  ====================================
  //  CP_GESCAMNAPPUER_001 – Acceso al la vista Gestión de Activos
  //  pasos 3
  //  ====================================

  async ingresarVistaGestionCambioNapPuerto(caseName = 'CP_GESCAMNAPPUER_001') {
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

      // === Paso 3: Clic en "Gestión cambio de NAP y puerto" ===
      const cambioNapBtn = await driver.wait(
        until.elementLocated(By.xpath("//div[contains(@class,'legend-application') and contains(text(),'Gestión cambio de NAP y puerto')]")),
        10000
      );
      await driver.executeScript("arguments[0].scrollIntoView({behavior:'smooth', block:'center'});", cambioNapBtn);
      await driver.wait(until.elementIsVisible(cambioNapBtn), 10000);
      await driver.wait(until.elementIsEnabled(cambioNapBtn), 10000);
      await driver.sleep(1000);
      await driver.executeScript("arguments[0].click();", cambioNapBtn);
      await driver.sleep(5000);

    } catch (error) {
      console.error(`❌ CP_GESCAMNAPPUER_001 Error: ${error.message}`);
      throw error;
    }
  }

  //  ==================================== 
  //  CP_GESCAMNAPPUER_002 – Seleccionar NAP
  //  pasos x
  //  ====================================

  //  Paso 1: Clic en el botón Picklist
  async SeleccionarNap(caseName = 'CP_GESCAMNAPPUER_002') {
    const driver = this.driver;

    try {
      const btnPicklistXpath = '//*[@id="widget-picklist-picklist-nap"]/div[1]/span/button';
      const opcionesPicklistXpath = '//*[@id="widget-picklist-picklist-nap"]//ul[contains(@class,"ui-menu") or contains(@class,"dropdown-menu")]';

      // 1️⃣ Esperar a que el botón esté presente
      const btnPicklist = await driver.wait(
        until.elementLocated(By.xpath(btnPicklistXpath)),
        10000
      );

      // 2️⃣ Esperar visibilidad y que esté habilitado
      await driver.wait(until.elementIsVisible(btnPicklist), 5000);
      await driver.wait(until.elementIsEnabled(btnPicklist), 5000);

      // 3️⃣ Hacer scroll hasta el botón
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnPicklist);
      await driver.sleep(300);

      // 4️⃣ Intentar clic normal y fallback con JS
      try {
        await btnPicklist.click();
      } catch {
        await driver.executeScript("arguments[0].click();", btnPicklist);
      }

      console.log("✅ Paso 1: Botón 'Seleccionar NAP' presionado correctamente.");
      await driver.sleep(2000);

      // 5️⃣ Esperar que se renderice el menú desplegable del Picklist
      try {
        const opciones = await driver.wait(
          until.elementLocated(By.xpath(opcionesPicklistXpath)),
          8000
        );
        await driver.wait(until.elementIsVisible(opciones), 5000);
        console.log("✅ Paso 1: Picklist abierto y opciones visibles.");
      } catch {
        console.log("⚠️ Paso 1: Click realizado pero no se detectó el contenedor de opciones (verificar Xpath).");
      }

    } catch (error) {
      // Manejo de error con captura si existe método auxiliar
      if (this._capturarError) await this._capturarError(error, caseName);
      throw new Error(`❌ Paso 1: No se pudo hacer clic en el picklist de NAP: ${error.message}`);
    }
  }
}