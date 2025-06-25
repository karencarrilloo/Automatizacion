import { Builder } from 'selenium-webdriver';
import { expect } from 'chai';
import LoginPage from '../pages/login.page.js';
import GestionActivosPage from '../pages/gestionActivos.page.js';

describe('Prueba de Gestión de Activos', function() {
  this.timeout(180000); // 3 minutos

  let driver;
  let gestionActivosPage;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    const loginPage = new LoginPage(driver);
    await loginPage.ejecutarLogin();
    gestionActivosPage = new GestionActivosPage(driver);
  });

  after(async () => {
    await driver.quit();
  });

  it('Debería completar el flujo de gestión de activos', async () => {
    await gestionActivosPage.ejecutarGestionActivos();
    expect(true).to.be.true; // Aserción placeholder
  });
});
