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

  async ejecutarExploradorEntidades() {
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
        until.elementLocated(By.xpath("//div[contains(@class,'legend-application') and contains(text(),'Explorador de entidades')]")),
        10000
      );
      await driver.executeScript("arguments[0].scrollIntoView({behavior:'smooth', block:'center'});", targetApp);
      await driver.wait(until.elementIsVisible(targetApp), 10000);
      await driver.wait(until.elementIsEnabled(targetApp), 10000);
      await driver.sleep(1000);
      await driver.executeScript("arguments[0].click();", targetApp);
      await driver.sleep(5000);

      // === Paso 4: Clic en el elemento OLT ===
      const oltElemento = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="container-entity"]/div/div[1]/div[2]/div[14]')),
        10000
      );

      // Asegurarse de que esté visible y listo para clic
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", oltElemento);
      await driver.wait(until.elementIsVisible(oltElemento), 10000);
      await driver.sleep(1000);
      await driver.executeScript("arguments[0].click();", oltElemento);

      // console.log('✅ Paso 4: Clic en el elemento OLT realizado con éxito.');
      await driver.sleep(3000); // Esperar para carga posterior

      // === Paso 5: Clic en el botón "Ver todas" del contenedor OLT ===

      const contenedorOLT = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="container-entity"]/div/div[1]/div[2]/div[14]')),
        10000
      );

      // Asegurarse de que el contenedor esté visible
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", contenedorOLT);
      await driver.wait(until.elementIsVisible(contenedorOLT), 10000);
      await driver.sleep(1000);

      // Ubicar el botón "Ver todas"
      const botonVerTodas = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="container-entity"]/div/div[1]/div[2]/div[14]/div[4]')),
        10000
      );

      // Hacer clic en el botón
      await driver.executeScript("arguments[0].click();", botonVerTodas);
      // console.log("✅ Paso 5: Clic en el botón 'Ver todas' realizado correctamente.");
      await driver.sleep(3000); // Esperar para que el modal o contenido cargue

      // === Paso 6: Clic en el botón "Configuración masiva de agente" ===

      const btnConfiguracionMasiva = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="btn-open-agent-massive"]')),
        10000
      );

      // Esperar a que sea visible
      await driver.wait(until.elementIsVisible(btnConfiguracionMasiva), 10000);

      // Scroll opcional si no está visible en viewport
      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", btnConfiguracionMasiva);
      await driver.sleep(500);

      // Ejecutar el clic
      await driver.executeScript("arguments[0].click();", btnConfiguracionMasiva);
      // console.log("✅ Paso 6: Se hizo clic en el botón 'Configuración masiva de agente'.");
      await driver.sleep(3000); // Espera a que se cargue la siguiente vista/modal

      // === Paso 7: Clic en el botón del campo "Categoría constructiva" ===

      try {
        // Esperar que el botón esté presente y visible
        const btnCategoriaConstructiva = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-picklist-constructivecategory"]/div[1]/span/button')),
          10000
        );

        await driver.wait(until.elementIsVisible(btnCategoriaConstructiva), 10000);

        // Scroll para asegurar visibilidad
        await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", btnCategoriaConstructiva);
        await driver.sleep(500); // Pausa breve por animaciones

        // Clic en el botón del campo
        await driver.executeScript("arguments[0].click();", btnCategoriaConstructiva);
        // console.log('✅ Se hizo clic en el botón del campo "Categoría constructiva".');

        // Esperar que el modal contenedor del picklist se cargue (uso el xpath del modal)
        const modalCategoriaConstructiva = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-dialog-dialog-filter-massive-agents"]/div/div')),
          10000
        );
        await driver.wait(until.elementIsVisible(modalCategoriaConstructiva), 10000);
        // console.log("✅ Modal de selección de 'Categoría constructiva' cargado correctamente.");

        await driver.sleep(1500); // Espera adicional para carga de contenido

      } catch (error) {
        throw new Error(`❌ Error en paso 7: ${error.message}`);
      }

      // === Paso 8: Seleccionar fila con ID "1" (indoor) ===

      try {
        // Esperar que el modal y tabla estén visibles
        const contenedorModalCategoria = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-dialog-dialog-filter-massive-agents"]/div/div')),
          10000
        );

        const tablaCategoria = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="grid-table-crud-grid-constructivecategory"]/div/div[2]/table')),
          10000
        );

        const tbodyCategoria = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="grid-table-crud-grid-constructivecategory"]/div/div[2]/table/tbody')),
          10000
        );

        // Seleccionar la fila con ID 1
        const filaIndoor = await tbodyCategoria.findElement(By.css('tr#row-1'));
        const celdaIdIndoor = await filaIndoor.findElement(By.css('td#id'));

        // Scroll hacia la fila
        await driver.executeScript(
          "arguments[0].scrollTop = arguments[1].offsetTop;",
          contenedorModalCategoria,
          filaIndoor
        );

        await driver.sleep(500); // Espera breve para aplicar scroll

        // Clic en la celda de la fila
        await driver.executeScript("arguments[0].click();", celdaIdIndoor);

        // Validar si la fila fue activada
        const claseFilaIndoor = await filaIndoor.getAttribute("class");
        if (!claseFilaIndoor.includes("active")) {
          throw new Error("❌ La fila con ID '1' no fue marcada como activa.");
        }

        // console.log("✅ Fila con ID '1' (indoor) seleccionada correctamente.");
        await driver.sleep(2500); // Espera visual opcional

      } catch (error) {
        throw new Error(`❌ Error en paso 8: ${error.message}`);
      }

      // === Paso 9: Clic en el botón "Seleccionar" del modal de categoría constructiva ===

      try {
        // Esperar que el botón "Seleccionar" esté presente y visible
        const botonSeleccionarCategoria = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-button-btSelect-constructivecategory"]/div')),
          10000
        );

        // Esperar que sea visible en viewport
        await driver.wait(until.elementIsVisible(botonSeleccionarCategoria), 10000);

        // Esperar que no esté deshabilitado
        await driver.wait(async () => {
          const disabledAttr = await botonSeleccionarCategoria.getAttribute('disabled');
          const classAttr = await botonSeleccionarCategoria.getAttribute('class');
          return !disabledAttr && !classAttr.includes('disabled');
        }, 10000, '❌ El botón "Seleccionar" de categoría constructiva no está habilitado.');

        // Scroll al botón
        await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", botonSeleccionarCategoria);
        await driver.sleep(500); // Pequeña pausa por si hay animaciones

        // Clic con JavaScript para evitar interferencias del modal
        await driver.executeScript("arguments[0].click();", botonSeleccionarCategoria);

        console.log("✅ Botón 'Seleccionar' de categoría constructiva presionado correctamente.");
        await driver.sleep(1500);

      } catch (error) {
        throw new Error(`❌ Error en paso 9 (clic en botón 'Seleccionar'): ${error.message}`);
      }

      // === Paso 10: Clic en el botón del campo "VLANQINQ" ===

      try {
        // Esperar que el contenedor del campo esté presente
        const campoVlanqinq = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-picklist-vlanqinq"]')),
          10000
        );

        // Esperar que el botón del picklist esté presente y visible
        const botonVlanqinq = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-picklist-vlanqinq"]/div[1]/span/button')),
          10000
        );

        // Asegurar visibilidad en el viewport
        await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", botonVlanqinq);
        await driver.sleep(500); // Espera ligera por animación o renderizado

        // Hacer clic con JS para evitar conflictos con overlays
        await driver.executeScript("arguments[0].click();", botonVlanqinq);

        console.log("✅ Botón del campo 'VLANQINQ' clickeado correctamente.");
        await driver.sleep(1500); // Esperar a que cargue el modal

      } catch (error) {
        throw new Error(`❌ Error en paso 10 (clic en botón VLANQINQ): ${error.message}`);
      }

      // === Paso 11: Seleccionar VLANQINQ con ID "3" ===

      try {
        // Esperar que el contenedor del modal esté visible
        const contenedorModalVlan = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-dialog-dialog-picklist-vlanqinq"]/div/div')),
          10000
        );

        // Esperar que el tbody de la tabla esté disponible
        const cuerpoTablaVlan = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="grid-table-crud-grid-vlanqinq"]/div/div[2]/table/tbody')),
          10000
        );

        // Localizar la fila con ID 3
        const filaVLAN2104 = await cuerpoTablaVlan.findElement(By.xpath('//*[@id="row-3"]'));

        // Localizar la celda con el ID dentro de la fila
        const celdaID = await filaVLAN2104.findElement(By.css('td#id'));

        // Hacer scroll dentro del contenedor del modal
        await driver.executeScript(
          "arguments[0].scrollTop = arguments[1].offsetTop;",
          contenedorModalVlan,
          filaVLAN2104
        );

        await driver.sleep(500); // Pausa corta por scroll

        // Hacer clic en la celda para activar la fila
        await driver.executeScript("arguments[0].click();", celdaID);
        await driver.sleep(1000); // Tiempo para aplicar el class active

        // Verificación visual por clase "active"
        const claseFilaVLAN = await filaVLAN2104.getAttribute("class");
        if (!claseFilaVLAN.includes("active")) {
          throw new Error("❌ La fila con ID '3' (VLAN 2104) no fue marcada como activa.");
        }

        console.log("✅ VLANQINQ '2104' seleccionada correctamente.");

      } catch (error) {
        throw new Error(`❌ Error en paso 11 (seleccionar VLANQINQ): ${error.message}`);
      }

      // === Paso 12: Clic en botón "Seleccionar" del modal VLANQINQ ===

      try {
        const modalFooterVlan = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-dialog-dialog-picklist-vlanqinq"]/div/div/div[3]')),
          10000
        );

        const botonSeleccionarVlan = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-button-btSelect-vlanqinq"]/div')),
          10000
        );

        // Esperar a que sea visible
        await driver.wait(until.elementIsVisible(botonSeleccionarVlan), 10000);

        // Verificar que no esté deshabilitado
        await driver.wait(async () => {
          const disabled = await botonSeleccionarVlan.getAttribute("disabled");
          const clase = await botonSeleccionarVlan.getAttribute("class");
          return !disabled && !clase.includes("disabled");
        }, 10000, '❌ El botón "Seleccionar" no se habilitó a tiempo.');

        // Scroll hacia el botón
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonSeleccionarVlan);
        await driver.sleep(500);

        // Clic en el botón
        await driver.executeScript("arguments[0].click();", botonSeleccionarVlan);
        await driver.sleep(3000);

        console.log("✅ Se hizo clic en el botón 'Seleccionar' del modal VLANQINQ.");

      } catch (error) {
        throw new Error(`❌ Error en paso 12 (clic en botón Seleccionar VLANQINQ): ${error.message}`);
      }

      // === Paso 13: Clic en botón del campo "Protocolo de conexión" ===

      try {
        const campoProtocolo = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-picklist-protocol"]')),
          10000
        );

        const botonProtocolo = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-picklist-protocol"]/div[1]/span/button')),
          10000
        );

        // Verificar visibilidad del botón
        await driver.wait(until.elementIsVisible(botonProtocolo), 10000);

        // Scroll hacia el botón
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonProtocolo);
        await driver.sleep(500); // Dar tiempo a la animación

        // Clic usando JavaScript para evitar overlays
        await driver.executeScript("arguments[0].click();", botonProtocolo);
        await driver.sleep(3000); // Espera apertura del modal

        console.log("✅ Se hizo clic en el botón del campo 'Protocolo de conexión'.");

      } catch (error) {
        throw new Error(`❌ Error en paso 13 (clic en botón Protocolo de conexión): ${error.message}`);
      }

      // === Paso 14: Seleccionar el protocolo "IPOE" (ID 1) ===

      try {
        // Esperar el contenedor del modal
        const modalProtocolo = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="grid-table-crud-grid-protocol"]/div/div[2]/table')),
          10000
        );

        // Esperar el cuerpo de la tabla dentro del modal
        const tablaBodyProtocolo = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="grid-table-crud-grid-protocol"]/div/div[2]/table/tbody')),
          10000
        );

        // Esperar la fila con ID 1 (IPOE)
        const filaIPOE = await tablaBodyProtocolo.findElement(By.css('tr#row-1'));

        // Buscar la celda ID dentro de la fila
        const celdaIdIPOE = await filaIPOE.findElement(By.css('td#id'));

        // Hacer scroll hacia la fila dentro del modal
        await driver.executeScript(
          "arguments[0].scrollTop = arguments[1].offsetTop;",
          modalProtocolo,
          filaIPOE
        );

        await driver.sleep(500); // Espera ligera para el scroll

        // Clic en la celda para activar selección
        await driver.executeScript("arguments[0].click();", celdaIdIPOE);

        // Verificar si fue seleccionada visualmente con la clase "active"
        const claseFilaIPOE = await filaIPOE.getAttribute("class");
        if (!claseFilaIPOE.includes("active")) {
          throw new Error("❌ La fila con ID '1' (IPOE) no fue marcada como activa.");
        }

        console.log("✅ Fila 'IPOE' seleccionada correctamente.");

      } catch (error) {
        throw new Error(`❌ Error en paso 14 (selección de IPOE): ${error.message}`);
      }

      // === Paso 15: Clic en el botón "Seleccionar" del modal de Protocolo ===

      try {
        // Esperar el contenedor del footer del modal
        const footerProtocolo = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-dialog-dialog-picklist-protocol"]/div/div/div[3]')),
          10000
        );

        // Esperar el botón "Seleccionar"
        const btnSeleccionarProtocolo = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-button-btSelect-protocol"]/div')),
          10000
        );

        // Asegurar que el botón sea visible
        await driver.wait(until.elementIsVisible(btnSeleccionarProtocolo), 10000);

        // Asegurar que no esté deshabilitado por clase o atributo
        await driver.wait(async () => {
          const disabled = await btnSeleccionarProtocolo.getAttribute("disabled");
          const clase = await btnSeleccionarProtocolo.getAttribute("class");
          return !disabled && !clase.includes("disabled");
        }, 10000);

        // Scroll y clic
        await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", btnSeleccionarProtocolo);
        await driver.sleep(500); // Transición
        await driver.executeScript("arguments[0].click();", btnSeleccionarProtocolo);

        console.log("✅ Se hizo clic en el botón 'Seleccionar' del modal de Protocolo.");
        await driver.sleep(2000);

      } catch (error) {
        throw new Error(`❌ Error en paso 15 (clic en botón 'Seleccionar' del protocolo): ${error.message}`);
      }

      // === Paso 16: Clic en el botón del campo "Categoría" ===

      try {
        // Esperar que el campo categoría esté presente en el DOM
        const campoCategoria = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-picklist-category"]')),
          10000
        );

        // Scroll hacia el campo
        await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", campoCategoria);
        await driver.sleep(500);

        // Esperar y localizar el botón del campo categoría
        const btnCategoria = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-picklist-category"]/div[1]/span/button')),
          10000
        );

        // Verificar visibilidad del botón
        await driver.wait(until.elementIsVisible(btnCategoria), 10000);

        // Clic usando JavaScript para evitar overlays
        await driver.executeScript("arguments[0].click();", btnCategoria);

        console.log("✅ Se hizo clic en el botón del campo 'Categoría'");
        await driver.sleep(1500); // Pausa por transición

      } catch (error) {
        throw new Error(`❌ Error en paso 16 (clic en botón de Categoría): ${error.message}`);
      }
      // === Paso 17: Seleccionar el elemento "Acceso" (ID 1) en el modal ===

      try {
        // Esperar que la tabla esté presente
        const tablaCategoria = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="grid-table-crud-grid-category"]/div/div[2]/table')),
          10000
        );

        // Scroll a la tabla para asegurar visibilidad
        await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", tablaCategoria);
        await driver.sleep(500);

        // Localizar el tbody de la tabla
        const tbodyCategoria = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="grid-table-crud-grid-category"]/div/div[2]/table/tbody')),
          10000
        );

        // Esperar la fila con ID 1
        const filaAcceso = await tbodyCategoria.findElement(By.xpath('.//*[@id="row-1"]'));

        // Localizar la primera celda de la fila (con el ID)
        const celdaAcceso = await filaAcceso.findElement(By.css('td#id'));

        // Scroll al elemento
        await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", celdaAcceso);
        await driver.sleep(500);

        // Clic sobre la celda
        await driver.executeScript("arguments[0].click();", celdaAcceso);

        // Verificar que se haya aplicado la clase "active"
        const claseSeleccionada = await filaAcceso.getAttribute("class");
        if (!claseSeleccionada.includes("active")) {
          throw new Error("❌ La fila con ID 1 no fue marcada como activa.");
        }

        console.log("✅ Fila con ID 1 (Acceso) seleccionada correctamente.");
        await driver.sleep(1500);

      } catch (error) {
        throw new Error(`❌ Error en paso 17 (selección categoría 'Acceso'): ${error.message}`);
      }

      // === Paso 18: Clic en el botón "Seleccionar" en el modal ===

      try {
        // Esperar el footer del modal para asegurar que el botón esté presente
        const footerModalCategoria = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-dialog-dialog-picklist-category"]/div/div/div[3]')),
          10000
        );

        // Asegurarse que el botón sea localizable dentro del footer
        const botonSeleccionarCategoria = await footerModalCategoria.findElement(
          By.xpath('.//*[@id="widget-button-btSelect-category"]/div')
        );

        // Asegurar visibilidad del botón
        await driver.wait(until.elementIsVisible(botonSeleccionarCategoria), 10000);

        // Scroll al botón para asegurar visibilidad
        await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", botonSeleccionarCategoria);
        await driver.sleep(500); // Breve pausa por animaciones

        // Clic en el botón
        await driver.executeScript("arguments[0].click();", botonSeleccionarCategoria);

        console.log("✅ Botón 'Seleccionar' del modal de categoría clickeado correctamente.");
        await driver.sleep(3000);

      } catch (error) {
        throw new Error(`❌ Error en paso 18 (clic en botón 'Seleccionar' categoría): ${error.message}`);
      }

      // === Paso 19: Diligenciar el campo "Serial Fábrica" con un valor aleatorio ===

      try {
        // Generar los últimos 3 dígitos aleatorios entre 1 y 9
        const ultimosDigitos = Array.from({ length: 3 }, () =>
          Math.floor(Math.random() * 9) + 1
        ).join('');

        const serialCompleto = `2102301260N0M0000${ultimosDigitos}`;

        // Esperar el campo input
        const inputSerialFabrica = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="textfield-factoryserial"]')),
          10000
        );

        // Asegurar visibilidad
        await driver.wait(until.elementIsVisible(inputSerialFabrica), 10000);

        // Limpiar y escribir el valor generado
        await inputSerialFabrica.clear();
        await inputSerialFabrica.sendKeys(serialCompleto);

        console.log(`✅ Serial de fábrica ingresado: ${serialCompleto}`);
        await driver.sleep(1000);

      } catch (error) {
        throw new Error(`❌ Error en paso 19 (campo Serial Fábrica): ${error.message}`);
      }

      // === Paso 20: Diligenciar campo "Cantidad de slots" con número aleatorio ===

      try {
        // Generar número aleatorio entre 1 y 50
        const cantidadSlots = Math.floor(Math.random() * 50) + 1;

        // Esperar el input del campo cantidad de slots
        const inputSlots = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="textfield-numberofslots"]')),
          10000
        );

        await driver.wait(until.elementIsVisible(inputSlots), 10000);

        // Limpiar y escribir el valor generado
        await inputSlots.clear();
        await inputSlots.sendKeys(cantidadSlots.toString());

        console.log(`✅ Cantidad de slots ingresada: ${cantidadSlots}`);
        await driver.sleep(1000);

      } catch (error) {
        throw new Error(`❌ Error en paso 20 (campo Cantidad de slots): ${error.message}`);
      }


      // === Paso 21: Diligenciar campo "Firmware versión" con formato EAXXXXXXXXXXXXXXX ===

      try {
        // Generar parte aleatoria de 15 caracteres alfanuméricos
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let versionAleatoria = 'EA';
        for (let i = 0; i < 15; i++) {
          versionAleatoria += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }

        // Esperar el input del campo firmware version
        const inputFirmware = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="textfield-firmwareversion"]')),
          10000
        );

        await driver.wait(until.elementIsVisible(inputFirmware), 10000);

        // Limpiar y escribir la versión generada
        await inputFirmware.clear();
        await inputFirmware.sendKeys(versionAleatoria);

        console.log(`✅ Firmware versión ingresada: ${versionAleatoria}`);
        await driver.sleep(1000);

      } catch (error) {
        throw new Error(`❌ Error en paso 21 (campo Firmware versión): ${error.message}`);
      }

      // === Paso 22: Diligenciar campo IP con formato IPv4 (iniciando en 172.) ===

      try {
        // Generar una IP aleatoria con prefijo 172.
        const octeto2 = Math.floor(Math.random() * 256);
        const octeto3 = Math.floor(Math.random() * 256);
        const octeto4 = Math.floor(Math.random() * 256);
        const ipAleatoria = `172.${octeto2}.${octeto3}.${octeto4}`;

        // Esperar el input del campo IP
        const inputIP = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="textfield-ip"]')),
          10000
        );

        await driver.wait(until.elementIsVisible(inputIP), 10000);

        // Limpiar y diligenciar IP
        await inputIP.clear();
        await inputIP.sendKeys(ipAleatoria);

        console.log(`✅ IP ingresada: ${ipAleatoria}`);
        await driver.sleep(1000);

      } catch (error) {
        throw new Error(`❌ Error en paso 22 (campo IP): ${error.message}`);
      }

      // === Paso 23: Diligenciar campo "Número de soporte" con valor aleatorio ===

      try {
        // Generar un número de soporte de 12 caracteres alfanuméricos
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const numeroSoporte = Array.from({ length: 12 }, () =>
          caracteres.charAt(Math.floor(Math.random() * caracteres.length))
        ).join('');

        // Esperar el input del campo
        const inputNumeroSoporte = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="textfield-supportnumber"]')),
          10000
        );

        await driver.wait(until.elementIsVisible(inputNumeroSoporte), 10000);

        // Limpiar y diligenciar
        await inputNumeroSoporte.clear();
        await inputNumeroSoporte.sendKeys(numeroSoporte);

        console.log(`✅ Número de soporte ingresado: ${numeroSoporte}`);
        await driver.sleep(1000);

      } catch (error) {
        throw new Error(`❌ Error en paso 23 (Número de soporte): ${error.message}`);
      }

      // === Paso 24: Clic en el botón del campo "Fecha de instalación" ===

      try {
        // Esperar el contenedor del campo fecha
        const campoFechaInstalacion = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-datepicker-installationdate"]')),
          10000
        );

        // Esperar el botón dentro del contenedor
        const botonFechaInstalacion = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="datapicker-select-button"]')),
          10000
        );

        // Asegurar visibilidad y hacer clic
        await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", botonFechaInstalacion);
        await driver.wait(until.elementIsVisible(botonFechaInstalacion), 10000);
        await driver.sleep(500); // para posibles animaciones

        // Hacer clic en el botón de fecha
        await botonFechaInstalacion.click();

        console.log("✅ Clic en el botón de 'Fecha de instalación' realizado correctamente.");
        await driver.sleep(1000);

      } catch (error) {
        throw new Error(`❌ Error en paso 24 (clic en botón de 'Fecha de instalación'): ${error.message}`);
      }

      // === Paso 25: Clic en el botón "ACEPTAR" del calendario ===
      try {
        // Esperar a que aparezca el contenedor de botones del calendario
        const contenedorBotonesCalendario = await driver.wait(
          until.elementLocated(By.css(".dtp-buttons")),
          10000
        );

        // Esperar específicamente el botón con clase "dtp-btn-ok"
        const botonAceptar = await contenedorBotonesCalendario.findElement(
          By.css(".dtp-btn-ok")
        );

        // Asegurarse que sea visible y clickeable
        await driver.wait(until.elementIsVisible(botonAceptar), 5000);
        await driver.wait(until.elementIsEnabled(botonAceptar), 5000);

        // Scroll al botón y clic
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonAceptar);
        await driver.sleep(500);
        await botonAceptar.click();
        await driver.sleep(3000);

        console.log("✅ Botón 'Aceptar' del calendario presionado con éxito.");
      } catch (error) {
        throw new Error(`❌ Error en paso 25: No se pudo hacer clic en el botón ACEPTAR. ${error.message}`);
      }

      // === Paso 26: Clic en el botón "ACEPTAR" del selector de hora ===
      try {
        // Esperar a que aparezca el contenedor de botones del calendario/reloj
        const contenedorBotonesHora = await driver.wait(
          until.elementLocated(By.css(".dtp-buttons")),
          10000
        );

        // Localizar el botón "Aceptar" dentro de ese contenedor
        const botonAceptarHora = await contenedorBotonesHora.findElement(
          By.css(".dtp-btn-ok")
        );

        // Asegurarse que el botón sea visible y esté habilitado
        await driver.wait(until.elementIsVisible(botonAceptarHora), 5000);
        await driver.wait(until.elementIsEnabled(botonAceptarHora), 5000);

        // Scroll al botón y clic
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonAceptarHora);
        await driver.sleep(500);
        await botonAceptarHora.click();
        await driver.sleep(3000);

        console.log("✅ Botón 'Aceptar' del reloj presionado con éxito.");
      } catch (error) {
        throw new Error(`❌ Error al confirmar la hora: ${error.message}`);
      }

      // === Paso 27: Confirmar minutos en el selector de fecha ===
      try {
        // Esperar a que aparezca el contenedor de botones del calendario/reloj
        const contenedorBotonesMinutos = await driver.wait(
          until.elementLocated(By.css(".dtp-buttons")),
          10000
        );

        // Localizar el botón "Aceptar" dentro de ese contenedor
        const botonAceptarMinutos = await contenedorBotonesMinutos.findElement(
          By.css(".dtp-btn-ok")
        );

        // Asegurarse que el botón sea visible y esté habilitado
        await driver.wait(until.elementIsVisible(botonAceptarMinutos), 5000);
        await driver.wait(until.elementIsEnabled(botonAceptarMinutos), 5000);

        // Scroll al botón y clic
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonAceptarMinutos);
        await driver.sleep(500);
        await botonAceptarMinutos.click();
        await driver.sleep(3000);

        console.log("✅ Paso 27: Minutos confirmados correctamente.");
      } catch (error) {
        throw new Error(`❌ Error en paso 27 (confirmar minutos): ${error.message}`);
      }

      // === Paso 28: Confirmar segundos en el selector de fecha ===
      try {
        // Esperar a que aparezca el contenedor de botones del calendario/reloj
        const contenedorBotonesSegundos = await driver.wait(
          until.elementLocated(By.css(".dtp-buttons")),
          10000
        );

        // Localizar el botón "Aceptar" dentro de ese contenedor
        const botonAceptarSegundos = await contenedorBotonesSegundos.findElement(
          By.css(".dtp-btn-ok")
        );

        // Asegurarse que el botón sea visible y esté habilitado
        await driver.wait(until.elementIsVisible(botonAceptarSegundos), 5000);
        await driver.wait(until.elementIsEnabled(botonAceptarSegundos), 5000);

        // Scroll al botón y clic
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonAceptarSegundos);
        await driver.sleep(500);
        await botonAceptarSegundos.click();
        await driver.sleep(3000);

        console.log("✅ Paso 28: Segundos confirmados correctamente.");
      } catch (error) {
        throw new Error(`❌ Error en paso 28 (confirmar segundos): ${error.message}`);
      }


      // === Paso 29: Clic en el botón del campo "Modelo" ===

      try {
        // Esperar a que el contenedor del campo esté presente
        const campoModelo = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-picklist-model"]')),
          10000
        );

        // Esperar a que el botón esté dentro del contenedor
        const botonModelo = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-picklist-model"]/div[1]/span/button')),
          10000
        );

        // Asegurar visibilidad y hacer clic
        await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", botonModelo);
        await driver.wait(until.elementIsVisible(botonModelo), 10000);
        await driver.sleep(500); // por animaciones
        await botonModelo.click();

        console.log("✅ Clic en el botón del campo 'Modelo' realizado correctamente.");
        await driver.sleep(1000);

      } catch (error) {
        throw new Error(`❌ Error en paso 29 (clic en botón 'Modelo'): ${error.message}`);
      }

      // === Paso 29: Seleccionar fila con ID 1123 y nombre "PIBA" ===
      try {
        // Esperar el modal que contiene la tabla
        const modalModelo = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-dialog-dialog-picklist-model"]/div/div')),
          10000
        );

        // Esperar a que el cuerpo de la tabla esté disponible
        const tablaModeloBody = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="grid-table-crud-grid-model"]/div/div[2]/table/tbody')),
          10000
        );

        // Buscar la fila con ID 1123
        const filaModelo1123 = await tablaModeloBody.findElement(By.css('tr#row-1123'));

        // Buscar la celda con el ID (usualmente el primer td)
        const celdaIdModelo = await filaModelo1123.findElement(By.css('td#id'));

        // Hacer scroll hacia arriba en el contenedor visible
        const contenedorScroll = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="grid-table-crud-grid-model"]/div/div[2]')),
          10000
        );
        await driver.executeScript("arguments[0].scrollTop = 0;", contenedorScroll); // Hacia arriba
        await driver.sleep(500); // Pausa para animación

        // Scroll específico al elemento
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", celdaIdModelo);
        await driver.sleep(500);

        // Hacer clic en la celda
        await driver.executeScript("arguments[0].click();", celdaIdModelo);
        await driver.sleep(1000); // Tiempo para que se aplique clase 'active'

        // Validar clase activa
        const claseActiva = await filaModelo1123.getAttribute("class");
        if (!claseActiva.includes("active")) {
          throw new Error("❌ La fila con ID '1123' no fue marcada como activa.");
        }

        console.log("✅ Paso 29: Registro PIBA (ID 1123) seleccionado correctamente.");
      } catch (error) {
        throw new Error(`❌ Error en paso 29 (seleccionar registro PIBA): ${error.message}`);
      }

      // === Paso 30: Clic en el botón "Seleccionar" del modal de Modelo ===
      try {
        // Esperar a que el footer del modal esté presente
        const footerModelo = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-dialog-dialog-picklist-model"]/div/div/div[3]')),
          10000
        );

        // Localizar el botón "Seleccionar"
        const botonSeleccionarModelo = await footerModelo.findElement(
          By.xpath('//*[@id="widget-button-btSelect-model"]/div')
        );

        // Esperar que sea visible y habilitado
        await driver.wait(until.elementIsVisible(botonSeleccionarModelo), 5000);
        await driver.wait(until.elementIsEnabled(botonSeleccionarModelo), 5000);

        // Scroll al botón y clic
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonSeleccionarModelo);
        await driver.sleep(500);
        await botonSeleccionarModelo.click();
        await driver.sleep(3000);

        console.log("✅ Paso 30: Botón 'Seleccionar' del modal de Modelo clickeado correctamente.");
      } catch (error) {
        throw new Error(`❌ Error en paso 30 (clic en botón 'Seleccionar' en Modelo): ${error.message}`);
      }

      // === Paso 31: Diligenciar campo "Nombre" con formato TEST_AUT_OLT_0X ===
      try {
        // Esperar el contenedor del input
        const contenedorNombre = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-textfield-name"]')),
          10000
        );

        // Localizar el input del nombre
        const inputNombre = await contenedorNombre.findElement(
          By.xpath('//*[@id="textfield-name"]')
        );

        // Generar valor con número aleatorio del 1 al 9
        const numeroAleatorio = Math.floor(Math.random() * 9) + 1; // 1 al 9
        const nombreGenerado = `TEST_AUT_OLT_0${numeroAleatorio}`;

        // Limpiar el campo antes de escribir
        await inputNombre.clear();
        await driver.sleep(300); // breve pausa

        // Ingresar el valor generado
        await inputNombre.sendKeys(nombreGenerado);
        await driver.sleep(2000);

        console.log(`✅ Paso 31: Campo 'Nombre' diligenciado con: ${nombreGenerado}`);
      } catch (error) {
        throw new Error(`❌ Error en paso 31 (diligenciar campo Nombre): ${error.message}`);
      }

      // === Paso 32: Diligenciar campo "Descripción" con el mismo valor del campo "Nombre" ===
      try {
        // Localizar directamente el input del nombre para obtener su valor
        const inputNombre = await driver.findElement(By.xpath('//*[@id="textfield-name"]'));
        const valorNombre = await inputNombre.getAttribute("value");

        // Esperar el contenedor del campo descripción
        const contenedorDescripcion = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-textfield-description"]')),
          10000
        );

        // Localizar el input de descripción
        const inputDescripcion = await contenedorDescripcion.findElement(
          By.xpath('//*[@id="textfield-description"]')
        );

        // Limpiar el campo antes de escribir
        await inputDescripcion.clear();
        await driver.sleep(300); // Pausa corta

        // Ingresar el valor del nombre en la descripción
        await inputDescripcion.sendKeys(valorNombre);
        await driver.sleep(2000);

        console.log(`✅ Paso 32: Campo 'Descripción' diligenciado con: ${valorNombre}`);
      } catch (error) {
        throw new Error(`❌ Error en paso 32 (diligenciar campo Descripción): ${error.message}`);
      }

      // === Paso 33: Diligenciar campo "Ícono" con valor fijo ===
      try {
        const valorIcono = "img/icons_entity/ico-sub-comp-internal-storage.png";

        // Esperar el contenedor del campo ícono
        const contenedorIcono = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-textfield-icon"]')),
          10000
        );

        // Localizar el input del campo ícono
        const inputIcono = await contenedorIcono.findElement(
          By.xpath('//*[@id="textfield-icon"]')
        );

        // Limpiar campo antes de escribir
        await inputIcono.clear();
        await driver.sleep(300); // Pausa breve

        // Escribir valor
        await inputIcono.sendKeys(valorIcono);
        await driver.sleep(2000);

        console.log(`✅ Paso 33: Campo 'Ícono' diligenciado con: ${valorIcono}`);
      } catch (error) {
        throw new Error(`❌ Error en paso 33 (diligenciar campo Ícono): ${error.message}`);
      }

      // === Paso 34: Clic en botón del campo "Localidad" ===
      try {
        // Esperar el contenedor del campo "Localidad"
        const contenedorLocalidad = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-picklocation-location"]')),
          10000
        );

        // Buscar el botón dentro del contenedor
        const botonLocalidad = await contenedorLocalidad.findElement(
          By.xpath('//*[@id="widget-picklocation-location"]/div[1]/span/button')
        );

        // Asegurarse de que sea visible
        await driver.wait(until.elementIsVisible(botonLocalidad), 5000);
        await driver.wait(until.elementIsEnabled(botonLocalidad), 5000);

        // Hacer scroll y clic
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonLocalidad);
        await driver.sleep(500); // Pausa por animación o transición

        await botonLocalidad.click();
        await driver.sleep(2000);

        console.log("✅ Paso 34: Clic en el botón del campo 'Localidad' realizado con éxito.");
      } catch (error) {
        throw new Error(`❌ Error en paso 34 (clic en botón Localidad): ${error.message}`);
      }

      // === Paso 35: Clic en el botón "Seleccionar" del modal de Localidad ===
      try {
        // Esperar a que aparezca el contenedor del modal de localidad
        const modalLocalidad = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-dialog-dialog-picklocation-location"]/div/div')),
          10000
        );

        // Esperar el footer del modal donde está el botón "Seleccionar"
        const footerModalLocalidad = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-dialog-dialog-picklocation-location"]/div/div/div[3]')),
          10000
        );

        // Localizar el botón "Seleccionar"
        const botonSeleccionarLocalidad = await footerModalLocalidad.findElement(
          By.xpath('//*[@id="widget-button-btSelect"]/div')
        );

        // Esperar a que sea visible y habilitado
        await driver.wait(until.elementIsVisible(botonSeleccionarLocalidad), 5000);
        await driver.wait(until.elementIsEnabled(botonSeleccionarLocalidad), 5000);

        // Hacer scroll y clic
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonSeleccionarLocalidad);
        await driver.sleep(500);

        await botonSeleccionarLocalidad.click();
        await driver.sleep(2000);

        console.log("✅ Paso 35: Clic en botón 'Seleccionar' del modal de localidad realizado con éxito.");
      } catch (error) {
        throw new Error(`❌ Error en paso 35 (clic en botón 'Seleccionar' de localidad): ${error.message}`);
      }
      // === Paso 36: Clic en el botón "Aceptar" del modal de configuración masiva de agente ===
      try {
        // Esperar a que aparezca el contenedor del modal
        const modalConfiguracionAgente = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-dialog-dialog-filter-massive-agents"]/div/div')),
          10000
        );

        // Esperar a que el footer del modal esté presente
        const footerModalConfiguracion = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-dialog-dialog-filter-massive-agents"]/div/div/div[3]')),
          10000
        );

        // Buscar el botón "Aceptar" en el footer
        const botonAceptarConfiguracion = await footerModalConfiguracion.findElement(
          By.xpath('//*[@id="widget-button-btn-acept-massive-agent"]/div')
        );

        // Asegurarse de que el botón sea visible y esté habilitado
        await driver.wait(until.elementIsVisible(botonAceptarConfiguracion), 5000);
        await driver.wait(until.elementIsEnabled(botonAceptarConfiguracion), 5000);

        // Hacer scroll al botón y dar clic
        await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", botonAceptarConfiguracion);
        await driver.sleep(500);
        await botonAceptarConfiguracion.click();
        await driver.sleep(1000); // Espera ligera tras la acción

        console.log("✅ Paso 36: Se hizo clic en el botón 'Aceptar' del modal de configuración masiva de agente.");
      } catch (error) {
        throw new Error(`❌ Error en paso 36 (clic en botón 'Aceptar'): ${error.message}`);
      }



    } catch (error) {
      console.error("❌ Error en Explorador de Entidades:", error.message);
      const screenshot = await driver.takeScreenshot();
      const carpetaErrores = path.resolve(__dirname, '../errores');
      if (!fs.existsSync(carpetaErrores)) fs.mkdirSync(carpetaErrores);
      const filePath = path.join(carpetaErrores, `error_exploradorEntidades_${Date.now()}.png`);
      fs.writeFileSync(filePath, screenshot, 'base64');
      throw error;
    }
  }
}
