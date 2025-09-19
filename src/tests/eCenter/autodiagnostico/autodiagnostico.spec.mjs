
// src/tests/eCenter/autodiagnostico/autodiagnostico.spec.mjs
import 'chromedriver';
import { Builder, By, until, logging } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import { describe, it, before, after } from 'mocha';
import { expect } from 'chai';

import LoginPage from '../../../pages/login/login.page.js';
import AutodiagnosticoPage from '../../../pages/eCenter/autodiagnostico/autodiagnostico.page.js';

let driver;
let loginPage;
let autoPage;

describe('Pruebas de Autodiagnóstico', function () {
  this.timeout(240000);

  before(async () => {
    const options = new chrome.Options();
    // Ajustes para silenciar los logs de Chrome/DevTools
    options.addArguments('--log-level=3');             // solo errores graves
    options.addArguments('--silent');                  // suprime mensajes extra
    options.excludeSwitches('enable-logging');         // evita “DevTools listening...”

    // (Opcional) desactivar logs de Selenium del navegador
    const prefs = new logging.Preferences();
    prefs.setLevel(logging.Type.BROWSER, logging.Level.OFF);

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .setLoggingPrefs(prefs)
      .build();

    loginPage = new LoginPage(driver);
    autoPage  = new AutodiagnosticoPage(driver);

    // Login común para todos los tests
    await loginPage.ejecutarLogin();
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it('CP_AUTO_001: Ingreso a la vista Autodiagnóstico', async () => {
    await autoPage.ingresarVistaAutodiagnostico();

    const container = await driver.wait(
      until.elementLocated(By.css('#container-mainframe')),
      30000
    );
    expect(await container.isDisplayed()).to.be.true;
  });

  it('CP_AUTO_002: Consulta de cliente por ID DEAL', async () => {
    await autoPage.consultarClientePorID('28006582524');

    // Aquí podrías validar que la información del cliente aparece
    // por ejemplo:
    // const info = await driver.findElement(By.css('.cliente-info'));
    // expect(await info.isDisplayed()).to.be.true;
  });

  it.skip('CP_AUTO_003: Editar configuración WiFi', async () => {
    await autoPage.editarConfiguracionWiFi();

    // Validación final (por ejemplo un mensaje de éxito)
    // const msg = await driver.wait(until.elementLocated(By.css('.alert-success')), 30000);
    // expect(await msg.isDisplayed()).to.be.true;
  });

  it('CP_AUTO_004: Redirigir ONT (clic en NO del modal)', async () => {
    // 3. Ejecutar todo el flujo del CP_AUTO_004
    await autoPage.ejecutarRedirigirONT();

    // 4. Verificación final: que el contenedor principal siga visible
    const container = await driver.wait(
      until.elementLocated(By.css('#container-mainframe')),
      30000
    );
    expect(await container.isDisplayed()).to.be.true;
  });
});

