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

    //  ==================================
    //  CP_CONTCLANEGSOP_002 – Seleccionar una entidad (Entidad que se encarga de almacenar idcuentas para simular aprovisionamiento)
    //  3 pasos
    //  ==================================

    async seleccionarEntidad() {
        const driver = this.driver;

        // Paso 1: Clic en el botón de la tabla (picklist)
        try {
            const botonPicklist = await driver.wait(
                until.elementLocated(By.css("button.btn.btn-default.picklist-btn")),
                10000
            );

            await driver.executeScript(
                "arguments[0].scrollIntoView({behavior:'smooth', block:'center'});",
                botonPicklist
            );
            await driver.sleep(500);

            const visible = await botonPicklist.isDisplayed();
            const habilitado = await botonPicklist.isEnabled();
            if (!visible || !habilitado) {
                throw new Error("❌ El botón picklist no está visible o habilitado.");
            }

            await driver.executeScript("arguments[0].click();", botonPicklist);
            await driver.sleep(3000);

            console.log("✅ Paso 1: Botón picklist presionado correctamente.");
        } catch (error) {
            throw new Error(`❌ Error en Paso 1 (clic en botón picklist): ${error.message}`);
        }

        // Paso 2: Diligenciar barra de búsqueda con "IDSIMULATION" y presionar ENTER
        try {
            // 1️⃣ Contenedor de la barra
            const searchBarContainer = await driver.wait(
                until.elementLocated(By.xpath('//*[@id="cont-crud-search-bar"]')),
                10000
            );

            await driver.executeScript(
                "arguments[0].scrollIntoView({behavior:'smooth', block:'center'});",
                searchBarContainer
            );
            await driver.sleep(500);

            // 2️⃣ Activar la barra de búsqueda
            await driver.executeScript("arguments[0].click();", searchBarContainer);
            await driver.sleep(500);

            // 3️⃣ Input interno
            const inputBusqueda = await searchBarContainer.findElement(By.css('input'));
            await driver.wait(until.elementIsVisible(inputBusqueda), 5000);

            // 4️⃣ Escribir texto y presionar ENTER
            await inputBusqueda.clear();
            await inputBusqueda.sendKeys("IDSIMULATION", Key.ENTER);
            await driver.sleep(2000); // tiempo para aplicar el filtro

            console.log("✅ Paso 2: Búsqueda 'IDSIMULATION' ejecutada con ENTER.");
        } catch (error) {
            throw new Error(`❌ Error en Paso 2 (buscar IDSIMULATION): ${error.message}`);
        }

    }

    }
