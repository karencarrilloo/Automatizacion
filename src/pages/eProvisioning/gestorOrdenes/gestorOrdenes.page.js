import { By, until } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class GestorOrdenesPage {
  constructor(driver) {
    this.driver = driver;
  }

  // === CP_GESORD_001 - Ingreso al Gestor de Órdenes ===
  async ingresarGestorOrdenes() {
    const driver = this.driver;

    try {
      const eProvisioningBtn = await driver.wait(
        until.elementLocated(By.xpath("//div[@id='21' and contains(@class, 'item-module')]")),
        10000
      );
      await driver.executeScript("arguments[0].click();", eProvisioningBtn);
      await driver.sleep(1000);

      const scrollContainer = await driver.wait(
        until.elementLocated(By.css('.container-applications')),
        10000
      );
      await driver.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight;", scrollContainer);
      await driver.sleep(1000);

      const targetApp = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="5524"]')),
        10000
      );
      await driver.executeScript("arguments[0].scrollIntoView({behavior:'smooth', block:'center'});", targetApp);
      await driver.wait(until.elementIsVisible(targetApp), 10000);
      await driver.wait(until.elementIsEnabled(targetApp), 10000);
      await driver.executeScript("arguments[0].click();", targetApp);
      await driver.sleep(5000);

      console.log("✅ Ingreso exitoso a la vista 'Gestor de Órdenes'.");
    } catch (error) {
      console.error("❌ Error en Gestor de Órdenes:", error.message);
      const screenshot = await driver.takeScreenshot();
      const carpetaErrores = path.resolve(__dirname, '../errores');
      if (!fs.existsSync(carpetaErrores)) fs.mkdirSync(carpetaErrores);
      const filePath = path.join(carpetaErrores, `error_gestorOrdenes_${Date.now()}.png`);
      fs.writeFileSync(filePath, screenshot, 'base64');
      throw error;
    }
  }

  // === CP_GESORD_002 - Orden Venta e Instalación ===
  async ordenVentaEInstalacion() {
    const driver = this.driver;
try {
    // --- FILTROS ---
    await driver.findElement(By.xpath("//div[@id='widget-button-btn-add-filter']/div")).click();

    const filtro1 = await driver.findElement(By.name("qb_66215_rule_0_filter"));
    await filtro1.click();
    await new Select(filtro1).selectByVisibleText("ID_DEAL");

    const valor1 = await driver.findElement(By.name("qb_66215_rule_0_value_0"));
    await valor1.click();
    await valor1.clear();
    await valor1.sendKeys("28006906438");

    await driver.findElement(By.xpath("//div[@id='qb_66215_group_0']/div/div/button")).click();

    const filtro2 = await driver.findElement(By.name("qb_66215_rule_1_filter"));
    await filtro2.click();
    await new Select(filtro2).selectByVisibleText("TIPO DE ORDEN");

    const valor2 = await driver.findElement(By.name("qb_66215_rule_1_value_0"));
    await valor2.click();
    await valor2.clear();
    await valor2.sendKeys("ORDEN - VENTA E INSTALACION");

    await driver.findElement(By.xpath("//div[@id='widget-button-btn-apply-filter-element']/div")).click();

    // --- ACCIONES DE ORDEN ---
    await driver.findElement(By.xpath("//td[@id='provisioningOrderId']")).click();
    await driver.findElement(By.xpath("//button[@id='btn-options']/div")).click();
    await driver.findElement(By.xpath("//li[@id='1097']/div")).click();

    await driver.findElement(By.xpath("//button[@id='btn-options']/div")).click();
    await driver.findElement(By.xpath("//li[@id='1096']/div")).click();
    await driver.findElement(By.xpath("//div[@id='widget-dialog-open-dialog-603975-5524-orderViewerGestor2']/div/div/div/button/span")).click();

    await driver.findElement(By.xpath("//button[@id='btn-options']/div")).click();
    await driver.findElement(By.xpath("//li[@id='1095']/div")).click();
    await driver.findElement(By.linkText("Bitácora")).click();
    await driver.findElement(By.xpath("//div[@id='widget-dialog-open-dialog-603975-5524-orderViewerGestor2']/div/div/div/button/span")).click();

    await driver.findElement(By.xpath("//button[@id='btn-options']/div")).click();
    await driver.findElement(By.xpath("//li[@id='1103']/div")).click();

    await driver.findElement(By.xpath("//td[@id='provisioningOrderId']")).click();
    await driver.findElement(By.xpath("//button[@id='btn-options']/div")).click();
    await driver.findElement(By.xpath("//li[@id='1103']/div")).click();
    await driver.findElement(By.xpath("//div[@id='widget-dialog-open-dialog-603975-5524-orderViewerGestor2']/div/div/div/button/span")).click();

    await driver.findElement(By.xpath("//td[@id='provisioningOrderId']")).click();
    await driver.findElement(By.xpath("//button[@id='btn-options']/div")).click();
    await driver.findElement(By.xpath("//li[@id='1094']/div")).click();

    // --- FORMULARIO DE ORDEN ---
    await driver.findElement(By.xpath("//div[@id='widget-dialog-open-dialog-603975-5524-orderViewerGestor2']/div/div/div[2]/div/div/div/div[2]/div/div")).click();
    await driver.findElement(By.xpath("//div[@id='widget-button-btn-next-step']/div")).click();

    const potenciaNap = await driver.findElement(By.id("textfield-PotenciaNAP"));
    await potenciaNap.clear();
    await potenciaNap.sendKeys("12");
    await driver.findElement(By.xpath("//div[@id='widget-button-btn-next-step']/div")).click();

    const serialOnt = await driver.findElement(By.id("textfield-SerialONT"));
    await serialOnt.clear();
    await serialOnt.sendKeys("48575443702FE8A5");
    await driver.findElement(By.xpath("//div[@id='widget-button-btn-next-step']/div")).click();

    await driver.findElement(By.xpath("//div[@id='widget-button-btn-provisioning-order']/div")).click();
    await driver.findElement(By.xpath("//div[@id='widget-button-btn-next-step']/div")).click();

    const velSubida = await driver.findElement(By.id("textfield-VelocidadSubida"));
    await velSubida.clear();
    await velSubida.sendKeys("100");

    const velBajada = await driver.findElement(By.id("textfield-VelocidadBajada"));
    await velBajada.clear();
    await velBajada.sendKeys("100");

    await driver.findElement(By.xpath("//div[@id='widget-button-btn-next-step']/div")).click();

    // --- CONFIG WIFI ---
    await driver.findElement(By.xpath("//div[@id='widget-button-btn-configure-wifi-img']/div")).click();

    const ssid = await driver.findElement(By.id("textfield-SSID"));
    await ssid.clear();
    await ssid.sendKeys("Prueba23");

    const pass = await driver.findElement(By.id("textfield-PasswordOneSSID"));
    await pass.clear();
    await pass.sendKeys("Prueba23");

    await driver.findElement(By.xpath("//div[@id='widget-button-btn-confirm-dialog']/div")).click();
    await driver.findElement(By.xpath("//div[@id='widget-button-complet-process']/div")).click();
    await driver.findElement(By.xpath("//div[@id='widget-button-btConfirmYes']/div")).click();

    await driver.findElement(By.xpath("//td[@id='provisioningOrderId']")).click();
    await driver.findElement(By.id("container-general-crud")).click();
    await driver.findElement(By.xpath("//li[@id='1093']/div")).click();

    // --- CAMPOS DE MATERIALES ---
    const campos = [
      { id: "widget-textareafield-PATCHCORDSC_APC-SC_APC", valor: "1" },
      { id: "widget-textareafield-CABLEDROP1G657", valor: "2" },
      { id: "widget-textareafield-CONECTORESSC_APC", valor: "3" },
      { id: "widget-textareafield-ROSETAFTB-506", valor: "4" }
    ];

    for (const campo of campos) {
      const el = await driver.findElement(By.xpath(`//div[@id='${campo.id}']/textarea`));
      await el.clear();
      await el.sendKeys(campo.valor);
    }

    await driver.findElement(By.xpath("(.//*[normalize-space(text()) and normalize-space(.)='CANCELAR'])[1]/following::div[2]")).click();

    await driver.findElement(By.xpath("//button[@id='btn-options']/div")).click();
    await driver.findElement(By.xpath("//li[@id='1091']/div")).click();
    await driver.findElement(By.xpath("//div[@id='widget-dialog-open-dialog-603975-5524-orderViewerGestor2']/div/div/div/button/span")).click();

    console.log("✅ Proceso 'ORDEN - VENTA E INSTALACION' ejecutado con éxito.");
  } catch (err) {
    console.error("❌ Error durante la ejecución:", err);
  } finally {
    await driver.quit();
  }
}


  // === CP_GESORD_003 - Orden Mantenimiento ===
  async ordenMantenimiento() {
    const driver = this.driver;

    try {
  // 🔹 Filtro inicial por tipo de orden
  await driver.findElement(By.xpath("//div[@id='widget-button-btn-add-filter']/div")).click();
  await driver.findElement(By.name("qb_80898_rule_0_filter")).click();
  await new Select(driver.findElement(By.name("qb_80898_rule_0_filter"))).selectByVisibleText("TIPO DE ORDEN");
  const tipoOrden = await driver.findElement(By.name("qb_80898_rule_0_value_0"));
  await tipoOrden.clear();
  await tipoOrden.sendKeys("ORDEN - MANTENIMIENTO");

  // 🔹 Filtro adicional por ID_DEAL
  await driver.findElement(By.xpath("//div[@id='qb_80898_group_0']/div/div/button")).click();
  await driver.findElement(By.name("qb_80898_rule_1_filter")).click();
  await new Select(driver.findElement(By.name("qb_80898_rule_1_filter"))).selectByVisibleText("ID_DEAL");
  const idDeal = await driver.findElement(By.name("qb_80898_rule_1_value_0"));
  await idDeal.clear();
  await idDeal.sendKeys("28006956314");

  await driver.findElement(By.xpath("//div[@id='widget-button-btn-apply-filter-element']/div")).click();

  // 🔹 Selección de orden y apertura de menú de opciones
  await driver.findElement(By.xpath("//td[@id='departamento']")).click();
  await driver.findElement(By.xpath("//td[@id='provisioningOrderId']")).click();
  await driver.findElement(By.xpath("(.//*[normalize-space(text()) and normalize-space(.)='RawData'])[1]/preceding::div[1]")).click();
  await driver.findElement(By.xpath("//li[@id='1094']/div")).click();

  // 🔹 Ejecución de varias acciones dentro del diálogo
  const acciones = [
    "//div[@id='widget-dialog-open-dialog-604172-5524-orderViewerGestor2']/div/div/div[2]/div/div/div/div[2]/div/div/div[3]",
    "//div[@id='widget-dialog-open-dialog-604172-5524-orderViewerGestor2']/div/div/div[2]/div/div/div/div[2]/div/div/div[2]",
    "//div[@id='widget-dialog-open-dialog-604172-5524-orderViewerGestor2']/div/div/div[2]/div/div/div/div[2]/div/div/div[4]"
  ];

  for (const accion of acciones) {
    await driver.findElement(By.xpath(accion)).click();
    await driver.findElement(By.xpath("//div[@id='widget-dialog-view-process-child']/div/div/div[2]/div/div/div/div[2]/div[3]/div/div/span")).click();
    await driver.findElement(By.xpath("//div[@id='widget-dialog-view-process-child']/div/div/div[2]/div/div/div/div[2]/div[3]/div/div[2]/div")).click();
    await driver.findElement(By.xpath("(.//*[normalize-space(text()) and normalize-space(.)='ATRÁS'])[1]/following::div[2]")).click();

    const obs = await driver.findElement(By.xpath("//div[@id='widget-textareafield-observation']/textarea"));
    await obs.clear();
    await obs.sendKeys("test");
    await driver.findElement(By.xpath("//div[@id='widget-button-btn-save-report']/div")).click();
  }

  // 🔹 Configuración de datos técnicos
  await driver.findElement(By.id("textfield-SerialONT")).clear();
  await driver.findElement(By.id("textfield-SerialONT")).sendKeys("485754435A2DBCA6");

  await driver.findElement(By.id("textfield-VelocidadSubida")).clear();
  await driver.findElement(By.id("textfield-VelocidadSubida")).sendKeys("100");

  await driver.findElement(By.id("textfield-VelocidadBajada")).clear();
  await driver.findElement(By.id("textfield-VelocidadBajada")).sendKeys("100");

  // 🔹 Configuración de WiFi
  await driver.findElement(By.xpath("//div[@id='widget-button-btn-configure-wifi-img']/div")).click();
  await driver.findElement(By.xpath("//div[@id='widget-checkbox-check-step-validation-wifi']/label")).click();
  await driver.findElement(By.id("textfield-SSID")).clear();
  await driver.findElement(By.id("textfield-SSID")).sendKeys("qweqw");
  await driver.findElement(By.id("textfield-PasswordOneSSID")).clear();
  await driver.findElement(By.id("textfield-PasswordOneSSID")).sendKeys("123123123");
  await driver.findElement(By.xpath("//div[@id='widget-button-btn-confirm-dialog']/div")).click();

  // 🔹 Potencia NAP
  const potencia = await driver.findElement(By.id("textfield-PotenciaNAP"));
  await potencia.clear();
  await potencia.sendKeys("12");

  // 🔹 Comentarios y cierre
  await driver.findElement(By.css("#widget-textareafield-Observations > textarea")).sendKeys("test");
  await driver.findElement(By.css("#widget-textareafield-observation > textarea")).sendKeys("tst");

  // 🔹 Confirmación final
  await driver.findElement(By.xpath("//div[@id='widget-button-btn-terminar']/div")).click();

    console.log("✅ Proceso 'ORDEN - VENTA E INSTALACION' ejecutado con éxito.");
  } catch (err) {
    console.error("❌ Error durante la ejecución:", err);
  } finally {
    await driver.quit();
  }
  }

//module.exports = { ordenVentaEInstalacion };

}
