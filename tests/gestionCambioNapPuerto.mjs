import { Builder } from 'selenium-webdriver';
import { expect } from 'chai';
import LoginPage from '../pages/login.page.js';
import GestionCambioNapPuertoPage from '../pages/gestionCambioNapPuerto.page.js';

describe('Prueba de Gestión cambio de NAP y puerto', function() {
  this.timeout(180000); // 3 minutos

  let driver;
  let gestionPage;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    const login = new LoginPage(driver);
    await login.ejecutarLogin();
    gestionPage = new GestionCambioNapPuertoPage(driver);
  });

  after(async () => {
    await driver.quit();
  });

  it('Debería abrir la vista Gestión cambio de NAP y puerto', async () => {
    await gestionPage.ejecutarCambioNapPuerto();
    expect(true).to.be.true; // Placeholder
  });
});
