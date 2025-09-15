import { By, until } from 'selenium-webdriver';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class AutodiagnosticoPage {
    constructor(driver) {
        this.driver = driver;
    }

    async ejecutarAutodiagnostico() {
        const driver = this.driver;

        try {

            // Paso 1: Clic en módulo eCenter ===
            try {
                const eCenterBtn = await driver.wait(
                    until.elementLocated(By.xpath("//div[@id='118' and contains(@class, 'item-module')]")),
                    10000
                );
                await driver.executeScript("arguments[0].click();", eCenterBtn);
                await driver.sleep(1000);
                console.log("✅ Paso 1: Módulo eCenter presionado correctamente.");
            } catch (error) {
                throw new Error(`❌ Error en Paso 1: (clic en módulo eCenter): ${error.message}`);
            }

            // === Paso 2: Scroll en el contenedor de aplicaciones ===
            try {
                const scrollContainer = await driver.wait(
                    until.elementLocated(By.css('.container-applications')),
                    10000
                );
                await driver.executeScript(
                    "arguments[0].scrollTop = arguments[0].scrollHeight;",
                    scrollContainer
                );
                await driver.sleep(1000);
                console.log("✅ Paso 2: Scroll en contenedor de aplicaciones realizado correctamente.");
            } catch (error) {
                throw new Error(`❌ Error en Paso 2 (scroll en contenedor de aplicaciones): ${error.message}`);
            }

            // === Paso 3: Clic en módulo "Autodiagnóstico" ===
            try {
                const autodiagnosticoBtn = await driver.wait(
                    until.elementLocated(By.xpath('//*[@id="4240"]/div[2]')),
                    10000
                );

                await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", autodiagnosticoBtn);
                await driver.wait(until.elementIsVisible(autodiagnosticoBtn), 10000);
                await driver.wait(until.elementIsEnabled(autodiagnosticoBtn), 10000);
                await driver.sleep(1000);
                await driver.executeScript("arguments[0].click();", autodiagnosticoBtn);
                await driver.sleep(5000); // esperar que cargue la vista

                console.log("✅ Paso 3: Vista 'Autodiagnóstico' abierta correctamente.");
            } catch (error) {
                throw new Error(`❌ error en Paso 3: (clic en módulo 'Autodiagnóstico'): ${error.message}`);
            }


            // Paso 4: Clic en botón "ID DEAL" ===
            try {
                const botonIDDeal = await driver.wait(
                    until.elementLocated(By.xpath('//*[@id="container-mainframe"]/div[4]/div/div/div/div[2]/div[2]/div[3]')),
                    10000
                );

                // Scroll y condiciones previas al clic
                await driver.executeScript("arguments[0].scrollIntoView({behavior:'smooth', block:'center'});", botonIDDeal);
                await driver.wait(until.elementIsVisible(botonIDDeal), 10000);
                await driver.wait(until.elementIsEnabled(botonIDDeal), 10000);
                await driver.sleep(1000);
                await botonIDDeal.click();
                await driver.sleep(3000); // espera para la carga de la siguiente vista

                console.log("✅ Error en  Paso 4: Botón 'ID DEAL' presionado correctamente.");
            } catch (error) {
                throw new Error(`❌ Error en Paso 4 (clic en botón 'ID DEAL'): ${error.message}`);
            }

            // === Paso 5: Ingresar número ID DEAL válido ===
            try {
                const inputIDDeal = await driver.wait(
                    until.elementLocated(By.xpath('//*[@id="textfield-input-consult-customer"]')),
                    10000
                );

                await driver.wait(until.elementIsVisible(inputIDDeal), 5000);
                await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", inputIDDeal);
                await driver.sleep(500);

                await inputIDDeal.clear();
                await inputIDDeal.sendKeys("28006582524");
                await driver.sleep(1000);

                console.log("✅ Paso 5: ID DEAL ingresado correctamente.");
            } catch (error) {
                throw new Error(`❌ Paso 5 (ingresar ID DEAL): ${error.message}`);
            }

            // === Paso 6 Clic en botón "Consultar cliente" === 
            try {
                const btnConsultarCliente = await driver.wait(
                    until.elementLocated(By.xpath('//*[@id="container-mainframe"]/div[4]/div/div/div/div[2]/div[3]/div[3]')),
                    20000
                );

                await driver.wait(until.elementIsVisible(btnConsultarCliente), 10000);
                await driver.wait(until.elementIsEnabled(btnConsultarCliente), 10000);
                await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnConsultarCliente);
                await driver.sleep(500);

                await btnConsultarCliente.click();

                // 🔹 Espera dinámica del loader
                try {
                    // Si aparece el contenedor de progreso, esperar hasta que desaparezca
                    const contenedorCarga = await driver.wait(
                        until.elementLocated(By.css("div.container-loading-iptotal")),
                        5000
                    );
                    console.log("⏳ Se detectó loader, esperando que finalice...");

                    await driver.wait(
                        until.stalenessOf(contenedorCarga),
                        60000 // esperar hasta 60s a que desaparezca
                    );

                    console.log("✅ Loader finalizado, ventana habilitada.");
                } catch (e) {
                    console.log("ℹ️ No se detectó loader, se continúa directamente.");
                }

                console.log("✅ Paso 6 Botón 'Consultar cliente' presionado correctamente.");
            } catch (error) {
                throw new Error(`❌ Error en Paso 6 (clic en botón 'Consultar cliente'): ${error.message}`);
            }


            // === Paso 7 Clic en botón "Opciones" ===
            try {
                const btnOpciones = await driver.wait(
                    until.elementLocated(By.xpath('//*[@id="btn-options"]')),
                    10000
                );

                await driver.wait(until.elementIsVisible(btnOpciones), 5000);
                await driver.wait(until.elementIsEnabled(btnOpciones), 5000);
                await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnOpciones);
                await driver.sleep(500); // Pausa corta

                await btnOpciones.click();
                await driver.sleep(3000); // Espera breve post-clic

                console.log("✅ Paso 7 Botón 'Opciones' presionado correctamente.");
            } catch (error) {
                throw new Error(`❌ Error en Paso 7 (clic en botón 'Opciones'): ${error.message}`);
            }

            // === Paso 8: Clic en opción "Configuración WiFi" ===
            try {
                const driver = this.driver;

                // Esperar directamente la opción
                const opcionWifi = await driver.wait(
                    until.elementLocated(By.xpath('//*[@id="1200"]/div')),
                    15000
                );

                await driver.wait(until.elementIsVisible(opcionWifi), 5000);
                await driver.wait(until.elementIsEnabled(opcionWifi), 5000);

                await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", opcionWifi);
                await driver.sleep(500);

                await opcionWifi.click();

                // Espera dinámica: esperar que desaparezca el contenedor de progreso si existe
                const loaderXPath = '//*[@id="progress-id-progress-WIFI"]'; // Ajusta este ID si usas otro
                try {
                    const progressDiv = await driver.wait(
                        until.elementLocated(By.xpath(loaderXPath)),
                        5000
                    );
                    await driver.wait(until.stalenessOf(progressDiv), 15000); // Espera a que desaparezca
                } catch {
                    // Si no se encuentra el loader, continuar sin error
                    console.log("ℹ️ No se encontró un loader visible, continuando...");
                }

                console.log("✅ Paso 8: Opción 'Configuración WiFi' seleccionada correctamente.");
            } catch (error) {
                throw new Error(`❌ Error en Paso 8: (clic en opción 'Configuración WiFi'): ${error.message}`);
            }


            // === Paso 9: Seleccionar el campo "Nombre de red" === 
            try {
                const driver = this.driver;

                // Esperar el contenedor del campo (div con id dinámico)
                const contenedorCampo = await driver.wait(
                    until.elementLocated(By.xpath('//*[@id="widget-textfield-2_4GHz-1"]')),
                    20000
                );
                await driver.wait(until.elementIsVisible(contenedorCampo), 10000);

                // Dentro del contenedor buscar el <input> real
                const inputNombreRed = await contenedorCampo.findElement(By.css('input'));

                // Esperar a que esté visible y habilitado
                await driver.wait(until.elementIsVisible(inputNombreRed), 10000);
                await driver.wait(until.elementIsEnabled(inputNombreRed), 10000);

                // Scroll y foco en el input
                await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", inputNombreRed);
                await driver.sleep(500);

                await inputNombreRed.click();
                await driver.executeScript("arguments[0].focus();", inputNombreRed);
                await driver.sleep(500);

                console.log("✅ Paso 9: Campo 'Nombre de red' localizado y enfocado correctamente.");
            } catch (error) {
                throw new Error(`❌ Error en Paso 9: (selección campo 'Nombre de red'): ${error.message}`);
            }


            // === Paso 10: Digitar "TEST_EDICION" en el campo "Nombre de red" ===
            try {
                const driver = this.driver;

                // Esperar el campo input "Nombre de red"
                const inputNombreRed = await driver.wait(
                    until.elementLocated(By.xpath('//*[@id="textfield-2_4GHz-1"]')),
                    10000
                );
                await driver.wait(until.elementIsVisible(inputNombreRed), 5000);
                await driver.wait(until.elementIsEnabled(inputNombreRed), 5000);

                // Limpiar el campo si ya tiene texto
                await inputNombreRed.clear();
                await driver.sleep(500);

                // Escribir el nuevo valor
                await inputNombreRed.sendKeys("TEST_EDICION");
                await driver.sleep(2000);

                console.log("✅ Paso 10: Se ingresó correctamente el texto 'test_automatización' en el campo Nombre de red.");
            } catch (error) {
                throw new Error(`❌ Error en Paso 10: (escribir en campo 'Nombre de red'): ${error.message}`);
            }

            // === Paso 11: Clic en el select "CANAL" ===
            try {
                const driver = this.driver;

                // Esperar que el <select> esté presente y visible
                const selectCanal = await driver.wait(
                    until.elementLocated(By.xpath('//*[@id="input-select-select-2_4GHz3"]')),
                    10000
                );
                await driver.wait(until.elementIsVisible(selectCanal), 5000);
                await driver.wait(until.elementIsEnabled(selectCanal), 5000);

                // Hacer clic en el <select>
                await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", selectCanal);
                await driver.sleep(300);
                await selectCanal.click();
                await driver.sleep(1000);

                console.log("✅ Paso 11: Clic en el select 'CANAL' realizado correctamente.");
            } catch (error) {
                throw new Error(`❌ Error en Paso 11: (clic en select 'CANAL'): ${error.message}`);
            }

            // === Paso 12: Seleccionar opción aleatoria del select de CANAL ===  
            try {
                const driver = this.driver;

                // Esperar que el select esté presente
                const selectElement = await driver.wait(
                    until.elementLocated(By.xpath('//*[@id="input-select-select-2_4GHz3"]')),
                    10000
                );

                // Obtener todas las opciones del select
                const options = await selectElement.findElements(By.css('option'));

                // Filtrar opciones válidas (evitamos la de "Seleccionar")
                let opcionesValidas = [];
                for (let opt of options) {
                    const text = await opt.getText();
                    if (text && text.trim() !== "Seleccionar") {
                        opcionesValidas.push(opt);
                    }
                }

                if (opcionesValidas.length === 0) {
                    throw new Error("⚠️ No se encontraron opciones válidas en el select de CANAL.");
                }

                // Seleccionar una opción al azar
                const randomIndex = Math.floor(Math.random() * opcionesValidas.length);
                const opcionSeleccionada = opcionesValidas[randomIndex];

                // Obtener texto antes de seleccionar
                const textoSeleccionado = await opcionSeleccionada.getText();

                // Forzar selección con JS para disparar evento change
                await driver.executeScript(`
        arguments[0].selected = true;
        arguments[0].dispatchEvent(new Event('change', { bubbles: true }));
    `, opcionSeleccionada);

                await driver.sleep(1500); // pequeña espera para que cierre la lista

                console.log(`✅ Paso 12: Opción '${textoSeleccionado}' seleccionada correctamente.`);
            } catch (error) {
                throw new Error(`❌ Error en Paso 12: (selección opción aleatoria de CANAL): ${error.message}`);
            }


        } catch (error) {
            console.error("❌ Error en Autodiagnostico:", error.message);

            const screenshot = await driver.takeScreenshot();
            const carpetaErrores = path.resolve(__dirname, '../errores');
            if (!fs.existsSync(carpetaErrores)) fs.mkdirSync(carpetaErrores);
            const ruta = path.join(carpetaErrores, `error_Autodiagnostico_${Date.now()}.png`);
            fs.writeFileSync(ruta, screenshot, 'base64');
            throw error;
        }
    }
}