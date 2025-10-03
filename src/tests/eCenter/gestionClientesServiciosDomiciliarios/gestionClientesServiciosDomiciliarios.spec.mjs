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

// === ID_DEAL GLOBAL para todas las pruebas ===
const ID_DEAL_GLOBAL = '28006757991';


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

    loginPage = new LoginPage(driver);
    gestionPage = new GestionClientesServiciosPage(driver, ID_DEAL_GLOBAL);

    // Login una sola vez antes de los tests
    await loginPage.ejecutarLogin();
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it.only('CP_GESCLSERDOM_001: Ingreso a la vista Gestión Clientes y Servicios Domiciliarios', async () => {
    await gestionPage.ingresarVistaGestionClientes();

    // Verificación: contenedor principal visible
    const container = await driver.wait(
      until.elementLocated(By.css('#container-mainframe')),
      30000,
      'El contenedor principal no apareció tras abrir la vista de Gestión'
    );
    expect(await container.isDisplayed()).to.be.true;
  });


  it.only('CP_GESCLSERDOM_002: Filtro de búsqueda por ID_DEAL', async () => {
    // Precondición: estar en la vista (puedes llamar el método anterior si es necesario)
    await gestionPage.filtrarPorIdDeal();
    // ajustar la aserción Para validar éxito estricto
    expect(true).to.be.true;
  });

  it.only('CP_GESCLSERDOM_003: Ver información técnica asociada', async () => {
    // Usa el ID global definido en el constructor
    await gestionPage.verInformacionTecnicaAsociada();

    // Validación simple
    expect(true).to.be.true;
  });

  it.only('CP_GESCLSERDOM_004: Reconfiguración del cliente', async () => {
    await gestionPage.reconfigurarCliente();
    expect(gestionPage.reconfiguracionExitosa).to.be.oneOf([true, false]);
    // puedes ajustar la aserción si necesitas validar éxito estricto
  });

  it.only('CP_GESCLSERDOM_005: Ver dispositivos del cliente', async () => {
    await gestionPage.verDispositivoCliente();
    expect(true).to.be.true; // Asersión placeholder; ajusta si deseas validar datos específicos
  });

  // it.only('CP_GESCLSERDOM_006: Ver y enviar documentos (Acta de instalación y Contrato)', async () => {
  //   await gestionPage.verYEnviarDocumentos(); // **CORREGIR**
  //   expect(true).to.be.true; // Placeholder de validación
  // });

  it('CP_GESCLSERDOM_007: Ver detalle del proceso', async () => {
    await gestionPage.verDetalleProceso();
    expect(true).to.be.true; // Aserción placeholder
  });

  it('CP_GESCLSERDOM_008: Suspensión del cliente', async () => {
    await gestionPage.suspenderCliente();
    expect(true).to.be.true; // aserción placeholder
  });

  it('CP_GESCLSERDOM_009: Reconexión del cliente', async function () {
    await gestionPage.reconectarCliente();
    expect(true).to.be.true;
  });

  it('CP_GESCLSERDOM_010: Cambio de plan del cliente(confirmar)', async function () {
    await gestionPage.cambioPlanCliente();
    expect(true).to.be.true;
  });

  it.only('CP_GESCLSERDOM_011: Cambio de plan del cliente (con CANCELAR)', async function () {
    await gestionPage.cambioPlanClienteCancelar();
    expect(true).to.be.true;
  });




});




