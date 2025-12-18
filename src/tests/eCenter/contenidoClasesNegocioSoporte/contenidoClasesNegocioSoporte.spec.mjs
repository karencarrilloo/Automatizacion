import 'chromedriver';
import { Builder, By, until, logging } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import { describe, it, before, after } from 'mocha';
import { expect } from 'chai';

// Page Objects
import LoginPage from '../../../pages/login/login.page.js';
import ContenidoClasesNegocioPageSoporte from '../../../pages/eCenter/contenidoClasesNegocioSoporte/contenidoClasesNegocioSoporte.page.js';

let driver;
let loginPage;
let contenidoPage;

describe('Pruebas de Contenido Clases de Negocio Soporte', function () {
  this.timeout(180000); // 3 minutos

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
    contenidoPage = new ContenidoClasesNegocioPageSoporte(driver);

    // Login inicial
    await loginPage.ejecutarLogin();
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it.only('CP_CONTCLANEGSOP_001: Ingreso a la vista "Contenido Clases de Negocio Soporte"', async () => {
    await contenidoPage.ingresarVistaContenidoClasesSoporte();

    // Verificación: contenedor principal visible
    const container = await driver.wait(
      until.elementLocated(By.css('#container-mainframe')),
      30000,
      'El contenedor principal no apareció tras abrir la vista'
    );
    expect(await container.isDisplayed()).to.be.true;
  });

  it.only("CP_CONTCLANEG_002: Seleccionar una entidad (Entidad que se encarga de almacenar idcuentas para simular aprovisionamiento)", async () => {
      await contenidoPage.seleccionarEntidad();
      expect(true).to.be.true; 
    });
  

  });
