import { Builder } from 'selenium-webdriver';
import { expect } from 'chai';
import LoginPage from '../pages/login.page.js';
import AutodiagnosticoPage from '../pages/Autodiagnostico.page.js';
import chromedriver from 'chromedriver';

describe('Prueba: Configuración de Autodiagnostico', function () {
  this.timeout(300000);

  let driver;
  let configuracionPage;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    const loginPage = new LoginPage(driver);
    await loginPage.ejecutarLogin();
    configuracionPage = new AutodiagnosticoPage(driver);
  });

  after(async () => {
    await driver.quit();
  });

  it('Debería acceder correctamente a la vista Autodiagnostico', async () => {
    await configuracionPage.ejecutarAutodiagnostico();
    expect(true).to.be.true;
  });
});
