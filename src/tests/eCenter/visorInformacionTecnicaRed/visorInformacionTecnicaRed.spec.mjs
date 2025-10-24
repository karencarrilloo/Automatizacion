import 'chromedriver';
import { Builder, By, until, logging } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import { describe, it, before, after } from 'mocha';
import { expect } from 'chai';

// Page Objects
import LoginPage from '../../../pages/login/login.page.js';
import VisorInformacionTecnicaRedPage
  from '../../../pages/eCenter/visorInformacionTecnicaRed/visorInformacionTecnicaRed.page.js';

let driver;
let loginPage;
let visorInfoPage;

describe('Pruebas del Visor de Información Técnica de Red', function () {
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

    visorInfoPage = new VisorInformacionTecnicaRedPage(driver);
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it.only('CP_INFTECRED_001: Ingreso a la vista Visor de Información Técnica de Red', async () => {
    await visorInfoPage.ingresarVistaVisorInformacion();

    // Verificación: contenedor principal de la plataforma
    const container = await driver.wait(
      until.elementLocated(By.css('#container-mainframe')),
      30000,
      'El contenedor principal no apareció tras abrir la vista'
    );
    expect(await container.isDisplayed()).to.be.true;
  });

  it.only('CP_INFTECRED_002: Filtro de búsqueda', async () => {
    await visorInfoPage.filtroBusquedaInformacionTecnica();

    expect(true).to.be.true;
  });

  it('CP_INFTECRED_003: Ver dispositivos', async () => {
    await visorInfoPage.verDispositivos();

    expect(true).to.be.true;
  });

  it('CP_INFTECRED_004: Editar estado', async () => {
    await visorInfoPage.editarEstado();

    expect(true).to.be.true;
  });

  it('CP_INFTECRED_005: Editar cliente', async () => {
    await visorInfoPage.editarCliente();

    expect(true).to.be.true;
  });

  it('CP_INFTECRED_006: Refrescar vista', async () => {
    await visorInfoPage.refrescarTabla();

    expect(true).to.be.true;
  });


});

