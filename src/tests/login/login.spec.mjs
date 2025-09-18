import 'chromedriver'; // asegura que el binario de ChromeDriver esté en el PATH
import { Builder, By, until, logging } from 'selenium-webdriver'; // crea y controla el navegador
import chrome from 'selenium-webdriver/chrome.js'; // opciones específicas para Chrome
import { describe, it, before, after } from 'mocha'; // estructura de pruebas
import { expect } from 'chai'; // aserciones/validaciones
import LoginPage from '../../pages/login.page.js'; // Page Object del login

let driver;      // instancia global de WebDriver
let loginPage;   // instancia global del Page Object

describe('Pruebas de Login', function () {
  this.timeout(60000); // tiempo máximo de cada test en ms

  before(async () => {
    const options = new chrome.Options(); // configuración del navegador
    // options.addArguments('--headless'); // descomenta para modo sin ventana

    // Ajustes para silenciar los logs de Chrome/DevTools
    options.addArguments('--log-level=3');             // solo errores graves
    options.addArguments('--silent');                  // suprime mensajes extra
    options.excludeSwitches('enable-logging');         // evita “DevTools listening...”

    // (Opcional) desactivar logs de Selenium del navegador
    const prefs = new logging.Preferences();
    prefs.setLevel(logging.Type.BROWSER, logging.Level.OFF);


    driver = await new Builder()
      .forBrowser('chrome')              // indica el navegador
      .setChromeOptions(options)         // aplica la configuración
      .setLoggingPrefs(prefs)      // aplica preferencia de logs
      .build();                          // crea la sesión de WebDriver
    loginPage = new LoginPage(driver);    // inicializa el Page Object
  });

  after(async () => {
    if (driver) await driver.quit();      // cierra el navegador al terminar
  });

  it('CP_LOGIN_001: Inicio de sesión exitoso con credenciales válidas.', async () => {
    await loginPage.ejecutarLogin(process.env.LOGIN_EMAIL,
      process.env.LOGIN_PASSWORD,
      'CP_LOGIN_001'); // Pasos 1–7

    // Esperar a que aparezca el contenedor principal de la plataforma
    const mainFrame = await driver.wait(
      until.elementLocated(By.id('container-mainframe')),
      60000,
      'No se encontró el contenedor principal después del login'
    );

    // Confirmar que realmente se ve en pantalla
    expect(await mainFrame.isDisplayed()).to.be.true;
  });


  // it('CP_LOGIN_002: Error de autenticación con contraseña inválida', async () => {
  //   await loginPage.ejecutarLogin(
  //     process.env.LOGIN_EMAIL,
  //     'Clave_Incorrecta_123'
  //   );

  //   // Esperar la alerta de error
  //   const alert = await driver.wait(
  //     until.elementLocated(
  //       By.css('div[data-growl="container"][role="alert"]')
  //     ),
  //     30000,
  //     'No se encontró la alerta de error de autenticación'
  //   );

  //   // Esperar a que sea visible
  //   await driver.wait(until.elementIsVisible(alert), 10000);

  //   const text = await alert.getText();
  //   expect(text.toLowerCase()).to.include('datos inválidos'); // ajusta si el texto varía
  // });


  // it('CP_LOGIN_003: Correo no registrado', async () => {
  //   await loginPage.open();
  //   await loginPage.enterEmail('noexiste@dominio.com');        // correo inexistente
  //   await loginPage.clickNext();
  //   const error = await loginPage.getGenericError();
  //   expect(error.toLowerCase()).to.include('no registrado');
  // });

  // it('CP_LOGIN_004: Correo vacío', async () => {
  //   await loginPage.open();
  //   await loginPage.clickNext();                               // intenta avanzar sin correo
  //   const error = await loginPage.getEmailError();
  //   expect(error.toLowerCase()).to.include('requerido');
  // });

  // it('CP_LOGIN_005: Contraseña vacía', async () => {
  //   await loginPage.open();
  //   await loginPage.enterEmail(process.env.LOGIN_EMAIL);
  //   await loginPage.clickNext();
  //   await loginPage.clickLogin();                              // intenta sin contraseña
  //   const error = await loginPage.getPasswordError();
  //   expect(error.toLowerCase()).to.include('requerido');
  // });

  // it('CP_LOGIN_006: Requiere login tras logout', async () => {
  //   await loginPage.open();
  //   await loginPage.enterEmail(process.env.LOGIN_EMAIL);
  //   await loginPage.clickNext();
  //   await loginPage.enterPassword(process.env.LOGIN_PASSWORD);
  //   await loginPage.clickLogin();
  //   // aquí irían pasos para cerrar sesión si la app los tiene
  //   await loginPage.open();                                    // vuelve a la URL de login
  //   const url = await driver.getCurrentUrl();
  //   expect(url).to.include('login');                           // confirma que pide credenciales
  // });

  // it('CP_LOGIN_007: Captura ante error', async () => {
  //   try {
  //     await loginPage.open();
  //     await loginPage.enterEmail(process.env.LOGIN_EMAIL);
  //     await loginPage.clickNext();
  //     await loginPage.enterPassword('badpass');                // forzar fallo
  //     await loginPage.clickLogin();
  //     throw new Error('Forzando fallo para captura');
  //   } catch (err) {
  //     const pathError = await loginPage.takeScreenshotOnError();
  //     expect(pathError).to.match(/error_login_\d+\.png$/);      // verifica que se guardó screenshot
  //   }
  // });
});
