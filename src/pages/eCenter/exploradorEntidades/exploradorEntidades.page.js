import { By, until } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class ExploradorEntidadesPage {
  constructor(driver) {
    this.driver = driver;
  }

  async ingresarVistaExploradorEntidades() {
    const driver = this.driver;

    try {
      // === Paso 1: Clic en módulo eCenter ===
      const eCenterBtn = await driver.wait(
        until.elementLocated(By.xpath("//div[@id='118' and contains(@class, 'item-module')]")),
        10000
      );
      await driver.executeScript("arguments[0].click();", eCenterBtn);
      await driver.sleep(1000);

      // === Paso 2: Scroll en el contenedor de aplicaciones ===
      const scrollContainer = await driver.wait(
        until.elementLocated(By.css('.container-applications')),
        10000
      );
      await driver.executeScript(
        "arguments[0].scrollTop = arguments[0].scrollHeight;",
        scrollContainer
      );
      await driver.sleep(1000);

      // === Paso 3: Clic en "Explorador de entidades" ===
      const targetApp = await driver.wait(
        until.elementLocated(
          By.xpath("//div[contains(@class,'legend-application') and contains(text(),'Explorador de entidades')]")
        ),
        10000
      );
      await driver.executeScript("arguments[0].scrollIntoView({behavior:'smooth', block:'center'});", targetApp);
      await driver.wait(until.elementIsVisible(targetApp), 10000);
      await driver.wait(until.elementIsEnabled(targetApp), 10000);
      await driver.sleep(1000);
      await driver.executeScript("arguments[0].click();", targetApp);
      await driver.sleep(5000);

      console.log("✅ Explorador de entidades abierto correctamente.");
    } catch (error) {
      console.error(`❌ Error al ejecutar Explorador de entidades: ${error.message}`);
      throw error;
    }
  }
  // =======================
  // CP_EXPENT_002 – Selección de elemento secundario y tarjeta ONT
  // =======================
  async seleccionarElementoSecundario(caseName = 'CP_EXPENT_002') {
    const driver = this.driver;

    try {
      // === Paso 1: Clic en "elemento secundario" ===
      const elementoSecundario = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="container-entity"]/div/div[1]/div[2]/div[13]')),
        15000
      );
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", elementoSecundario);
      await driver.wait(until.elementIsVisible(elementoSecundario), 10000);
      await driver.wait(until.elementIsEnabled(elementoSecundario), 10000);
      await elementoSecundario.click();
      await driver.sleep(3000);
      console.log("✅ CP_EXPENT_002 Paso 1: Elemento secundario seleccionado.");

      // === Paso 2: Clic en tarjeta ONT ===
      const tarjetaONT = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="container-entity"]/div/div[1]/div[2]/div[13]/div[5]/div')),
        15000
      );
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", tarjetaONT);
      await driver.wait(until.elementIsVisible(tarjetaONT), 10000);
      await driver.wait(until.elementIsEnabled(tarjetaONT), 10000);
      await tarjetaONT.click();
      await driver.sleep(10000);
      console.log("✅ CP_EXPENT_002 Paso 2: Tarjeta ONT seleccionada.");

      // // === Validación mínima después del clic ===
      // const contenedor = await driver.wait(
      //   until.elementLocated(By.xpath('//*[@id="container-entity"]')),
      //   10000
      // );
      // if (!(await contenedor.isDisplayed())) {
      //   throw new Error("El contenedor de entidad no se muestra tras seleccionar la tarjeta ONT.");
      // }
      // console.log("✅ CP_EXPENT_002 Validación: Contenedor visible tras seleccionar ONT.");



    } catch (error) {
      console.error(`❌ Error en ${caseName}: ${error.message}`);
      throw error;
    }
  }

 // =======================
// CP_EXPENT_003 – Crear nuevo registro de entidad
// =======================
async crearNuevoRegistroEntidad(caseName = 'CP_EXPENT_003') {
  const driver = this.driver;

  try {
    // === Paso 1: Clic en la primera tarjeta ===
    const contenedor = await driver.wait(
      until.elementLocated(By.id('container-grid-crud')),
      20000
    );
    await driver.wait(until.elementIsVisible(contenedor), 20000);

    const tarjetas = await driver.findElements(
      By.xpath('//*[@id="container-grid-crud"]//div[starts-with(@id,"device-")]')
    );

    if (tarjetas.length === 0) {
      throw new Error("No se encontraron tarjetas dentro de #container-grid-crud.");
    }

    const primeraTarjeta = tarjetas[0];
    await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", primeraTarjeta);
    await driver.wait(until.elementIsVisible(primeraTarjeta), 30000);
    await primeraTarjeta.click();
    await driver.sleep(2000);

    console.log("✅ CP_EXPENT_003 Paso 1: Primera tarjeta seleccionada.");

    // === Paso 2: Clic en botón "Nuevo registro de entidad" ===
    const btnNuevo = await driver.wait(
      until.elementLocated(By.xpath('//*[@id="btn-open-crud-new"]')),
      20000
    );
    await driver.wait(until.elementIsVisible(btnNuevo), 20000);
    await driver.wait(until.elementIsEnabled(btnNuevo), 20000);

    await btnNuevo.click();
    await driver.sleep(2000);

    console.log("✅ CP_EXPENT_003 Paso 2: Botón 'Nuevo registro de entidad' clickeado.");

    // === Paso 3: Diligenciar campo SERIALCELSIA con 1048XXXX ===
    const campoSerial = await driver.wait(
      until.elementLocated(By.xpath('//*[@id="textfield-SERIALCELSIA"]')),
      20000
    );
    await driver.wait(until.elementIsVisible(campoSerial), 20000);

    // Generar serial aleatorio con prefijo 1048
    const randomPart = Math.floor(1000 + Math.random() * 9000); // 4 dígitos aleatorios
    const serial = `1048${randomPart}`;

    await campoSerial.clear();
    await campoSerial.sendKeys(serial);
    await driver.sleep(1000);

    console.log(`✅ CP_EXPENT_003 Paso 3: Campo SERIALCELSIA diligenciado con valor ${serial}.`);

    // === Paso 4: Diligenciar campo FACTORYSERIAL con 485724435AXXXXXX ===
    const campoFactorySerial = await driver.wait(
      until.elementLocated(By.xpath('//*[@id="textfield-FACTORYSERIAL"]')),
      20000
    );
    await driver.wait(until.elementIsVisible(campoFactorySerial), 20000);

    const randomFactory = Math.floor(100000 + Math.random() * 900000); // 6 dígitos aleatorios
    const factorySerial = `485724435A${randomFactory}`;

    await campoFactorySerial.clear();
    await campoFactorySerial.sendKeys(factorySerial);
    await driver.sleep(1000);

    console.log(`✅ CP_EXPENT_003 Paso 4: Campo FACTORYSERIAL diligenciado con valor ${factorySerial}.`);


    // === Paso 5: Clic en botón Categoría ===
    const btnCategoria = await driver.wait(
      until.elementLocated(By.xpath('//*[@id="widget-picklist-CATEGORY"]/div[1]/span[2]/button')),
      20000
    );
    await driver.wait(until.elementIsVisible(btnCategoria), 20000);
    await driver.wait(until.elementIsEnabled(btnCategoria), 20000);

    await btnCategoria.click();
    await driver.sleep(2000);

    console.log("✅ CP_EXPENT_003 Paso 5: Botón 'Categoría' clickeado.");

    // === Paso 6: Seleccionar registro ONT ===
    const registroONT = await driver.wait(
      until.elementLocated(By.xpath('//*[@id="row-21"]')),
      20000
    );
    await driver.wait(until.elementIsVisible(registroONT), 20000);
    await driver.wait(until.elementIsEnabled(registroONT), 20000);

    await registroONT.click();
    await driver.sleep(2000);

    console.log("✅ CP_EXPENT_003 Paso 6: Registro 'ONT' seleccionado.");

    // === Paso 7: Clic en botón Seleccionar (confirmar categoría) ===
    const btnSeleccionar = await driver.wait(
      until.elementLocated(By.xpath('//*[@id="widget-button-btSelect-CATEGORY"]/div')),
      20000
    );
    await driver.wait(until.elementIsVisible(btnSeleccionar), 20000);
    await driver.wait(until.elementIsEnabled(btnSeleccionar), 20000);

    await btnSeleccionar.click();
    await driver.sleep(2000);

    console.log("✅ CP_EXPENT_003 Paso 7: Botón 'Seleccionar' clickeado (categoría confirmada).");

    // === Paso 8: Diligenciar campo IP con una dirección IPv4 aleatoria ===
    const campoIP = await driver.wait(
      until.elementLocated(By.xpath('//*[@id="textfield-IP"]')),
      20000
    );
    await driver.wait(until.elementIsVisible(campoIP), 20000);

    // Generar dirección IPv4 aleatoria (ej. 192.168.45.123)
    const oct1 = Math.floor(Math.random() * 256);
    const oct2 = Math.floor(Math.random() * 256);
    const oct3 = Math.floor(Math.random() * 256);
    const oct4 = Math.floor(Math.random() * 256);
    const ip = `${oct1}.${oct2}.${oct3}.${oct4}`;

    await campoIP.clear();
    await campoIP.sendKeys(ip);
    await driver.sleep(1000);

    console.log(`✅ CP_EXPENT_003 Paso 8: Campo IP diligenciado con valor ${ip}.`);

    // === Paso 9: Diligenciar campo MAC con serial aleatoria ===
    const campoMAC = await driver.wait(
      until.elementLocated(By.xpath('//*[@id="textfield-MAC"]')),
      20000
    );
    await driver.wait(until.elementIsVisible(campoMAC), 20000);

    // Generar MAC aleatoria (ej. AB:1F:93:4C:20:D7)
    const randomHex = () =>
      ('0' + Math.floor(Math.random() * 256).toString(16)).slice(-2).toUpperCase();
    const mac = `${randomHex()}:${randomHex()}:${randomHex()}:${randomHex()}:${randomHex()}:${randomHex()}`;

    await campoMAC.clear();
    await campoMAC.sendKeys(mac);
    await driver.sleep(1000);

    console.log(`✅ CP_EXPENT_003 Paso 9: Campo MAC diligenciado con valor ${mac}.`);

    // === Paso 10: Diligenciar campo Nombre con "HUAWEI_TEST" ===
    const campoNombre = await driver.wait(
      until.elementLocated(By.xpath('//*[@id="textfield-NAME"]')),
      20000
    );
    await driver.wait(until.elementIsVisible(campoNombre), 20000);

    await campoNombre.clear();
    await campoNombre.sendKeys("HUAWEI_TEST");
    await driver.sleep(1000);

    console.log("✅ CP_EXPENT_003 Paso 10: Campo Nombre diligenciado con valor 'HUAWEI_TEST'.");

    // === Paso 11: Clic en botón del campo "Modelo" ===
    const btnModelo = await driver.wait(
      until.elementLocated(By.xpath('//*[@id="widget-picklist-MODEL"]/div[1]/span[2]/button')),
      20000
    );
    await driver.wait(until.elementIsVisible(btnModelo), 20000);
    await driver.wait(until.elementIsEnabled(btnModelo), 20000);

    await btnModelo.click();
    await driver.sleep(2000);

    console.log("✅ CP_EXPENT_003 Paso 11: Botón 'Modelo' clickeado.");

    // === Paso 12: Digitar en la barra de búsqueda del modal "EG8145V5" y presionar Enter ===
    const barraBusqueda = await driver.wait(
      until.elementLocated(By.xpath('//*[@id="crud-search-bar"]')),
      20000
    );
    await driver.wait(until.elementIsVisible(barraBusqueda), 20000);

    await barraBusqueda.clear();
    await barraBusqueda.sendKeys("EG8145V5");
    await barraBusqueda.sendKeys("\n"); // Simula Enter
    await driver.sleep(3000); // Esperar que se refresquen los resultados

    console.log("✅ CP_EXPENT_003 Paso 12: Se buscó 'EG8145V5' en la barra de búsqueda del modal de Modelo.");


  } catch (error) {
    console.error(`❌ Error en ${caseName}: ${error.message}`);
    throw error;

  
}


}

}
