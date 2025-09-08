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

  async ejecutarLogin(usuario = process.env.LOGIN_EMAIL, clave = process.env.LOGIN_PASSWORD) {
    try {
      const driver = this.driver;
      // === CP_LOGIN_001 - Ingreso a aplicacion web emalaea ===
      // Paso 1: Abre la URL del sistema OSS ===
      await driver.get(this.url);

      // Paso 2: En el campo "Correo electrónico", digitar un correo registrado ===
      const inputCorreo = await driver.wait(
        until.elementLocated(By.css('#textfield-field-user')),
        25000
      ); // Espera que el campo de correo esté disponible
      await inputCorreo.sendKeys(usuario); // Ingresa el correo

      // === Paso 3: Clic en botón "Siguiente" ===
      const btnSiguiente = await driver.wait(
        until.elementLocated(By.xpath("//div[contains(text(),'Siguiente') and contains(@class, 'btn-default')]")),
        25000
      ); // Espera el botón Siguiente
      await driver.executeScript("arguments[0].click();", btnSiguiente); // Hace clic con JS para evitar overlays
      await driver.sleep(5000); // Espera transición

      // === Paso 4: Ingresar la contraseña válida ===
      const inputPassword = await driver.wait(
        until.elementLocated(By.css('#textfield-field-password')),
        25000
      ); // Espera campo de contraseña
      await inputPassword.sendKeys(clave); // Ingresa contraseña

      // === Paso 5: Clic en botón "Iniciar sesión" ===
      const btnLogin = await driver.wait(
        until.elementLocated(By.css('#widget-button-btn-common-login > div')),
        55000
      ); // Espera botón login
      await driver.executeScript("arguments[0].click();", btnLogin); // Hace clic en login

      // === Paso 6: Clic en aplicación Himalaya ===
      const himalayaBtn = await driver.wait(
        until.elementLocated(By.css('#login-cloud-view-container .popular-apps > div')),
        55000
      ); // Espera botón Himalaya
      await driver.executeScript("arguments[0].click();", himalayaBtn); // Clic en Himalaya
      await driver.sleep(5000); // Espera modal

      // === Paso 7: En el recuadro de confirmacion dar clic en la opcion "Sí"===
      const btnConfirmar = await driver.wait(
        until.elementLocated(By.xpath("//div[contains(text(),'Sí') and contains(@class, 'btn-default')]")),
        25000
      ); // Espera botón Sí
      await driver.executeScript("arguments[0].click();", btnConfirmar); // Clic en Sí
      await driver.sleep(5000); // Espera transición

    } catch (error) {
      console.error('❌ Error en login:', error.message); // Log del error

      const screenshot = await this.driver.takeScreenshot(); // Captura screenshot

      const carpetaErrores = path.resolve(__dirname, '../errores'); // Ruta carpeta errores
      if (!fs.existsSync(carpetaErrores)) {
        fs.mkdirSync(carpetaErrores); // Crea carpeta si no existe
      }
      const archivoSalida = path.join(carpetaErrores, `error_login_${Date.now()}.png`); // Nombre archivo
      fs.writeFileSync(archivoSalida, screenshot, 'base64'); // Guarda imagen

      await this.driver.quit(); // Cierra navegador
      throw error; // Relanza error
    }
  }
}