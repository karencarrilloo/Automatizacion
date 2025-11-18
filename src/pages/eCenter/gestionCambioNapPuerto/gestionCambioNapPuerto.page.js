import { By, until, Key } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { testData } from '../../../config/testData.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class GestionCambioNapPuertoPage {
  /**
  * @param {WebDriver} driver  instancia de selenium
  * @param {string} defaultNapSerialCelsia  ID_DEAL global reutilizable
  * @param {string} defaultIdDeal  ID_DEAL global reutilizable
  * * @param {string} puertoSeleccion  ID_DEAL global reutilizable
  */
  constructor(driver, defaultNapSerialCelsia = testData.GestionCambioNapPuerto.defaultNapSerialCelsia, defaultIdDeal = testData.GestionCambioNapPuerto.defaultIdDeal, puertoSeleccion = testData.GestionCambioNapPuerto.puertoSeleccion) {
    this.driver = driver;
    this.testData = testData.GestionCambioNapPuerto
    this.defaultNapSerialCelsia = defaultNapSerialCelsia;
    this.defaultIdDeal = defaultIdDeal;
    this.puertoSeleccion = puertoSeleccion;
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
      throw new Error(`❌ Paso 2: No se pudo hacer clic en el picklist de NAP: ${error.message}`);
    }

    // === Paso 2: Diligenciar campo "Buscar" con la NAP ===
    try {
      const napBuscar = this.testData.defaultNapSerialCelsia;

      const campoBuscar = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="crud-search-bar"]')),
        15000
      );

      await driver.wait(until.elementIsVisible(campoBuscar), 8000);
      await campoBuscar.clear();
      await campoBuscar.sendKeys(napBuscar);
      await driver.sleep(500);

      // 👉 Presionar Enter para mostrar los resultados
      await campoBuscar.sendKeys(Key.ENTER);
      console.log(`✅ Paso 2: Campo 'Buscar' diligenciado con la NAP ${napBuscar} y búsqueda ejecutada.`);

      await driver.sleep(2000); // Espera breve mientras se cargan los resultados
    } catch (error) {
      throw new Error(`❌ Paso 2: No se pudo diligenciar el campo "Buscar" con la NAP: ${error.message}`);
    }


    // === Paso 3: Seleccionar el registro de la NAP ===
    try {
      const tablaXpath = '//*[@id="grid-table-crud-grid-picklist-nap"]/div/div[2]/table/tbody';

      // Esperar que la tabla esté presente y visible
      const tabla = await driver.wait(
        until.elementLocated(By.xpath(tablaXpath)),
        10000
      );
      await driver.wait(until.elementIsVisible(tabla), 5000);

      // Tomar la primera fila (único registro esperado)
      const fila = await tabla.findElement(By.xpath('./tr[1]'));
      await driver.sleep(500);

      // Clic directo (sin scroll)
      try {
        await fila.click();
      } catch {
        await driver.executeScript("arguments[0].click();", fila);
      }

      console.log("✅ Paso 3: Registro de NAP seleccionado correctamente.");
      await driver.sleep(1000);
    } catch (error) {
      throw new Error(`❌ Paso 3: No se pudo seleccionar el registro de la NAP: ${error.message}`);
    }

    // === Paso 4: Clic en el botón "Seleccionar" del modal ===
    try {
      const btnSeleccionarXpath = '//*[@id="widget-button-btSelect-picklist-nap"]/div';

      const btnSeleccionar = await driver.wait(
        until.elementLocated(By.xpath(btnSeleccionarXpath)),
        10000
      );
      await driver.wait(until.elementIsVisible(btnSeleccionar), 5000);

      await driver.executeScript("arguments[0].click();", btnSeleccionar);
      await driver.sleep(12000);

      console.log("✅ Paso 4: Botón 'Seleccionar' presionado correctamente.");
    } catch (error) {
      throw new Error(`❌ Paso 4: No se pudo presionar el botón 'Seleccionar': ${error.message}`);
    }


  } catch(error) {
    console.error(`❌ CP_GESCAMNAPPUER_002 Error: ${error.message}`);
    throw error;
  }

  //  ==================================== 
  //  CP_GESCAMNAPPUER_003 – Seleccionar un puerto y realizar el cambio
  //  pasos x
  //  ====================================

  async cambioDePuerto(caseName = 'CP_GESCAMNAPPUER_003') {
    const driver = this.driver;
    // === Paso 1: Seleccionar puerto disponible ===
    try {
      const configNap = (this.testData && this.testData.gestionCambioNapPuerto)
        ? this.testData.gestionCambioNapPuerto
        : {};

      const modoSeleccion = configNap.puertoSeleccion || "first";

      const listaPuertosXpath = '//*[@id="widget-list-list1"]/div/div[1]/ul/li';

      // Esperar que aparezca el listado
      await driver.wait(until.elementLocated(By.xpath(listaPuertosXpath)), 15000);

      const puertos = await driver.findElements(By.xpath(listaPuertosXpath));

      if (puertos.length === 0) {
        throw new Error("No se encontraron puertos disponibles.");
      }

      let index = 0;
      if (modoSeleccion === "last") {
        index = puertos.length - 1;
      } else if (modoSeleccion === "random") {
        index = Math.floor(Math.random() * puertos.length);
      } else if (!isNaN(modoSeleccion)) {
        index = Number(modoSeleccion);
      }

      const puertoSeleccionado = puertos[index];

      // Scroll + clic seguro
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", puertoSeleccionado);
      await driver.sleep(400);

      try {
        await puertoSeleccionado.click();
      } catch {
        await driver.executeScript("arguments[0].click();", puertoSeleccionado);
      }

      console.log(`✅ Paso 1: Puerto seleccionado (modo: "${modoSeleccion}", índice: ${index}).`);
      await driver.sleep(2000);

       } catch (error) {
      throw new Error(`❌ Paso 1: No se pudo seleccionar el puerto disponible: ${error.message}`);
    }

  

      // === Paso 2: Diligenciar el campo "ID DEAL" ===
      try {
        const idDealValue = this.testData.defaultIdDeal;
        if (!idDealValue) {
          throw new Error("Valor defaultIdDeal no definido en testData.");
        }

        // 1️⃣ Localizar el campo ID DEAL
        const campoIdDeal = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="textfield-inputIdAccount"]')),
          15000
        );

        await driver.wait(until.elementIsVisible(campoIdDeal), 8000);

        // 2️⃣ Scroll hacia el campo (por seguridad)
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", campoIdDeal);
        await driver.sleep(300);

        // 3️⃣ Limpiar y diligenciar el valor desde testData
        await campoIdDeal.clear();
        await campoIdDeal.sendKeys(idDealValue);
        await driver.sleep(500);

        console.log(`✅ Paso 2: Campo 'ID DEAL' diligenciado correctamente con: ${idDealValue}`);

      } catch (error) {
        throw new Error(`❌ Paso 2: No se pudo diligenciar el campo "ID DEAL": ${error.message}`);
      }


   
    }
  }
