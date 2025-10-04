import 'chromedriver';
import { Builder, By, until, logging } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import { describe, it, before, after } from 'mocha';
import { expect } from 'chai';

// Page Objects
import LoginPage from '../../../pages/login/login.page.js';
import ContenidoClasesNegocioPage from '../../../pages/eCenter/contenidoClasesNegocio/contenidoClasesNegocio.page.js';

let driver;
let loginPage;
let contenidoPage;

describe('Pruebas de Contenido Clases de Negocio', function () {
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

    loginPage    = new LoginPage(driver);
    contenidoPage = new ContenidoClasesNegocioPage(driver);

    // Login inicial
    await loginPage.ejecutarLogin();
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it('CP_CONTENIDO_001: Ingreso a la vista "Contenido Clases de Negocio"', async () => {
    await contenidoPage.ingresarVistaContenidoClases();

    // Verificación: contenedor principal visible
    const container = await driver.wait(
      until.elementLocated(By.css('#container-mainframe')),
      30000,
      'El contenedor principal no apareció tras abrir la vista'
    );
    expect(await container.isDisplayed()).to.be.true;
  });

  it("CP_CONTCLANEG_002: Seleccionar una entidad (Modelos)", async () => {
    await contenidoPage.seleccionarEntidadModelos();
    expect(true).to.be.true; // validación mínima
  });

  it("CP_CONTCLANEG_003: Crear un modelo", async () => {
    await contenidoPage.crearModelo();
    expect(true).to.be.true; // validación mínima
  });

  it("CP_CONTCLANEG_004: Editar modelo", async () => {
    await contenidoPage.editarModelo();
    expect(true).to.be.true; // validación mínima
  });

  it("CP_CONTCLANEG_005: Eliminar el modelo", async () => {
    await contenidoPage.eliminarModelo();
    expect(true).to.be.true; // validación mínima
  });

  it("CP_CONTCLANEG_006: Refrescar vista", async () => {
    await contenidoPage.refrescarVista();
    expect(true).to.be.true; // validación mínima
  });

  it("CP_CONTCLANEG_007: generar reporte xls", async () => {
    await contenidoPage.generarReporte();
    expect(true).to.be.true; // validación mínima
  });

  it("CP_CONTCLANEG_008: Validar funcionamiento del paginador en la vista(Entidad planes comerciales)", async () => {
    await contenidoPage.validarPaginador();
    expect(true).to.be.true; // validación mínima
  });
  
  it("CP_CONTCLANEG_009: Validar funcionamiento del paginador en la vista(Entidad planes comerciales)", async () => {
    await contenidoPage.realizarFiltro();
    expect(true).to.be.true; // validación mínima

  });

});

