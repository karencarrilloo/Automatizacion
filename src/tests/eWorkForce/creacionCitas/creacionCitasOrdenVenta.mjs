import { Builder } from 'selenium-webdriver';
import { expect } from 'chai';
import LoginPage from '../pages/login.page.js';
import CreacionCitasOrdenVentaPage from '../pages/creacionCitasOrdenVenta.page.js';
import chromedriver from 'chromedriver';

describe('Creación Orden Venta Test', function() {
  this.timeout(180000);

  let driver;
  let loginPage;
  let creacionPage;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    loginPage = new LoginPage(driver);
    creacionPage = new CreacionCitasOrdenVentaPage(driver);
  });

  after(async () => {
    await driver.quit();
  });

  it('Debería realizar el login correctamente y crear orden de venta', async () => {
    await loginPage.ejecutarLogin(); // Ejecuta login
    await creacionPage.ejecutarCreacionOrden(); // Ejecuta creación de orden
    expect(true).to.be.true; // Placeholder para aserción real
  });
});
