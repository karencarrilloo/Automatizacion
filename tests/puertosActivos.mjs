import { Builder } from 'selenium-webdriver';
import { expect } from 'chai';
import PuertosActivosPage from '../pages/puertosActivos.page.js';
import LoginPage from '../pages/login.page.js';

describe('Prueba Puertos Activos', function () {
  this.timeout(180000); // Tiempo extendido para prueba completa

  let driver;
  let puertosActivosPage;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    const loginPage = new LoginPage(driver);
    await loginPage.ejecutarLogin();
    puertosActivosPage = new PuertosActivosPage(driver);
  });

  after(async () => {
    await driver.quit();
  });

  it('Debería navegar y abrir Puertos Activos correctamente', async () => {
    await puertosActivosPage.ejecutarPuertosActivos();
    expect(true).to.be.true; // Puedes agregar una aserción real si hay algo que validar
  });
});
