// archivo: test/legalizacionOrdenes.mjs
import { Builder } from 'selenium-webdriver';
import { expect } from 'chai';
import LoginPage from '../pages/login.page.js';
import LegalizacionOrdenesPage from '../pages/legalizacionOrdenes.page.js';
import chromedriver from 'chromedriver';

describe('Prueba de Legalización Órdenes', function () {
  this.timeout(180000); // 3 minutos de timeout

  let driver;
  let legalizacionPage;

  before(async () => {
    // Inicializar navegador
    driver = await new Builder().forBrowser('chrome').build();

    // Login en la aplicación
    const login = new LoginPage(driver);
    await login.ejecutarLogin();

    // Instancia de la nueva página
    legalizacionPage = new LegalizacionOrdenesPage(driver);
  });

  after(async () => {
    // Cerrar el navegador al finalizar
    await driver.quit();
  });

  it('Debería abrir la vista "Legalización Órdenes"', async () => {
    await legalizacionPage.ingresarLegalizacionOrdenes();
    expect(true).to.be.true; // validación simple de flujo
  });
});
