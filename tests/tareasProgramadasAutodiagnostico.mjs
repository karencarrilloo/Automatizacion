// archivo: tareasProgramadasAutodiagnostico.mjs
import { Builder } from 'selenium-webdriver';
import { expect } from 'chai';
import LoginPage from '../pages/login.page.js';
import TareasProgramadasAutodiagnosticoPage from '../pages/tareasProgramadasAutodiagnostico.page.js';
import chromedriver from 'chromedriver';

describe('Prueba de Tareas Programadas Autodiagnóstico', function () {
  this.timeout(180000); // 3 minutos para la prueba

  let driver;
  let tareasPage;

  before(async () => {
    // Inicializa el navegador
    driver = await new Builder().forBrowser('chrome').build();

    // Login en la aplicación
    const login = new LoginPage(driver);
    await login.ejecutarLogin();

    // Instancia de la nueva página
    tareasPage = new TareasProgramadasAutodiagnosticoPage(driver);
  });

  after(async () => {
    // Cierra el navegador al finalizar
    await driver.quit();
  });

  it('Debería abrir la vista "Tareas Programadas Autodiagnóstico"', async () => {
    await tareasPage.ingresarTareasProgramadasAutodiagnostico();
    expect(true).to.be.true; // simple validación de que el flujo no falló
  });
});
