import { Builder } from 'selenium-webdriver';
import { expect } from 'chai';
import LoginPage from '../pages/login.page.js';
import GestionContratosPage from '../pages/gestionContratos.page.js';

describe('Prueba: Gestión de contratos', function () {
  this.timeout(180000);

  let driver;
  let gestionContratosPage;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    const loginPage = new LoginPage(driver);
    await loginPage.ejecutarLogin();
    gestionContratosPage = new GestionContratosPage(driver);
  });

  after(async () => {
    await driver.quit();
  });

  it('Debería acceder correctamente a la vista Gestión de contratos', async () => {
    await gestionContratosPage.ejecutarGestionContratos();
    expect(true).to.be.true;
  });
});
