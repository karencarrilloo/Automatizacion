import { By, until, Key } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class ContenidoClasesNegocioPage {
  constructor(driver) {
    this.driver = driver;
  }


  //  ==================================
  //  CP_CONTCLANEG_001 – Ingreso a vista
  // 3 pasos
  //  ==================================

  async ingresarVistaContenidoClases(caseName = 'CP_CONTENIDO_001') {
    const driver = this.driver;

    try {
      // Paso 1: Módulo eCenter
      const eCenterBtn = await driver.wait(
        until.elementLocated(By.xpath("//div[@id='118' and contains(@class, 'item-module')]")),
        10000
      );
      await driver.executeScript("arguments[0].click();", eCenterBtn);
      await driver.sleep(1000);
      console.log("✅ Paso 1: Clic en módulo eCenter.");

      // Paso 2: Scroll en el contenedor de aplicaciones
      const scrollContainer = await driver.wait(
        until.elementLocated(By.css('.container-applications')),
        10000
      );
      await driver.executeScript(
        "arguments[0].scrollTop = arguments[0].scrollHeight;",
        scrollContainer
      );
      await driver.sleep(1000);
      console.log("✅ Paso 2: Scroll en contenedor de aplicaciones.");

      // Paso 3: Clic en "Contenido clases de negocio"
      const contenidoBtn = await driver.wait(
        until.elementLocated(
          By.xpath("//div[contains(@class,'legend-application') and contains(text(),'Contenido clases de negocio')]")
        ),
        15000
      );
      await driver.executeScript("arguments[0].scrollIntoView({behavior:'smooth', block:'center'});", contenidoBtn);
      await driver.wait(until.elementIsVisible(contenidoBtn), 10000);
      await driver.wait(until.elementIsEnabled(contenidoBtn), 10000);
      await driver.sleep(1000);
      await driver.executeScript("arguments[0].click();", contenidoBtn);
      await driver.sleep(5000);
      console.log("✅ Paso 3: Vista 'Contenido clases de negocio' abierta.");

    } catch (error) {
      console.error(`❌ Error: ${error.message}`);

      throw error;
    }
  }

  //  ==================================
  //  CP_CONTCLANEG_002 – Seleccionar una entidad (Modelos)
  //  3 pasos
  //  ==================================

  // === CP_CONTCLANEG_002: Seleccionar una entidad (Modelos) ===
  async seleccionarEntidadModelos() {
    const driver = this.driver;

    // Paso 1: Clic en el botón de la tabla (picklist)
    try {
      const botonPicklist = await driver.wait(
        until.elementLocated(By.css("button.btn.btn-default.picklist-btn")),
        10000
      );

      await driver.executeScript(
        "arguments[0].scrollIntoView({behavior:'smooth', block:'center'});",
        botonPicklist
      );
      await driver.sleep(500);

      const visible = await botonPicklist.isDisplayed();
      const habilitado = await botonPicklist.isEnabled();
      if (!visible || !habilitado) {
        throw new Error("❌ El botón picklist no está visible o habilitado.");
      }

      await driver.executeScript("arguments[0].click();", botonPicklist);
      await driver.sleep(3000);

      console.log("✅ Paso 1: Botón picklist presionado correctamente.");
    } catch (error) {
      throw new Error(`❌ Error en Paso 1 (clic en botón picklist): ${error.message}`);
    }

    // Paso 2: Seleccionar la entidad con ALIAS "Modelos"
    try {
      const tablaCuerpo = await driver.wait(
        until.elementLocated(By.css("div.modal-body table tbody")),
        10000
      );

      const filaEntidad31 = await driver.wait(
        until.elementLocated(By.css("tr#row-31")),
        10000
      );

      const celdaSeleccion = await filaEntidad31.findElement(By.css("td#id"));

      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", celdaSeleccion);
      await driver.sleep(500);
      await driver.executeScript("arguments[0].click();", celdaSeleccion);

      const claseFila = await filaEntidad31.getAttribute("class");
      if (!claseFila.includes("active")) {
        throw new Error("❌ La fila con ID 31 no fue marcada como activa tras el clic.");
      }

      console.log("✅ Paso 2: Fila con ID 31 seleccionada correctamente (ALIAS 'Modelos').");
      await driver.sleep(2000);
    } catch (error) {
      throw new Error(`❌ Error en Paso 2 (selección de entidad 'Modelos'): ${error.message}`);
    }

    // Paso 3: Clic en el botón "Seleccionar" ===

    const botonSeleccionar = await driver.wait(
      until.elementLocated(By.xpath("//div[contains(text(),'Seleccionar') and contains(@class, 'btn-primary')]")),
      10000
    );

    // Esperar a que el botón sea visible
    await driver.wait(until.elementIsVisible(botonSeleccionar), 10000);

    // Esperar a que el botón esté habilitado (sin atributo 'disabled')
    await driver.wait(async () => {
      const disabledAttr = await botonSeleccionar.getAttribute('disabled');
      const classAttr = await botonSeleccionar.getAttribute('class');
      return !disabledAttr && !classAttr.includes('disabled');
    }, 10000, '❌ El botón "Seleccionar" no se habilitó a tiempo.');

    // Scroll para asegurarse de que es visible en viewport
    await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", botonSeleccionar);
    await driver.sleep(500); // Pausa por animación o transición

    // Clic en el botón
    await driver.executeScript("arguments[0].click();", botonSeleccionar);
    // console.log('✅ Se hizo clic en el botón "Seleccionar".');
    await driver.sleep(5000);
  }

  //  ==================================
  // CP_CONTCLANEG_003: Crear un modelo ===
  // 14 pasos
  //  ==================================
  async crearModelo() {
    const driver = this.driver;

    // Paso 1: Clic en el botón "+" (Nuevo)
    try {
      const botonAgregar = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="crud-new-btn"]')),
        10000
      );

      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonAgregar);
      await driver.sleep(500);

      await driver.executeScript("arguments[0].click();", botonAgregar);
      await driver.sleep(5000);

      console.log("✅ CP_CONTCLANEG_003 Paso 1: Botón 'Nuevo' clickeado.");
    } catch (error) {
      throw new Error(`❌ CP_CONTCLANEG_003 Error en Paso 1 (clic en botón Nuevo): ${error.message}`);
    }

    // Paso 2: Clic en botón del campo "Fabricante"
    try {
      const btnFabricante = await driver.wait(
        until.elementLocated(By.css('#widget-picklist-manufacturer button.picklist-btn')),
        10000
      );

      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnFabricante);
      await driver.sleep(500);
      await driver.executeScript("arguments[0].click();", btnFabricante);
      await driver.sleep(5000);

      console.log("✅ CP_CONTCLANEG_003 Paso 2: Botón 'Fabricante' clickeado.");
    } catch (error) {
      throw new Error(`❌ CP_CONTCLANEG_003 Error en Paso 2 (clic en btn Fabricante): ${error.message}`);
    }

    // Paso 3: Seleccionar fila del fabricante con ID "1" (HUAWEI)
    try {
      const contenedorModalFabricante = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-dialog-dialog-picklist-manufacturer"]/div/div')),
        10000
      );

      const tablaBodyFabricante = await driver.wait(
        until.elementLocated(By.css('#grid-table-crud-grid-manufacturer tbody')),
        10000
      );

      const filaHUAWEI = await tablaBodyFabricante.findElement(By.css('tr#row-1'));
      const celdaIdHUAWEI = await filaHUAWEI.findElement(By.css('td#id'));

      // Scroll dentro del contenedor modal para acercar la fila
      await driver.executeScript("arguments[0].scrollTop = arguments[1].offsetTop;", contenedorModalFabricante, filaHUAWEI);
      await driver.sleep(500);

      await driver.executeScript("arguments[0].click();", celdaIdHUAWEI);
      await driver.sleep(500);

      const claseSeleccionada = await filaHUAWEI.getAttribute("class");
      if (!claseSeleccionada || !claseSeleccionada.includes("active")) {
        throw new Error("❌ La fila con ID '1' no fue marcada como activa.");
      }

      console.log("✅ CP_CONTCLANEG_003 Paso 3: Fabricante 'HUAWEI' seleccionado.");
      await driver.sleep(1500);
    } catch (error) {
      throw new Error(`❌ CP_CONTCLANEG_003 Error en Paso 3 (seleccionar fabricante HUAWEI): ${error.message}`);
    }

    // Paso 4: Clic en el botón "Seleccionar" tras elegir fabricante
    try {
      const botonSeleccionarFabricante = await driver.wait(
        until.elementLocated(By.css('#widget-button-btSelect-manufacturer .btn.btn-primary')),
        10000
      );

      await driver.wait(until.elementIsVisible(botonSeleccionarFabricante), 10000);

      await driver.wait(async () => {
        const disabledAttr = await botonSeleccionarFabricante.getAttribute('disabled');
        const classAttr = await botonSeleccionarFabricante.getAttribute('class');
        return !disabledAttr && !classAttr.includes('disabled');
      }, 10000, '❌ El botón "Seleccionar" no se habilitó a tiempo.');

      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", botonSeleccionarFabricante);
      await driver.sleep(500);
      await driver.executeScript("arguments[0].click();", botonSeleccionarFabricante);
      await driver.sleep(3000);

      console.log("✅ CP_CONTCLANEG_003 Paso 4: Botón 'Seleccionar' (fabricante) clickeado.");
    } catch (error) {
      throw new Error(`❌ CP_CONTCLANEG_003 Error en Paso 4 (clic en 'Seleccionar' fabricante): ${error.message}`);
    }

    // Paso 5: Diligenciar campo "Nombre" con "TEST CREAR"
    try {
      const inputNombre = await driver.wait(
        until.elementLocated(By.id('textfield-name')),
        10000
      );
      await driver.wait(until.elementIsVisible(inputNombre), 10000);
      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", inputNombre);
      await driver.sleep(500);
      await inputNombre.clear();
      await inputNombre.sendKeys('TEST CREAR');
      await driver.sleep(3000);

      console.log("✅ CP_CONTCLANEG_003 Paso 5: Campo 'Nombre' diligenciado.");
    } catch (error) {
      throw new Error(`❌ CP_CONTCLANEG_003 Error en Paso 5 (diligenciar Nombre): ${error.message}`);
    }

    // Paso 6: Diligenciar "Cantidad de slots" con número aleatorio
    try {
      const cantidadAleatoria = Math.floor(Math.random() * 50) + 1;

      const inputSlots = await driver.wait(
        until.elementLocated(By.id('textfield-numberofslots')),
        10000
      );
      await driver.wait(until.elementIsVisible(inputSlots), 10000);
      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", inputSlots);
      await driver.sleep(500);
      await inputSlots.clear();
      await inputSlots.sendKeys(cantidadAleatoria.toString());
      await driver.sleep(3000);

      console.log(`✅ CP_CONTCLANEG_003 Paso 6: 'Cantidad de slots' diligenciado con ${cantidadAleatoria}.`);
    } catch (error) {
      throw new Error(`❌ CP_CONTCLANEG_003 Error en Paso 6 (diligenciar slots): ${error.message}`);
    }

    // Paso 7: Clic en el botón del campo "Tipo"
    try {
      const botonTipo = await driver.wait(
        until.elementLocated(By.css('#widget-picklist-type .picklist-btn')),
        10000
      );
      await driver.wait(until.elementIsVisible(botonTipo), 10000);
      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", botonTipo);
      await driver.sleep(500);
      await driver.executeScript("arguments[0].click();", botonTipo);
      await driver.sleep(5000);

      console.log("✅ CP_CONTCLANEG_003 Paso 7: Botón 'Tipo' clickeado.");
    } catch (error) {
      throw new Error(`❌ CP_CONTCLANEG_003 Error en Paso 7 (clic en boton Tipo): ${error.message}`);
    }

    // Paso 8: Seleccionar tipo NOMBRE "ELEMENTO TERCIARIO - GADGETS" (fila ID 21)
    try {
      const modalTipo = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-dialog-dialog-picklist-type"]/div/div')),
        10000
      );

      const tablaTipoCuerpo = await modalTipo.findElement(By.css('table tbody'));
      const filaTipo21 = await tablaTipoCuerpo.findElement(By.css('tr#row-21'));
      const celdaTipo21 = await filaTipo21.findElement(By.css('td#id'));

      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", celdaTipo21);
      await driver.sleep(500);
      await driver.executeScript("arguments[0].click();", celdaTipo21);
      await driver.sleep(500);

      const claseSeleccionadaTipo = await filaTipo21.getAttribute("class");
      if (!claseSeleccionadaTipo || !claseSeleccionadaTipo.includes("active")) {
        throw new Error("❌ No se marcó como activa la fila con ID 21 después del clic.");
      }

      console.log("✅ CP_CONTCLANEG_003 Paso 8: Fila tipo (ID 21) seleccionada.");
      await driver.sleep(1000);
    } catch (error) {
      throw new Error(`❌ CP_CONTCLANEG_003 Error en Paso 8 (seleccionar tipo ID 21): ${error.message}`);
    }

    // Paso 9: Clic en el botón "Seleccionar" del modal de tipo
    try {
      const contenedorBtnSeleccionarTipo = await driver.wait(
        until.elementLocated(By.id("widget-button-btSelect-type")),
        10000
      );
      const btnSeleccionarTipo = await contenedorBtnSeleccionarTipo.findElement(By.css("div.btn.btn-primary"));

      await driver.wait(until.elementIsVisible(btnSeleccionarTipo), 10000);
      await driver.wait(async () => {
        const disabledAttr = await btnSeleccionarTipo.getAttribute('disabled');
        const classAttr = await btnSeleccionarTipo.getAttribute('class');
        return !disabledAttr && !classAttr.includes('disabled');
      }, 10000, '❌ El botón "Seleccionar" no se habilitó a tiempo.');

      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", btnSeleccionarTipo);
      await driver.sleep(500);
      await driver.executeScript("arguments[0].click();", btnSeleccionarTipo);
      await driver.sleep(3000);

      console.log("✅ CP_CONTCLANEG_003 Paso 9: Botón 'Seleccionar' (tipo) clickeado.");
    } catch (error) {
      throw new Error(`❌ CP_CONTCLANEG_003 Error en Paso 9 (clic en 'Seleccionar' tipo): ${error.message}`);
    }

    // Paso 10: Diligenciar campo "Descripción"
    try {
      const inputDescripcion = await driver.wait(
        until.elementLocated(By.id('textfield-description')),
        10000
      );
      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", inputDescripcion);
      await driver.sleep(500);
      await inputDescripcion.clear();
      await inputDescripcion.sendKeys("TEST CREAR");
      await driver.sleep(1000);

      console.log("✅ CP_CONTCLANEG_003 Paso 10: Campo 'Descripción' diligenciado.");
    } catch (error) {
      throw new Error(`❌ CP_CONTCLANEG_003 Error en Paso 10 (diligenciar descripción): ${error.message}`);
    }

    // Paso 11: Diligenciar campo "Ícono"
    try {
      const inputIcono = await driver.wait(
        until.elementLocated(By.id('textfield-icon')),
        10000
      );
      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", inputIcono);
      await driver.sleep(500);
      await inputIcono.clear();
      await inputIcono.sendKeys("img/icons_entity/ico-cat-infra-rfid-&-sensors.png");
      await driver.sleep(3000);

      console.log("✅ CP_CONTCLANEG_003 Paso 11: Campo 'Ícono' diligenciado.");
    } catch (error) {
      throw new Error(`❌ CP_CONTCLANEG_003 Error en Paso 11 (diligenciar ícono): ${error.message}`);
    }

    // Paso 12: Clic en el botón del campo "Localidad"
    try {
      const btnLocalidad = await driver.wait(
        until.elementLocated(By.css('button.picklocation-btn')),
        10000
      );
      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", btnLocalidad);
      await driver.sleep(500);
      await driver.executeScript("arguments[0].click();", btnLocalidad);
      await driver.sleep(3000);

      console.log("✅ CP_CONTCLANEG_003 Paso 12: Botón 'Localidad' clickeado.");
    } catch (error) {
      throw new Error(`❌ CP_CONTCLANEG_003 Error en Paso 12 (clic en Localidad): ${error.message}`);
    }

    // Paso 13: Clic en botón "Seleccionar" del modal de Localidad
    try {
      const modalLocalidad = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-dialog-dialog-picklocation-location"]/div/div')),
        10000
      );
      await driver.wait(until.elementIsVisible(modalLocalidad), 10000);

      const btnSeleccionarLocalidad = await modalLocalidad.findElement(
        By.xpath(".//div[contains(@class, 'btn-primary') and contains(normalize-space(.), 'Seleccionar')]")
      );

      await driver.wait(until.elementIsVisible(btnSeleccionarLocalidad), 10000);
      await driver.wait(async () => {
        const disabledAttr = await btnSeleccionarLocalidad.getAttribute('disabled');
        const classAttr = await btnSeleccionarLocalidad.getAttribute('class');
        return !disabledAttr && !classAttr.includes('disabled');
      }, 10000, '❌ El botón "Seleccionar" del modal de localidad no está habilitado.');

      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", btnSeleccionarLocalidad);
      await driver.sleep(500);
      await driver.executeScript("arguments[0].click();", btnSeleccionarLocalidad);
      await driver.sleep(3000);

      console.log("✅ CP_CONTCLANEG_003 Paso 13: Botón 'Seleccionar' (localidad) clickeado.");
    } catch (error) {
      throw new Error(`❌ CP_CONTCLANEG_003 Error en Paso 13 (Seleccionar localidad): ${error.message}`);
    }

    // Paso 14: Clic en el botón "Guardar"
    try {
      const btnGuardar = await driver.wait(
        until.elementLocated(By.xpath("//div[contains(text(),'Guardar') and contains(@class, 'btn-primary')]")),
        10000,
        '❌ El botón "Guardar" no fue localizado a tiempo.'
      );

      await driver.wait(until.elementIsVisible(btnGuardar), 10000, '❌ El botón "Guardar" no es visible.');

      await driver.wait(async () => {
        const isDisabled = await btnGuardar.getAttribute('disabled');
        const classAttr = await btnGuardar.getAttribute('class');
        return !isDisabled && !classAttr.includes('disabled');
      }, 10000, '❌ El botón "Guardar" está deshabilitado.');

      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnGuardar);
      await driver.sleep(500);
      await driver.executeScript("arguments[0].click();", btnGuardar);
      await driver.sleep(5000);

      console.log("✅ CP_CONTCLANEG_003 Paso 14: Botón 'Guardar' clickeado (modelo creado).");
    } catch (error) {
      throw new Error(`❌ CP_CONTCLANEG_003 Error en Paso 14 (clic en Guardar): ${error.message}`);
    }
  }
  //  ==================================
  // === CP_CONTCLANEG_004: Editar modelo ===
  // 14 pasos
  // ==================================

  async editarModelo() {
    const driver = this.driver;

    // Paso 1: Clic en la barra de búsqueda
    try {
      const barraBusqueda = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="crud-search-bar"]')),
        10000
      );
      await driver.wait(until.elementIsVisible(barraBusqueda), 10000);
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", barraBusqueda);
      await driver.sleep(500);
      await driver.executeScript("arguments[0].click();", barraBusqueda);
      await driver.sleep(1500);
      console.log("✅ CP_CONTCLANEG_004 Paso 1: Barra de búsqueda clickeada.");
    } catch (error) {
      throw new Error("❌ Error CP_CONTCLANEG_004 Paso 1: " + error.message);
    }

    // Paso 2: Digitar "TEST CREAR" y presionar Enter
    try {
      const inputBusquedaCrear = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="crud-search-bar"]')),
        10000
      );
      await driver.wait(until.elementIsVisible(inputBusquedaCrear), 10000);
      await inputBusquedaCrear.clear();
      await inputBusquedaCrear.sendKeys("TEST CREAR", Key.ENTER);
      console.log("✅ CP_CONTCLANEG_004 Paso 2: Texto 'TEST CREAR' ingresado en búsqueda.");
      await driver.sleep(3000);
    } catch (error) {
      throw new Error("❌ Error CP_CONTCLANEG_004 Paso 2: " + error.message);
    }

    // Paso 3: Seleccionar registro con ID mayor y validar nombre
    try {
      const cuerpoTabla = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="grid-table-crud-grid-crud-31"]/div/div[2]/table/tbody')),
        10000
      );
      const filas = await cuerpoTabla.findElements(By.css("tr"));
      if (filas.length === 0) throw new Error("❌ No se encontraron filas.");

      let filaMayorId = null;
      let mayorId = -1;
      for (const fila of filas) {
        const celdaId = await fila.findElement(By.css("td#id"));
        const idNumero = parseInt((await celdaId.getText()).trim(), 10);
        if (!isNaN(idNumero) && idNumero > mayorId) {
          mayorId = idNumero;
          filaMayorId = fila;
        }
      }
      if (!filaMayorId) throw new Error("❌ No se pudo determinar fila con ID mayor.");

      const celdaIdSeleccion = await filaMayorId.findElement(By.css("td#id"));
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", celdaIdSeleccion);
      await driver.sleep(500);
      await driver.executeScript("arguments[0].click();", celdaIdSeleccion);
      await driver.sleep(1000);

      const claseFila = await filaMayorId.getAttribute("class");
      if (!claseFila.includes("active")) throw new Error("❌ La fila mayor no quedó activa.");

      const celdaNombre = await filaMayorId.findElement(By.css("td#name"));
      const textoNombre = await celdaNombre.getText();
      if (textoNombre.trim() !== "TEST CREAR") {
        throw new Error(`❌ El campo 'Nombre' no coincide. Se esperaba 'TEST CREAR' y se encontró '${textoNombre}'.`);
      }
      console.log(`✅ CP_CONTCLANEG_004 Paso 3: Fila con ID mayor (${mayorId}) seleccionada correctamente.`);
    } catch (error) {
      throw new Error("❌ Error CP_CONTCLANEG_004 Paso 3: " + error.message);
    }

    // Paso 4: Clic en botón Editar
    try {
      const botonEditar = await driver.wait(
        until.elementLocated(By.id("crud-edit-btn")),
        10000
      );
      await driver.wait(until.elementIsVisible(botonEditar), 10000);
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", botonEditar);
      await driver.sleep(500);
      await driver.executeScript("arguments[0].click();", botonEditar);
      await driver.sleep(8000);
      console.log("✅ CP_CONTCLANEG_004 Paso 4: Botón 'Editar' clickeado.");
    } catch (error) {
      throw new Error("❌ Error CP_CONTCLANEG_004 Paso 4: " + error.message);
    }

    // Paso 5: Clic en el botón del campo "Fabricante" (modo edición)
    try {
      const btnFabricanteEditar = await driver.wait(
        until.elementLocated(
          By.xpath("//div[contains(@id, 'widget-picklist-manufacturer')]//button[contains(@class, 'picklist-btn')]")
        ),
        10000
      );
      await driver.wait(until.elementIsVisible(btnFabricanteEditar), 10000);
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", btnFabricanteEditar);
      await driver.sleep(500);
      await driver.executeScript("arguments[0].click();", btnFabricanteEditar);
      await driver.sleep(3000);
      console.log("✅ CP_CONTCLANEG_004 Paso 5: Botón 'Fabricante' clickeado (edición).");
    } catch (error) {
      throw new Error("❌ Error CP_CONTCLANEG_004 Paso 5: " + error.message);
    }

    // Paso 6: Seleccionar fabricante con ID 2 (FIBERHOME)
    try {
      const tablaBodyFabricante = await driver.wait(
        until.elementLocated(By.css("#grid-table-crud-grid-manufacturer tbody")),
        10000
      );
      const filaFIBERHOME = await tablaBodyFabricante.findElement(By.css("tr#row-2"));
      const celdaIdFIBERHOME = await filaFIBERHOME.findElement(By.css("td#id"));
      await driver.executeScript("arguments[0].click();", celdaIdFIBERHOME);
      const claseFila = await filaFIBERHOME.getAttribute("class");
      if (!claseFila.includes("active")) throw new Error("❌ Fila FIBERHOME no quedó activa.");
      console.log("✅ CP_CONTCLANEG_004 Paso 6: Fabricante 'FIBERHOME' seleccionado.");
    } catch (error) {
      throw new Error("❌ Error CP_CONTCLANEG_004 Paso 6: " + error.message);
    }

    // Paso 7: Clic en botón "Seleccionar" del modal Fabricante
    try {
      const botonSeleccionarFabricante = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-button-btSelect-manufacturer"]/div')),
        10000
      );
      await driver.wait(until.elementIsVisible(botonSeleccionarFabricante), 10000);
      await driver.executeScript("arguments[0].click();", botonSeleccionarFabricante);
      await driver.sleep(5000);
      console.log("✅ CP_CONTCLANEG_004 Paso 7: Botón 'Seleccionar' (fabricante) clickeado.");
    } catch (error) {
      throw new Error("❌ Error CP_CONTCLANEG_004 Paso 7: " + error.message);
    }

    // Paso 8: Editar campo "Nombre" con "TEST EDITAR"
    try {
      const inputNombre = await driver.wait(
        until.elementLocated(By.css("#widget-textfield-name input")),
        10000
      );
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", inputNombre);
      await driver.sleep(500);
      await inputNombre.clear();
      await inputNombre.sendKeys("TEST EDITAR");
      await driver.sleep(2000);
      console.log("✅ CP_CONTCLANEG_004 Paso 8: Campo 'Nombre' actualizado.");
    } catch (error) {
      throw new Error("❌ Error CP_CONTCLANEG_004 Paso 8: " + error.message);
    }

    // Paso 9: Editar campo "Cantidad de slots" con valor aleatorio 51–100
    try {
      const inputSlots = await driver.wait(
        until.elementLocated(By.css("#widget-textfield-numberofslots input")),
        10000
      );
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", inputSlots);
      await driver.sleep(500);
      const cantidadAleatoria = Math.floor(Math.random() * 50) + 51;
      await inputSlots.clear();
      await inputSlots.sendKeys(cantidadAleatoria.toString());
      await driver.sleep(2000);
      console.log(`✅ CP_CONTCLANEG_004 Paso 9: 'Cantidad de slots' actualizado a ${cantidadAleatoria}.`);
    } catch (error) {
      throw new Error("❌ Error CP_CONTCLANEG_004 Paso 9: " + error.message);
    }

    // Paso 10: Clic en botón "Tipo"
    try {
      const botonTipo = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-picklist-type"]/div[1]/span[2]/button')),
        10000
      );
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", botonTipo);
      await driver.sleep(500);
      await driver.executeScript("arguments[0].click();", botonTipo);
      await driver.sleep(3000);
      console.log("✅ CP_CONTCLANEG_004 Paso 10: Botón 'Tipo' clickeado.");
    } catch (error) {
      throw new Error("❌ Error CP_CONTCLANEG_004 Paso 10: " + error.message);
    }

    // Paso 11: Seleccionar fila con ID 1 (ELEMENTO PRIMARIO - ACCESO)
    try {
      const tablaTipo = await driver.wait(
        until.elementLocated(By.css("#grid-table-crud-grid-type tbody")),
        10000
      );
      const filaTipo = await tablaTipo.findElement(By.css("tr#row-1"));
      const celdaTipo = await filaTipo.findElement(By.css("td#id"));
      await driver.executeScript("arguments[0].click();", celdaTipo);
      const claseTipo = await filaTipo.getAttribute("class");
      if (!claseTipo.includes("active")) throw new Error("❌ Tipo fila ID=1 no quedó activa.");
      console.log("✅ CP_CONTCLANEG_004 Paso 11: Tipo 'ELEMENTO PRIMARIO - ACCESO' seleccionado.");
    } catch (error) {
      throw new Error("❌ Error CP_CONTCLANEG_004 Paso 11: " + error.message);
    }

    // Paso 12: Clic en "Seleccionar" del modal Tipo
    try {
      const botonSeleccionarTipo = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-button-btSelect-type"]/div')),
        10000
      );
      await driver.wait(until.elementIsVisible(botonSeleccionarTipo), 10000);
      await driver.executeScript("arguments[0].click();", botonSeleccionarTipo);
      await driver.sleep(3000);
      console.log("✅ CP_CONTCLANEG_004 Paso 12: Botón 'Seleccionar' (tipo) clickeado.");
    } catch (error) {
      throw new Error("❌ Error CP_CONTCLANEG_004 Paso 12: " + error.message);
    }

    // Paso 13: Editar campo "Descripción"
    try {
      const inputDescripcion = await driver.wait(
        until.elementLocated(By.css("#widget-textfield-description input")),
        10000
      );
      await driver.wait(until.elementIsVisible(inputDescripcion), 10000);
      await inputDescripcion.clear();
      await inputDescripcion.sendKeys("TEST EDITAR");
      console.log("✅ CP_CONTCLANEG_004 Paso 13: Descripción actualizada.");
      await driver.sleep(2000);
    } catch (error) {
      throw new Error("❌ Error CP_CONTCLANEG_004 Paso 13: " + error.message);
    }

    // Paso 14: Clic en botón "Guardar" (formulario edición)
    try {
      const botonGuardar = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-button-btAction-crud-31"]/div')),
        10000
      );
      await driver.wait(until.elementIsVisible(botonGuardar), 10000);
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", botonGuardar);
      await driver.sleep(500);
      await driver.executeScript("arguments[0].click();", botonGuardar);
      await driver.sleep(6000);
      console.log("✅ CP_CONTCLANEG_004 Paso 14: Botón 'Guardar' clickeado (edición).");

    } catch (error) {
      throw new Error("❌ Error CP_CONTCLANEG_004 Paso 14: " + error.message);
    }
  }
  // === CP_CONTCLANEG_005 - Eliminar el modelo ===

  async eliminarModelo() {
    const driver = this.driver;
    // Paso 1: Buscar el modelo "TEST EDITAR"
    try {
      const inputBusquedaEditar = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="crud-search-bar"]')),
        10000
      );

      await driver.wait(until.elementIsVisible(inputBusquedaEditar), 10000);
      await inputBusquedaEditar.clear();
      await inputBusquedaEditar.sendKeys('TEST EDITAR', Key.ENTER);

      console.log('✅ [CP_CONTCLANEG_005 - Paso 1] Se digitó "TEST EDITAR" en la barra de búsqueda y se presionó Enter.');
      await driver.sleep(3000);
    } catch (error) {
      throw new Error('❌ [CP_CONTCLANEG_005 - Paso 1] Error al escribir en la barra de búsqueda: ' + error.message);
    }

    // Paso 2: Seleccionar registro con mayor ID
    try {
      const cuerpoTablaBusqueda = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="grid-table-crud-grid-crud-31"]/div/div[2]/table/tbody')),
        10000
      );

      const filasBusqueda = await cuerpoTablaBusqueda.findElements(By.css('tr'));
      if (filasBusqueda.length === 0) throw new Error('❌ No se encontraron filas tras la búsqueda.');

      let filaMayorId = null;
      let mayorId = -1;

      for (const fila of filasBusqueda) {
        const celdaId = await fila.findElement(By.css('td#id'));
        const celdaNombre = await fila.findElement(By.css('td#name'));

        const textoId = await celdaId.getText();
        const textoNombre = await celdaNombre.getText();

        const idNumero = parseInt(textoId.trim(), 10);

        if (
          !isNaN(idNumero) &&
          textoNombre.trim().toUpperCase() === "TEST EDITAR" &&
          idNumero > mayorId
        ) {
          mayorId = idNumero;
          filaMayorId = fila;
        }
      }

      if (!filaMayorId) throw new Error('❌ No se encontró ninguna fila con nombre "TEST EDITAR".');

      const celdaIdSeleccion = await filaMayorId.findElement(By.css('td#id'));
      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", celdaIdSeleccion);
      await driver.sleep(500);
      await driver.executeScript("arguments[0].click();", celdaIdSeleccion);

      const claseActiva = await filaMayorId.getAttribute("class");
      if (!claseActiva.includes("active")) {
        throw new Error("❌ La fila con nombre 'TEST EDITAR' no fue marcada como activa.");
      }

      console.log(`✅ [CP_CONTCLANEG_005 - Paso 2] Fila con nombre "TEST EDITAR" y mayor ID (${mayorId}) seleccionada correctamente.`);
      await driver.sleep(1000);

    } catch (error) {
      throw new Error("❌ [CP_CONTCLANEG_005 - Paso 2] Error al seleccionar el registro: " + error.message);
    }

    // Paso 3: Clic en botón "Eliminar"
    try {
      const botonEliminar = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="crud-delete-btn"]')),
        10000
      );
      await driver.wait(until.elementIsVisible(botonEliminar), 10000);

      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", botonEliminar);
      await driver.sleep(500);
      await driver.executeScript("arguments[0].click();", botonEliminar);

      console.log("✅ [CP_CONTCLANEG_005 - Paso 3] Botón 'Eliminar' clickeado correctamente.");
      await driver.sleep(2000);
    } catch (error) {
      throw new Error("❌ [CP_CONTCLANEG_005 - Paso 3] Error al hacer clic en botón 'Eliminar': " + error.message);
    }

    // Paso 4: Confirmar eliminación en modal
    try {
      const botonConfirmarSi = await driver.wait(
        until.elementLocated(By.xpath("//div[@id='widget-button-btConfirmYes']/div[contains(text(),'Sí')]")),
        10000
      );

      await driver.wait(until.elementIsVisible(botonConfirmarSi), 10000);
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonConfirmarSi);
      await driver.sleep(500);
      await driver.executeScript("arguments[0].click();", botonConfirmarSi);

      console.log("✅ [CP_CONTCLANEG_005 - Paso 4] Confirmación 'Sí' realizada correctamente.");
      await driver.sleep(3000);
    } catch (error) {
      throw new Error("❌ [CP_CONTCLANEG_005 - Paso 4] Error al confirmar eliminación: " + error.message);
    }
  }

  // === CP_CONTCLANEG_006 - Refrescar vista

  async refrescarVista() {
    const driver = this.driver;

    // Paso 1: Clic en el boton refrescar
    try {
      const btnRefrescar = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="crud-refresh-btn"]')),
        10000
      );

      await driver.wait(until.elementIsVisible(btnRefrescar), 5000);
      await driver.wait(until.elementIsEnabled(btnRefrescar), 5000);

      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", btnRefrescar);
      await driver.sleep(300);
      await btnRefrescar.click();

      // Espera dinámica si hay barra de carga (opcional)
      try {
        const progressBar = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="progress-crud-refresh"]')),
          5000
        );
        await driver.wait(until.stalenessOf(progressBar), 20000);
      } catch {
        console.warn("⚠️ No se detectó progress de refresco, se continúa.");
      }

      console.log("✅ Paso X: Botón 'Refrescar' presionado correctamente.");
    } catch (error) {
      throw new Error(`❌ CP_CONTCLANEG_006 Paso 1: (clic en botón 'Refrescar'): ${error.message}`);
    }
  }

  // === CP_CONTCLANEG_007 - generar reporte xls (opcion exportar todos los registros)
  async generarReporte() {
    const driver = this.driver;
    try {
      // Paso 1: Clic en botón que abre el modal de entidades
      const btnGenerarXLS = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-button-btn-export-xls"]/div[1]')),
        10000
      );

      await driver.wait(until.elementIsVisible(btnGenerarXLS), 5000);
      await driver.wait(until.elementIsEnabled(btnGenerarXLS), 5000);

      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnGenerarXLS);
      await driver.sleep(300); // espera breve antes del clic
      await btnGenerarXLS.click();

      // Espera dinámica si aparece progress o el archivo tarda en generarse
      try {
        const progresoDescarga = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="progress-download-xls"]')),
          5000
        );
        await driver.wait(until.stalenessOf(progresoDescarga), 20000); // espera a que desaparezca
      } catch {
        console.warn("⚠️ No se detectó barra de progreso de descarga, se continúa.");
      }

      console.log("✅ Paso X: Botón 'Generar XLS' presionado correctamente.");
    } catch (error) {
      throw new Error(`❌ Paso X (clic en botón 'Generar XLS'): ${error.message}`);
    }


    // === CP_CONTCLANEG_007 Paso 2: Clic en opción 'Exportar todos los registros' ===
    try {
      // Esperar contenedor del menú de exportación
      const contenedorExportMenu = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-button-btn-export-xls"]/div[2]')),
        10000
      );

      // Asegurarse de que el contenedor esté visible
      await driver.wait(until.elementIsVisible(contenedorExportMenu), 5000);

      // Localizar y hacer clic en la opción "Exportar todos los registros"
      const opcionExportarTodo = await contenedorExportMenu.findElement(By.xpath('./div[1]'));
      await driver.wait(until.elementIsVisible(opcionExportarTodo), 5000);
      await opcionExportarTodo.click();

      // Espera dinámica si se muestra algún progreso
      try {
        const progreso = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="progress-download-xls"]')),
          5000
        );
        await driver.wait(until.stalenessOf(progreso), 20000);
      } catch {
        console.warn("⚠️ No se detectó barra de progreso después de exportar todos los registros.");
      }

      console.log("✅ Paso X: Opción 'Exportar todos los registros' seleccionada correctamente.");
    } catch (error) {
      throw new Error(`❌ Paso X (clic en 'Exportar todos los registros'): ${error.message}`);
    }
  }

  // === CP_CONTCLANEG_008 - Validar funcionamiento del paginador en la vista(Entidad planes comerciales)
  async validarPaginador() {
    const driver = this.driver;
    // Paso 1: Clic en botón que abre el modal de entidades ===
    try {
      const botonModalEntidades = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-picklist-listId"]/div[1]/span/button')),
        10000
      );

      await driver.wait(until.elementIsVisible(botonModalEntidades), 5000);
      await driver.wait(until.elementIsEnabled(botonModalEntidades), 5000);

      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", botonModalEntidades);
      await driver.sleep(500);
      await driver.executeScript("arguments[0].click();", botonModalEntidades);

      // === Espera dinámica a que cargue la tabla dentro del modal ===
      await driver.wait(
        until.elementLocated(By.css('div.modal-body table tbody')),
        10000
      );

      console.log("✅ CP_CONTCLANEG_008 Paso 1: Modal de entidades abierto correctamente.");
    } catch (error) {
      throw new Error(`❌ CP_CONTCLANEG_008 Paso 1: (clic en botón modal entidades): ${error.message}`);
    }

    // === CP_CONTCLANEG_008 Paso 2: Seleccionar la entidad con ID 135 ("Valores de planes") ===
    try {
      const cuerpoTablaEntidades = await driver.wait(
        until.elementLocated(By.css('div.modal-body table tbody')),
        10000
      );

      const filaEntidad82 = await driver.wait(
        until.elementLocated(By.css('tr#row-135')),
        10000
      );

      const celdaEntidad = await filaEntidad82.findElement(By.css('td#id'));

      // Scroll hacia la celda y clic
      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", celdaEntidad);
      await driver.sleep(500);
      await driver.executeScript("arguments[0].click();", celdaEntidad);

      // Verificar que la fila se marcó como activa
      const claseFilaSeleccionada = await filaEntidad82.getAttribute("class");
      if (!claseFilaSeleccionada.includes("active")) {
        throw new Error("❌ La fila con ID 135 no fue marcada como activa tras el clic.");
      }

      console.log("✅ CP_CONTCLANEG_002 Paso 2: Entidad 'Valores de planes' seleccionada correctamente.");
      await driver.sleep(4000); // Puedes ajustar esto o reemplazar por espera dinámica si deseas
    } catch (error) {
      throw new Error(`❌ CP_CONTCLANEG_002 Paso 2 (selección entidad ID 135): ${error.message}`);
    }


    // === CP_CONTCLANEG_008 Paso 3: Clic en botón "Seleccionar" ===
    try {
      // Guardar texto de la primera celda antes de hacer clic en Seleccionar
      let primeraCeldaAntes = null;
      try {
        primeraCeldaAntes = await driver.findElement(
          By.xpath('//*[@id="grid-table-grid-reports"]/div/div[2]/table/tbody/tr[1]/td[1]')
        ).getText();
      } catch {
        console.warn("⚠️ No se pudo obtener la primera celda antes del clic (puede ser tabla vacía).");
      }

      // Localizar el botón Seleccionar
      const botonSeleccionar = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-button-btSelect-listId"]/div')),
        10000
      );

      await driver.wait(until.elementIsVisible(botonSeleccionar), 5000);
      await driver.wait(until.elementIsEnabled(botonSeleccionar), 5000);

      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", botonSeleccionar);
      await driver.sleep(500);
      await driver.executeScript("arguments[0].click();", botonSeleccionar);

      // Espera dinámica: cambio de contenido en primera celda o cierre de modal
      try {
        await driver.wait(async () => {
          try {
            const primeraCeldaDespues = await driver.findElement(
              By.xpath('//*[@id="grid-table-grid-reports"]/div/div[2]/table/tbody/tr[1]/td[1]')
            ).getText();
            return primeraCeldaAntes !== null && primeraCeldaDespues !== primeraCeldaAntes;
          } catch {
            return false; // Todavía no se ha renderizado la tabla
          }
        }, 5000);
      } catch (esperaError) {
        console.warn("⚠️ No se detectó cambio de tabla, esperando cierre de modal como respaldo.");
        try {
          const modal = await driver.findElement(By.css('div.modal-content'));
          await driver.wait(until.stalenessOf(modal), 15000);
        } catch {
          console.warn("⚠️ No se detectó cierre de modal, continuando...");
        }
      }

      console.log("✅ CP_ENTIDADES_001 Paso 3: Botón 'Seleccionar' presionado y espera dinámica completada.");
    } catch (error) {
      throw new Error(`❌ CP_ENTIDADES_001 Paso 3 (clic en botón 'Seleccionar'): ${error.message}`);
    }

    // === CP_CONTCLANEG_008 Paso 4: Clic en botón "Página siguiente" ===
    try {
      const widgetPaginador = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-grid-crud-grid-crud-135"]/div/div[2]')),
        7000
      );

      const btnPaginaSiguienteSpan = await widgetPaginador.findElement(
        By.xpath('.//*[@id="grid-paginator-next"]/span')
      );

      await driver.wait(until.elementIsVisible(btnPaginaSiguienteSpan), 5000);
      await driver.wait(until.elementIsEnabled(btnPaginaSiguienteSpan), 5000);

      // Capturamos la primera celda antes del cambio
      let primeraCeldaAntes = null;
      try {
        const celdaElem = await driver.findElement(
          By.xpath('//*[@id="grid-table-grid-reports"]/div/div[2]/table/tbody/tr[1]/td[1]')
        );
        primeraCeldaAntes = await celdaElem.getText();
      } catch {
        console.warn("⚠️ No se encontró fila inicial.");
      }

      // Clic en el botón
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnPaginaSiguienteSpan);
      await driver.sleep(300);
      await driver.executeScript("arguments[0].click();", btnPaginaSiguienteSpan);

      // Espera dinámica: si hay overlay/progress
      try {
        const progress = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="progress-id-filter" or contains(@class, "progress")]')),
          3000
        );
        await driver.wait(until.stalenessOf(progress), 15000);
      } catch {
        console.warn("⚠️ No se detectó overlay de carga, continuando...");
      }

      // Espera limitada a cambio de celda (máximo 10 seg)
      if (primeraCeldaAntes) {
        await Promise.race([
          driver.wait(async () => {
            try {
              const nuevaCelda = await driver.findElement(
                By.xpath('//*[@id="grid-table-grid-reports"]/div/div[2]/table/tbody/tr[1]/td[1]')
              );
              return (await nuevaCelda.getText()) !== primeraCeldaAntes;
            } catch {
              return false;
            }
          }, 10000),
          new Promise(res => setTimeout(res, 10000)) // si pasa 10 seg, salimos
        ]);
      }

      console.log("✅ CP_CONTCLANEG_008 Paso 4: Página siguiente seleccionada correctamente.");
    } catch (error) {
      throw new Error(`❌ CP_CONTCLANEG_008 Paso 4 (clic en botón 'Página siguiente'): ${error.message}`);
    }

    // === CP_CONTCLANEG_008 Paso 5: Clic en botón "Página anterior" ===
    try {
      const widgetPaginador = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-grid-crud-grid-crud-135"]/div/div[2]')),
        10000
      );

      const btnPaginaAnterior = await widgetPaginador.findElement(
        By.xpath('.//*[@id="grid-paginator-prev"]/span')
      );

      await driver.wait(until.elementIsVisible(btnPaginaAnterior), 5000);
      await driver.wait(until.elementIsEnabled(btnPaginaAnterior), 5000);

      // Capturamos la primera celda antes del cambio
      let primeraCeldaAntes = null;
      try {
        const celdaElem = await driver.findElement(
          By.xpath('//*[@id="grid-table-grid-reports"]/div/div[2]/table/tbody/tr[1]/td[1]')
        );
        primeraCeldaAntes = await celdaElem.getText();
      } catch {
        console.warn("⚠️ No se encontró fila inicial.");
      }

      // Clic en el botón
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnPaginaAnterior);
      await driver.sleep(300);
      await driver.executeScript("arguments[0].click();", btnPaginaAnterior);

      // Espera dinámica: si hay overlay/progress
      try {
        const progress = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="progress-id-filter" or contains(@class, "progress")]')),
          3000
        );
        await driver.wait(until.stalenessOf(progress), 15000);
      } catch {
        console.warn("⚠️ No se detectó overlay de carga, continuando...");
      }

      // Espera limitada a cambio de celda (máximo 10 seg)
      if (primeraCeldaAntes) {
        await Promise.race([
          driver.wait(async () => {
            try {
              const nuevaCelda = await driver.findElement(
                By.xpath('//*[@id="grid-table-grid-reports"]/div/div[2]/table/tbody/tr[1]/td[1]')
              );
              return (await nuevaCelda.getText()) !== primeraCeldaAntes;
            } catch {
              return false;
            }
          }, 10000),
          new Promise(res => setTimeout(res, 10000)) // si pasa 10 seg, salimos
        ]);
      }

      console.log("✅ CP_CONTCLANEG_008 Paso 5: Página anterior seleccionada correctamente.");
    } catch (error) {
      throw new Error(`❌ CP_CONTCLANEG_008 Paso 5 (clic en botón 'Página anterior'): ${error.message}`);
    }

    // === CP_CONTCLANEG_008 Paso 6: Clic en botón "Última página" ===
    try {
      const widgetPaginador = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-grid-crud-grid-crud-135"]/div/div[2]')),
        10000
      );

      const btnUltimaPagina = await widgetPaginador.findElement(
        By.xpath('.//*[@id="grid-paginator-last"]/span')
      );

      await driver.wait(until.elementIsVisible(btnUltimaPagina), 5000);
      await driver.wait(until.elementIsEnabled(btnUltimaPagina), 5000);

      // Capturamos la primera celda antes del cambio
      let primeraCeldaAntes = null;
      try {
        const celdaElem = await driver.findElement(
          By.xpath('//*[@id="grid-table-grid-reports"]/div/div[2]/table/tbody/tr[1]/td[1]')
        );
        primeraCeldaAntes = await celdaElem.getText();
      } catch {
        console.warn("⚠️ No se encontró fila inicial.");
      }

      // Clic en el botón
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnUltimaPagina);
      await driver.sleep(300);
      await driver.executeScript("arguments[0].click();", btnUltimaPagina);

      // Espera dinámica: si hay overlay/progress
      try {
        const progress = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="progress-id-filter" or contains(@class, "progress")]')),
          3000
        );
        await driver.wait(until.stalenessOf(progress), 15000);
      } catch {
        console.warn("⚠️ No se detectó overlay de carga, continuando...");
      }

      // Espera limitada a cambio de celda (máximo 10 seg)
      if (primeraCeldaAntes) {
        await Promise.race([
          driver.wait(async () => {
            try {
              const nuevaCelda = await driver.findElement(
                By.xpath('//*[@id="grid-table-grid-reports"]/div/div[2]/table/tbody/tr[1]/td[1]')
              );
              return (await nuevaCelda.getText()) !== primeraCeldaAntes;
            } catch {
              return false;
            }
          }, 10000),
          new Promise(res => setTimeout(res, 10000))
        ]);
      }

      console.log("✅ CP_CONTCLANEG_008 Paso 6: Última página seleccionada correctamente.");
    } catch (error) {
      throw new Error(`❌ CP_CONTCLANEG_008 Paso 6 (clic en botón 'Última página'): ${error.message}`);
    }


    // === CP_CONTCLANEG_008 Paso 7: Clic en botón "Primera página" ===
    try {
      const widgetPaginador = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-grid-crud-grid-crud-135"]/div/div[2]')),
        10000
      );

      const btnPrimeraPagina = await widgetPaginador.findElement(
        By.xpath('.//*[@id="grid-paginator-first"]/span')
      );

      await driver.wait(until.elementIsVisible(btnPrimeraPagina), 5000);
      await driver.wait(until.elementIsEnabled(btnPrimeraPagina), 5000);

      // Capturamos la primera celda antes del cambio
      let primeraCeldaAntes = null;
      try {
        const celdaElem = await driver.findElement(
          By.xpath('//*[@id="grid-table-grid-reports"]/div/div[2]/table/tbody/tr[1]/td[1]')
        );
        primeraCeldaAntes = await celdaElem.getText();
      } catch {
        console.warn("⚠️ No se encontró fila inicial.");
      }

      // Clic en el botón
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnPrimeraPagina);
      await driver.sleep(300);
      await driver.executeScript("arguments[0].click();", btnPrimeraPagina);

      // Espera dinámica: si hay overlay/progress
      try {
        const progress = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="progress-id-filter" or contains(@class, "progress")]')),
          3000
        );
        await driver.wait(until.stalenessOf(progress), 15000);
      } catch {
        console.warn("⚠️ No se detectó overlay de carga, continuando...");
      }

      // Espera limitada a cambio de celda (máximo 10 seg)
      if (primeraCeldaAntes) {
        await Promise.race([
          driver.wait(async () => {
            try {
              const nuevaCelda = await driver.findElement(
                By.xpath('//*[@id="grid-table-grid-reports"]/div/div[2]/table/tbody/tr[1]/td[1]')
              );
              return (await nuevaCelda.getText()) !== primeraCeldaAntes;
            } catch {
              return false;
            }
          }, 10000),
          new Promise(res => setTimeout(res, 10000))
        ]);
      }

      console.log("✅ CP_CONTCLANEG_008 Paso 7: Primera página seleccionada correctamente.");
    } catch (error) {
      throw new Error(`❌ CP_CONTCLANEG_008 Paso 7 (clic en botón 'Primera página'): ${error.message}`);
    }
  }
  //  ==================================
  // === CP_CONTCLANEG_009 - Filtrar (entidad valores de planes)
  // 14 pasos
  //  ==================================
  async realizarFiltro() {
    const driver = this.driver;
    // Paso 1: Seleccionar el primer registro de la tabla y capturar datos ===
    try {
      const cuerpoTabla = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="grid-table-crud-grid-crud-135"]/div/div[2]/table/tbody')),
        10000
      );

      const filas = await cuerpoTabla.findElements(By.xpath('./tr'));

      if (filas.length === 0) {
        throw new Error("No se encontraron filas en la tabla.");
      }

      const primeraFila = filas[0];

      await driver.wait(until.elementIsVisible(primeraFila), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", primeraFila);
      await driver.sleep(300);

      // Obtener todas las celdas de la fila
      const celdas = await primeraFila.findElements(By.css('td'));

      // Capturar datos por índice (ajusta si cambia el orden de columnas)
      this.identificador = await celdas[0].getText();
      this.nombre = await celdas[3].getText();
      this.navigation = await celdas[4].getText();
      this.valor = await celdas[5].getText();

      console.log(`📌 IDENTIFICADOR: ${this.identificador}`);
      console.log(`📌 NOMBRE: ${this.nombre}`);
      console.log(`📌 NAVIGATION: ${this.navigation}`);
      console.log(`📌 VALOR: ${this.valor}`);

      // Clic en la fila
      await primeraFila.click();
      await driver.sleep(1000);

      console.log("✅ Paso 1: Primer registro dinámico seleccionado correctamente.");
    } catch (error) {
      throw new Error(`❌ Paso 1 (selección dinámica de primer registro): ${error.message}`);
    }


    // === Paso 2: Clic en botón "Filtrar" ===
    try {
      const btnFiltrar = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="crud-filter-btn"]')),
        10000
      );

      await driver.wait(until.elementIsVisible(btnFiltrar), 5000);
      await driver.wait(until.elementIsEnabled(btnFiltrar), 5000);

      // Hacer scroll y clic
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnFiltrar);
      await driver.sleep(300);
      await driver.executeScript("arguments[0].click();", btnFiltrar);

      // === Espera dinámica si aparece overlay/progress ===
      try {
        const progress = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="progress-id-filter" or contains(@class,"progress")]')),
          3000
        );
        await driver.wait(until.stalenessOf(progress), 15000);
      } catch {
        console.warn("⚠️ No se detectó barra de progreso después de filtrar, continuando...");
      }

      console.log("✅ Paso 2: Botón 'Filtrar' presionado y espera dinámica completada.");
    } catch (error) {
      throw new Error(`❌ Paso 2 (clic en botón 'Filtrar'): ${error.message}`);
    }

    // === Paso 3: Llenar modal con datos capturados ===
    try {
      // Campo IDENTIFICADOR
      const inputIdentificador = await driver.findElement(By.xpath('//input[@placeholder="Identificador"]'));
      await inputIdentificador.clear();
      await inputIdentificador.sendKeys(this.identificador);

      // Campo NOMBRE
      const inputNombre = await driver.findElement(By.xpath('//input[@placeholder="Nombre"]'));
      await inputNombre.clear();
      await inputNombre.sendKeys(this.nombre);

      // Campo NAVIGATION
      const inputNavigation = await driver.findElement(By.xpath('//input[@placeholder="NAVIGATION"]'));
      await inputNavigation.clear();
      await inputNavigation.sendKeys(this.navigation);

      // Campo VALOR
      const inputValor = await driver.findElement(By.xpath('//input[@placeholder="Valor"]'));
      await inputValor.clear();
      await inputValor.sendKeys(this.valor);
      await driver.sleep(5000);

      console.log("✅ Paso 3: Modal diligenciado correctamente con los datos capturados.");
    } catch (error) {
      throw new Error(`❌ Paso 3: ${error.message}`);
    }

    // === Paso 4 Clic en botón "SOCIALSTRATUMID" ===
    try {
      const btnSocialStratum = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-picklist-socialstratumid"]/div[1]/span/button')),
        10000
      );

      await driver.wait(until.elementIsVisible(btnSocialStratum), 5000);
      await driver.wait(until.elementIsEnabled(btnSocialStratum), 5000);

      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", btnSocialStratum);
      await driver.sleep(300); // pequeña pausa antes del clic

      await btnSocialStratum.click();

      await driver.sleep(2000);
      console.log("✅ Paso 4: Botón 'SOCIALSTRATUMID' presionado correctamente.");
    } catch (error) {
      throw new Error(`❌ Paso 4 (clic en botón 'SOCIALSTRATUMID'): ${error.message}`);
    }

    // === Paso 5: Seleccionar el primer registro de la tabla ===
    try {
      // Esperar a que el tbody del modal esté presente
      const cuerpoTablaModal = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="grid-table-crud-grid-socialstratumid"]/div/div[2]/table/tbody')),
        15000
      );

      // Esperar a que haya al menos una fila visible dentro del modal
      await driver.wait(async () => {
        const filas = await cuerpoTablaModal.findElements(By.xpath('./tr'));
        return filas.length > 0;
      }, 10000);

      // Tomar la primera fila del modal (la que realmente se ve en pantalla)
      const filas = await cuerpoTablaModal.findElements(By.xpath('./tr'));
      const primeraFilaModal = filas[0];

      // Asegurar visibilidad y hacer scroll
      await driver.wait(until.elementIsVisible(primeraFilaModal), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", primeraFilaModal);
      await driver.sleep(300);

      // Intentar clic normal, si falla usar JS
      try {
        await primeraFilaModal.click();
      } catch {
        await driver.executeScript("arguments[0].click();", primeraFilaModal);
      }

      await driver.sleep(800);

      console.log("✅ Paso 5: Primer registro del modal seleccionado correctamente.");
    } catch (error) {
      throw new Error(`❌ Paso 5 (selección primer registro modal): ${error.message}`);
    }

    // === Paso 6: Clic en botón "Seleccionar" del modal ===
    try {
      const botonSeleccionarModal = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-button-btSelect-socialstratumid"]/div')),
        10000
      );

      await driver.wait(until.elementIsVisible(botonSeleccionarModal), 5000);
      await driver.wait(until.elementIsEnabled(botonSeleccionarModal), 5000);

      // Scroll y clic
      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", botonSeleccionarModal);
      await driver.sleep(300);

      try {
        await botonSeleccionarModal.click();
      } catch {
        await driver.executeScript("arguments[0].click();", botonSeleccionarModal);
      }

      // Espera dinámica a que desaparezca el modal
      try {
        const modal = await driver.findElement(By.xpath('//*[@id="widget-dialog-dialog-picklist-socialstratumid"]/div/div'));
        await driver.wait(until.stalenessOf(modal), 10000);
      } catch {
        console.warn("⚠️ No se detectó cierre de modal, se continúa.");
      }

      console.log("✅ Paso 6: Botón 'Seleccionar' del modal presionado correctamente.");
    } catch (error) {
      throw new Error(`❌ Paso 6: (clic en botón 'Seleccionar'): ${error.message}`);
    }

    // === Paso 7: Clic en botón "MUNICIPALITYID" ===
    try {
      const btnMunicipality = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-picklist-municipalityid"]/div[1]/span/button')),
        10000
      );

      await driver.wait(until.elementIsVisible(btnMunicipality), 5000);
      await driver.wait(until.elementIsEnabled(btnMunicipality), 5000);

      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", btnMunicipality);
      await driver.sleep(300); // pequeña pausa antes del clic

      await btnMunicipality.click();

      await driver.sleep(2000);
      console.log("✅ Paso 7: Botón 'MUNICIPALITYID' presionado correctamente.");
    } catch (error) {
      throw new Error(`❌ Paso 7 (clic en botón 'MUNICIPALITYID'): ${error.message}`);
    }

    // === Paso 8: Buscar "ESPINAL" en la barra de búsqueda del modal MUNICIPALITYID ===
    try {
      const barraBusquedaModal = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-dialog-dialog-picklist-municipalityid"]//input[@id="crud-search-bar"]')),
        10000
      );

      await driver.wait(until.elementIsVisible(barraBusquedaModal), 5000);
      await driver.wait(until.elementIsEnabled(barraBusquedaModal), 5000);

      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", barraBusquedaModal);
      await driver.sleep(300);

      // Limpiar y escribir el texto
      await barraBusquedaModal.clear();
      await barraBusquedaModal.sendKeys('ESPINAL', Key.RETURN);
      await driver.sleep(2000);

      console.log("✅ Paso 8: Palabra 'ESPINAL' escrita en el modal y búsqueda ejecutada.");
    } catch (error) {
      throw new Error(`❌ Paso 8: (buscar 'ESPINAL' en modal): ${error.message}`);
    }


    // === Paso 9: Seleccionar resultado de búsqueda en modal MUNICIPALITYID ===
    try {
      const filaMunicipio = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="row-974"]')),
        10000
      );

      await driver.wait(until.elementIsVisible(filaMunicipio), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", filaMunicipio);
      await driver.sleep(300);

      await filaMunicipio.click();
      await driver.sleep(1000);

      console.log("✅ Paso 9: Registro de MUNICIPALITYID seleccionado correctamente.");
    } catch (error) {
      throw new Error(`❌ Paso 9 (selección de resultado en modal MUNICIPALITYID): ${error.message}`);
    }



    // === Paso 10: Clic en botón "Seleccionar" del modal MUNICIPALITYID ===
    try {
      const botonSeleccionarMunicipio = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-button-btSelect-municipalityid"]/div')),
        10000
      );

      await driver.wait(until.elementIsVisible(botonSeleccionarMunicipio), 5000);
      await driver.wait(until.elementIsEnabled(botonSeleccionarMunicipio), 5000);

      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", botonSeleccionarMunicipio);
      await driver.sleep(300);

      await botonSeleccionarMunicipio.click();

      // Esperar a que desaparezca el modal
      try {
        const modalMunicipio = await driver.findElement(By.xpath('//*[@id="widget-dialog-dialog-picklist-municipalityid"]/div/div'));
        await driver.wait(until.stalenessOf(modalMunicipio), 15000);
      } catch {
        console.warn("⚠️ No se detectó cierre del modal de MUNICIPALITYID, se continúa.");
      }

      console.log("✅ Paso 10: Botón 'Seleccionar' en modal MUNICIPALITYID presionado correctamente.");
    } catch (error) {
      throw new Error(`❌ Paso 10: (clic en botón 'Seleccionar' en modal MUNICIPALITYID): ${error.message}`);
    }

    // === Paso 11: Scroll hasta el final y clic en botón "ID PLAN COMERCIAL" ===
    try {
      // 1️⃣ Localizar el modal-body
      const modalBody = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-dialog-dialog-crud-crud-135"]/div/div/div[2]')),
        10000
      );

      // 2️⃣ Hacer scroll hasta el final del modal
      await driver.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight", modalBody);
      await driver.sleep(500); // breve pausa para que cargue cualquier contenido adicional

      // 3️⃣ Localizar el botón "ID PLAN COMERCIAL"
      const btnIdPlanComercial = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-picklist-commercialplanid"]/div[1]/span/button')),
        10000
      );

      await driver.wait(until.elementIsVisible(btnIdPlanComercial), 5000);
      await driver.wait(until.elementIsEnabled(btnIdPlanComercial), 5000);

      // 4️⃣ Scroll hasta el botón y clic
      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", btnIdPlanComercial);
      await driver.sleep(300);
      await btnIdPlanComercial.click();

      await driver.sleep(2000); // esperar que se abra el modal
      console.log("✅ Paso 11: Scroll abajo y clic en botón 'ID PLAN COMERCIAL' realizado correctamente.");
    } catch (error) {
      throw new Error(`❌ Paso 11 (scroll y clic en botón 'ID PLAN COMERCIAL'): ${error.message}`);
    }

    // === Paso 12: Seleccionar el primer registro del modal "ID PLAN COMERCIAL" ===
    try {
      // 1️⃣ Esperar a que se muestre el modal-body del picklist
      const modalBodyPlanComercial = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-dialog-dialog-picklist-commercialplanid"]/div/div/div[2]')),
        10000
      );

      await driver.wait(until.elementIsVisible(modalBodyPlanComercial), 5000);

      // 2️⃣ Dentro del modal, ubicar el tbody de la tabla
      const tbodyPlanComercial = await modalBodyPlanComercial.findElement(
        By.xpath('.//table/tbody')
      );

      // 3️⃣ Obtener todas las filas visibles
      const filasPlanComercial = await tbodyPlanComercial.findElements(By.xpath('./tr'));

      if (filasPlanComercial.length === 0) {
        throw new Error("No se encontraron registros en el modal 'ID PLAN COMERCIAL'.");
      }

      // 4️⃣ Tomar la primera fila
      const primeraFilaPlanComercial = filasPlanComercial[0];

      await driver.wait(until.elementIsVisible(primeraFilaPlanComercial), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", primeraFilaPlanComercial);
      await driver.sleep(300);

      // 5️⃣ Clic en la primera fila
      await primeraFilaPlanComercial.click();
      await driver.sleep(2000);

      console.log("✅ Paso 12: Primer registro del modal 'ID PLAN COMERCIAL' seleccionado correctamente.");
    } catch (error) {
      throw new Error(`❌ Paso 12: (selección primer registro modal 'ID PLAN COMERCIAL'): ${error.message}`);
    }

    // ===  Paso 13: Clic en botón "Seleccionar" del modal ID PLAN COMERCIAL ===
    try {
      // 1️⃣ Esperar a que esté visible el modal-body para confirmar que el modal está abierto
      const modalBodyPlanComercial = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-dialog-dialog-picklist-commercialplanid"]/div/div/div[2]')),
        10000
      );
      await driver.wait(until.elementIsVisible(modalBodyPlanComercial), 5000);

      // 2️⃣ Localizar el botón "Seleccionar" dentro del modal-footer
      const botonSeleccionarPlanComercial = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-button-btSelect-commercialplanid"]/div')),
        10000
      );

      await driver.wait(until.elementIsVisible(botonSeleccionarPlanComercial), 5000);
      await driver.wait(until.elementIsEnabled(botonSeleccionarPlanComercial), 5000);

      // 3️⃣ Scroll hacia el botón y clic
      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", botonSeleccionarPlanComercial);
      await driver.sleep(300);
      await botonSeleccionarPlanComercial.click();

      // 4️⃣ Espera dinámica a que desaparezca el modal
      try {
        const modalContentPlanComercial = await driver.findElement(
          By.xpath('//*[@id="widget-dialog-dialog-picklist-commercialplanid"]/div/div')
        );
        await driver.wait(until.stalenessOf(modalContentPlanComercial), 15000);
      } catch {
        console.warn("⚠️ No se detectó cierre del modal, continuando...");
      }

      console.log("✅ Paso 13: Botón 'Seleccionar' del modal ID PLAN COMERCIAL presionado correctamente.");
    } catch (error) {
      throw new Error(`❌ Paso 13: (clic en botón 'Seleccionar' modal ID PLAN COMERCIAL): ${error.message}`);
    }

    // === Paso 14: Clic en botón "Filtrar" del modal cls_commercialplanvalue ===
    try {
      // 1️⃣ Esperar que el modal esté abierto (modal-content visible)
      const modalContentFiltrar = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-dialog-dialog-crud-crud-135"]/div/div')),
        10000
      );
      await driver.wait(until.elementIsVisible(modalContentFiltrar), 5000);

      // 2️⃣ Localizar el botón "Filtrar" dentro del modal
      const botonFiltrarModal = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-button-btAction-crud-135"]/div')),
        10000
      );

      await driver.wait(until.elementIsVisible(botonFiltrarModal), 5000);
      await driver.wait(until.elementIsEnabled(botonFiltrarModal), 5000);

      // 3️⃣ Scroll hacia el botón y clic
      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", botonFiltrarModal);
      await driver.sleep(300);
      await botonFiltrarModal.click();

      // 4️⃣ Espera dinámica a que el modal se cierre
      try {
        await driver.wait(until.stalenessOf(modalContentFiltrar), 15000);
      } catch {
        console.warn("⚠️ No se detectó cierre del modal, continuando...");
      }

      console.log("✅ Paso 14: Botón 'Filtrar' en modal cls_commercialplanvalue presionado correctamente.");
    } catch (error) {
      throw new Error(`❌ Paso 14: (clic en botón 'Filtrar' modal cls_commercialplanvalue): ${error.message}`);
    }

  }
  //  ==================================
  //  === CP_CONTCLANEG_010: Validar funcionalidad carga masiva de objetos, opcion descargar plantilla (entidad valores de planes) ===
  //  3 pasos
  //  ==================================

  async validarCargaMasivaObjetos() {
    const driver = this.driver;

    // === Paso 1: Clic en botón "Carga masiva de objetos" ===
    try {
      const contenedorPick = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="view-content-class"]/div[1]')),
        10000
      );
      await driver.wait(until.elementIsVisible(contenedorPick), 5000);

      const btnCargaMasiva = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="massive-load"]')),
        10000
      );

      await driver.wait(until.elementIsVisible(btnCargaMasiva), 5000);
      await driver.wait(until.elementIsEnabled(btnCargaMasiva), 5000);

      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", btnCargaMasiva);
      await driver.sleep(300);
      await btnCargaMasiva.click();
      await driver.sleep(2000);

      console.log("✅ CP_CONTCLANEG_010 Paso 1: Botón 'Carga masiva de objetos' presionado correctamente.");
    } catch (error) {
      throw new Error(`❌ CP_CONTCLANEG_010 Paso 1 (clic en botón 'Carga masiva de objetos'): ${error.message}`);
    }

    // === Paso 2: Clic en botón "Descargar plantilla" ===
    try {
      const modalContent = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-dialog-dialogExportXlsx"]/div/div')),
        10000
      );
      await driver.wait(until.elementIsVisible(modalContent), 5000);

      const contentDownload = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-dialog-dialogExportXlsx"]/div/div/div[2]/div/div[1]')),
        10000
      );
      await driver.wait(until.elementIsVisible(contentDownload), 5000);

      const btnDescargarPlantilla = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="btn-download-template"]')),
        10000
      );

      await driver.wait(until.elementIsVisible(btnDescargarPlantilla), 5000);
      await driver.wait(until.elementIsEnabled(btnDescargarPlantilla), 5000);

      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", btnDescargarPlantilla);
      await driver.sleep(300);
      await btnDescargarPlantilla.click();
      await driver.sleep(2000);

      try {
        const progreso = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="progress-download-template"]')),
          3000
        );
        await driver.wait(until.stalenessOf(progreso), 15000);
      } catch {
        console.warn("⚠️ No se detectó barra de progreso de descarga, se continúa.");
      }

      console.log("✅ CP_CONTCLANEG_010 Paso 2: Botón 'Descargar plantilla' presionado correctamente.");
    } catch (error) {
      throw new Error(`❌ CP_CONTCLANEG_010 Paso 2 (clic en botón 'Descargar plantilla'): ${error.message}`);
    }

    // === Paso 3: Clic en botón "Cancelar" del modal ===
    try {
      const btnCancelar = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-button-btnCancelExport"]/div')),
        10000
      );

      await driver.wait(until.elementIsVisible(btnCancelar), 5000);
      await driver.wait(until.elementIsEnabled(btnCancelar), 5000);

      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", btnCancelar);
      await driver.sleep(300);
      await btnCancelar.click();

      try {
        const modalContent = await driver.findElement(
          By.xpath('//*[@id="widget-dialog-dialogExportXlsx"]/div/div')
        );
        await driver.wait(until.stalenessOf(modalContent), 15000);
      } catch {
        console.warn("⚠️ No se detectó cierre del modal, se continúa.");
      }

      console.log("✅ CP_CONTCLANEG_010 Paso 3: Botón 'Cancelar' presionado y modal cerrado correctamente.");
    } catch (error) {
      throw new Error(`❌ CP_CONTCLANEG_010 Paso 3 (clic en botón 'Cancelar'): ${error.message}`);
    }
  }

}