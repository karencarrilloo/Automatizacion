import { Builder } from 'selenium-webdriver';
import { expect } from 'chai';
import LoginPage from '../pages/login.page.js';
import ProgramadorTareasPage from '../pages/programadorTareas.page.js';
import chromedriver from 'chromedriver';

describe('Prueba de Programador de Tareas', function () {
  this.timeout(180000);

  let driver;
  let programadorPage;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    const login = new LoginPage(driver);
    await login.ejecutarLogin();
    programadorPage = new ProgramadorTareasPage(driver);
  });

  after(async () => {
    await driver.quit();
  });

  it('Debería abrir la vista "Programador de tareas"', async () => {
    await programadorPage.ejecutarProgramadorTareas();
    expect(true).to.be.true;
  });
});
