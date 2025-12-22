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

      // === Paso 3: Clic en botón "Siguiente" ===
      try {
        const btnSiguienteXpath = '//*[@id="widget-button-btn-next-step-login"]/div';

        const btnSiguiente = await driver.wait(
          until.elementLocated(By.xpath(btnSiguienteXpath)),
          25000
        );

        await driver.wait(until.elementIsVisible(btnSiguiente), 10000);
        await driver.wait(until.elementIsEnabled(btnSiguiente), 10000);

        // Scroll por si está fuera de vista
        await driver.executeScript(
          "arguments[0].scrollIntoView({block:'center'});",
          btnSiguiente
        );
        await driver.sleep(500);

        // Click robusto (frontend nuevo suele necesitar JS)
        try {
          await btnSiguiente.click();
        } catch {
          await driver.executeScript("arguments[0].click();", btnSiguiente);
        }

        console.log("✅ Paso 3: Botón 'Siguiente' presionado correctamente.");
        await driver.sleep(5000); // espera transición

      } catch (error) {
        throw new Error(`❌ Error en Paso 3 (clic en botón Siguiente): ${error.message}`);
      }

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

      // 🟢 Carpeta del caso de prueba, p. ej. "CP_LOGIN_00X"
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

}
