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


            // === Paso 13: Clic en el select "ANCHO BANDA CANAL" ===
            try {
                const driver = this.driver;

                // Esperar que el <select> de ancho banda esté presente y visible
                const selectAnchoBanda = await driver.wait(
                    until.elementLocated(By.xpath('//*[@id="input-select-select-2_4GHz4"]')),
                    10000
                );
                await driver.wait(until.elementIsVisible(selectAnchoBanda), 5000);
                await driver.wait(until.elementIsEnabled(selectAnchoBanda), 5000);

                // Hacer clic en el <select>
                await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", selectAnchoBanda);
                await driver.sleep(300);
                await selectAnchoBanda.click();
                await driver.sleep(1000);

                console.log("✅ Paso 13: Clic en el select 'ANCHO BANDA CANAL' realizado correctamente.");
            } catch (error) {
                throw new Error(`❌ Error en Paso 13: (clic en select 'ANCHO BANDA CANAL'): ${error.message}`);
            }

            // === Paso 14: Seleccionar opción aleatoria del select "ANCHO BANDA CANAL" ===
            try {
                const driver = this.driver;

                // Esperar que el <select> de ANCHO BANDA CANAL esté presente
                const selectElement = await driver.wait(
                    until.elementLocated(By.xpath('//*[@id="input-select-select-2_4GHz4"]')),
                    10000
                );

                // Obtener todas las opciones del select
                const options = await selectElement.findElements(By.css('option'));

                // Filtrar opciones válidas (evitamos la de "Seleccionar" si existiera)
                let opcionesValidas = [];
                for (let opt of options) {
                    const text = await opt.getText();
                    if (text && text.trim() !== "Seleccionar") {
                        opcionesValidas.push(opt);
                    }
                }

                if (opcionesValidas.length === 0) {
                    throw new Error("⚠️ No se encontraron opciones válidas en el select de ANCHO BANDA CANAL.");
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

                await driver.sleep(1500); // pequeña espera para que cierre la lista/desencadene eventos

                console.log(`✅ Paso 14: Opción '${textoSeleccionado}' seleccionada correctamente en 'ANCHO BANDA CANAL'.`);
            } catch (error) {
                throw new Error(`❌ Error en Paso 14: (selección opción aleatoria de ANCHO BANDA CANAL): ${error.message}`);
            }

            // === Paso 15: Clic en el checkbox "Unsecured" (clic en el label) ===
            try {
                const driver = this.driver;

                // Ubicar el <label> que envuelve al input
                const checkboxLabel = await driver.wait(
                    until.elementLocated(
                        By.xpath('//*[@id="widget-checkbox-checklist-data2_4GHz1"]/label')
                    ),
                    10000
                );

                // Esperar a que el label sea visible
                await driver.wait(until.elementIsVisible(checkboxLabel), 5000);

                // Scroll por si no está en pantalla
                await driver.executeScript(
                    "arguments[0].scrollIntoView({block:'center'});",
                    checkboxLabel
                );
                await driver.sleep(300);

                // Clic en el label para marcar el checkbox
                await driver.executeScript("arguments[0].click();", checkboxLabel);
                await driver.sleep(800);

                console.log("✅ Paso 15: Checkbox 'Unsecured' marcado correctamente mediante clic en el label.");
            } catch (error) {
                throw new Error(`❌ Error en Paso 15 (clic en label de checkbox 'Unsecured'): ${error.message}`);
            }

            // === Paso 16: Clic en el botón "ENVIAR" con espera dinámica de progress ===
            try {
                const driver = this.driver;
                const btnEnviarXpath = '//*[@id="widget-button-send-info"]/div';
                const progressXpath = '//*[@class="progress-bar"]'; // ajusta si la clase cambia

                // 1️⃣ Localizar y asegurar visibilidad/habilitación del botón
                const btnEnviar = await driver.wait(
                    until.elementLocated(By.xpath(btnEnviarXpath)),
                    10000
                );
                await driver.wait(until.elementIsVisible(btnEnviar), 5000);
                await driver.wait(until.elementIsEnabled(btnEnviar), 5000);

                // 2️⃣ Centrarlo en pantalla
                await driver.executeScript(
                    "arguments[0].scrollIntoView({block: 'center'});",
                    btnEnviar
                );
                await driver.sleep(300);

                // 3️⃣ Clic (fallback a JS si es interceptado)
                try {
                    await btnEnviar.click();
                } catch {
                    await driver.executeScript("arguments[0].click();", btnEnviar);
                }
                console.log("✅ Paso 16: Botón 'ENVIAR' presionado.");

                // 4️⃣ Espera dinámica de progress
                try {
                    const progress = await driver.wait(
                        until.elementLocated(By.xpath(progressXpath)),
                        5000 // esperar a que aparezca (si no aparece, sigue sin error)
                    );
                    console.log("⏳ Progress detectado. Esperando a que finalice...");
                    await driver.wait(until.stalenessOf(progress), 30000); // esperar a que desaparezca
                    console.log("✅ Progress finalizado.");
                } catch {
                    console.log("⚠️ No se detectó progress, se continúa.");
                }

                // 5️⃣ (Opcional) Esperar a un mensaje de éxito o nuevo elemento
                // await driver.wait(until.elementLocated(By.xpath("//div[contains(text(),'Configuración aplicada')]")), 15000);

            } catch (error) {
                throw new Error(`❌ Error en Paso 16: (clic en botón 'ENVIAR'): ${error.message}`);
            }


            // === Paso 17: Cerrar el modal de Configuración WiFi ===
            try {
                const driver = this.driver;
                const closeBtnXpath = '//*[@id="widget-dialog-open-dialog-603378-undefined"]/div/div/div[1]/button';
                const modalRootXpath = '//*[@id="widget-dialog-open-dialog-603378-undefined"]/div/div';

                const closeBtn = await driver.wait(
                    until.elementLocated(By.xpath(closeBtnXpath)),
                    10000
                );
                await driver.wait(until.elementIsVisible(closeBtn), 5000);

                // Desplazar y hacer clic
                await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", closeBtn);
                await driver.sleep(200);
                try {
                    await closeBtn.click();
                } catch {
                    await driver.executeScript("arguments[0].click();", closeBtn);
                }

                // 🔎 Esperar a que el modal ya no sea visible (aunque siga en el DOM)
                await driver.wait(async () => {
                    try {
                        const modalRoot = await driver.findElement(By.xpath(modalRootXpath));
                        const displayed = await modalRoot.isDisplayed();
                        return !displayed;               // esperamos a que deje de mostrarse
                    } catch {
                        return true;                      // si ya no está en el DOM, también ok
                    }
                }, 15000); // hasta 15 s

                console.log("✅ Paso 17: Modal de Configuración WiFi cerrado correctamente.");
            } catch (error) {
                throw new Error(`❌ Error en Paso 17: (cerrar modal de Configuración WiFi): ${error.message}`);
            }


            // === Paso 18 Clic en botón "Opciones" ===
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

                console.log("✅ Paso 18 Botón 'Opciones' presionado correctamente.");
            } catch (error) {
                throw new Error(`❌ Error en Paso 18 (clic en botón 'Opciones'): ${error.message}`);
            }


            // === Paso 18: Clic en opción "Redirigir ONT" y esperar modal ===
            try {
                const driver = this.driver;

                // Clic en la opción
                const opcionRedirigir = await driver.wait(
                    until.elementLocated(By.xpath('//*[@id="1201"]')),
                    15000
                );
                await driver.wait(until.elementIsVisible(opcionRedirigir), 5000);
                await driver.wait(until.elementIsEnabled(opcionRedirigir), 5000);
                await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", opcionRedirigir);
                await driver.sleep(500);
                await opcionRedirigir.click();
                console.log("✅ Clic en 'Redirigir ONT' realizado.");

                // Esperar a que desaparezca el loader (si existe)
                const loaderXPath = '//*[contains(@id,"progress-id-progress")]';
                try {
                    const progressDiv = await driver.wait(
                        until.elementLocated(By.xpath(loaderXPath)),
                        5000
                    );
                    await driver.wait(until.stalenessOf(progressDiv), 20000);
                    console.log("⏳ Loader finalizado.");
                } catch {
                    console.log("ℹ️ No se encontró loader visible, continuando…");
                }

                // 🔑 Esperar al modal por texto único
                const modalXPath = "//*[contains(text(),'Desea ser redirigido a la pagina de la ONT')]";
                const modal = await driver.wait(
                    until.elementLocated(By.xpath(modalXPath)),
                    20000
                );
                await driver.wait(until.elementIsVisible(modal), 6000);

                console.log("✅ Paso 18: Modal de confirmación visible y listo para el próximo paso.");

            } catch (error) {
                throw new Error(`❌ Error en Paso 18 (clic o espera de modal): ${error.message}`);
            }

            // === Paso 19: Clic en el botón "NO" del modal de confirmación (robusto) ===
            try {
                const driver = this.driver;

                // Aseguramos que el modal con texto está visible (precondición)
                const modalTextoXPath = "//*[contains(text(),'Desea ser redirigido')]";
                await driver.wait(until.elementLocated(By.xpath(modalTextoXPath)), 10000);
                const modalTextoElem = await driver.findElement(By.xpath(modalTextoXPath));
                await driver.wait(until.elementIsVisible(modalTextoElem), 5000);

                // Localizar y clicar en "NO"
                const btnNo = await driver.wait(
                    until.elementLocated(By.xpath('//*[@id="widget-button-btConfirmNo"]/div')),
                    10000
                );
                await driver.wait(until.elementIsVisible(btnNo), 5000);
                await driver.wait(until.elementIsEnabled(btnNo), 5000);

                await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnNo);
                await driver.sleep(200);
                try {
                    await btnNo.click();
                } catch {
                    await driver.executeScript("arguments[0].click();", btnNo);
                }

                // Espera robusta: devuelve true cuando:
                //  - no existe ya ningun modal con ese texto, o
                //  - existe pero NO es visible (oculto), lo que indica que se cerró visualmente.
                await driver.wait(async () => {
                    try {
                        const modales = await driver.findElements(By.xpath(
                            "//div[contains(@id,'widget-dialog-open-dialog') and contains(., 'Desea ser redirigido')]"
                        ));
                        if (modales.length === 0) {
                            return true; // ya no existe en DOM
                        }
                        // si existe, verificar visibilidad del primero
                        const visible = await modales[0].isDisplayed().catch(() => false);
                        return !visible; // true cuando está oculto
                    } catch (err) {
                        // Si ocurre cualquier error (p. ej. DOM cambió), consideramos que ya no está visible
                        return true;
                    }
                }, 15000, "El modal no se cerró o no se ocultó dentro del timeout.");

                // pequeña pausa para estabilizar DOM
                await driver.sleep(500);

                console.log("✅ Paso 19: Clic en botón 'NO' realizado y modal cerrado/oculto correctamente.");
            } catch (error) {
                throw new Error(`❌ Error en Paso 19: (clic en botón 'NO'): ${error.message}`);
            }

            // === Paso 20 Clic en botón "Opciones" ===
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

                console.log("✅ Paso 20 Botón 'Opciones' presionado correctamente.");
            } catch (error) {
                throw new Error(`❌ Error en Paso 20 (clic en botón 'Opciones'): ${error.message}`);
            }


            // === Paso 21: Clic en opción "Creación de órdenes" ===
            try {
                const driver = this.driver;

                // Localizar la opción en el menú/lista
                const opcionCreacion = await driver.wait(
                    until.elementLocated(By.xpath('//*[@id="1202"]')),
                    15000
                );

                // Esperar a que esté visible y habilitada
                await driver.wait(until.elementIsVisible(opcionCreacion), 5000);
                await driver.wait(until.elementIsEnabled(opcionCreacion), 5000);

                // Desplazarla al centro de la vista y hacer clic
                await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", opcionCreacion);
                await driver.sleep(300);
                try {
                    await opcionCreacion.click();
                } catch {
                    // Click de respaldo por si hay overlay
                    await driver.executeScript("arguments[0].click();", opcionCreacion);
                }

                // --- Espera dinámica de progress/loader si aparece ---
                // Ajusta el xpath del loader si en tu entorno usa otro id.
                const loaderXPath = "//*[contains(@id,'progress-id-progress')]";
                try {
                    const progressElem = await driver.wait(
                        until.elementLocated(By.xpath(loaderXPath)),
                        5000
                    );
                    // Esperar a que desaparezca el loader
                    await driver.wait(until.stalenessOf(progressElem), 20000);
                } catch {
                    console.log("ℹ️ No se encontró loader visible, continuando...");
                }

                console.log("✅ Paso 21: Opción 'Creación de órdenes' seleccionada correctamente.");
            } catch (error) {
                throw new Error(`❌ Error en Paso 21: (clic en opción 'Creación de órdenes'): ${error.message}`);
            }

            // === Paso 22: Clic en el select "Tipo de orden" ===
            try {
                const driver = this.driver;

                // Localizar el <select> por su id
                const selectTipoOrden = await driver.wait(
                    until.elementLocated(By.xpath('//*[@id="input-select-selectType"]')),
                    15000
                );

                // Esperar a que sea visible y habilitado
                await driver.wait(until.elementIsVisible(selectTipoOrden), 5000);
                await driver.wait(until.elementIsEnabled(selectTipoOrden), 5000);

                // Desplazarlo a la vista y hacer clic para desplegar opciones
                await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", selectTipoOrden);
                await driver.sleep(300);
                try {
                    await selectTipoOrden.click();
                    await driver.sleep(3000);
                } catch {
                    // Click de respaldo en caso de overlay o intercept
                    await driver.executeScript("arguments[0].click();", selectTipoOrden);
                    await driver.sleep(3000);
                }

                console.log("✅ Paso 22: Clic en el select 'Tipo de orden' realizado correctamente.");
            } catch (error) {
                throw new Error(`❌ Error en Paso 22: (clic en select 'Tipo de orden'): ${error.message}`);
            }

            // === Paso 23: Seleccionar opción "Orden de mantenimiento" del select "Tipo de orden" ===
            try {
                const driver = this.driver;

                // Localizar el elemento <select>
                const selectTipoOrden = await driver.wait(
                    until.elementLocated(By.xpath('//*[@id="input-select-selectType"]')),
                    10000
                );

                // Asegurarse de que sea visible y habilitado
                await driver.wait(until.elementIsVisible(selectTipoOrden), 5000);
                await driver.wait(until.elementIsEnabled(selectTipoOrden), 5000);

                // Buscar la segunda opción (Orden de mantenimiento)
                const opcionMantenimiento = await driver.wait(
                    until.elementLocated(By.xpath('//*[@id="input-select-selectType"]/option[2]')),
                    5000
                );

                // Obtener el texto de la opción para registrar en log
                const textoOpcion = await opcionMantenimiento.getText();

                // Seleccionar forzando el cambio para que dispare el evento 'change'
                await driver.executeScript(`
    arguments[0].selected = true;
    arguments[0].dispatchEvent(new Event('change', { bubbles: true }));
  `, opcionMantenimiento);

                await driver.sleep(1000); // pequeña espera para que el select procese el cambio

                console.log(`✅ Paso 23: Opción '${textoOpcion}' seleccionada correctamente en "Tipo de orden".`);
            } catch (error) {
                throw new Error(`❌ Error en Paso 23: (selección opción 'Orden de mantenimiento'): ${error.message}`);
            }

            // === Paso 24: Clic en el select "Posible falla" ===
            try {
                const driver = this.driver;

                // Localizar el elemento <select> de "Posible falla"
                const selectPosibleFalla = await driver.wait(
                    until.elementLocated(By.xpath('//*[@id="input-select-selectTypeDiagnosis"]')),
                    10000
                );

                // Asegurarse de que sea visible y habilitado
                await driver.wait(until.elementIsVisible(selectPosibleFalla), 5000);
                await driver.wait(until.elementIsEnabled(selectPosibleFalla), 5000);

                // Desplazarlo a la vista para evitar problemas de superposición
                await driver.executeScript(
                    "arguments[0].scrollIntoView({block: 'center'});",
                    selectPosibleFalla
                );
                await driver.sleep(300);

                // Clic para desplegar las opciones
                await selectPosibleFalla.click();
                await driver.sleep(1000); // pequeña espera para que aparezcan las opciones

                console.log("✅ Paso 24: Clic en el select 'Posible falla' realizado correctamente.");
            } catch (error) {
                throw new Error(`❌ Error en Paso 24: (clic en select 'Posible falla'): ${error.message}`);
            }


            // === Paso 25: Seleccionar opción aleatoria del select "Posible falla" ===
            try {
                const driver = this.driver;

                // Localizar el elemento <select>
                const selectElement = await driver.wait(
                    until.elementLocated(By.xpath('//*[@id="input-select-selectTypeDiagnosis"]')),
                    10000
                );

                // Obtener todas las <option> internas
                const options = await selectElement.findElements(By.css('option'));

                // Filtrar para descartar opciones vacías o tipo "Seleccionar"
                const opcionesValidas = [];
                for (let opt of options) {
                    const text = await opt.getText();
                    if (text && text.trim().toLowerCase() !== 'seleccionar') {
                        opcionesValidas.push(opt);
                    }
                }

                if (opcionesValidas.length === 0) {
                    throw new Error('⚠️ No se encontraron opciones válidas en el select de "Posible falla".');
                }

                // Elegir una opción aleatoria
                const randomIndex = Math.floor(Math.random() * opcionesValidas.length);
                const opcionSeleccionada = opcionesValidas[randomIndex];
                const textoSeleccionado = await opcionSeleccionada.getText();

                // Forzar selección con JavaScript para disparar el evento change
                await driver.executeScript(`
    arguments[0].selected = true;
    arguments[0].dispatchEvent(new Event('change', { bubbles: true }));
  `, opcionSeleccionada);

                await driver.sleep(1000); // pequeña espera para reflejar el cambio

                console.log(`✅ Paso 25: Opción '${textoSeleccionado}' seleccionada correctamente en "Posible falla".`);
            } catch (error) {
                throw new Error(`❌ Error en Paso 25: (selección de opción en "Posible falla"): ${error.message}`);
            }


            // === Paso 26: Diligenciar campo "Observaciones" ===
            try {
                const driver = this.driver;

                // Localizar el <textarea> de Observaciones
                const observacionesInput = await driver.wait(
                    until.elementLocated(By.xpath('//*[@id="widget-textareafield-observations"]/textarea')),
                    10000
                );

                // Asegurar que sea visible y editable
                await driver.wait(until.elementIsVisible(observacionesInput), 5000);
                await driver.wait(until.elementIsEnabled(observacionesInput), 5000);

                // Limpiar cualquier texto previo y escribir el nuevo
                await observacionesInput.clear();
                await observacionesInput.sendKeys('test creacion ordenes');
                await driver.sleep(3000);

                console.log('✅ Paso 26: Campo "Observaciones" diligenciado correctamente.');
            } catch (error) {
                throw new Error(`❌ Error en Paso 26: (diligenciar campo "Observaciones"): ${error.message}`);
            }


            // === Paso 27: Clic en botón "Generar orden" ===
            try {
                const driver = this.driver;

                // Localizar el botón
                const btnGenerarOrden = await driver.wait(
                    until.elementLocated(By.xpath('//*[@id="widget-button-create-order"]/div')),
                    10000
                );

                // Asegurar visibilidad y disponibilidad
                await driver.wait(until.elementIsVisible(btnGenerarOrden), 5000);
                await driver.wait(until.elementIsEnabled(btnGenerarOrden), 5000);

                // Desplazar y hacer clic
                await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnGenerarOrden);
                await driver.sleep(300);
                await driver.executeScript("arguments[0].click();", btnGenerarOrden);

                // Espera breve para permitir la acción
                await driver.sleep(2000);

                // Espera opcional de progress
                try {
                    const progress = await driver.wait(
                        until.elementLocated(By.xpath('//*[@class="progress-bar"]')),
                        5000
                    );
                    await driver.wait(until.stalenessOf(progress), 20000);
                    console.log("⏳ Progress completado tras generar orden.");
                } catch {
                    console.log("ℹ️ No se detectó progress después de generar la orden.");
                }


                console.log("✅ Paso 27: Botón 'Generar orden' presionado correctamente.");
            } catch (error) {
                throw new Error(`❌ Error en Paso 27: (clic en botón 'Generar orden'): ${error.message}`);
            }


            // === Paso 28: Clic en botón "Sí" del modal de confirmación ===
            try {
                const driver = this.driver;

                // Localizar el botón "Sí" en el modal
                const btnConfirmYes = await driver.wait(
                    until.elementLocated(By.xpath('//*[@id="widget-button-btConfirmYes"]/div')),
                    15000
                );

                // Asegurar visibilidad y habilitación
                await driver.wait(until.elementIsVisible(btnConfirmYes), 5000);
                await driver.wait(until.elementIsEnabled(btnConfirmYes), 5000);

                // Desplazar y hacer clic
                await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", btnConfirmYes);
                await driver.sleep(300);
                await driver.executeScript("arguments[0].click();", btnConfirmYes);
                console.log("✅ Paso 28: Botón 'Sí' de confirmación presionado correctamente.");

                // --- Espera opcional: si se muestra un progress mientras se confirma ---
                try {
                    const progressXpath = '//*[@class="progress-bar"]';
                    const progressElem = await driver.wait(
                        until.elementLocated(By.xpath(progressXpath)),
                        5000
                    );
                    console.log("⏳ Progress detectado tras confirmación de la orden...");
                    await driver.wait(until.stalenessOf(progressElem), 30000);
                    console.log("✅ Progress completado después de confirmar la orden.");
                } catch {
                    console.log("ℹ️ No se detectó progress después de confirmar la orden.");
                }

            } catch (error) {
                throw new Error(`❌ Error en Paso 28: (clic en botón 'Sí' de confirmación): ${error.message}`);
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