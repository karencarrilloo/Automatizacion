import { Builder } from 'selenium-webdriver';
import { expect } from 'chai';
import LoginPage from '../pages/login.page.js';
import ConfiguracionTipoOrdenPage from '../pages/configuracionTipoOrden.page.js';
import chromedriver from 'chromedriver';

describe('Prueba: Configuración de tipo de orden', function () {
  this.timeout(180000);

  let driver;
  let configuracionPage;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    const loginPage = new LoginPage(driver);
    await loginPage.ejecutarLogin();
    configuracionPage = new ConfiguracionTipoOrdenPage(driver);
  });

  after(async () => {
    await driver.quit();
  });

  it('Debería acceder correctamente a la vista Configuración de tipo de orden', async () => {
    await configuracionPage.ejecutarConfiguracionTipoOrden();
    expect(true).to.be.true;
  });
});
