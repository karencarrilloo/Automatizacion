import { Builder } from 'selenium-webdriver';
import { expect } from 'chai';
import LoginPage from '../pages/login.page.js';
import CreacionOrdenVentaPage from '../pages/creacionOrdenVenta.page.js';
import GestionOrdenVentaPage from '../pages/gestionOrdenVenta.page.js';

describe('Gestión Orden Venta Test', function() {
  this.timeout(300000); // Ajustado por la cantidad de pasos

  let driver;
  let loginPage, creacionPage, gestionPage;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    loginPage = new LoginPage(driver);
    creacionPage = new CreacionOrdenVentaPage(driver);
    gestionPage = new GestionOrdenVentaPage(driver);
  });

  after(async () => {
    await driver.quit();
  });

  it('Debío realizar login, crear orden y gestionar orden (hasta el paso realizado)', async () => {
    await loginPage.ejecutarLogin(); // Paso login
    await creacionPage.ejecutarCreacionOrden(); // Paso creación
    await gestionPage.ejecutarGestionOrden(); // Paso gestión
    expect(true).to.be.true; // Placeholder aserción real
  });
});
