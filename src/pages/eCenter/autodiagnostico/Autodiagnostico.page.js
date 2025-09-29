// src/pages/eCenter/autodiagnostico/autodiagnostico.page.js
import { By, until } from 'selenium-webdriver';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

export default class AutodiagnosticoPage {
  constructor(driver) {
    this.driver = driver;
  }

  // === Utilidad común para capturar pantallas de error ===
  async screenshotError(prefix) {
    const screenshot = await this.driver.takeScreenshot();
    const folder = path.resolve(__dirname, '../../../../errors/eCenter/autodiagnostico');
    fs.mkdirSync(folder, { recursive: true });
    const file = path.join(folder, `${prefix}_${Date.now()}.png`);
    fs.writeFileSync(file, screenshot, 'base64');
    return file;
  }

  // =======================
  // CP_AUTO_001: Ingreso a la vista Autodiagnóstico
  // Pasos 3
  // =======================
  async ingresarVistaAutodiagnostico() {
    const d = this.driver;
    try {
      // Paso 1: clic en módulo eCenter
      const eCenterBtn = await d.wait(
        until.elementLocated(By.xpath("//div[@id='118' and contains(@class,'item-module')]")),
        15000
      );
      await d.executeScript("arguments[0].click();", eCenterBtn);
      await d.sleep(1000);

      // Paso 2: scroll en contenedor
      const scrollContainer = await d.wait(
        until.elementLocated(By.css('.container-applications')),
        10000
      );
      await d.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight;", scrollContainer);
      await d.sleep(1000);

      // Paso 3: clic en módulo Autodiagnóstico
      const autoBtn = await d.wait(
        until.elementLocated(By.xpath('//*[@id="4240"]/div[2]')),
        15000
      );
      await d.executeScript("arguments[0].scrollIntoView({block:'center'});", autoBtn);
      await d.wait(until.elementIsVisible(autoBtn), 10000);
      await d.executeScript("arguments[0].click();", autoBtn);
      await d.sleep(5000);
    } catch (e) {
      await this.screenshotError('CP_AUTO_001');
      throw e;
    }
  }

  // =======================
  // CP_AUTO_002: Consulta del cliente por ID DEAL
  // Pasos 3
  // =======================
  async consultarClientePorID(idDeal = '28006582524') {
    const d = this.driver;
    try {
      // Paso 1: clic en botón ID DEAL
      const botonID = await d.wait(
        until.elementLocated(By.xpath('//*[@id="container-mainframe"]/div[4]/div/div/div/div[2]/div[2]/div[3]')),
        15000
      );
      await d.executeScript("arguments[0].scrollIntoView({block:'center'});", botonID);
      await d.executeScript("arguments[0].click();", botonID);
      await d.sleep(2000);

      // Paso 2: ingresar número
      const inputID = await d.wait(
        until.elementLocated(By.xpath('//*[@id="textfield-input-consult-customer"]')),
        10000
      );
      await inputID.clear();
      await inputID.sendKeys(idDeal);
      await d.sleep(1000);

      // Paso 3: clic en Consultar cliente
      const btnConsultar = await d.wait(
        until.elementLocated(By.xpath('//*[@id="container-mainframe"]/div[4]/div/div/div/div[2]/div[3]/div[3]')),
        15000
      );
      await d.executeScript("arguments[0].scrollIntoView({block:'center'});", btnConsultar);
      await btnConsultar.click();

      // espera a que desaparezca loader si aparece
      try {
        const loader = await d.wait(
          until.elementLocated(By.css('div.container-loading-iptotal')),
          5000
        );
        await d.wait(until.stalenessOf(loader), 60000);
      } catch {
        // sin loader, continuar
      }
    } catch (e) {
      await this.screenshotError('CP_AUTO_002');
      throw e;
    }
  }

  // =======================
  // CP_AUTO_003: Editar configuración de WiFi
  // Pasos 11
  // =======================
  async editarConfiguracionWiFi() {
    const d = this.driver;
    try {
      // Paso 1: opciones
      const btnOpciones = await d.wait(until.elementLocated(By.xpath('//*[@id="btn-options"]')), 15000);
      await d.executeScript("arguments[0].click();", btnOpciones);
      await d.sleep(2000);

      // Paso 2: Configuración WiFi
      const opcionWifi = await d.wait(until.elementLocated(By.xpath('//*[@id="1200"]/div')), 15000);
      await d.executeScript("arguments[0].click();", opcionWifi);

    // === Paso 3: Seleccionar el campo "Nombre de red"
    const contenedorCampo = await d.wait(
      until.elementLocated(By.xpath('//*[@id="widget-textfield-2_4GHz-1"]')),
      20000
    );
    await d.wait(until.elementIsVisible(contenedorCampo), 10000);
    const inputNombreRed = await contenedorCampo.findElement(By.css('input'));
    await d.wait(until.elementIsVisible(inputNombreRed), 10000);
    await d.wait(until.elementIsEnabled(inputNombreRed), 10000);
    await d.executeScript("arguments[0].scrollIntoView({block: 'center'});", inputNombreRed);
    await d.sleep(500);
    await inputNombreRed.click();
    await d.executeScript("arguments[0].focus();", inputNombreRed);
    await d.sleep(500);

    // === Paso 4: Digitar nuevo nombre de red
    await inputNombreRed.clear();
    await d.sleep(500);
    await inputNombreRed.sendKeys("TEST_EDICION");
    await d.sleep(2000);

    // === Paso 5: Clic en el select CANAL
    const selectCanal = await d.wait(
      until.elementLocated(By.xpath('//*[@id="input-select-select-2_4GHz3"]')),
      10000
    );
    await d.wait(until.elementIsVisible(selectCanal), 5000);
    await d.wait(until.elementIsEnabled(selectCanal), 5000);
    await d.executeScript("arguments[0].scrollIntoView({block:'center'});", selectCanal);
    await d.sleep(300);
    await selectCanal.click();
    await d.sleep(1000);

    // === Paso 6: Selección aleatoria de canal
    const opcionesCanal = await selectCanal.findElements(By.css('option'));
    const canalesValidos = [];
    for (const opt of opcionesCanal) {
      const txt = (await opt.getText()).trim();
      if (txt && txt !== 'Seleccionar') canalesValidos.push(opt);
    }
    if (!canalesValidos.length) throw new Error("Sin opciones válidas en CANAL");
    const canalElegido = canalesValidos[Math.floor(Math.random() * canalesValidos.length)];
    const txtCanal = await canalElegido.getText();
    await d.executeScript(
      `arguments[0].selected = true; arguments[0].dispatchEvent(new Event('change',{bubbles:true}));`,
      canalElegido
    );
    await d.sleep(1500);

    // === Paso 7: Clic en select ANCHO BANDA CANAL
    const selectAncho = await d.wait(
      until.elementLocated(By.xpath('//*[@id="input-select-select-2_4GHz4"]')),
      10000
    );
    await d.wait(until.elementIsVisible(selectAncho), 5000);
    await d.wait(until.elementIsEnabled(selectAncho), 5000);
    await d.executeScript("arguments[0].scrollIntoView({block:'center'});", selectAncho);
    await d.sleep(300);
    await selectAncho.click();
    await d.sleep(1000);

    // === Paso 8: Selección aleatoria de ancho de banda
    const opcionesAncho = await selectAncho.findElements(By.css('option'));
    const anchosValidos = [];
    for (const opt of opcionesAncho) {
      const txt = (await opt.getText()).trim();
      if (txt && txt !== 'Seleccionar') anchosValidos.push(opt);
    }
    if (!anchosValidos.length) throw new Error("Sin opciones válidas en ANCHO BANDA");
    const anchoElegido = anchosValidos[Math.floor(Math.random() * anchosValidos.length)];
    const txtAncho = await anchoElegido.getText();
    await d.executeScript(
      `arguments[0].selected = true; arguments[0].dispatchEvent(new Event('change',{bubbles:true}));`,
      anchoElegido
    );
    await d.sleep(1500);

    // === Paso 9: Marcar checkbox 'Unsecured'
    const labelUnsecured = await d.wait(
      until.elementLocated(By.xpath('//*[@id="widget-checkbox-checklist-data2_4GHz1"]/label')),
      10000
    );
    await d.wait(until.elementIsVisible(labelUnsecured), 5000);
    await d.executeScript("arguments[0].scrollIntoView({block:'center'});", labelUnsecured);
    await d.sleep(300);
    await d.executeScript("arguments[0].click();", labelUnsecured);
    await d.sleep(800);

    // === Paso 10: Clic en botón ENVIAR y esperar progress
    const btnEnviar = await d.wait(
      until.elementLocated(By.xpath('//*[@id="widget-button-send-info"]/div')),
      10000
    );
    await d.wait(until.elementIsVisible(btnEnviar), 5000);
    await d.wait(until.elementIsEnabled(btnEnviar), 5000);
    await d.executeScript("arguments[0].scrollIntoView({block:'center'});", btnEnviar);
    await d.sleep(300);
    try { await btnEnviar.click(); } catch { await d.executeScript("arguments[0].click();", btnEnviar); }
   

    // Esperar progress si aparece
    try {
      const progress = await d.wait(until.elementLocated(By.xpath('//*[@class="progress-bar"]')), 5000);
      await d.wait(until.stalenessOf(progress), 30000);
    } catch { }

    // === Paso 11: Cerrar modal de Configuración WiFi
    const closeBtn = await d.wait(
      until.elementLocated(By.xpath('//*[@id="widget-dialog-open-dialog-603378-undefined"]/div/div/div[1]/button')),
      10000
    );
    await d.wait(until.elementIsVisible(closeBtn), 5000);
    await d.executeScript("arguments[0].scrollIntoView({block:'center'});", closeBtn);
    await d.sleep(200);
    try { await closeBtn.click(); } catch { await d.executeScript("arguments[0].click();", closeBtn); }

    await d.wait(async () => {
      try {
        const modal = await d.findElement(By.xpath('//*[@id="widget-dialog-open-dialog-603378-undefined"]/div/div'));
        return !(await modal.isDisplayed());
      } catch { return true; }
    }, 15000);


    } catch (e) {
      await this.screenshotError('CP_AUTO_003');
      throw e;
    }
  }

  /**
   * ===========================
   * CP_AUTO_004 – Redirigir ONT
   * ===========================
   * Flujo completo:
   *   1. Clic en botón “Opciones”
   *   2. Clic en opción “Redirigir ONT”
   *   3. Clic en el botón "NO" del modal de confirmación
   */
  async ejecutarRedirigirONT(caseName = 'CP_AUTO_004') {
    const driver = this.driver;

    try {
      // Paso 1: Clic en botón "Opciones"
      const btnOpciones = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="btn-options"]')),
        10000
      );
      await driver.wait(until.elementIsVisible(btnOpciones), 5000);
      await driver.wait(until.elementIsEnabled(btnOpciones), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", btnOpciones);
      await driver.sleep(500);
      await btnOpciones.click();
      await driver.sleep(3000);

      // Paso 2: Clic en opción "Redirigir ONT"
      const opcionRedirigir = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="1201"]')),
        15000
      );
      await driver.wait(until.elementIsVisible(opcionRedirigir), 5000);
      await driver.wait(until.elementIsEnabled(opcionRedirigir), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", opcionRedirigir);
      await driver.sleep(500);
      await opcionRedirigir.click();

      // Esperar loader (opcional)
      const loaderXPath = '//*[contains(@id,"progress-id-progress")]';
      try {
        const loader = await driver.wait(
          until.elementLocated(By.xpath(loaderXPath)),
          5000
        );
        await driver.wait(until.stalenessOf(loader), 20000);
        
      } catch {
  
      }

      const modalXPath = "//*[contains(text(),'Desea ser redirigido a la pagina de la ONT')]";
      const modal = await driver.wait(
        until.elementLocated(By.xpath(modalXPath)),
        20000
      );
      await driver.wait(until.elementIsVisible(modal), 6000);

      // Paso 3: Clic en el botón "NO" del modal de confirmación
      const btnNo = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-button-btConfirmNo"]/div')),
        10000
      );
      await driver.wait(until.elementIsVisible(btnNo), 5000);
      await driver.wait(until.elementIsEnabled(btnNo), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", btnNo);
      await driver.sleep(1000);
      await btnNo.click().catch(() =>
        driver.executeScript("arguments[0].click();", btnNo)
      );

      // Confirmar que el modal desapareció
      await driver.wait(async () => {
        const modales = await driver.findElements(
          By.xpath("//div[contains(@id,'widget-dialog-open-dialog') and contains(., 'Desea ser redirigido')]")
        );
        if (modales.length === 0) return true;
        const visible = await modales[0].isDisplayed().catch(() => false);
        return !visible;
      }, 15000);
      await driver.sleep(500);

    } catch (error) {
      console.error(`❌ [CP_AUTO_004] Error: ${error.message}`);

      // Captura de pantalla en caso de fallo
      const screenshot = await driver.takeScreenshot();
      const errorsRoot = path.resolve(__dirname, '../../../../errors', 'autodiagnostico', caseName);
      fs.mkdirSync(errorsRoot, { recursive: true });
      const filePath = path.join(errorsRoot, `error_${Date.now()}.png`);
      fs.writeFileSync(filePath, screenshot, 'base64');

      throw error;
    }
  }


}
