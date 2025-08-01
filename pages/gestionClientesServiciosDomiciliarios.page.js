import { By, until } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import loginPage from './login.page.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class GestionClientesServiciosPage {
  constructor(driver) {
    this.driver = driver;
  }

  async ejecutarGestionClientesServicios() {
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

      // === Paso 3: Clic en "Gestión sobre clientes y servicios domiciliarios" ===
      const gestionClientesBtn = await driver.wait(
        until.elementLocated(By.xpath("//div[contains(@class,'legend-application') and contains(text(),'Gestión sobre clientes y servicios domiciliarios')]")),
        10000
      );
      await driver.executeScript("arguments[0].scrollIntoView({behavior:'smooth', block:'center'});", gestionClientesBtn);
      await driver.wait(until.elementIsVisible(gestionClientesBtn), 10000);
      await driver.wait(until.elementIsEnabled(gestionClientesBtn), 10000);
      await driver.sleep(1000);
      await driver.executeScript("arguments[0].click();", gestionClientesBtn);
      await driver.sleep(5000);

      // === Paso 4: Clic sobre el registro y seleccionar opcion Ver informacion tecnica de red" ===
      await driver.get("https://oss-dev.celsiainternet.com/");

    // Click en uno de los registros
    await driver.findElement(By.xpath("//tr[@id='row-602616']/td[6]")).click();

    // Click en el botón de opciones
    await driver.findElement(By.xpath("//button[@id='btn-options']/div")).click();

    // Click en la opción Ver informacion tecnica de red
    await driver.findElement(By.xpath("//li[@id='1090']/div")).click();

    // Click en el botón Cerrar
    await driver.findElement(By.xpath("//div[@id='widget-button-cancel-confirm-selected']/div")).click();

      // === Paso 5: Clic sobre el registro y seleccionar opcion Reconfiguración" ===

      // Click en uno de los registros
    await driver.findElement(By.xpath("//tr[@id='row-602576']/td[8]")).click();

    // Click en el botón de opciones
    await driver.findElement(By.xpath("//button[@id='btn-options']/div")).click();

    // Click en la opción Reconfiguración
    await driver.findElement(By.xpath("//li[@id='1089']/div")).click();

    // Validar que no es posible dar click al recuadro ONT
    await driver.findElement(By.xpath("//div[@id='widget-dialog-open-dialog-602576-5522-CustomerManager']/div/div/div[2]/div/div/div/div/div/div[2]")).click();

    // Click en botón Reconfigurar
    await driver.findElement(By.xpath("//div[@id='widget-button-btn-reconfig']/div")).click();

    // Click en botón Confirmar (Sí)
    await driver.findElement(By.xpath("//div[@id='widget-button-btConfirmYes']/div")).click();

    // Click en botón Siguiente
    await driver.findElement(By.xpath("//div[@id='widget-button-btn-next']/div")).click();

    // Click en botón Configurar WiFi
    await driver.findElement(By.xpath("//div[@id='widget-button-btn-config-wifi-data']/div")).click();

      // === Paso 6: Clic sobre el registro y seleccionar opcion Ver dispositivos" ===

      // Click en uno de los registros
    await driver.findElement(By.xpath("//tr[@id='row-602556']/td[8]")).click();

    // Click en el botón de opciones
    await driver.findElement(By.xpath("//button[@id='btn-options']/div")).click();

    // Click en la opción Ver dispositivos
    await driver.findElement(By.xpath("//li[@id='1088']/div")).click();

    // Click en el botón cerrar
    await driver.findElement(By.xpath("//div[@id='widget-dialog-open-dialog-602556-5522-CustomerManager']/div/div/div/button/span")).click();

      // === Paso 7: Clic sobre el registro y seleccionar opcion Ver documentos" ===

      // Click en uno de los registros
    await driver.findElement(By.xpath("//td[@id='email']")).click();

    // Click en botón de opciones
    await driver.findElement(By.xpath("//button[@id='btn-options']/div")).click();

    // Click en opción Ver documentos
    await driver.findElement(By.xpath("//li[@id='1080']/div")).click();

    // Click en la opcion Descargar contrato
    await driver.findElement(By.xpath("//li[@id='6889268b8fe15a17bec49ae9']/div[5]/span")).click();

    // Click en la opcion Ver documento
    await driver.findElement(By.xpath("//li[@id='6889268b8fe15a17bec49ae9']/div[4]/span")).click();

    // Click en la opcion Cerrar visor del contrato
    await driver.findElement(By.xpath("//div[@id='widget-dialog-contract-dialog']/div/div/div/button/span")).click();

    // Click en la opcion Enviar contrato
    await driver.findElement(By.xpath("//li[@id='6889268b8fe15a17bec49ae9']/div[3]/span")).click();

    // Click en botón cerrar visor de documentos
    await driver.findElement(By.xpath("//div[@id='widget-dialog-open-dialog-602636-5522-CustomerManager']/div/div/div/button/span")).click();

      // === Paso 8: Clic sobre el registro y seleccionar opcion Detalle del proceso" ===

    // Click en uno de los registros
    await driver.findElement(By.xpath("//td[@id='phone']")).click();

    // Click en botón de opciones
    await driver.findElement(By.xpath("//button[@id='btn-options']/div")).click();

    // Click en opción Detalle del proceso
    await driver.findElement(By.xpath("//li[@id='1084']/div")).click();

    // Click en botón para cerrar detalle de proceso
    await driver.findElement(By.xpath("//div[@id='widget-button-close-detail-process']/div")).click();

      // === Paso 9: Clic sobre el registro y seleccionar opcion Suspensión" ===

    // Click en uno de los registros
    await driver.findElement(By.xpath("//tr[@id='row-602616']/td[8]")).click();

    // Click en el botón de opciones
    await driver.findElement(By.xpath("//button[@id='btn-options']/div")).click();

    // Click en la opcion Suspensión
    await driver.findElement(By.xpath("//li[@id='1083']/div")).click();

    // Seleccionar en el dropdown "SUSPENSION POR NO PAGO"
    const selectElement = await driver.findElement(By.id("input-select-suspension-type-select"));
    await selectElement.click();
    await selectElement.findElement(By.xpath("//option[normalize-space(.)='SUSPENSION POR NO PAGO']")).click();

    // Escribir comentario en el campo de texto
    const commentField1 = await driver.findElement(By.id("textfield-input-data-comment"));
    await commentField1.click();
    await commentField1.clear();
    await commentField1.sendKeys("si");

    // Click en botón de detalle de suspensión
    await driver.findElement(By.xpath("//div[@id='widget-button-suspension-detail']/div")).click();

    // Confirmar acción
    await driver.findElement(By.xpath("//div[@id='widget-button-btConfirmYes']/div")).click();

    // Click en botón Refrescar
    await driver.findElement(By.xpath("//div[@id='process-detail-container']/div[2]/div[2]/button/span")).click();

    // Cerrar detalles de proceso
    await driver.findElement(By.xpath("//div[@id='widget-button-close-detail-process']/div")).click();

      // === Paso 10: Clic sobre el registro y seleccionar opcion Reconexión" ===

    // Click en uno de los registros
    await driver.findElement(By.xpath("//tr[@id='row-602616']/td[8]")).click();

    // Click en botón de opciones
    await driver.findElement(By.xpath("//button[@id='btn-options']/div")).click();

    // Click en la opción Reconexión
    await driver.findElement(By.xpath("//li[@id='1081']/div")).click();

    // Escribir comentario en el campo de texto
    const commentField2 = await driver.findElement(By.id("textfield-input-data-comment"));
    await commentField2.click();
    await commentField2.clear();
    await commentField2.sendKeys("comentario");

    // Click en botón Confirmar
    await driver.findElement(By.xpath("//div[@id='widget-button-suspension-detail']/div")).click();

    // Confirmar acción
    await driver.findElement(By.xpath("//div[@id='widget-button-btConfirmYes']/div")).click();

    // Click en botón Refrescar
    await driver.findElement(By.xpath("//div[@id='process-detail-container']/div[2]/div[2]/button/span")).click();

    // Cerrar detalle de proceso
    await driver.findElement(By.xpath("//div[@id='widget-button-close-detail-process']/div")).click();

      // === Paso 11: Clic sobre el registro y seleccionar opcion Cambio de plan" ===

    // Click en uno de los registros
    await driver.findElement(By.xpath("//tr[@id='row-602616']/td[8]")).click();

    // Click en botón de opciones
    await driver.findElement(By.id("btn-options")).click();

    // Click en la opción Cambio de plan
    await driver.findElement(By.xpath("//li[@id='1082']/div")).click();

    // Abrir selector de cambio de plan
    await driver.findElement(By.xpath("//div[@id='widget-pickview-pick-data-change-plan']/div/span[2]/button/i")).click();

    // Selección uno de los productos comerciales
    await driver.findElement(By.xpath("//div[@id='widget-dialog-pickview-pick-data-change-plan']//tr[2]/td[4]/div/button/i")).click();
    await driver.findElement(By.xpath("//div[@id='widget-dialog-pickview-pick-data-change-plan']//tr[16]/td/div/button/i")).click();
    await driver.findElement(By.xpath("//div[@id='widget-dialog-pickview-pick-data-change-plan']//tr[17]/td[4]/div/button[2]/i")).click();

    // Confirmar selección de plan
    await driver.findElement(By.xpath("//div[@id='widget-button-select-pick-data-change-plan']/div")).click();

    // Rellenar número PQ
    const numberField = await driver.findElement(By.id("textfield-input-data-number-pq"));
    await numberField.click();
    await numberField.clear();
    await numberField.sendKeys("123");

    // Rellenar comentario
    const commentField3 = await driver.findElement(By.id("textfield-input-data-comment"));
    await commentField3.click();
    await commentField3.clear();
    await commentField3.sendKeys("comentario");

    // Confirmar cambio de plan
    await driver.findElement(By.xpath("//div[@id='widget-button-suspension-detail']/div")).click();

    // Click en botón Refrescar
    await driver.findElement(By.xpath("//div[@id='process-detail-container']/div[2]/div[2]/button")).click();

    // Cerrar detalle de proceso
    await driver.findElement(By.xpath("//div[@id='widget-button-close-detail-process']/div")).click();


      // === Paso 12: Clic sobre el registro y seleccionar opcion Configuración DirecTV" ===

      // Aquí puedes continuar con otros pasos si aplica

    } catch (error) {
      console.error("❌ Error en gestión de clientes y servicios domiciliarios:", error.message);
      const screenshot = await driver.takeScreenshot();
      const carpetaErrores = path.resolve(__dirname, '../errores');
      if (!fs.existsSync(carpetaErrores)) fs.mkdirSync(carpetaErrores);
      const filePath = path.join(carpetaErrores, `error_gestionClientes_${Date.now()}.png`);
      fs.writeFileSync(filePath, screenshot, 'base64');
      throw error;
    }
  }
}
