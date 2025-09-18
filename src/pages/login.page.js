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

  // === Login completo en un solo método ===
async ejecutarLogin(
  usuario = process.env.LOGIN_EMAIL,
  clave = process.env.LOGIN_PASSWORD,
  caseName = 'default'           // ➜ nombre del caso de prueba
) {
  try {
    const driver = this.driver;

    // Paso 1: Abrir https://oss-dev.celsiainternet.com/
    await driver.get(this.url);

    // Paso 2: Ingresar correo válido en el campo “Correo electrónico”.
    const inputCorreo = await driver.wait(
      until.elementLocated(By.css('#textfield-field-user')),
      25000
    );
    await inputCorreo.sendKeys(usuario);

    // Paso 3: Clic en Siguiente.
    const btnSiguiente = await driver.wait(
      until.elementLocated(
        By.xpath("//div[contains(text(),'Siguiente') and contains(@class, 'btn-default')]")
      ),
      25000
    );
    await driver.executeScript('arguments[0].click();', btnSiguiente);
    await driver.sleep(5000); // espera transición

    // Paso 4: Ingresar contraseña válida.
    const inputPassword = await driver.wait(
      until.elementLocated(By.css('#textfield-field-password')),
      25000
    );
    await inputPassword.sendKeys(clave);

    // Paso 5: Clic en Iniciar sesión.
    const btnLogin = await driver.wait(
      until.elementLocated(By.css('#widget-button-btn-common-login > div')),
      55000
    );
    await driver.executeScript('arguments[0].click();', btnLogin);

    // Paso 6: Seleccionar aplicación Himalaya.
    const himalayaBtn = await driver.wait(
      until.elementLocated(
        By.css('#login-cloud-view-container .popular-apps > div')
      ),
      55000
    );
    await driver.executeScript('arguments[0].click();', himalayaBtn);
    await driver.sleep(5000); // espera modal de confirmación

    // Paso 7: Confirmar en el modal con Sí.
    const btnConfirmar = await driver.wait(
      until.elementLocated(
        By.xpath("//div[contains(text(),'Sí') and contains(@class, 'btn-default')]")
      ),
      25000
    );
    await driver.executeScript('arguments[0].click();', btnConfirmar);
    await driver.sleep(5000); // espera redirección o carga final

  } catch (error) {
    // === Captura de pantalla organizada por carpetas ===
    const screenshot = await this.driver.takeScreenshot();

    // 🟢 Carpeta raíz del proyecto: ../../.. desde src/pages
    const rootErrors = path.resolve(__dirname, '../../../errors');

    // 🟢 Carpeta del Page Object: "login"
    const pageFolder = path.join(rootErrors, 'login');

    // 🟢 Carpeta del caso de prueba, p. ej. "CP_LOGIN_002"
    const caseFolder = path.join(pageFolder, caseName);

    // Crear carpetas si no existen
    [rootErrors, pageFolder, caseFolder].forEach(folder => {
      if (!fs.existsSync(folder)) fs.mkdirSync(folder);
    });

    // Nombre de archivo con timestamp
    const archivoSalida = path.join(
      caseFolder,
      `error_${Date.now()}.png`
    );

    fs.writeFileSync(archivoSalida, screenshot, 'base64');

    throw error; // relanza para que la prueba falle
  }
}


  // async getEmailError() {
  //   const el = await this.driver.wait(
  //     until.elementLocated(By.css('.error-email')),             // busca mensaje de error de correo
  //     5000
  //   );
  //   return el.getText();                                        // devuelve el texto del error
  // }

  // async getPasswordError() {
  //   const el = await this.driver.wait(
  //     until.elementLocated(By.css('.error-password')),          // busca mensaje de error de contraseña
  //     5000
  //   );
  //   return el.getText();
  // }

  // async getGenericError() {
  //   const el = await this.driver.wait(
  //     until.elementLocated(By.css('.error-message')),           // busca mensaje de error genérico
  //     5000
  //   );
  //   return el.getText();
  // }

  async takeScreenshotOnError(prefix = 'error_login') {
  const screenshot = await this.driver.takeScreenshot();
  // 📁 Subir 3 niveles: de src/pages -> src -> raíz
  const carpetaErrores = path.resolve(__dirname, '../../../errors');
  if (!fs.existsSync(carpetaErrores)) fs.mkdirSync(carpetaErrores);
  const archivoSalida = path.join(
    carpetaErrores,
    `${prefix}_${Date.now()}.png`
  );
  fs.writeFileSync(archivoSalida, screenshot, 'base64');
  return archivoSalida;
}

}
