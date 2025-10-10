import { Builder } from 'selenium-webdriver';
import { expect } from 'chai';
import LoginPage from '../pages/login.page.js';
import GestorOrdenesPage from '../pages/gestorOrdenes.page.js';
import chromedriver from 'chromedriver';

describe('Prueba de Gestor de Órdenes', function () {
  this.timeout(180000);

  let driver;
  let gestorPage;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    const login = new LoginPage(driver);
    await login.ejecutarLogin();
    gestorPage = new GestorOrdenesPage(driver);
  });

  after(async () => {
    await driver.quit();
  });

  it('Debería abrir la vista "Gestor de Órdenes"', async () => {
    await gestorPage.ingresarGestorOrdenes();
    expect(true).to.be.true;
  });

  it('Pasos dentro de ORDEN - VENTA E INSTALACION"', async () => {
    await gestorPage.ordenVentaEInstalacion();
    expect(true).to.be.true;
  });

  it('Pasos dentro de ORDEN - MANTENIMIENTO"', async () => {
    await gestorPage.ordenMantenimiento();
    expect(true).to.be.true;
  });
});
