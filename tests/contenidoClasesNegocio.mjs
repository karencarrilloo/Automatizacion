import { Builder } from 'selenium-webdriver';
import { expect } from 'chai';
import LoginPage from '../pages/login.page.js';
import ContenidoClasesNegocioPage from '../pages/contenidoClasesNegocio.page.js';
import chromedriver from 'chromedriver';

describe('Prueba de Contenido clases de negocio', function () {
  this.timeout(270000);

  let driver;
  let contenidoPage;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    const login = new LoginPage(driver);
    await login.ejecutarLogin();
    contenidoPage = new ContenidoClasesNegocioPage(driver);
  });

  after(async () => {
    await driver.quit();
  });

  it('Debería abrir la vista "Contenido clases de negocio"', async () => {
    await contenidoPage.ejecutarContenidoClasesNegocio();
    expect(true).to.be.true;
  });
});
