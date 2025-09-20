import { Builder } from 'selenium-webdriver';
import { expect } from 'chai';
import VisorInformacionTecnicaRedPage from '../pages/visorInformacionTecnicaRed.page.js';
import LoginPage from '../pages/login.page.js';
import chromedriver from 'chromedriver';

describe('Prueba visor de informacion tecnica de red', function () {
  this.timeout(180000); // Tiempo extendido para prueba completa

  let driver;
  let visorInformacionTecnicaRedPage;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    const loginPage = new LoginPage(driver);
    await loginPage.ejecutarLogin();
    visorInformacionTecnicaRedPage = new VisorInformacionTecnicaRedPage(driver);
  });

  after(async () => {
    await driver.quit();
  });

  it('Debería navegar y abrir visor de informacion tecnica de red', async () => {
    await visorInformacionTecnicaRedPage.ejecutarVisorInformacionTecnicaRed();
    expect(true).to.be.true;
  });
});
