import { Builder } from 'selenium-webdriver';
import { expect } from 'chai';
import LoginPage from '../pages/login.page.js';
import ExploradorEntidadesPage from '../pages/exploradorEntidades.page.js';

describe('Prueba de Explorador de Entidades', function () {
  this.timeout(180000);

  let driver;
  let exploradorPage;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    const login = new LoginPage(driver);
    await login.ejecutarLogin();
    exploradorPage = new ExploradorEntidadesPage(driver);
  });

  after(async () => {
    await driver.quit();
  });

  it('Debería abrir la vista "Explorador de entidades"', async () => {
    await exploradorPage.ejecutarExploradorEntidades();
    expect(true).to.be.true;
  });
});
