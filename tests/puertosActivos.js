
// Importa la función de login desde el archivo login.js
const loginTest = require('./login');

// Importa los módulos necesarios de selenium-webdriver
const { By, until } = require('selenium-webdriver');

// Importa fs para guardar capturas de pantalla en caso de error
const fs = require('fs'); // Para guardar capturas de pantalla

async function main() {
  // Ejecuta el login y obtiene el driver del navegador
  const driver = await loginTest();

  try {
 // === Paso 1: Clic en módulo eCenter ===
    const eCenterBtn = await driver.wait(
      until.elementLocated(By.xpath("//div[@id='118' and contains(@class, 'item-module')]")),
      10000
    );
    await driver.executeScript("arguments[0].click();", eCenterBtn);
    await driver.sleep(1000);

    // === Paso 2: Esperar el contenedor scrollable ===
    const scrollContainer = await driver.wait(
      until.elementLocated(By.css('.container-applications')),
      10000
    );
    await driver.executeScript(
      "arguments[0].scrollTop = arguments[0].scrollHeight;",
      scrollContainer
    );
    await driver.sleep(1000);

   // === Paso 3: Clic en "Puertos Activos" ===
    const puertosActivosBtn = await driver.wait(
      until.elementLocated(By.css('div.application-item[title="Puertos activos"]')),
      10000
    );
    await driver.executeScript(
      "arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });",
      puertosActivosBtn
    );
    await driver.wait(until.elementIsVisible(puertosActivosBtn), 10000);
    await driver.wait(until.elementIsEnabled(puertosActivosBtn), 10000);
    await driver.sleep(1000);
    await driver.executeScript("arguments[0].click();", puertosActivosBtn);
    await driver.sleep(5000);

   

  } catch (error) {
    console.error("❌ No se pudo completar la prueba:", error.message);
    const screenshot = await driver.takeScreenshot();
    fs.writeFileSync(`error_puertosActivos_${Date.now()}.png`, screenshot, 'base64');
    throw error;
}
};

if (require.main === module) {
  main();
}