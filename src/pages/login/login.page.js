import { By, until } from 'selenium-webdriver';                // localizar/esperar elementos en la página
import path from 'path';                                       // manejo de rutas de archivos
import fs from 'fs';                                           // lectura/escritura de archivos
import { fileURLToPath } from 'url';                           // obtener ruta absoluta en módulos ES
import dotenv from 'dotenv';                                   // cargar variables de entorno
dotenv.config();                                               // habilita process.env.LOGIN_EMAIL, etc.

const __filename = fileURLToPath(import.meta.url);             // ruta completa de este archivo
const __dirname = path.dirname(__filename);                    // carpeta de este archivo

export default class LoginPage {
  constructor(driver) {
    this.driver = driver;                                      // guarda la instancia de WebDriver
    this.url = 'https://oss-dev.celsiainternet.com/';          // URL de la página de login
  }


  //  ===============================
//  CP_LOGIN_001 – Ingreso a vista
//  7 pasos
//  ===============================

async ejecutarLogin(
  usuario = process.env.LOGIN_EMAIL,
  clave = process.env.LOGIN_PASSWORD,
  caseName = 'CP_LOGIN_001'
) {
  try {
    const driver = this.driver;

    // ===============================
    // Paso 1: Abrir URL
    // ===============================
    try {
      await driver.get(this.url);
      console.log('✅ Paso 1: URL abierta correctamente');
    } catch (error) {
      throw new Error(`❌ Error en Paso 1 (abrir URL): ${error.message}`);
    }

    // ===============================
    // Paso 2: Ingresar correo
    // ===============================
    try {
      const inputCorreo = await driver.wait(
        until.elementLocated(By.css('#textfield-field-user')),
        25000
      );
      await inputCorreo.clear();
      await inputCorreo.sendKeys(usuario);
      console.log('✅ Paso 2: Correo ingresado correctamente');
    } catch (error) {
      throw new Error(`❌ Error en Paso 2 (ingresar correo): ${error.message}`);
    }

    // ===============================
    // Paso 3: Clic en Siguiente
    // ===============================
    try {
      const btnSiguienteXpath = '//*[@id="widget-button-btn-next-step-login"]/div';

      const btnSiguiente = await driver.wait(
        until.elementLocated(By.xpath(btnSiguienteXpath)),
        25000
      );

      await driver.wait(until.elementIsVisible(btnSiguiente), 10000);
      await driver.wait(until.elementIsEnabled(btnSiguiente), 10000);

      await driver.executeScript(
        "arguments[0].scrollIntoView({block:'center'});",
        btnSiguiente
      );
      await driver.sleep(500);

      try {
        await btnSiguiente.click();
      } catch {
        await driver.executeScript("arguments[0].click();", btnSiguiente);
      }

      console.log("✅ Paso 3: Botón 'Siguiente' presionado");
      await driver.sleep(5000);
    } catch (error) {
      throw new Error(`❌ Error en Paso 3 (clic en Siguiente): ${error.message}`);
    }

    // ===============================
    // Paso 4: Ingresar contraseña
    // ===============================
    try {
      const inputPassword = await driver.wait(
        until.elementLocated(By.css('#textfield-field-password')),
        25000
      );
      await inputPassword.clear();
      await inputPassword.sendKeys(clave);
      console.log('✅ Paso 4: Contraseña ingresada correctamente');
    } catch (error) {
      throw new Error(`❌ Error en Paso 4 (ingresar contraseña): ${error.message}`);
    }

    // ===============================
    // Paso 5: Clic en Iniciar sesión
    // ===============================
    try {
      const btnLogin = await driver.wait(
        until.elementLocated(By.css('#widget-button-btn-common-login > div')),
        55000
      );

      await driver.executeScript(
        "arguments[0].scrollIntoView({block:'center'});",
        btnLogin
      );
      await driver.executeScript('arguments[0].click();', btnLogin);

      console.log('✅ Paso 5: Botón Iniciar sesión presionado');
    } catch (error) {
      throw new Error(`❌ Error en Paso 5 (clic en Iniciar sesión): ${error.message}`);
    }

    // ===============================
    // Paso 6: Seleccionar aplicación Himalaya
    // ===============================
    try {
      const himalayaBtn = await driver.wait(
        until.elementLocated(
          By.css('#login-cloud-view-container .popular-apps > div')
        ),
        55000
      );

      await driver.executeScript('arguments[0].click();', himalayaBtn);
      await driver.sleep(5000);

      console.log('✅ Paso 6: Aplicación Himalaya seleccionada');
    } catch (error) {
      throw new Error(`❌ Error en Paso 6 (seleccionar Himalaya): ${error.message}`);
    }

    // ===============================
    // Paso 7: Confirmar modal (Sí)
    // ===============================
    try {
      const btnConfirmar = await driver.wait(
        until.elementLocated(
          By.xpath("//div[contains(text(),'Sí') and contains(@class, 'btn-default')]")
        ),
        25000
      );

      await driver.executeScript('arguments[0].click();', btnConfirmar);
      await driver.sleep(5000);

      console.log('✅ Paso 7: Confirmación realizada');
    } catch (error) {
      throw new Error(`❌ Error en Paso 7 (confirmar modal): ${error.message}`);
    }

  } catch (error) {
    // ===============================
    // Screenshot y manejo de error
    // ===============================
    const screenshot = await this.driver.takeScreenshot();

    const rootErrors = path.resolve(__dirname, '../../../errors');
    const pageFolder = path.join(rootErrors, 'login');
    const caseFolder = path.join(pageFolder, caseName);

    [rootErrors, pageFolder, caseFolder].forEach(folder => {
      if (!fs.existsSync(folder)) fs.mkdirSync(folder);
    });

    const archivoSalida = path.join(
      caseFolder,
      `error_${Date.now()}.png`
    );

    fs.writeFileSync(archivoSalida, screenshot, 'base64');

    throw error;
  }
}
}
