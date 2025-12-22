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
   *@param {string} defaultIdDeal ID_DEAL para fr_idsimulation
   */
    constructor(driver, defaultIdDeal = testData.contenidoClasesNegocioSoporte.defaultIdDeal ) {
        this.driver = driver;
        this.defaultIdDeal = defaultIdDeal;
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

        // Paso 3: Seleccionar la entidad con nombre "IDSIMULATION"
        try {
            // 1️⃣ Ubicar el cuerpo de la tabla
            const tablaBody = await driver.wait(
                until.elementLocated(
                    By.xpath('//*[@id="grid-table-crud-grid-listId"]/div/div[2]/table/tbody')
                ),
                10000
            );

            // 2️⃣ Obtener todas las filas
            const filas = await tablaBody.findElements(By.css('tr'));

            let filaObjetivo = null;

            for (const fila of filas) {
                const textoFila = (await fila.getText()).trim().toUpperCase();
                if (textoFila.includes("IDSIMULATION")) {
                    filaObjetivo = fila;
                    break;
                }
            }

            if (!filaObjetivo) {
                throw new Error("No se encontró la fila con texto 'IDSIMULATION'.");
            }

            // 3️⃣ Seleccionar la celda ID de la fila encontrada
            const celdaSeleccion = await filaObjetivo.findElement(By.css('td#id'));

            await driver.executeScript(
                "arguments[0].scrollIntoView({block:'center'});",
                celdaSeleccion
            );
            await driver.sleep(500);
            await driver.executeScript("arguments[0].click();", celdaSeleccion);

            // 4️⃣ Validar que la fila quedó activa
            const claseFila = await filaObjetivo.getAttribute("class");
            if (!claseFila || !claseFila.includes("active")) {
                throw new Error("❌ La fila 'IDSIMULATION' no fue marcada como activa.");
            }

            console.log("✅ Paso 3: Entidad 'IDSIMULATION' seleccionada correctamente.");
            await driver.sleep(2000);

        } catch (error) {
            throw new Error(`❌ Error en Paso 3 (seleccionar entidad 'IDSIMULATION'): ${error.message}`);
        }

        // Paso 4: Clic en el botón "Seleccionar" ===

        const botonSeleccionar = await driver.wait(
            until.elementLocated(By.xpath("//div[contains(text(),'Seleccionar') and contains(@class, 'btn-primary')]")),
            10000
        );

        // Esperar a que el botón sea visible
        await driver.wait(until.elementIsVisible(botonSeleccionar), 10000);

        // Esperar a que el botón esté habilitado (sin atributo 'disabled')
        await driver.wait(async () => {
            const disabledAttr = await botonSeleccionar.getAttribute('disabled');
            const classAttr = await botonSeleccionar.getAttribute('class');
            return !disabledAttr && !classAttr.includes('disabled');
        }, 10000, '❌ El botón "Seleccionar" no se habilitó a tiempo.');

        // Scroll para asegurarse de que es visible en viewport
        await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", botonSeleccionar);
        await driver.sleep(500); // Pausa por animación o transición

        // Clic en el botón
        await driver.executeScript("arguments[0].click();", botonSeleccionar);
        // console.log('✅ Se hizo clic en el botón "Seleccionar".');
        await driver.sleep(5000);
        console.log("✅ paso 4 Clic en el botón Seleccionar correctamente (ALIAS 'Modelos').");
        await driver.sleep(2000);
    } catch(error) {
        throw new Error(`❌ Error en Paso 4: ${error.message}`);
    }

    //  ==================================
    //  CP_CONTCLANEG_003 – Crear fr_idsimulation
    //  Paso 1
    //  ==================================

    async crearIdsimulation(caseName = 'CP_CONTCLANEG_004') {
        const driver = this.driver;

        try {
            // Paso 1: Clic en botón "Nuevo"
            const botonNuevo = await driver.wait(
                until.elementLocated(By.xpath('//*[@id="crud-new-btn"]')),
                10000
            );

            await driver.wait(until.elementIsVisible(botonNuevo), 5000);
            await driver.wait(until.elementIsEnabled(botonNuevo), 5000);

            await driver.executeScript(
                "arguments[0].scrollIntoView({block:'center'});",
                botonNuevo
            );
            await driver.sleep(500);

            await driver.executeScript("arguments[0].click();", botonNuevo);
            await driver.sleep(3000);

            console.log("✅ CP_CONTCLANEG_004 Paso 1: Botón 'Nuevo' presionado correctamente.");

        } catch (error) {
            throw new Error(`❌ CP_CONTCLANEG_004 Error en Paso 1 (clic en botón Nuevo): ${error.message}`);
        }

        // === Paso 2: Diligenciar campo "ID_DEAL" ===
        try {
            const inputIdDeal = await driver.wait(
                until.elementLocated(By.xpath('//*[@id="textfield-idcuenta"]')),
                10000
            );

            await driver.wait(until.elementIsVisible(inputIdDeal), 5000);
            await driver.wait(until.elementIsEnabled(inputIdDeal), 5000);

            await driver.executeScript(
                "arguments[0].scrollIntoView({block:'center'});",
                inputIdDeal
            );
            await driver.sleep(500);

            await inputIdDeal.clear();
            await inputIdDeal.sendKeys(this.defaultIdDeal);
            await driver.sleep(2000);

            console.log(`✅ CP_CONTCLANEG_004 Paso 2: Campo 'ID_DEAL' diligenciado con ${this.defaultIdDeal}.`);

        } catch (error) {
            throw new Error(`❌ CP_CONTCLANEG_004 Error en Paso 2 (diligenciar ID_DEAL): ${error.message}`);
        }

    }



}







