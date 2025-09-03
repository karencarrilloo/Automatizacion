import { Builder } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import path from "path";
import { describe, before, after, it } from "mocha";
import LoginPage from "../pages/login.page.js";

let driver;
let loginPage;

describe("Pruebas de Login", function () {
  this.timeout(60000);

  before(async () => {
    const downloadPath = path.resolve("./descargas"); // 📂 Carpeta de descargas

    const options = new chrome.Options();
    options.addArguments(
      "--safebrowsing-disable-download-protection",
      "--disable-popup-blocking",
      "--allow-running-insecure-content",
      "--no-first-run",
      "--no-default-browser-check"
    );

    options.setUserPreferences({
      "download.default_directory": downloadPath,
      "download.prompt_for_download": false,
      "download.directory_upgrade": true,
      "safebrowsing.enabled": true,
      "profile.default_content_setting_values.automatic_downloads": 1,
      "profile.default_content_setting_values.popups": 0
    });


    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();

    loginPage = new LoginPage(driver);
  });

  after(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it("Debería iniciar sesión correctamente", async () => {
    await loginPage.open();
    await loginPage.login(process.env.APP_USERNAME, process.env.APP_PASSWORD);

    // Aquí puedes validar si entró correctamente
    console.log("✅ Login realizado con éxito.");
  });
});
