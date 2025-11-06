import 'chromedriver';
import { Builder, By, until, logging } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import { describe, it, before, after } from 'mocha';
import { expect } from 'chai';

import LoginPage from '../../../pages/login/login.page.js';
import ExploradorEntidadesPage from '../../../pages/eCenter/exploradorEntidades/exploradorEntidades.page.js';

let driver;
let exploradorPage;
let loginPage;

describe('Prueba de Explorador de Entidades', function () {
  this.timeout(180000);

  before(async () => {
    const options = new chrome.Options();
    options.addArguments('--log-level=3', '--silent');
    options.excludeSwitches('enable-logging');

    const prefs = new logging.Preferences();
    prefs.setLevel(logging.Type.BROWSER, logging.Level.OFF);

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .setLoggingPrefs(prefs)
      .build();

    loginPage = new LoginPage(driver);
    await loginPage.ejecutarLogin();

    exploradorPage = new ExploradorEntidadesPage(driver);
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it('CP_EXPENT_001: Ingreso a la vista Explorador de Entidades', async () => {
    await exploradorPage.ingresarVistaExploradorEntidades();
    expect(true).to.be.true;
  });

  it('CP_EXPENT_002: Selección de elemento secundario(ONT)', async () => {
    await exploradorPage.seleccionarElementoSecundario();
    expect(true).to.be.true;
  });

  it('CP_EXPENT_003: Crear nuevo registro de entidad(ONT)', async () => {
    await exploradorPage.crearNuevoRegistroEntidad();
    expect(true).to.be.true;
  });

  it("CP_EXPENT_004: Editar registro de entidad (ONT)", async () => {
    await exploradorPage.editarEntidad();
    expect(true).to.be.true;
  });

  it("CP_EXPENT_005: Eliminar registro de entidad (ONT)", async () => {
    await exploradorPage.eliminarEntidad();
    expect(true).to.be.true;
  });
});
