// src/pages/login.page.js
import { By, until } from 'selenium-webdriver';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class LoginPage {
  constructor(driver) {
    this.driver = driver;
    this.url = 'https://oss-dev.celsiainternet.com/';
  }

  async open() {
    await this.driver.get(this.url);
  }

  async enterEmail(email) {
    const inputCorreo = await this.driver.wait(
      until.elementLocated(By.css('#textfield-field-user')),
      25000
    );
    await inputCorreo.clear();
    await inputCorreo.sendKeys(email);
  }

  async clickNext() {
    const btnSiguiente = await this.driver.wait(
      until.elementLocated(
        By.xpath("//div[contains(text(),'Siguiente') and contains(@class, 'btn-default')]")
      ),
      25000
    );
    await this.driver.executeScript('arguments[0].click();', btnSiguiente);
  }

  async enterPassword(password) {
    const inputPassword = await this.driver.wait(
      until.elementLocated(By.css('#textfield-field-password')),
      25000
    );
    await inputPassword.clear();
    await inputPassword.sendKeys(password);
  }

  async clickLogin() {
    const btnLogin = await this.driver.wait(
      until.elementLocated(By.css('#widget-button-btn-common-login > div')),
      25000
    );
    await this.driver.executeScript('arguments[0].click();', btnLogin);
  }

  async selectHimalayaAndConfirm() {
    const himalayaBtn = await this.driver.wait(
      until.elementLocated(By.css('#login-cloud-view-container .popular-apps > div')),
      55000
    );
    await this.driver.executeScript('arguments[0].click();', himalayaBtn);

    const btnConfirmar = await this.driver.wait(
      until.elementLocated(
        By.xpath("//div[contains(text(),'Sí') and contains(@class, 'btn-default')]")
      ),
      25000
    );
    await this.driver.executeScript('arguments[0].click();', btnConfirmar);
  }

  // ✅ Métodos de validación de mensajes de error
  async getEmailError() {
    const el = await this.driver.wait(
      until.elementLocated(By.css('.error-email')),
      5000
    );
    return el.getText();
  }

  async getPasswordError() {
    const el = await this.driver.wait(
      until.elementLocated(By.css('.error-password')),
      5000
    );
    return el.getText();
  }

  async getGenericError() {
    const el = await this.driver.wait(
      until.elementLocated(By.css('.error-message')),
      5000
    );
    return el.getText();
  }

  async takeScreenshotOnError(prefix = 'error_login') {
    const screenshot = await this.driver.takeScreenshot();
    const carpetaErrores = path.resolve(__dirname, '../errores');
    if (!fs.existsSync(carpetaErrores)) fs.mkdirSync(carpetaErrores);
    const archivoSalida = path.join(
      carpetaErrores,
      `${prefix}_${Date.now()}.png`
    );
    fs.writeFileSync(archivoSalida, screenshot, 'base64');
    return archivoSalida;
  }
}
