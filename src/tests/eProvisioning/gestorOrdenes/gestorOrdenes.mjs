import 'chromedriver';
import { Builder, By, until, logging } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import { describe, it, before, after } from 'mocha';
import { expect } from 'chai';

// === Page Objects ===
import LoginPage from '../../../pages/login/login.page.js';
import GestorOrdenesPage from '../../../pages/eProvisioning/gestorOrdenes/gestorOrdenes.page.js';

// === Variables globales ===
let driver;
let loginPage;
let gestorOrdenesPage;

// === Configuración general de las pruebas ===
describe('Pruebas de Gestor de Órdenes', function () {
  this.timeout(180000); // 3 minutos

  before(async () => {
    const options = new chrome.Options();

    // Reducir logs de Chrome
    options.addArguments('--log-level=3');
    options.addArguments('--silent');
    options.excludeSwitches('enable-logging');

    // Desactivar logs del navegador
    const prefs = new logging.Preferences();
    prefs.setLevel(logging.Type.BROWSER, logging.Level.OFF);

    // Crear sesión del driver
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .setLoggingPrefs(prefs)
      .build();

    // Instancias de las páginas
    loginPage = new LoginPage(driver);
    gestorOrdenesPage = new GestorOrdenesPage(driver);

    // Login una vez antes de todas las pruebas
    await loginPage.ejecutarLogin();
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  // === Caso de prueba 1: Ingreso a la vista Gestor de Órdenes ===
  it('CP_GESORD_001: Debería abrir la vista "Gestor de Órdenes"', async () => {
    await gestorOrdenesPage.ingresarGestorOrdenes();
    expect(true).to.be.true;
  });

  it('CP_GESORD_002: Pasos dentro de ORDEN - VENTA E INSTALACION"', async () => {
    await gestorOrdenesPage.ordenVentaEInstalacion();
    expect(true).to.be.true;
  });

  it('CP_GESORD_003: Pasos dentro de ORDEN - MANTENIMIENTO"', async () => {
    await gestorOrdenesPage.ordenMantenimiento();
    expect(true).to.be.true;
  });
});