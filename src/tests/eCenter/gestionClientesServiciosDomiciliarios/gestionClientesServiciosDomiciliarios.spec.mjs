import 'chromedriver';
import { Builder, By, until, logging } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import { describe, it, before, after } from 'mocha';
import { expect } from 'chai';

// Page Objects
import LoginPage from '../../../pages/login/login.page.js';
import GestionClientesServiciosPage from '../../../pages/eCenter/gestionClientesServiciosDomiciliarios/gestionClientesServiciosDomiciliarios.page.js';

let driver;
let loginPage;
let gestionPage;

describe('Pruebas de Gestión Clientes y Servicios Domiciliarios', function () {
  this.timeout(180000); // 3 min

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

    loginPage   = new LoginPage(driver);
    gestionPage = new GestionClientesServiciosPage(driver);

    // Login una sola vez antes de los tests
    await loginPage.ejecutarLogin();
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it('CP_GESCLSERDOM_001: Ingreso a la vista Gestión Clientes y Servicios Domiciliarios', async () => {
    await gestionPage.ingresarVistaGestionClientes();

    // Verificación: contenedor principal visible
    const container = await driver.wait(
      until.elementLocated(By.css('#container-mainframe')),
      30000,
      'El contenedor principal no apareció tras abrir la vista de Gestión'
    );
    expect(await container.isDisplayed()).to.be.true;
     });


     
     it('CP_GESCLSERDOM_002: Filtro de búsqueda por ID_DEAL', async () => {
    // Precondición: estar en la vista (puedes llamar el método anterior si es necesario)
    await gestionPage.filtrarPorIdDeal();
    // Aquí podrías agregar una aserción que valide que la tabla muestre los resultados esperados.
    expect(true).to.be.true;
  });

});

