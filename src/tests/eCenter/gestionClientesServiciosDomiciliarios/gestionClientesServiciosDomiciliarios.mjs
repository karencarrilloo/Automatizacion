import { Builder } from 'selenium-webdriver';
import { expect } from 'chai';
import LoginPage from '../pages/login.page.js';
import chromedriver from 'chromedriver';
import GestionClientesServiciosPage from '../pages/gestionClientesServiciosDomiciliarios.page.js';

describe('Prueba de Gestión sobre Clientes y Servicios Domiciliarios', function() {
  this.timeout(800000); // 3 min

  let driver;
  let gestionPage;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    const login = new LoginPage(driver);
    await login.ejecutarLogin();
    gestionPage = new GestionClientesServiciosPage(driver);
  });

  after(async () => {
    await driver.quit();
  });

  it('Debería abrir Gestión sobre clientes y servicios domiciliarios', async () => {
    await gestionPage.ejecutarGestionClientesServicios();
    expect(true).to.be.true; // Placeholder para aserción real
  });
});
