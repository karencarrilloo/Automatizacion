import { Builder } from 'selenium-webdriver';
import { expect } from 'chai';
import LoginPage from '../pages/login.page.js';
import MotorReglasPage from '../pages/motorReglas.page.js';
import chromedriver from 'chromedriver';

describe('Prueba de Motor de Reglas', function () {
  this.timeout(180000);

  let driver;
  let motorPage;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    const login = new LoginPage(driver);
    await login.ejecutarLogin();
    motorPage = new MotorReglasPage(driver);
  });

  after(async () => {
    await driver.quit();
  });

  it('Debería abrir la vista "Motor de reglas"', async () => {
    await motorPage.ejecutarMotorReglas();
    expect(true).to.be.true;
  });
});
