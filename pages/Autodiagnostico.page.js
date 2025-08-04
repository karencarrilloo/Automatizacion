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
            // === CP_AUTO_001 Validar el ingreso a la vista “Autodiagnostico” y se muestre la información correctamente
            // === CP_AUTO_001 Paso 1: Clic en módulo eCenter ===
            try {
                const eCenterBtn = await driver.wait(
                    until.elementLocated(By.xpath("//div[@id='118' and contains(@class, 'item-module')]")),
                    10000
                );
                await driver.executeScript("arguments[0].click();", eCenterBtn);
                await driver.sleep(1000);
                console.log("✅ CP_GESACT_001 Paso 1: Módulo eCenter presionado correctamente.");
            } catch (error) {
                throw new Error(`❌ CP_GESACT_001 Paso 1 (clic en módulo eCenter): ${error.message}`);
            }

            // === CP_AUTO_001 Paso 2: Scroll en el contenedor de aplicaciones ===
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
                console.log("✅ CP_GESACT_001 Paso 2: Scroll en contenedor de aplicaciones realizado correctamente.");
            } catch (error) {
                throw new Error(`❌ CP_GESACT_001 Paso 2 (scroll en contenedor de aplicaciones): ${error.message}`);
            }

            // === CP_AUTO_001 Paso 3: Clic en módulo "Autodiagnóstico" ===
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

                console.log("✅ CP_AUTO_001 Paso 3: Vista 'Autodiagnóstico' abierta correctamente.");
            } catch (error) {
                throw new Error(`❌ CP_AUTO_001 Paso 3 (clic en módulo 'Autodiagnóstico'): ${error.message}`);
            }

            // === CP_AUTO_002 - Validar la consulta del usuario de autodiagnostico por ID DEAL
            // === CP_AUTO_002 Paso 1: Clic en botón "ID DEAL" ===
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

                console.log("✅ CP_AUTO_002 Paso 4: Botón 'ID DEAL' presionado correctamente.");
            } catch (error) {
                throw new Error(`❌ CP_AUTO_002 Paso 4 (clic en botón 'ID DEAL'): ${error.message}`);
            }

            // === CP_AUTO_002 Paso 2: Ingresar número ID DEAL válido ===
            try {
                const inputIDDeal = await driver.wait(
                    until.elementLocated(By.xpath('//*[@id="textfield-input-consult-customer"]')),
                    10000
                );

                await driver.wait(until.elementIsVisible(inputIDDeal), 5000);
                await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", inputIDDeal);
                await driver.sleep(500);

                await inputIDDeal.clear();
                await inputIDDeal.sendKeys("28006167828");
                await driver.sleep(1000);

                console.log("✅ CP_AUTO_002 Paso 2: ID DEAL ingresado correctamente.");
            } catch (error) {
                throw new Error(`❌ CP_AUTO_002 Paso 2 (ingresar ID DEAL): ${error.message}`);
            }

            // === CP_AUTO_002 Paso 3: Clic en botón "Consultar cliente" ===
            try {
                const btnConsultarCliente = await driver.wait(
                    until.elementLocated(By.xpath('//*[@id="container-mainframe"]/div[4]/div/div/div/div[2]/div[3]/div[3]')),
                    10000
                );

                await driver.wait(until.elementIsVisible(btnConsultarCliente), 5000);
                await driver.wait(until.elementIsEnabled(btnConsultarCliente), 5000);
                await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnConsultarCliente);
                await driver.sleep(500);

                await btnConsultarCliente.click();

                // Espera dinámica: esperar a que desaparezca el contenedor de carga si aparece
                try {
                    const contenedorCarga = await driver.wait(
                        until.elementLocated(By.css("div.container-loading-iptotal")),
                        5000
                    );
                    await driver.wait(until.stalenessOf(contenedorCarga), 15000); // Espera hasta que desaparezca
                } catch (e) {
                    console.log("ℹ️ No se detectó contenedor de progreso, se continúa.");
                }

                console.log("✅ CP_AUTO_002 Paso 3: Botón 'Consultar cliente' presionado correctamente.");
            } catch (error) {
                throw new Error(`❌ CP_AUTO_002 Paso 3 (clic en botón 'Consultar cliente'): ${error.message}`);
            }
            // === CP_AUTO_003 - Validar cambios en la opcion Configuracion Wifi
            // === CP_AUTO_003 Paso 1: Clic en botón "Opciones" ===
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

                console.log("✅ CP_AUTO_003 Paso 1: Botón 'Opciones' presionado correctamente.");
            } catch (error) {
                throw new Error(`❌ CP_AUTO_003 Paso 1 (clic en botón 'Opciones'): ${error.message}`);
            }

            // === CP_AUTO_003 Paso 2: Clic en opción "Configuración WiFi" ===
            try {
                // Esperar directamente a la opción "Configuración WiFi"
                const opcionWifi = await driver.wait(
                    until.elementLocated(By.xpath('//*[@id="1200"]/div')),
                    15000
                );

                await driver.wait(until.elementIsVisible(opcionWifi), 5000);
                await driver.wait(until.elementIsEnabled(opcionWifi), 5000);
                await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", opcionWifi);
                await driver.sleep(500); // Breve espera

                await opcionWifi.click();
                await driver.sleep(1000); // Tiempo para que cargue vista WiFi

                console.log("✅ CP_AUTO_003 Paso 2: Opción 'Configuración WiFi' seleccionada correctamente.");
            } catch (error) {
                throw new Error(`❌ CP_AUTO_003 Paso 2 (clic en opción 'Configuración WiFi'): ${error.message}`);
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
