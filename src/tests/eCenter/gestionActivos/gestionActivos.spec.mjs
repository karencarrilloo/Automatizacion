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

  it('CP_GESTION_ACTIVOS_001: Ingreso a la vista Gestión de Activos', async () => {
    await gestionActivosPage.ingresarVistaGestionActivos();

    // Verificación: contenedor principal de la plataforma
    const container = await driver.wait(
      until.elementLocated(By.css('#container-mainframe')),
      30000,
      'El contenedor principal no apareció tras abrir la vista'
    );
    expect(await container.isDisplayed()).to.be.true;
  });
});

