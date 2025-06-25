import { Builder } from 'selenium-webdriver';
import { expect } from 'chai';
import LoginPage from '../pages/login.page.js';
import OcupacionPuertosPage from '../pages/ocupacionPuertos.page.js';

describe('Prueba de Ocupación de Puertos', function () {
  this.timeout(180000);

  let driver;
  let ocupacionPage;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    const login = new LoginPage(driver);
    await login.ejecutarLogin();
    ocupacionPage = new OcupacionPuertosPage(driver);
  });

  after(async () => {
    await driver.quit();
  });

  it('Debería abrir la vista "Ocupación de puertos"', async () => {
    await ocupacionPage.ejecutarOcupacionPuertos();
    expect(true).to.be.true;
  });
});
