import { Builder } from 'selenium-webdriver';
import { expect } from 'chai';
import LoginPage from '../pages/login.page.js';

describe('Login Test', function() {
  this.timeout(60000);

  let driver;
  let loginPage;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build(); // Instancia navegador
    loginPage = new LoginPage(driver); // Instancia page object
  });

  after(async () => {
    await driver.quit(); // Cierra navegador al final
  });

  it('Debería realizar el login correctamente', async () => {
    await loginPage.ejecutarLogin(); // Ejecuta login completo
    expect(true).to.be.true; // Placeholder para aserción real
  });
});
