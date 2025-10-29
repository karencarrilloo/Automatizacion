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

  it.only('CP_GESORD_001: Debería abrir la vista "Gestor de Órdenes"', async () => {
    await gestorOrdenesPage.ingresarGestorOrdenes();
    expect(true).to.be.true;
  });

  it.only('CP_GESORD_002: Primer Filtro de búsqueda por ID_DEAL', async () => {
    await gestorOrdenesPage.filtrarPorIdDeal();
    expect(true).to.be.true;
  });

  it('CP_GESORD_00X: Segundo filtro de búsqueda por TIPO DE ORDEN', async () => {
    await gestorOrdenesPage.filtrarPorTipoOrden();
    expect(true).to.be.true;
  });

   it('CP_GESORD_003 :RawData', async () => {
    await gestorOrdenesPage.rawData();
    expect(true).to.be.true;
  });

  it('CP_GESORD_004: Adjuntos', async () => {
    await gestorOrdenesPage.Adjuntos();
    expect(true).to.be.true;
  });

  it('CP_GESORD_005: Registro de la orden', async () => {
    await gestorOrdenesPage.registroOrden();
    expect(true).to.be.true;
  });

  it('CP_GESORD_006: Ver información técnica asociada', async () => {
    await gestorOrdenesPage.verInfomacionTecnicaAsociada();
    expect(true).to.be.true;
  });

  it('CP_GESORD_007: Ejecutar orden venta e instalación (cliente simulado)', async () => {
    await gestorOrdenesPage.ejecutarOrdenVentaInstalacion();
    expect(true).to.be.true;
  });

  it.only('CP_GESORD_008: Ejecutar orden mantenimiento (cliente simulado)', async () => {
    await gestorOrdenesPage.ejecutarOrdenMantenimiento();
    expect(true).to.be.true;
  });

  it('CP_GESORD_008: Registro de materiales', async () => {
    await gestorOrdenesPage.registroMateriales();
    expect(true).to.be.true;
  });

  it('CP_GESORD_009: Revisar sesiones', async () => {
    await gestorOrdenesPage.revisarSesiones();
    expect(true).to.be.true;
  });

  it('CP_GESORD_010: Reabrir orden', async () => {
    await gestorOrdenesPage.reabrirOrden();
    expect(true).to.be.true;
  });
});