import 'chromedriver';
import { Builder, By, until, logging } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import { describe, it, before, after } from 'mocha';
import { expect } from 'chai';

// Page Objects
import LoginPage from '../../../pages/login/login.page.js';
import GestionActivosPage from '../../../pages/eCenter/gestionActivos/gestionActivos.page.js';

let driver;
let loginPage;
let gestionActivosPage;

describe('Pruebas de Gestión de Activos', function () {
  this.timeout(180000); // 3 min

  before(async () => {
    const options = new chrome.Options();

    // Ajustes para silenciar los logs de Chrome/DevTools
    options.addArguments('--log-level=3');             // solo errores graves
    options.addArguments('--silent');                  // suprime mensajes extra
    options.excludeSwitches('enable-logging');         // evita “DevTools listening...”


    const prefs   = new logging.Preferences();
    prefs.setLevel(logging.Type.BROWSER, logging.Level.OFF);

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .setLoggingPrefs(prefs)
      .build();

    loginPage = new LoginPage(driver);
    await loginPage.ejecutarLogin();

    gestionActivosPage = new GestionActivosPage(driver);
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it('CP_GESACT_001: Ingreso a la vista Gestión de Activos', async () => {
    await gestionActivosPage.ingresarVistaGestionActivos();
    expect(await container.isDisplayed()).to.be.true;
  });

  it('CP_GESACT_002: Filtrar ont por estado en "FAILED"', async () => {
    await gestionActivosPage.filtraOnt();
    expect(await container.isDisplayed()).to.be.true;
  });

  it('CP_GESACT_003: Actualización de estado de la ONT de FAILED a LOST', async () => {
    await gestionActivosPage.ActualizarOntyFiltro();
    expect(await container.isDisplayed()).to.be.true;
  });

   
});

