import { By, until, Key } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { testData } from '../../../config/testData.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class ContenidoClasesNegocioPageSoporte {
  /**
 *@param {WebDriver} driver  instancia de selenium
 */
  constructor(driver) {
    this.driver = driver;
  }


  //  ==================================
//  CP_CONTCLANEGSOP_001 – Ingreso a vista
//  3 pasos
//  ==================================

async ingresarVistaContenidoClasesSoporte(caseName = 'CP_CONTCLANEG_SOP_001') {
  const driver = this.driver;

  try {
    // Paso 1: Módulo eCenter
    const eCenterBtn = await driver.wait(
      until.elementLocated(By.xpath("//div[@id='118' and contains(@class, 'item-module')]")),
      10000
    );
    await driver.executeScript("arguments[0].click();", eCenterBtn);
    await driver.sleep(1000);
    console.log("✅ Paso 1: Clic en módulo eCenter.");

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
    console.log("✅ Paso 2: Scroll en contenedor de aplicaciones.");

    // Paso 3: Clic en "Contenido clases de negocio Soporte"
    const contenidoSoporteBtn = await driver.wait(
      until.elementLocated(By.xpath('//*[@id="4046"]/div[2]')),
      15000
    );
    await driver.executeScript(
      "arguments[0].scrollIntoView({behavior:'smooth', block:'center'});",
      contenidoSoporteBtn
    );
    await driver.wait(until.elementIsVisible(contenidoSoporteBtn), 10000);
    await driver.wait(until.elementIsEnabled(contenidoSoporteBtn), 10000);
    await driver.sleep(1000);
    await driver.executeScript("arguments[0].click();", contenidoSoporteBtn);
    await driver.sleep(5000);

    console.log("✅ Paso 3: Vista 'Contenido clases de negocio Soporte' abierta.");

  } catch (error) {
    console.error(`❌ Error ${caseName}: ${error.message}`);
    throw error;
  }
}
}