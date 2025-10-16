import { By, until, Key } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class ExploradorEntidadesPage {
  constructor(driver) {
    this.driver = driver;
  }
  // =======================
  // CP_EXPENT_001 – Ingreso a la vista Explorador de Entidades
  // =======================
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
  // CP_EXPENT_003 – Crear nuevo registro de entidad(ONT)
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

      // === Paso 12: digitar "EG8145V5" en la barra de búsqueda DEL MODAL ===
      try {
        const modalModelo = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-dialog-dialog-picklist-MODEL"]/div/div')),
          20000
        );
        await driver.wait(until.elementIsVisible(modalModelo), 20000);
        console.log("✅ Modal 'Modelo' visible.");

        // Intentar ubicar la barra de búsqueda DENTRO del modal (varios fallback)
        let barraBusqueda = null;

        // 1) Buscar input con id dentro del modal
        try {
          barraBusqueda = await modalModelo.findElement(
            By.xpath('.//input[@id="crud-search-bar" or contains(@id,"crud-search") or contains(@placeholder,"Búsqueda") or contains(@placeholder,"Buscar")]')
          );
        } catch (e) {
          // ignora, probaremos otros selectores
        }

        // 2) Si no lo encontramos por xpath, intentar por selectores CSS dentro del modal
        if (!barraBusqueda) {
          const selects = [
            'input#crud-search-bar',
            'input[type="search"]',
            'input[placeholder*="Búsqueda"]',
            'input[placeholder*="Buscar"]',
            'input[class*="search"]',
            'input' // último recurso: primer input dentro del modal
          ];
          for (const s of selects) {
            const elems = await modalModelo.findElements(By.css(s));
            if (elems.length > 0) {
              barraBusqueda = elems[0];
              break;
            }
          }
        }

        // 3) Fallback global (solo si no se encontró dentro del modal)
        if (!barraBusqueda) {
          console.warn("⚠️ No se encontró la barra de búsqueda dentro del modal; intentando locator global '#crud-search-bar'.");
          const globalElems = await driver.findElements(By.xpath('//*[@id="crud-search-bar"]'));
          if (globalElems.length > 0) barraBusqueda = globalElems[0];
        }

        if (!barraBusqueda) {
          throw new Error("No se pudo localizar la barra de búsqueda del modal de Modelo.");
        }

        // Asegurar visibilidad y escribir el término
        await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", barraBusqueda);
        await driver.wait(until.elementIsVisible(barraBusqueda), 10000);
        await barraBusqueda.clear();
        await barraBusqueda.sendKeys("EG8145V5");
        await barraBusqueda.sendKeys("\n"); // Enter
        await driver.sleep(2500);

        console.log("✅ Búsqueda 'EG8145V5' realizada en la barra del modal (se usó la barra dentro del modal).");
      } catch (error) {
        console.error(`❌ Error buscando 'EG8145V5' en el modal de Modelo: ${error.message}`);
        throw error;
      }

      // === Paso 13: Seleccionar el registro encontrado (EG8145V5) ===
      const registroModelo = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="row-12"]')),
        20000
      );
      await driver.wait(until.elementIsVisible(registroModelo), 20000);
      await driver.wait(until.elementIsEnabled(registroModelo), 20000);

      await registroModelo.click();
      await driver.sleep(2000);

      console.log("✅ CP_EXPENT_003 Paso 13: Registro 'EG8145V5' seleccionado en el modal de Modelo.");

      // === Paso 14: Clic en botón Seleccionar (confirmar modelo) ===
      const btnSeleccionarModel = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-button-btSelect-MODEL"]/div')),
        20000
      );
      await driver.wait(until.elementIsVisible(btnSeleccionarModel), 20000);
      await driver.wait(until.elementIsEnabled(btnSeleccionarModel), 20000);

      await btnSeleccionarModel.click();
      await driver.sleep(2000);

      console.log("✅ CP_EXPENT_003 Paso 14: Botón 'Seleccionar' clickeado (modelo confirmado).");


      // === Paso 14: Diligenciar campo Descripción con "HUAWEI_TEST" ===
      const campoDescripcion = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="textfield-DESCRIPTION"]')),
        20000
      );
      await driver.wait(until.elementIsVisible(campoDescripcion), 20000);

      await campoDescripcion.clear();
      await campoDescripcion.sendKeys("HUAWEI_TEST");
      await driver.sleep(1000);

      console.log("✅ CP_EXPENT_003 Paso 14: Campo Descripción diligenciado con valor 'ONT HUAWEI_TEST'.");

      // === Paso 15: Clic en botón del campo "Icono" ===
      const btnIcono = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-picklisticon-ICON"]/div[1]/span[2]/button')),
        20000
      );
      await driver.wait(until.elementIsVisible(btnIcono), 20000);
      await driver.wait(until.elementIsEnabled(btnIcono), 20000);

      await btnIcono.click();
      await driver.sleep(2000);

      console.log("✅ CP_EXPENT_003 Paso 15: Botón 'Icono' clickeado.");


      // === Paso 16: Seleccionar el ícono ONT en el modal ===
      const iconoONT = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-dialog-dialog-picklisticon-ICON"]/div/div/div[2]/div/ul/li[19]')),
        20000
      );
      await driver.wait(until.elementIsVisible(iconoONT), 20000);
      await driver.wait(until.elementIsEnabled(iconoONT), 20000);

      await iconoONT.click();
      await driver.sleep(2000);

      console.log("✅ CP_EXPENT_003 Paso 16: Ícono ONT seleccionado en el modal de íconos.");


      // === Paso 17: Clic en botón "Seleccionar" del modal de ícono ===
      const btnSeleccionarIcono = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-button-btSelect-ICON"]/div')),
        20000
      );
      await driver.wait(until.elementIsVisible(btnSeleccionarIcono), 20000);
      await driver.wait(until.elementIsEnabled(btnSeleccionarIcono), 20000);

      await btnSeleccionarIcono.click();
      await driver.sleep(2000);

      console.log("✅ CP_EXPENT_003 Paso 17: Botón 'Seleccionar' clickeado en el modal de ícono.");


      // === Paso 18: Clic en botón del campo "Localidad" ===
      const btnLocalidad = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-picklocation-LOCATION"]/div[1]/span/button')),
        20000
      );
      await driver.wait(until.elementIsVisible(btnLocalidad), 20000);
      await driver.wait(until.elementIsEnabled(btnLocalidad), 20000);

      await btnLocalidad.click();
      await driver.sleep(2000);

      console.log("✅ CP_EXPENT_003 Paso 18: Botón 'Localidad' clickeado.");



      // === Paso 19: Clic en botón "Seleccionar" del modal de Localidad ===
      const btnSeleccionarLocalidad = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-button-btSelect"]/div')),
        20000
      );
      await driver.wait(until.elementIsVisible(btnSeleccionarLocalidad), 20000);
      await driver.wait(until.elementIsEnabled(btnSeleccionarLocalidad), 20000);

      await btnSeleccionarLocalidad.click();
      await driver.sleep(2000);

      console.log("✅ CP_EXPENT_003 Paso 19: Botón 'Seleccionar' clickeado en el modal de Localidad.");



      // === Paso 20: Clic en la flecha "Siguiente" en el formulario de creación de entidad ===
      const btnSiguiente = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-dialog-crud-generic"]/div/div/div[2]/div/div/div[2]/div[1]/div[1]/div')),
        20000
      );
      await driver.wait(until.elementIsVisible(btnSiguiente), 20000);
      await driver.wait(until.elementIsEnabled(btnSiguiente), 20000);

      await btnSiguiente.click();
      await driver.sleep(2000);

      console.log("✅ CP_EXPENT_003 Paso 20: Flecha 'Siguiente' clickeada en el formulario de entidad.");


      // === Paso 21: Clic en botón "Crear" y esperar finalización del progreso ===
      const btnCrear = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-button-btn-Ok"]/div')),
        20000
      );
      await driver.wait(until.elementIsVisible(btnCrear), 20000);
      await driver.wait(until.elementIsEnabled(btnCrear), 20000);

      await btnCrear.click();

      console.log("✅ CP_EXPENT_003 Paso 21: Botón 'Crear' clickeado.");

      // Esperar a que aparezca el progress correcto
      const progress = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="progress-form-carrousel-progress"]')),
        10000
      );

      console.log("⏳ CP_EXPENT_003 Paso 21: Proceso de creación iniciado, esperando que finalice...");

      // Esperar hasta que deje de estar visible (máx. 120s)
      await driver.wait(async () => {
        try {
          return !(await progress.isDisplayed());
        } catch (e) {
          // Si el progress desapareció del DOM, también es válido
          return true;
        }
      }, 120000);

      await driver.sleep(10000);

      console.log("✅ CP_EXPENT_003 Paso 21: Proceso de creación finalizado.");



    } catch (error) {
      console.error(`❌ Error en ${caseName}: ${error.message}`);
      throw error;

    }

  }
  // === CP_EXPENT_004 – Editar registro de entidad (ONT) ===
  async editarEntidad() {
    const driver = this.driver;

    // === Paso 1: Buscar la entidad "HUAWEI_TEST" ===
    try {
      const barraBusqueda = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="crud-search-bar"]')),
        10000
      );
      await driver.wait(until.elementIsVisible(barraBusqueda), 10000);

      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", barraBusqueda);
      await driver.sleep(300);

      // Limpiar campo y escribir texto
      await barraBusqueda.clear();
      await barraBusqueda.sendKeys("HUAWEI_TEST");
      await driver.sleep(500);

      // Presionar ENTER para ejecutar la búsqueda
      await barraBusqueda.sendKeys('\n');
      await driver.sleep(3000); // espera resultados

      console.log("✅ CP_EXPENT_004 Paso 1: Búsqueda de 'HUAWEI_TEST' ejecutada correctamente.");
    } catch (error) {
      throw new Error(`❌ CP_EXPENT_004 Error en Paso 1 (búsqueda en barra): ${error.message}`);
    }

    // === Paso 2: Seleccionar el registro del resultado de búsqueda (card dinámico tipo device) ===
    try {
      // Esperar que el contenedor principal esté visible
      const contenedorResultados = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="container-grid-crud"]')),
        15000
      );
      await driver.wait(until.elementIsVisible(contenedorResultados), 10000);

      // Esperar el primer card disponible
      const card = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="container-grid-crud"]//*[starts-with(@id, "device-")]')),
        10000
      );

      // Scroll hasta el card
      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", card);
      await driver.sleep(800);

      // Clic preciso en el centro del elemento (forzar evento UI real)
      await driver.actions({ bridge: true })
        .move({ origin: card })
        .pause(200)
        .click()
        .perform();

      await driver.sleep(1500);

      // Validar que el card haya sido marcado como activo
      const className = await card.getAttribute("class");
      if (!className.includes("active")) {
        throw new Error("❌ El elemento no fue marcado como seleccionado (no tiene clase 'active').");
      }

      console.log("✅ CP_EXPENT_004 Paso 2: Registro seleccionado correctamente (clase 'active' detectada).");
    } catch (error) {
      throw new Error(`❌ CP_EXPENT_004 Error en Paso 2 (seleccionar registro): ${error.message}`);
    }


    // === Paso 3: Clic en el botón "Editar" ===
    try {
      const botonEditar = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="btn-open-crud-edit"]')),
        10000
      );

      await driver.wait(until.elementIsVisible(botonEditar), 10000);
      await driver.wait(until.elementIsEnabled(botonEditar), 10000);

      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonEditar);
      await driver.sleep(300);

      // Hacer clic mediante JavaScript (evita overlays o intercepciones)
      await driver.executeScript("arguments[0].click();", botonEditar);
      await driver.sleep(3000);

      console.log("✅ CP_EXPENT_004 Paso 3: Botón 'Editar' clickeado correctamente.");
    } catch (error) {
      throw new Error(`❌ CP_EXPENT_004 Error en Paso 3 (clic en botón Editar): ${error.message}`);
    }

    // === CP_EXPENT_004 Paso 4: Clic en la flecha "Siguiente" en el modal de edición ===
    try {
      // Esperar a que el modal de edición esté visible
      const modalEdicion = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-dialog-crud-generic-edit"]/div/div')),
        15000
      );
      await driver.wait(until.elementIsVisible(modalEdicion), 10000);

      // Localizar la flecha "Siguiente" dentro del modal
      const flechaSiguiente = await driver.wait(
        until.elementLocated(
          By.xpath('//*[@id="widget-dialog-crud-generic-edit"]/div/div/div[2]/div/div/div[2]/div[1]/div[1]/div')
        ),
        10000
      );

      // Asegurarse de que sea visible y habilitada antes de interactuar
      await driver.wait(until.elementIsVisible(flechaSiguiente), 10000);
      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", flechaSiguiente);
      await driver.sleep(500);

      // Clic preciso en el centro de la flecha (para evitar overlays)
      await driver.actions({ bridge: true })
        .move({ origin: flechaSiguiente })
        .pause(200)
        .click()
        .perform();

      await driver.sleep(1500); // Espera por transición de pestaña o animación
      console.log("✅ CP_EXPENT_004 Paso 4: Flecha 'Siguiente' clickeada correctamente.");
    } catch (error) {
      throw new Error(`❌ CP_EXPENT_004 Error en Paso 4 (clic en flecha 'Siguiente'): ${error.message}`);
    }

    // === CP_EXPENT_004 Paso 5: Editar campos "Nombre" y "Descripción" ===
    try {
      // Esperar el campo de Nombre
      const campoNombre = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="textfield-NAME"]')),
        15000
      );
      await driver.wait(until.elementIsVisible(campoNombre), 10000);
      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", campoNombre);
      await driver.sleep(500);

      // Limpiar y diligenciar el nuevo nombre
      await campoNombre.clear();
      await campoNombre.sendKeys('HUAWEI_TEST_EDIT');
      console.log("✅ Campo 'Nombre' editado correctamente con valor 'HUAWEI_TEST_EDIT'.");

      // Esperar el campo de Descripción
      const campoDescripcion = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="textfield-DESCRIPTION"]')),
        15000
      );
      await driver.wait(until.elementIsVisible(campoDescripcion), 10000);
      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", campoDescripcion);
      await driver.sleep(500);

      // Limpiar y diligenciar la nueva descripción
      await campoDescripcion.clear();
      await campoDescripcion.sendKeys('HUAWEI_TEST_EDIT');
      console.log("✅ Campo 'Descripción' editado correctamente con valor 'HUAWEI_TEST_EDIT'.");

      await driver.sleep(1000);
    } catch (error) {
      throw new Error(`❌ CP_EXPENT_004 Error en Paso 5 (editar campos 'Nombre' y 'Descripción'): ${error.message}`);
    }

    // === CP_EXPENT_004 Paso 6: Clic en el botón "Siguiente" dentro del modal de edición ===
    try {
      // Esperar que el botón siguiente esté presente en el DOM
      const botonSiguiente = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-dialog-crud-generic-edit"]/div/div/div[2]/div/div/div[2]/div[2]/div[2]/div')),
        15000
      );

      // Verificar visibilidad y que esté habilitado
      await driver.wait(until.elementIsVisible(botonSiguiente), 10000);
      await driver.wait(until.elementIsEnabled(botonSiguiente), 10000);

      // Scroll y clic usando JS para evitar overlays o intercepciones
      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", botonSiguiente);
      await driver.sleep(500);
      await driver.executeScript("arguments[0].click();", botonSiguiente);

      console.log("✅ CP_EXPENT_004 Paso 6: Botón 'Siguiente' clickeado correctamente dentro del modal de edición.");
      await driver.sleep(3000); // Pequeña espera tras la acción
    } catch (error) {
      throw new Error(`❌ CP_EXPENT_004 Error en Paso 6 (clic en botón 'Siguiente' dentro del modal de edición): ${error.message}`);
    }

    // === CP_EXPENT_004 Paso 7: Clic en el botón "Editar" y esperar finalización del progreso ===
    try {
      // Esperar a que el botón "Editar" esté visible y habilitado
      const btnEditar = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-button-btn-Ok"]/div')),
        20000
      );

      await driver.wait(until.elementIsVisible(btnEditar), 20000);
      await driver.wait(until.elementIsEnabled(btnEditar), 20000);

      // Clic en el botón "Editar"
      await btnEditar.click();
      console.log("✅ CP_EXPENT_004 Paso 7: Botón 'Editar' clickeado correctamente.");

      // Esperar que aparezca el progress del formulario
      const progress = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="progress-form-carrousel-progress"]')),
        10000
      );

      console.log("⏳ CP_EXPENT_004 Paso 7: Proceso de edición iniciado, esperando finalización...");

      // Esperar hasta que el progress desaparezca (máximo 120 segundos)
      await driver.wait(async () => {
        try {
          return !(await progress.isDisplayed());
        } catch (e) {
          // Si ya no existe en el DOM, consideramos que terminó
          return true;
        }
      }, 120000);

      // Esperar unos segundos adicionales por estabilidad
      await driver.sleep(8000);

      console.log("✅ CP_EXPENT_004 Paso 7: Proceso de edición finalizado correctamente.");
    } catch (error) {
      throw new Error(`❌ CP_EXPENT_004 Error en Paso 7 (clic en botón 'Editar' y esperar progreso): ${error.message}`);
    }

  }

  // === CP_EXPENT_005 – Eliminar registro de entidad (ONT) === 
  async eliminarEntidad() {
    const driver = this.driver;

    // === Paso 1: Buscar la entidad "HUAWEI_TEST_EDIT" ===
    try {
      const barraBusqueda = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="crud-search-bar"]')),
        10000
      );
      await driver.wait(until.elementIsVisible(barraBusqueda), 10000);

      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", barraBusqueda);
      await driver.sleep(300);

      // Limpiar campo y escribir texto
      await barraBusqueda.clear();
      await barraBusqueda.sendKeys("HUAWEI_TEST_EDIT");
      await driver.sleep(500);

      // Presionar ENTER para ejecutar la búsqueda
      await barraBusqueda.sendKeys('\n');
      await driver.sleep(3000); // Esperar resultados de búsqueda

      console.log("✅ CP_EXPENT_005 Paso 1: Búsqueda de 'HUAWEI_TEST_EDIT' ejecutada correctamente.");
    } catch (error) {
      throw new Error(`❌ CP_EXPENT_005 Error en Paso 1 (búsqueda en barra): ${error.message}`);
    }

    // === Paso 2: Seleccionar el registro del resultado de búsqueda (card dinámico tipo device) ===
    try {
      // Esperar que el contenedor principal esté visible
      const contenedorResultados = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="container-grid-crud"]')),
        15000
      );
      await driver.wait(until.elementIsVisible(contenedorResultados), 10000);

      // Esperar el primer card disponible
      const card = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="container-grid-crud"]//*[starts-with(@id, "device-")]')),
        10000
      );

      // Scroll hasta el card
      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", card);
      await driver.sleep(800);

      // Clic preciso en el centro del elemento (forzar evento UI real)
      await driver.actions({ bridge: true })
        .move({ origin: card })
        .pause(200)
        .click()
        .perform();

      await driver.sleep(1500);

      // Validar que el card haya sido marcado como activo
      const className = await card.getAttribute("class");
      if (!className.includes("active")) {
        throw new Error("❌ El elemento no fue marcado como seleccionado (no tiene clase 'active').");
      }

      console.log("✅ CP_EXPENT_005 Paso 2: Registro seleccionado correctamente (clase 'active' detectada).");
    } catch (error) {
      throw new Error(`❌ CP_EXPENT_005 Error en Paso 2 (seleccionar registro): ${error.message}`);
    }

    // === Paso 3: Clic en el botón "Eliminar" ===
  try {
    const botonEliminar = await driver.wait(
      until.elementLocated(By.xpath('//*[@id="btn-open-crud-delete"]')),
      10000
    );
    await driver.wait(until.elementIsVisible(botonEliminar), 10000);
    await driver.wait(until.elementIsEnabled(botonEliminar), 10000);

    await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonEliminar);
    await driver.sleep(500);

    await driver.executeScript("arguments[0].click();", botonEliminar);
    await driver.sleep(3000);

    console.log("✅ CP_EXPENT_005 Paso 3: Botón 'Eliminar' clickeado correctamente.");
  } catch (error) {
    throw new Error(`❌ CP_EXPENT_005 Error en Paso 3 (clic en botón Eliminar): ${error.message}`);
  }

  // === Paso 4: Clic en el checkbox "Eliminar todas las dependencias" ===
  try {
    const checkboxDependencias = await driver.wait(
      until.elementLocated(By.xpath('//*[@id="ul-tree-ROOT-1_1_check"]')),
      15000
    );

    await driver.wait(until.elementIsVisible(checkboxDependencias), 10000);
    await driver.wait(until.elementIsEnabled(checkboxDependencias), 10000);

    await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", checkboxDependencias);
    await driver.sleep(500);

    await driver.executeScript("arguments[0].click();", checkboxDependencias);
    await driver.sleep(1000);

    console.log("✅ CP_EXPENT_005 Paso 4: Checkbox 'Eliminar todas las dependencias' marcado correctamente.");
  } catch (error) {
    throw new Error(`❌ CP_EXPENT_005 Error en Paso 4 (clic en checkbox 'Eliminar todas las dependencias'): ${error.message}`);
  }

  // === Paso 5: Clic en el botón "Eliminar" del modal de confirmación ===
try {
  const botonConfirmarEliminar = await driver.wait(
    until.elementLocated(By.xpath('//*[@id="widget-button-btn-delete"]/div')),
    15000
  );

  await driver.wait(until.elementIsVisible(botonConfirmarEliminar), 10000);
  await driver.wait(until.elementIsEnabled(botonConfirmarEliminar), 10000);

  await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonConfirmarEliminar);
  await driver.sleep(500);

  await driver.executeScript("arguments[0].click();", botonConfirmarEliminar);
  await driver.sleep(3000);

  console.log("✅ CP_EXPENT_005 Paso 5: Botón 'Eliminar' clickeado correctamente.");
} catch (error) {
  throw new Error(`❌ CP_EXPENT_005 Error en Paso 5 (clic en botón 'Eliminar'): ${error.message}`);
}

// === Paso 6: Clic en botón "Sí" del modal de confirmación y esperar finalización del progreso ===
try {
  const btnConfirmar = await driver.wait(
    until.elementLocated(By.xpath('//*[@id="widget-button-btConfirmYes"]/div')),
    20000
  );

  await driver.wait(until.elementIsVisible(btnConfirmar), 20000);
  await driver.wait(until.elementIsEnabled(btnConfirmar), 20000);

  await btnConfirmar.click();

  console.log("✅ CP_EXPENT_005 Paso 6: Botón 'Sí' clickeado.");

  // Esperar a que aparezca el progress correcto
  const progress = await driver.wait(
    until.elementLocated(By.xpath('//*[@id="progress-form-carrousel-progress"]')),
    10000
  );

  console.log("⏳ CP_EXPENT_005 Paso 6: Proceso de eliminación iniciado, esperando que finalice...");

  // Esperar hasta que deje de estar visible (máx. 120s)
  await driver.wait(async () => {
    try {
      return !(await progress.isDisplayed());
    } catch (e) {
      // Si el progress desapareció del DOM, también es válido
      return true;
    }
  }, 120000);

  await driver.sleep(10000);

  console.log("✅ CP_EXPENT_005 Paso 6: Proceso de eliminación finalizado.");
} catch (error) {
  console.error(`❌ CP_EXPENT_005 Error en Paso 6 (confirmación de eliminación): ${error.message}`);
  throw error;
}
  }
}
