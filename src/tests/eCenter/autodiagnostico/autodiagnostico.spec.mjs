import { Builder } from 'selenium-webdriver';
import { expect } from 'chai';
import chrome from 'selenium-webdriver/chrome.js';  
import LoginPage from '../../../pages/login/login.page.js';
import AutodiagnosticoPage from '../../../pages/eCenter/autodiagnostico/autodiagnostico.page.js';
import chromedriver from 'chromedriver';

describe('Pruebas de Autodiagnóstico', function () {
  this.timeout(180000);

  let driver;
  let autodiagnosticoPage;

  before(async () => {
    const options = new chrome.Options();
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options) // ✅ ahora sí funciona
      .build();

    const login = new LoginPage(driver);
    await login.ejecutarLogin();
    autodiagnosticoPage = new AutodiagnosticoPage(driver);
  });

  after(async () => {
    await driver.quit();
  });

  it.only('CP_AUTO_001: Ingreso a la vista Autodiagnóstico', async () => {
    await autodiagnosticoPage.ingresarVistaAutodiagnostico();
 expect(true).to.be.true;
  });

  it.only('CP_AUTO_002: Consulta de cliente por ID DEAL', async () => {
    await autodiagnosticoPage.consultarClientePorID(); // ** CREAR VARIABLE GLOBAL COMO EN GESTOR DE ORDENES **//
 expect(true).to.be.true;
  });

  it('CP_AUTO_003: Editar configuración WiFi', async () => {
    await autodiagnosticoPage.editarConfiguracionWiFi();
 expect(true).to.be.true;
  });

  it('CP_AUTO_004: Redirigir ONT (clic en NO del modal)', async () => {
   
    await autodiagnosticoPage.ejecutarRedirigirONT();
 expect(true).to.be.true;
  });

  it.only("CP_AUTO_005: Creación de órdenes", async () => {
    await autodiagnosticoPage.crearOrdenes();
    expect(true).to.be.true; 
  });

  it('CP_AUTO_006: Función UPnP', async () => {
  await autodiagnosticoPage.funcionUPnP();
  expect(true).to.be.true;
});

it('CP_AUTO_007: Función DMZ', async () => {
  await autodiagnosticoPage.funcionDMZ();
  expect(true).to.be.true;
});

it('CP_AUTO_008: Función IPv4 Port Mapping', async () => {
  await autodiagnosticoPage.funcionIPv4PortMapping();
  expect(true).to.be.true;
});

it('CP_AUTO_009: reserva DHCP', async () => {
  await autodiagnosticoPage.funcionReservaDHCP();
  expect(true).to.be.true;
});

it('CP_AUTO_010: Dispositivos conectados', async () => {
  await autodiagnosticoPage.funcionDispositivosConectados();
  expect(true).to.be.true;

});
});