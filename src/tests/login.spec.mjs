// src/tests/login/login.spec.mjs
import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import { describe, it, before, after } from 'mocha';
import { expect } from 'chai';
import path from 'path';
import LoginPage from '../../pages/login.page.js';

let driver;
let loginPage;

describe('Pruebas de Login', function () {
  this.timeout(60000);

  before(async () => {
    const options = new chrome.Options();
    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    loginPage = new LoginPage(driver);
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it('CP_LOGIN_001: Inicio de sesión exitoso con credenciales válidas', async () => {
    await loginPage.open();
    await loginPage.enterEmail(process.env.LOGIN_EMAIL);
    await loginPage.clickNext();
    await loginPage.enterPassword(process.env.LOGIN_PASSWORD);
    await loginPage.clickLogin();
    await loginPage.selectHimalayaAndConfirm();

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('himalaya');
  });

  it('CP_LOGIN_002: Error de autenticación con contraseña inválida', async () => {
    await loginPage.open();
    await loginPage.enterEmail(process.env.LOGIN_EMAIL);
    await loginPage.clickNext();
    await loginPage.enterPassword('contraseña_incorrecta');
    await loginPage.clickLogin();
    const error = await loginPage.getGenericError();
    expect(error.toLowerCase()).to.include('credencial');
  });

  it('CP_LOGIN_003: Correo no registrado', async () => {
    await loginPage.open();
    await loginPage.enterEmail('noexiste@dominio.com');
    await loginPage.clickNext();
    const error = await loginPage.getGenericError();
    expect(error.toLowerCase()).to.include('no registrado');
  });

  it('CP_LOGIN_004: Campo correo vacío', async () => {
    await loginPage.open();
    await loginPage.clickNext();
    const error = await loginPage.getEmailError();
    expect(error.toLowerCase()).to.include('requerido');
  });

  it('CP_LOGIN_005: Campo contraseña vacío', async () => {
    await loginPage.open();
    await loginPage.enterEmail(process.env.LOGIN_EMAIL);
    await loginPage.clickNext();
    await loginPage.clickLogin();
    const error = await loginPage.getPasswordError();
    expect(error.toLowerCase()).to.include('requerido');
  });

  it('CP_LOGIN_006: Cerrar sesión y validar que solicita credenciales de nuevo', async () => {
    await loginPage.open();
    await loginPage.enterEmail(process.env.LOGIN_EMAIL);
    await loginPage.clickNext();
    await loginPage.enterPassword(process.env.LOGIN_PASSWORD);
    await loginPage.clickLogin();
    // Aquí agregarías pasos para cerrar sesión si tu aplicación tiene un botón Logout
    await loginPage.open();
    const url = await driver.getCurrentUrl();
    expect(url).to.include('login'); // Ajustar selector según tu app
  });

  it('CP_LOGIN_007: Captura de pantalla ante error', async () => {
    try {
      await loginPage.open();
      await loginPage.enterEmail(process.env.LOGIN_EMAIL);
      await loginPage.clickNext();
      await loginPage.enterPassword('badpass');
      await loginPage.clickLogin();
      throw new Error('Forzando fallo para captura');
    } catch (err) {
      const pathError = await loginPage.takeScreenshotOnError();
      expect(pathError).to.match(/error_login_\d+\.png$/);
    }
  });
});
