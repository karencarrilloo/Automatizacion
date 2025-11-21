import 'chromedriver';
import { Builder, By, until, logging } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import { describe, it, before, after } from 'mocha';
import { expect } from 'chai';

// Page Objects
import LoginPage from '../../../pages/login/login.page.js';
import OcupacionPuertosPage from '../../../pages/eCenter/ocupacionPuertos/ocupacionPuertos.page.js';

let driver;
let loginPage;
let ocupacionPage;

describe('Prueba de Ocupación de Puertos', function () {
  this.timeout(180000);


  before(async () => {
    const options = new chrome.Options();

    // Ajustes para silenciar los logs de Chrome/DevTools
    options.addArguments('--log-level=3');             // solo errores graves
    options.addArguments('--silent');                  // suprime mensajes extra
    options.excludeSwitches('enable-logging');         // evita “DevTools listening...”

    const prefs = new logging.Preferences();
    prefs.setLevel(logging.Type.BROWSER, logging.Level.OFF);
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .setLoggingPrefs(prefs)
      .build();

    loginPage = new LoginPage(driver);
    await loginPage.ejecutarLogin();

    ocupacionPage = new OcupacionPuertosPage(driver);
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it('CP_OCUPUERT_001: Ingreso a la vista Visor de ocupacion de puertos', async () => {
    await ocupacionPage.ingresarOcupacionPuertos();
    expect(true).to.be.true;
  });

  it.skip('CP_OCUPUERT_002: Consultar Nap', async () => {
    await ocupacionPage.consultarNap();
    expect(true).to.be.true;
  });

  it('CP_OCUPUERT_003: Consultar Ceo', async () => {
    await ocupacionPage.consultarCeo();
    expect(true).to.be.true;
  });
});
