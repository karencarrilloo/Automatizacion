import 'chromedriver';
import { Builder, By, until, logging } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import { describe, it, before, after } from 'mocha';
import { expect } from 'chai';

// Page Objects
import LoginPage from '../../../pages/login/login.page.js';
import GestionCambioNapPuertoPage from '../../../pages/eCenter/gestionCambioNapPuerto/gestionCambioNapPuerto.page.js';

let driver;
let loginPage;
let gestionCambioNapPuertoPage;

describe('Pruebas de Gestión cambio de nap y puerto', function () {
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

    gestionCambioNapPuertoPage = new GestionCambioNapPuertoPage(driver);
  });

  after(async () => {
    if (driver) await driver.quit();
  });


  it(' CP_GESCAMNAPPUER_001: Acceso al la vista Gestión cambio de nap y puerto', async () => {
    await gestionCambioNapPuertoPage.ingresarVistaGestionCambioNapPuerto();
    expect(true).to.be.true; // Placeholder
  });

  it(' CP_GESCAMNAPPUER_002: Seleccionar una nap', async () => {
    await gestionCambioNapPuertoPage.SeleccionarNap();
    expect(true).to.be.true; // Placeholder
  });

  it(' CP_GESCAMNAPPUER_003: Seleccionar un puerto y realizar el cambio', async () => {
    await gestionCambioNapPuertoPage.cambioDePuerto();
    expect(true).to.be.true; // Placeholder
  });
});
