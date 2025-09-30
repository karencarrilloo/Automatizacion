import { By, until } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class ExploradorEntidadesPage {
  constructor(driver) {
    this.driver = driver;
  }

  async ingresarVistaExploradorEntidades() {
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

      // === Paso 3: Clic en "Explorador de entidades" ===
      const targetApp = await driver.wait(
        until.elementLocated(
          By.xpath("//div[contains(@class,'legend-application') and contains(text(),'Explorador de entidades')]")
        ),
        10000
      );
      await driver.executeScript("arguments[0].scrollIntoView({behavior:'smooth', block:'center'});", targetApp);
      await driver.wait(until.elementIsVisible(targetApp), 10000);
      await driver.wait(until.elementIsEnabled(targetApp), 10000);
      await driver.sleep(1000);
      await driver.executeScript("arguments[0].click();", targetApp);
      await driver.sleep(5000);

      console.log("✅ Explorador de entidades abierto correctamente.");
    } catch (error) {
      console.error(`❌ Error al ejecutar Explorador de entidades: ${error.message}`);
      throw error;
    }
  }
  // =======================
  // CP_EXPENT_002 – Selección de elemento secundario y tarjeta ONT
  // =======================
  async seleccionarElementoSecundario(caseName = 'CP_EXPENT_002') {
    const driver = this.driver;

    try {
      // === Paso 1: Clic en "elemento secundario" ===
      const elementoSecundario = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="container-entity"]/div/div[1]/div[2]/div[13]')),
        15000
      );
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", elementoSecundario);
      await driver.wait(until.elementIsVisible(elementoSecundario), 10000);
      await driver.wait(until.elementIsEnabled(elementoSecundario), 10000);
      await elementoSecundario.click();
      await driver.sleep(3000);
      console.log("✅ CP_EXPENT_002 Paso 1: Elemento secundario seleccionado.");

      // === Paso 2: Clic en tarjeta ONT ===
      const tarjetaONT = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="container-entity"]/div/div[1]/div[2]/div[13]/div[5]/div')),
        15000
      );
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", tarjetaONT);
      await driver.wait(until.elementIsVisible(tarjetaONT), 10000);
      await driver.wait(until.elementIsEnabled(tarjetaONT), 10000);
      await tarjetaONT.click();
      await driver.sleep(10000);
      console.log("✅ CP_EXPENT_002 Paso 2: Tarjeta ONT seleccionada.");

      // // === Validación mínima después del clic ===
      // const contenedor = await driver.wait(
      //   until.elementLocated(By.xpath('//*[@id="container-entity"]')),
      //   10000
      // );
      // if (!(await contenedor.isDisplayed())) {
      //   throw new Error("El contenedor de entidad no se muestra tras seleccionar la tarjeta ONT.");
      // }
      // console.log("✅ CP_EXPENT_002 Validación: Contenedor visible tras seleccionar ONT.");



    } catch (error) {
      console.error(`❌ Error en ${caseName}: ${error.message}`);
      throw error;
    }
  }

  // =======================
  // CP_EXPENT_003 – Crear nuevo registro de entidad
  // =======================
  async crearNuevoRegistroEntidad(caseName = 'CP_EXPENT_003') {
    const driver = this.driver;

    try {
      // Paso 1: Esperar contenedor correcto
      const contenedor = await driver.wait(
        until.elementLocated(By.id('container-grid-crud')),
        20000
      );
      await driver.wait(until.elementIsVisible(contenedor), 20000);

      // Paso 2: Buscar tarjetas dentro de este contenedor
      const tarjetas = await driver.findElements(
        By.xpath('//*[@id="container-grid-crud"]//div[starts-with(@id,"device-")]')
      );

      if (tarjetas.length === 0) {
        throw new Error("No se encontraron tarjetas dentro de #container-grid-crud.");
      }

      // Paso 3: Clic en la primera tarjeta
      const primeraTarjeta = tarjetas[0];
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", primeraTarjeta);
      await driver.wait(until.elementIsVisible(primeraTarjeta), 30000);
      await primeraTarjeta.click();
      await driver.sleep(2000);

      console.log("✅ CP_EXPENT_003 Paso 1: Primera tarjeta de entidad seleccionada.");

      // // Paso 4: Validación de que se abre la vista de la entidad
      // const vistaEntidad = await driver.wait(
      //   until.elementLocated(By.css('.legend-application')),
      //   20000
      // );
      // if (!(await vistaEntidad.isDisplayed())) {
      //   throw new Error("La vista de la entidad no se abrió tras hacer clic en la tarjeta.");
      // }
      // console.log("✅ CP_EXPENT_003 Validación: Vista de entidad cargada.");

    } catch (error) {
      console.error(`❌ Error en ${caseName}: ${error.message}`);
      throw error;
    }
  }




}
