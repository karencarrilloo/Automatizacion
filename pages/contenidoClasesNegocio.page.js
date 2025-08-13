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

  async ejecutarContenidoClasesNegocio() {
    const driver = this.driver;

    try {
      // === CP_CONTCLANEG_001 - Validar el ingreso a la vista “Contenido clases de negocio” se muestre la información correctamente ===
      // === CP_CONTCLANEG_001 Paso 1: Clic en módulo eCenter ===
      const eCenterBtn = await driver.wait(
        until.elementLocated(By.xpath("//div[@id='118' and contains(@class, 'item-module')]")),
        10000
      );
      await driver.executeScript("arguments[0].click();", eCenterBtn);
      await driver.sleep(1000);

      // === CP_CONTCLANEG_001 Paso 2: Scroll en el contenedor de aplicaciones ===
      const scrollContainer = await driver.wait(
        until.elementLocated(By.css('.container-applications')),
        10000
      );
      await driver.executeScript(
        "arguments[0].scrollTop = arguments[0].scrollHeight;",
        scrollContainer
      );
      await driver.sleep(1000);

      // === CP_CONTCLANEG_001 Paso 3: Clic en "Contenido clases de negocio" ===
      const contenidoBtn = await driver.wait(
        until.elementLocated(By.xpath("//div[contains(@class,'legend-application') and contains(text(),'Contenido clases de negocio')]")),
        10000
      );
      await driver.executeScript("arguments[0].scrollIntoView({behavior:'smooth', block:'center'});", contenidoBtn);
      await driver.wait(until.elementIsVisible(contenidoBtn), 10000);
      await driver.wait(until.elementIsEnabled(contenidoBtn), 10000);
      await driver.sleep(1000);
      await driver.executeScript("arguments[0].click();", contenidoBtn);
      await driver.sleep(5000);

      // Aquí podrías continuar con otros pasos si aplica

      // === CP_CONTCLANEG_002 - Seleccionar una entidad (Modelos).
      // CP_CONTCLANEG_002 Paso 1: Clic en el botón de la tabla para desplegar la lista de clases de negocio ===
      const botonPicklist = await driver.wait(
        until.elementLocated(By.css('button.btn.btn-default.picklist-btn')),
        10000
      );

      // Asegura visibilidad antes de interactuar
      await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", botonPicklist);
      await driver.sleep(500); // Espera breve por animaciones

      // Verifica si está visible y habilitado
      const visible = await botonPicklist.isDisplayed();
      const habilitado = await botonPicklist.isEnabled();

      if (!visible || !habilitado) {
        throw new Error('❌ El botón picklist no está visible o habilitado.');
      }

      // Clic en el botón para abrir el modal de opciones
      await driver.executeScript("arguments[0].click();", botonPicklist);
      await driver.sleep(3000); // Espera por la carga del contenido

      // === CP_CONTCLANEG_002 Paso 2: Seleccionar la entidad con ALIAS "Modelos" ===

      const tablaCuerpo = await driver.wait(
        until.elementLocated(By.css('div.modal-body table tbody')),
        10000
      );

      // Esperar la fila con ID 31
      const filaEntidad31 = await driver.wait(
        until.elementLocated(By.css('tr#row-31')),
        10000
      );

      // Buscar la primera celda (<td>) de la fila
      const celdaSeleccion = await filaEntidad31.findElement(By.css('td#id'));

      // Hacer scroll y clic en la celda para activar la fila
      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", celdaSeleccion);
      await driver.sleep(500); // Breve pausa
      await driver.executeScript("arguments[0].click();", celdaSeleccion);

      // Verificar visualmente que se marcó (opcional)
      const claseFila = await filaEntidad31.getAttribute("class");
      if (!claseFila.includes("active")) {
        throw new Error("❌ La fila con ID 31 no fue marcada como activa tras el clic.");
      }

      // console.log('✅ Fila con ID 31 seleccionada correctamente.');
      await driver.sleep(3000);


      // ===CP_CONTCLANEG_002 Paso 3: Clic en el botón "Seleccionar" ===

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

      // === CP_CONTCLANEG_003 - Crear un modelo.
      // === CP_CONTCLANEG_003 Paso 1: Clic en el botón "+" (Nuevo) ===

      const botonAgregar = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="crud-new-btn"]')),
        10000
      );

      // Asegurar visibilidad y scroll
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonAgregar);
      await driver.sleep(500);

      // Clic confiable con JavaScript
      await driver.executeScript("arguments[0].click();", botonAgregar);

      // console.log('✅ Se hizo clic en el botón "+" correctamente.');
      await driver.sleep(5000);

      // === CP_CONTCLANEG_003 Paso 2: Clic en el botón del campo "Fabricante" ===

      const btnFabricante = await driver.wait(
        until.elementLocated(By.css('#widget-picklist-manufacturer button.picklist-btn')),
        10000
      );

      // Scroll al botón (opcional si está oculto)
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnFabricante);
      await driver.sleep(500);

      // Clic en el botón
      await driver.executeScript("arguments[0].click();", btnFabricante);
      await driver.sleep(5000);

      // console.log('✅ Se hizo clic en el botón del campo "Fabricante".');

      // === CP_CONTCLANEG_003 Paso 3: Seleccionar fila del fabricante con ID "1"(HUAWEI) ===

      // Esperar que el contenedor del modal esté presente
      const contenedorModalFabricante = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-dialog-dialog-picklist-manufacturer"]/div/div')),
        10000
      );

      // Esperar que el cuerpo de la tabla esté presente dentro del modal
      const tablaBodyFabricante = await driver.wait(
        until.elementLocated(By.css('#grid-table-crud-grid-manufacturer tbody')),
        10000
      );

      // Localizar la fila con ID 1
      const filaHUAWEI = await tablaBodyFabricante.findElement(By.css('tr#row-1'));

      // Buscar la primera celda (usualmente la que tiene el ID visible)
      const celdaIdHUAWEI = await filaHUAWEI.findElement(By.css('td#id'));

      // Scroll usando el contenedor modal
      await driver.executeScript(
        "arguments[0].scrollTop = arguments[1].offsetTop;",
        contenedorModalFabricante,
        filaHUAWEI
      );

      await driver.sleep(500); // Espera ligera para scroll

      // Clic en la celda para seleccionar
      await driver.executeScript("arguments[0].click();", celdaIdHUAWEI);

      // Verificación de selección visual por clase 'active'
      const claseSeleccionada = await filaHUAWEI.getAttribute("class");
      if (!claseSeleccionada.includes("active")) {
        throw new Error("❌ La fila con ID '1' no fue marcada como activa.");
      }

      // console.log("✅ Fabricante 'HUAWEI' seleccionado correctamente.");
      await driver.sleep(1500);

      // === CP_CONTCLANEG_003 Paso 4: Clic en el botón "Seleccionar" tras elegir fabricante ===

      const botonSeleccionarFabricante = await driver.wait(
        until.elementLocated(By.css('#widget-button-btSelect-manufacturer .btn.btn-primary')),
        10000
      );

      // Esperar a que el botón sea visible
      await driver.wait(until.elementIsVisible(botonSeleccionarFabricante), 10000);

      // Esperar a que el botón esté habilitado
      await driver.wait(async () => {
        const disabledAttr = await botonSeleccionarFabricante.getAttribute('disabled');
        const classAttr = await botonSeleccionarFabricante.getAttribute('class');
        return !disabledAttr && !classAttr.includes('disabled');
      }, 10000, '❌ El botón "Seleccionar" no se habilitó a tiempo.');

      // Scroll hacia el botón y clic
      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", botonSeleccionarFabricante);
      await driver.sleep(500); // Pausa corta
      await driver.executeScript("arguments[0].click();", botonSeleccionarFabricante);

      await driver.sleep(3000); // Espera después del clic
      // console.log('✅ Clic exitoso en botón "Seleccionar" de fabricante.');

      // === CP_CONTCLANEG_003 Paso 5: Diligenciar el campo "Nombre" con "TEST CREAR" ===

      const inputNombre = await driver.wait(
        until.elementLocated(By.id('textfield-name')),
        10000
      );

      // Asegurar que sea visible antes de interactuar
      await driver.wait(until.elementIsVisible(inputNombre), 10000);

      // Scroll para que esté visible en viewport
      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", inputNombre);
      await driver.sleep(500); // Pausa breve

      // Limpiar campo y escribir TEST
      await inputNombre.clear();
      await inputNombre.sendKeys('TEST CREAR');
      await driver.sleep(3000);

      // console.log('✅ Campo "Nombre" diligenciado con "TEST".');

      // === CP_CONTCLANEG_003 Paso 6: Diligenciar el campo "Cantidad de slots" con número aleatorio ===

      // Generar número aleatorio entre 1 y 50
      const cantidadAleatoria = Math.floor(Math.random() * 50) + 1;

      const inputSlots = await driver.wait(
        until.elementLocated(By.id('textfield-numberofslots')),
        10000
      );

      // Esperar a que sea visible
      await driver.wait(until.elementIsVisible(inputSlots), 10000);

      // Scroll al campo
      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", inputSlots);
      await driver.sleep(500); // Breve pausa

      // Limpiar y escribir el número generado
      await inputSlots.clear();
      await inputSlots.sendKeys(cantidadAleatoria.toString());
      await driver.sleep(3000);

      // console.log(`✅ Campo "Cantidad de slots" diligenciado con el valor: ${cantidadAleatoria}`);

      // === CP_CONTCLANEG_003 Paso 7: Clic en el botón del campo "Tipo" ===

      const botonTipo = await driver.wait(
        until.elementLocated(By.css('#widget-picklist-type .picklist-btn')),
        10000
      );

      // Esperar a que esté visible
      await driver.wait(until.elementIsVisible(botonTipo), 10000);

      // Hacer scroll y clic
      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", botonTipo);
      await driver.sleep(500); // Pausa por animación

      await driver.executeScript("arguments[0].click();", botonTipo);
      await driver.sleep(5000);

      // console.log('✅ Botón del campo "Tipo" clickeado correctamente.');

      // === CP_CONTCLANEG_003 Paso 8: Seleccionar tipo con NOMBRE "ELEMENTO TERCIARIO - GADGETS" dentro del modal ===

      const modalTipo = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-dialog-dialog-picklist-type"]/div/div')),
        10000
      );

      // Esperar el tbody dentro del modal
      const tablaTipoCuerpo = await modalTipo.findElement(By.css('table tbody'));

      // Localizar la fila con ID 21
      const filaTipo21 = await tablaTipoCuerpo.findElement(By.css('tr#row-21'));

      // Buscar la celda con id="id"
      const celdaTipo21 = await filaTipo21.findElement(By.css('td#id'));

      // Hacer scroll y clic sobre la celda
      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", celdaTipo21);
      await driver.sleep(500);
      await driver.executeScript("arguments[0].click();", celdaTipo21);

      // Validar que la clase sea "active"
      const claseSeleccionadaTipo = await filaTipo21.getAttribute("class");
      if (!claseSeleccionadaTipo.includes("active")) {
        throw new Error("❌ No se marcó como activa la fila con ID 21 después del clic.");
      }

      // console.log("✅ Fila con ID 21 seleccionada correctamente.");
      await driver.sleep(1000);

      // === CP_CONTCLANEG_003 Paso 9: Clic en el botón "Seleccionar" del modal de tipo ===

      const contenedorBtnSeleccionarTipo = await driver.wait(
        until.elementLocated(By.id("widget-button-btSelect-type")),
        10000
      );

      // Buscar el botón interno dentro del contenedor
      const btnSeleccionarTipo = await contenedorBtnSeleccionarTipo.findElement(By.css("div.btn.btn-primary"));

      // Esperar que el botón esté visible
      await driver.wait(until.elementIsVisible(btnSeleccionarTipo), 10000);

      // Verificar que no esté deshabilitado
      await driver.wait(async () => {
        const disabledAttr = await btnSeleccionarTipo.getAttribute('disabled');
        const classAttr = await btnSeleccionarTipo.getAttribute('class');
        return !disabledAttr && !classAttr.includes('disabled');
      }, 10000, '❌ El botón "Seleccionar" no se habilitó a tiempo.');

      // Scroll al botón y clic
      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", btnSeleccionarTipo);
      await driver.sleep(500);
      await driver.executeScript("arguments[0].click();", btnSeleccionarTipo);

      // console.log("✅ Clic realizado en el botón 'Seleccionar' del modal tipo.");
      await driver.sleep(3000);


      // === CP_CONTCLANEG_003 Paso 10: Diligenciar el campo "Descripción" ===

      const inputDescripcion = await driver.wait(
        until.elementLocated(By.id('textfield-description')),
        10000
      );

      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", inputDescripcion);
      await driver.sleep(500);

      await inputDescripcion.clear(); // Por si ya tiene algo
      await inputDescripcion.sendKeys("TEST CREAR");

      // console.log("✅ Campo 'Descripción' diligenciado con 'TEST'");
      await driver.sleep(1000);

      // === CP_CONTCLANEG_003 Paso 11: Diligenciar campo "Ícono" ===

      const inputIcono = await driver.wait(
        until.elementLocated(By.id('textfield-icon')),
        10000
      );

      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", inputIcono);
      await driver.sleep(500);

      await inputIcono.clear();
      await inputIcono.sendKeys("img/icons_entity/ico-cat-infra-rfid-&-sensors.png");

      // console.log("✅ Campo 'Ícono' diligenciado correctamente.");
      await driver.sleep(3000);

      // === CP_CONTCLANEG_003 Paso 12: Clic en el botón del campo "Localidad" ===

      const btnLocalidad = await driver.wait(
        until.elementLocated(By.css('button.picklocation-btn')),
        10000
      );

      // Hacer scroll al botón si es necesario
      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", btnLocalidad);
      await driver.sleep(500);

      // Ejecutar clic con JavaScript (por si tiene overlays)
      await driver.executeScript("arguments[0].click();", btnLocalidad);

      // console.log("✅ Botón de 'Localidad' clicado correctamente.");
      await driver.sleep(3000); // Tiempo para que cargue el modal o panel

      // === CP_CONTCLANEG_003 Paso 13: Clic en botón "Seleccionar" del modal de Localidad ===

      const modalLocalidad = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-dialog-dialog-picklocation-location"]/div/div')),
        10000
      );

      // Esperar hasta que esté visible
      await driver.wait(until.elementIsVisible(modalLocalidad), 10000);

      // Buscar el botón dentro del modal
      const btnSeleccionarLocalidad = await modalLocalidad.findElement(
        By.xpath(".//div[contains(@class, 'btn-primary') and contains(text(), 'Seleccionar')]")
      );

      // Esperar que esté visible
      await driver.wait(until.elementIsVisible(btnSeleccionarLocalidad), 10000);

      // Esperar que no esté deshabilitado
      await driver.wait(async () => {
        const disabledAttr = await btnSeleccionarLocalidad.getAttribute('disabled');
        const classAttr = await btnSeleccionarLocalidad.getAttribute('class');
        return !disabledAttr && !classAttr.includes('disabled');
      }, 10000, '❌ El botón "Seleccionar" del modal de localidad no está habilitado.');

      // Hacer scroll y clic
      await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", btnSeleccionarLocalidad);
      await driver.sleep(500);
      await driver.executeScript("arguments[0].click();", btnSeleccionarLocalidad);

      // console.log("✅ Se hizo clic en el botón 'Seleccionar' del modal de localidad.");
      await driver.sleep(3000);

      // === CP_CONTCLANEG_003 Paso 14: Clic en el botón "Guardar" ===

      const btnGuardar = await driver.wait(
        until.elementLocated(By.xpath("//div[contains(text(),'Guardar') and contains(@class, 'btn-primary')]")),
        10000,
        '❌ El botón "Guardar" no fue localizado a tiempo.'
      );

      // Esperar que sea visible
      await driver.wait(
        until.elementIsVisible(btnGuardar),
        10000,
        '❌ El botón "Guardar" no es visible.'
      );

      // Esperar que esté habilitado (no tenga atributo 'disabled' ni clase 'disabled')
      await driver.wait(async () => {
        const isDisabled = await btnGuardar.getAttribute('disabled');
        const classAttr = await btnGuardar.getAttribute('class');
        return !isDisabled && !classAttr.includes('disabled');
      }, 10000, '❌ El botón "Guardar" está deshabilitado.');

      // Hacer scroll para que esté en el viewport
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", btnGuardar);
      await driver.sleep(500); // Pequeña pausa por transición

      // Hacer clic con JavaScript para evitar interferencias
      await driver.executeScript("arguments[0].click();", btnGuardar);

      // console.log('✅ Se hizo clic en el botón "Guardar" correctamente.');
      await driver.sleep(5000); // Esperar posibles transiciones o validaciones

      // === CP_CONTCLANEG_004 - Editar modelo
      // === CP_CONTCLANEG_004 Paso 1: Clic en la barra de búsqueda ===

      try {
        // Esperar que la barra de búsqueda esté presente y visible
        const barraBusqueda = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="crud-search-bar"]')),
          10000
        );
        await driver.wait(until.elementIsVisible(barraBusqueda), 10000);

        // Hacer scroll hacia la barra (por si está fuera de vista)
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", barraBusqueda);
        await driver.sleep(500); // Pausa por animaciones

        // Clic en la barra de búsqueda
        await driver.executeScript("arguments[0].click();", barraBusqueda);

        await driver.sleep(1500);

        console.log("✅ Barra de búsqueda clickeada correctamente.");

      } catch (error) {
        throw new Error("❌ Error CP_CONTCLANEG_004 Paso 1 al hacer clic en la barra de búsqueda: " + error.message);
      }

      // === CP_CONTCLANEG_004 Paso 2: Digitar "TEST CREAR" en la barra de búsqueda y presionar Enter ===
      try {
        const inputBusquedaCrear = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="crud-search-bar"]')),
          10000
        );

        await driver.wait(until.elementIsVisible(inputBusquedaCrear), 10000);

        // Limpiar texto previo si lo hay
        await inputBusquedaCrear.clear();

        // Ingresar la palabra TEST y presionar Enter
        await inputBusquedaCrear.sendKeys('TEST CREAR', Key.ENTER);

        console.log('✅ Se digitó "TEST CREAR" en la barra de búsqueda y se presionó Enter.');
        await driver.sleep(3000); // Espera que cargue el resultado

      } catch (error) {
        throw new Error('❌ Error en el CP_CONTCLANEG_004 Paso 2 al escribir en la barra de búsqueda: ' + error.message);
      }


      // === CP_CONTCLANEG_004 Paso 3: Seleccionar registro con el campo "Identificador" mayor y validar campo "Nombre" ===

      try {
        // Scroll al contenedor principal
        const contenedorPrincipal = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="view-content-class"]/div[2]')),
          10000
        );
        await driver.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight;", contenedorPrincipal);
        await driver.sleep(1000);

        // Scroll al contenedor tabla
        const tablaContenedor = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="grid-table-crud-grid-crud-31"]/div/div[2]/table')),
          10000
        );
        await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", tablaContenedor);
        await driver.sleep(500);

        // Obtener tbody y filas
        const cuerpoTabla = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="grid-table-crud-grid-crud-31"]/div/div[2]/table/tbody')),
          10000
        );

        const filas = await cuerpoTabla.findElements(By.css('tr'));
        if (filas.length === 0) throw new Error('❌ No se encontraron filas.');

        let filaMayorId = null;
        let mayorId = -1;

        for (const fila of filas) {
          const celdaId = await fila.findElement(By.css('td#id'));
          const textoId = await celdaId.getText();
          const idNumero = parseInt(textoId.trim(), 10);

          if (!isNaN(idNumero) && idNumero > mayorId) {
            mayorId = idNumero;
            filaMayorId = fila;
          }
        }

        if (!filaMayorId) throw new Error('❌ No se pudo determinar la fila con el ID mayor.');

        // Clic sobre la celda de ID de la fila mayor
        const celdaIdSeleccion = await filaMayorId.findElement(By.css('td#id'));
        await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", celdaIdSeleccion);
        await driver.sleep(500);
        await driver.executeScript("arguments[0].click();", celdaIdSeleccion);
        await driver.sleep(1000);

        // Verificar que la clase 'active' se haya aplicado
        const claseSeleccionMayor = await filaMayorId.getAttribute("class");
        if (!claseSeleccionMayor.includes("active")) {
          throw new Error("❌ La fila con ID mayor no fue marcada como activa.");
        }

        // Validar campo "Nombre"
        const celdaNombre = await filaMayorId.findElement(By.css('td#name'));
        const textoNombre = await celdaNombre.getText();
        if (textoNombre.trim() !== "TEST CREAR") {
          throw new Error(`❌ El campo 'Nombre' no es 'TEST CREAR', es '${textoNombre}'.`);
        }

        console.log(`✅ Fila con ID mayor (${mayorId}) seleccionada y validada correctamente.`);

      } catch (error) {
        console.error(`❌ Error en CP_CONTCLANEG_004 paso3: ${error.message}`);
        throw error;
      }

      // === CP_CONTCLANEG_004 Paso 4: Clic en botón Editar ===

      try {
        // Esperar a que el contenedor del botón esté presente
        const contenedorBotonEditar = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="crud-crud-31"]/div/div[1]')),
          10000
        );
        await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", contenedorBotonEditar);
        await driver.sleep(500); // Pausa para asegurar visibilidad

        // Esperar el botón "Editar"
        const botonEditar = await driver.wait(
          until.elementLocated(By.id('crud-edit-btn')),
          10000
        );

        // Verificar visibilidad y estado
        await driver.wait(until.elementIsVisible(botonEditar), 10000);
        await driver.wait(until.elementIsEnabled(botonEditar), 10000);

        // Hacer clic en el botón
        await driver.executeScript("arguments[0].click();", botonEditar);
        // console.log('✅ Se hizo clic en el botón "Editar".');
        await driver.sleep(8000);// Esperar apertura de modal de edición

      } catch (error) {
        console.error(`❌ Error en CP_CONTCLANEG_004 Paso 4 (clic en botón Editar): ${error.message}`);
        throw error;
      }

      // === CP_CONTCLANEG_004 Paso 5: Clic en el botón del campo "Fabricante" (modo edición) ===

      try {
        // Esperar el botón con clase específica en el contexto del formulario
        const btnFabricanteEditar = await driver.wait(
          until.elementLocated(
            By.xpath("//div[contains(@id, 'widget-picklist-manufacturer')]//button[contains(@class, 'picklist-btn')]")
          ),
          10000
        );

        // Verificar que el botón esté visible y habilitado
        await driver.wait(until.elementIsVisible(btnFabricanteEditar), 10000);
        await driver.wait(until.elementIsEnabled(btnFabricanteEditar), 10000);

        // Hacer scroll y clic en el botón
        await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", btnFabricanteEditar);
        await driver.sleep(500); // Breve espera para estabilidad
        await driver.executeScript("arguments[0].click();", btnFabricanteEditar);

        // console.log("✅ Se hizo clic en el botón del campo Fabricante (modo edición).");
        await driver.sleep(3000); // Esperar apertura del modal

      } catch (error) {
        console.error(`❌ Error en CP_CONTCLANEG_004 Paso 5: (clic botón Fabricante edición): ${error.message}`);
        throw error;
      }


      // === CP_CONTCLANEG_004 Paso 6: Seleccionar fila del fabricante con ID "2" (FIBERHOME) ===

      const contenedorModalFabricanteEditar = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-dialog-dialog-picklist-manufacturer"]/div/div')),
        10000
      );

      const tablaBodyFabricanteEditar = await driver.wait(
        until.elementLocated(By.css('#grid-table-crud-grid-manufacturer tbody')),
        10000
      );

      // Localizar la fila con ID 2
      const filaFIBERHOME = await tablaBodyFabricanteEditar.findElement(By.css('tr#row-2'));

      // Buscar la primera celda (ID)
      const celdaIdFIBERHOME = await filaFIBERHOME.findElement(By.css('td#id'));

      // Scroll usando el contenedor modal
      await driver.executeScript(
        "arguments[0].scrollTop = arguments[1].offsetTop;",
        contenedorModalFabricanteEditar,
        filaFIBERHOME
      );

      await driver.sleep(2000); // Espera por animación

      // Clic para seleccionar
      await driver.executeScript("arguments[0].click();", celdaIdFIBERHOME);

      // Validar que quedó seleccionada
      const claseFilaFIBERHOME = await filaFIBERHOME.getAttribute("class");
      if (!claseFilaFIBERHOME.includes("active")) {
        throw new Error("❌ Error CP_CONTCLANEG_004 Paso 6: La fila con ID '2' no fue marcada como activa.");
      }

      console.log("✅ Fila 'FIBERHOME' seleccionada correctamente.");

      // === CP_CONTCLANEG_004 Paso 7: Clic en el botón "Seleccionar" del modal Fabricante ===

      try {
        // Esperar a que el botón esté presente en el DOM
        const botonSeleccionarFabricante = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-button-btSelect-manufacturer"]/div')),
          10000
        );

        // Esperar a que el botón sea visible
        await driver.wait(until.elementIsVisible(botonSeleccionarFabricante), 10000);

        // Verificar que no esté deshabilitado por clase
        await driver.wait(async () => {
          const disabledAttr = await botonSeleccionarFabricante.getAttribute('disabled');
          const classAttr = await botonSeleccionarFabricante.getAttribute('class');
          return !disabledAttr && !classAttr.includes('disabled');
        }, 10000, '❌ El botón "Seleccionar" del modal Fabricante no se habilitó a tiempo.');

        // Scroll al botón si está fuera del viewport
        await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", botonSeleccionarFabricante);
        await driver.sleep(500); // Espera por transición

        // Clic en el botón
        await driver.executeScript("arguments[0].click();", botonSeleccionarFabricante);
        // console.log('✅ Se hizo clic en el botón "Seleccionar" del modal Fabricante.');

        await driver.sleep(5000); // Espera por cierre del modal

      } catch (error) {
        throw new Error("❌ Error CP_CONTCLANEG_004 Paso 7 al hacer clic en el botón 'Seleccionar' del modal Fabricante: " + error.message);
      }

      // === CP_CONTCLANEG_004 Paso 8: Limpiar y diligenciar el campo "Nombre" con "TEST EDITAR" ===

      try {
        // Esperar el campo de nombre dentro del widget
        const inputNombre = await driver.wait(
          until.elementLocated(By.css('#widget-textfield-name input')),
          10000
        );

        // Hacer scroll por si está fuera de vista
        await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", inputNombre);
        await driver.sleep(500); // Pausa para scroll

        // Limpiar el campo y escribir nuevo valor
        await inputNombre.clear();
        await inputNombre.sendKeys("TEST EDITAR");
        await driver.sleep(5000);

        // console.log('✅ Campo "Nombre" diligenciado con "TEST EDITAR".');
      } catch (error) {
        throw new Error("❌ Error en el CP_CONTCLANEG_004 Paso 8 al diligenciar el campo 'Nombre': " + error.message);
      }

      // === CP_CONTCLANEG_004 Paso 9: Limpiar y diligenciar el campo "Cantidad de slots" con valor aleatorio entre 51 y 100 ===

      try {
        // Esperar el campo input dentro del widget del slot
        const inputSlots = await driver.wait(
          until.elementLocated(By.css('#widget-textfield-numberofslots input')),
          10000
        );

        // Hacer scroll al campo
        await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", inputSlots);
        await driver.sleep(500); // Breve pausa

        // Generar número aleatorio entre 51 y 100
        const cantidadAleatoria = Math.floor(Math.random() * 50) + 51;

        // Limpiar campo y diligenciar valor
        await inputSlots.clear();
        await inputSlots.sendKeys(cantidadAleatoria.toString());
        await driver.sleep(5000);

        // console.log(`✅ Campo "Cantidad de slots" diligenciado con: ${cantidadAleatoria}`);
      } catch (error) {
        throw new Error("❌ Error en el CP_CONTCLANEG_004 Paso 9 al diligenciar el campo 'Cantidad de slots': " + error.message);
      }

      // === CP_CONTCLANEG_004 Paso 10: Dar clic en el botón del campo "Tipo" ===

      try {
        // Esperar el botón del campo "Tipo"
        const botonTipo = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-picklist-type"]/div[1]/span[2]/button')),
          10000
        );

        // Asegurar visibilidad en viewport
        await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", botonTipo);
        await driver.sleep(500); // Pausa por posibles animaciones

        // Hacer clic usando JS
        await driver.executeScript("arguments[0].click();", botonTipo);
        await driver.sleep(3000); // Esperar apertura del modal

        console.log("✅ Clic realizado en el botón del campo 'Tipo'.");
      } catch (error) {
        throw new Error("❌ Error en CP_CONTCLANEG_004 Paso 10: al hacer clic en el botón del campo 'Tipo': " + error.message);
      }

      // === CP_CONTCLANEG_004 Paso 11: Seleccionar fila con ID 1 (ELEMENTO PRIMARIO - ACCESO) ===

      try {
        // Esperar el modal contenedor del listado
        const modalTipo = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-dialog-dialog-picklist-type"]/div/div')),
          10000
        );

        // Esperar a que el cuerpo de la tabla esté presente
        const tablaTipo = await driver.wait(
          until.elementLocated(By.css('#grid-table-crud-grid-type tbody')),
          10000
        );

        // Buscar la fila con ID 1
        const filaTipo = await tablaTipo.findElement(By.css('tr#row-1'));

        // Buscar la celda ID dentro de la fila
        const celdaTipo = await filaTipo.findElement(By.css('td#id'));

        // Hacer scroll dentro del modal hasta la fila
        await driver.executeScript(
          "arguments[0].scrollTop = arguments[1].offsetTop;",
          modalTipo,
          filaTipo
        );

        await driver.sleep(500); // Breve pausa por scroll

        // Clic sobre la celda para seleccionar
        await driver.executeScript("arguments[0].click();", celdaTipo);

        // Verificar si quedó seleccionada con la clase 'active'
        const claseTipoSeleccionada = await filaTipo.getAttribute("class");
        if (!claseTipoSeleccionada.includes("active")) {
          throw new Error("❌ La fila con ID '1' no fue marcada como activa.");
        }

        console.log("✅ Fila con ID 1 (ELEMENTO PRIMARIO - ACCESO) seleccionada correctamente.");
        await driver.sleep(2500);
      } catch (error) {
        throw new Error("❌ Error en CP_CONTCLANEG_004 Paso 11 al seleccionar fila con ID 1: " + error.message);
      }

      // === CP_CONTCLANEG_004 Paso 12: Clic en el botón "Seleccionar" del modal de Tipo ===

      try {
        // Esperar el botón dentro del modal
        const botonSeleccionarTipo = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-button-btSelect-type"]/div')),
          10000
        );

        // Esperar que sea visible
        await driver.wait(until.elementIsVisible(botonSeleccionarTipo), 10000);

        // Esperar que no esté deshabilitado
        await driver.wait(async () => {
          const disabledAttr = await botonSeleccionarTipo.getAttribute('disabled');
          const classAttr = await botonSeleccionarTipo.getAttribute('class');
          return !disabledAttr && !classAttr.includes('disabled');
        }, 10000, '❌ El botón "Seleccionar" del modal Tipo no se habilitó a tiempo.');

        // Hacer scroll si es necesario
        await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", botonSeleccionarTipo);
        await driver.sleep(500); // Espera ligera por si hay transición

        // Clic usando JavaScript
        await driver.executeScript("arguments[0].click();", botonSeleccionarTipo);

        console.log("✅ Botón 'Seleccionar' del modal Tipo fue clickeado exitosamente.");
        await driver.sleep(3000); // Espera por cierre de modal y procesamiento

      } catch (error) {
        throw new Error("❌ Error en CP_CONTCLANEG_004 Paso 12: al hacer clic en el botón 'Seleccionar': " + error.message);
      }

      // === CP_CONTCLANEG_004 Paso 13: Limpiar y diligenciar el campo "Descripción" con "TEST EDITAR" ===

      try {
        const contenedorDescripcion = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-textfield-description"]')),
          10000
        );

        // Buscar el input dentro del contenedor
        const inputDescripcion = await contenedorDescripcion.findElement(By.css('input.form-control'));

        // Asegurarse de que esté visible
        await driver.wait(until.elementIsVisible(inputDescripcion), 10000);

        // Limpiar y escribir nuevo valor
        await inputDescripcion.clear();
        await inputDescripcion.sendKeys("TEST EDITAR");

        console.log("✅ Campo 'Descripción' diligenciado correctamente con 'TEST EDITAR'");
        await driver.sleep(1000); // Pausa breve para estabilidad

      } catch (error) {
        throw new Error("❌ Error en CP_CONTCLANEG_004 Paso 13 al diligenciar el campo 'Descripción': " + error.message);
      }

      // === CP_CONTCLANEG_004 Paso 14 Clic en el botón "Guardar" en el formulario de edición ===

      try {
        // Esperar el contenedor del footer del modal
        const footerGuardar = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-dialog-dialog-crud-crud-31"]/div/div/div[3]')),
          10000
        );

        // Esperar el botón "Guardar" dentro del footer
        const botonGuardar = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="widget-button-btAction-crud-31"]/div')),
          10000
        );

        // Asegurar visibilidad
        await driver.wait(until.elementIsVisible(botonGuardar), 10000);

        // Hacer scroll hacia el botón
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonGuardar);
        await driver.sleep(500); // Pequeña pausa por animación

        // Clic en el botón
        await driver.executeScript("arguments[0].click();", botonGuardar);
        await driver.sleep(6000); // Tiempo de espera por transición/post-guardado

        console.log("✅ Botón 'Guardar' clickeado correctamente (Edición)");

      } catch (error) {
        throw new Error("❌ Error en CP_CONTCLANEG_004 Paso 14 al hacer clic en el botón 'Guardar': " + error.message);
      }
      // === CP_CONTCLANEG_005 - Eliminar el modelo
      // === CP_CONTCLANEG_005 Paso 1: Digitar "TEST EDITAR" en la barra de búsqueda y presionar Enter ===
      try {
        const inputBusquedaEditar = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="crud-search-bar"]')),
          10000
        );

        await driver.wait(until.elementIsVisible(inputBusquedaEditar), 10000);

        // Limpiar texto previo si lo hay
        await inputBusquedaEditar.clear();

        // Ingresar la palabra TEST y presionar Enter
        await inputBusquedaEditar.sendKeys('TEST EDITAR', Key.ENTER);

        console.log('✅ Se digitó "TEST EDITAR" en la barra de búsqueda y se presionó Enter.');
        await driver.sleep(3000); // Espera que cargue el resultado

      } catch (error) {
        throw new Error('❌ Error en CP_CONTCLANEG_004 Paso 15: al escribir en la barra de búsqueda: ' + error.message);
      }

      // === CP_CONTCLANEG_005 Paso 2: Seleccionar registro con el campo "Identificador" mayor y nombre "TEST EDITAR" ===

      try {
        // Scroll al contenedor principal
        const contenedorPrincipalBusqueda = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="view-content-class"]/div[2]')),
          10000
        );
        await driver.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight;", contenedorPrincipalBusqueda);
        await driver.sleep(1000);

        // Scroll al contenedor de la tabla
        const tablaContenedorBusqueda = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="grid-table-crud-grid-crud-31"]/div/div[2]/table')),
          10000
        );
        await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", tablaContenedorBusqueda);
        await driver.sleep(500);

        // Obtener el tbody y las filas
        const cuerpoTablaBusqueda = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="grid-table-crud-grid-crud-31"]/div/div[2]/table/tbody')),
          10000
        );

        const filasBusqueda = await cuerpoTablaBusqueda.findElements(By.css('tr'));
        if (filasBusqueda.length === 0) throw new Error('❌ No se encontraron filas tras la búsqueda.');

        let filaMayorIdBusqueda = null;
        let mayorIdBusqueda = -1;

        for (const fila of filasBusqueda) {
          const celdaId = await fila.findElement(By.css('td#id'));
          const celdaNombre = await fila.findElement(By.css('td#name'));

          const textoId = await celdaId.getText();
          const textoNombre = await celdaNombre.getText();

          const idNumero = parseInt(textoId.trim(), 10);

          if (
            !isNaN(idNumero) &&
            textoNombre.trim().toUpperCase() === "TEST EDITAR" &&
            idNumero > mayorIdBusqueda
          ) {
            mayorIdBusqueda = idNumero;
            filaMayorIdBusqueda = fila;
          }
        }

        if (!filaMayorIdBusqueda) throw new Error('❌ No se encontró ninguna fila con nombre "TEST EDITAR".');

        // Hacer clic sobre la celda del ID
        const celdaIdSeleccionBusqueda = await filaMayorIdBusqueda.findElement(By.css('td#id'));
        await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", celdaIdSeleccionBusqueda);
        await driver.sleep(500);
        await driver.executeScript("arguments[0].click();", celdaIdSeleccionBusqueda);
        await driver.sleep(1000);

        // Validar clase activa
        const claseActivaBusqueda = await filaMayorIdBusqueda.getAttribute("class");
        if (!claseActivaBusqueda.includes("active")) {
          throw new Error("❌ La fila con nombre 'TEST EDITAR' no fue marcada como activa.");
        }

        console.log(`✅ Fila con nombre "TEST EDITAR" y mayor ID (${mayorIdBusqueda}) seleccionada correctamente.`);

      } catch (error) {
        console.error(`❌ Error en CP_CONTCLANEG_005 Paso 2: ${error.message}`);
        throw error;
      }

      // === CP_CONTCLANEG_005 Paso 3: Clic en botón "Eliminar" con el registro seleccionado ===

      try {
        // Esperar que el botón "Eliminar" esté disponible
        const botonEliminar = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="crud-delete-btn"]')),
          10000
        );

        // Asegurarse de que esté visible
        await driver.wait(until.elementIsVisible(botonEliminar), 10000);

        // Hacer scroll y clic con JavaScript para evitar overlays
        await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", botonEliminar);
        await driver.sleep(500); // Espera ligera por animación
        await driver.executeScript("arguments[0].click();", botonEliminar);

        console.log("✅ Botón 'Eliminar' clickeado correctamente.");
        await driver.sleep(2000); // Esperar que aparezca la ventana de confirmación

      } catch (error) {
        console.error(`❌ Error en CP_CONTCLANEG_005 Paso 3: (clic en botón Eliminar): ${error.message}`);
        throw error;
      }

      // === CP_CONTCLANEG_005 Paso 4: Confirmar eliminación - clic en botón "Sí" en modal ===

      try {

        // Esperar a que el botón "Sí" esté presente y visible
        const botonConfirmarSi = await driver.wait(
          until.elementLocated(By.xpath("//div[@id='widget-button-btConfirmYes']/div[contains(text(),'Sí')]")),
          10000
        );

        await driver.wait(until.elementIsVisible(botonConfirmarSi), 10000);

        // Scroll hacia el botón
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonConfirmarSi);
        await driver.sleep(500); // Espera ligera

        // Hacer clic usando JS para evitar overlays
        await driver.executeScript("arguments[0].click();", botonConfirmarSi);

        console.log("✅ Se hizo clic en el botón 'Sí' del modal de confirmación.");
        await driver.sleep(3000); // Espera a que se procese la eliminación

      } catch (error) {
        console.error(`❌ Error al confirmar eliminación CP_CONTCLANEG_005 Paso 4:: ${error.message}`);
        throw error;
      }

      // === CP_CONTCLANEG_006 - Refrescar vista
      // === CP_CONTCLANEG_006 Paso 1: Clic en el botón "Refrescar" ===
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

      // === CP_CONTCLANEG_007 - generar reporte xls (opcion exportar todos los registros)
      // === CP_CONTCLANEG_007 Paso 1: Clic en el botón generar xls ===
      try {
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

      // === CP_CONTCLANEG_008 - Validar funcionamiento del paginador en la vista(Entidad planes comerciales)
      // CP_CONTCLANEG_008 Paso 1: Clic en botón que abre el modal de entidades ===
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

      // === CP_CONTCLANEG_009 - Realizar Filtro
      // === CP_CONTCLANEG_009 Paso 1: Seleccionar el primer registro de la tabla y capturar datos ===
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

        console.log("✅ CP_FILTRAR_002 Paso 1: Primer registro dinámico seleccionado correctamente.");
      } catch (error) {
        throw new Error(`❌ CP_FILTRAR_002 Paso 1 (selección dinámica de primer registro): ${error.message}`);
      }


      // === CP_CONTCLANEG_009 Paso 2: Clic en botón "Filtrar" ===
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

        console.log("✅ CP_FILTRAR_001 Paso 1: Botón 'Filtrar' presionado y espera dinámica completada.");
      } catch (error) {
        throw new Error(`❌ CP_FILTRAR_001 Paso 1 (clic en botón 'Filtrar'): ${error.message}`);
      }

      // === CP_CONTCLANEG_009 Paso 3: Llenar modal con datos capturados ===
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

        console.log("✅ CP_CONTCLANEG_009 Paso 3: Modal diligenciado correctamente con los datos capturados.");
      } catch (error) {
        throw new Error(`❌ CP_CONTCLANEG_009 Paso 3: ${error.message}`);
      }

      // === CP_CONTCLANEG_009 Paso 4 Clic en botón "SOCIALSTRATUMID" ===
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
        console.log("✅ CP_CONTCLANEG_009 Paso 4: Botón 'SOCIALSTRATUMID' presionado correctamente.");
      } catch (error) {
        throw new Error(`❌ CP_CONTCLANEG_009 Paso 4 (clic en botón 'SOCIALSTRATUMID'): ${error.message}`);
      }

      // === CP_CONTCLANEG_009 Paso 5: Seleccionar el primer registro de la tabla ===
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

        console.log("✅ CP_CONTCLANEG_009 Paso 5: Primer registro del modal seleccionado correctamente.");
      } catch (error) {
        throw new Error(`❌ CP_CONTCLANEG_009 Paso 5 (selección primer registro modal): ${error.message}`);
      }

      // === CP_CONTCLANEG_009 Paso 6: Clic en botón "Seleccionar" del modal ===
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

        console.log("✅ CP_CONTCLANEG_009 Paso 6: Botón 'Seleccionar' del modal presionado correctamente.");
      } catch (error) {
        throw new Error(`❌ CP_CONTCLANEG_009 Paso 6: (clic en botón 'Seleccionar'): ${error.message}`);
      }

      // === CP_CONTCLANEG_009 Paso 7: Clic en botón "MUNICIPALITYID" ===
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
        console.log("✅ CP_CONTCLANEG_009 Paso 7: Botón 'MUNICIPALITYID' presionado correctamente.");
      } catch (error) {
        throw new Error(`❌ CP_CONTCLANEG_009 Paso 7 (clic en botón 'MUNICIPALITYID'): ${error.message}`);
      }

      // === CP_CONTCLANEG_009 Paso 8: Buscar "ESPINAL" en la barra de búsqueda del modal MUNICIPALITYID ===
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

        console.log("✅ CP_CONTCLANEG_009 Paso 8: Palabra 'ESPINAL' escrita en el modal y búsqueda ejecutada.");
      } catch (error) {
        throw new Error(`❌ CP_CONTCLANEG_009 Paso 8: (buscar 'ESPINAL' en modal): ${error.message}`);
      }


      // === CP_CONTCLANEG_009 Paso 9: Seleccionar resultado de búsqueda en modal MUNICIPALITYID ===
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

        console.log("✅ CP_CONTCLANEG_010 Paso 4: Registro de MUNICIPALITYID seleccionado correctamente.");
      } catch (error) {
        throw new Error(`❌ CP_CONTCLANEG_010 Paso 4 (selección de resultado en modal MUNICIPALITYID): ${error.message}`);
      }



      // === CP_CONTCLANEG_009 Paso 10: Clic en botón "Seleccionar" del modal MUNICIPALITYID ===
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

        console.log("✅ CP_CONTCLANEG_009 Paso 9: Botón 'Seleccionar' en modal MUNICIPALITYID presionado correctamente.");
      } catch (error) {
        throw new Error(`❌ CP_CONTCLANEG_009 Paso 9: (clic en botón 'Seleccionar' en modal MUNICIPALITYID): ${error.message}`);
      }

      // === CP_CONTCLANEG_011 Paso 1: Scroll hasta el final y clic en botón "ID PLAN COMERCIAL" ===
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
        console.log("✅ CP_CONTCLANEG_011 Paso 1: Scroll abajo y clic en botón 'ID PLAN COMERCIAL' realizado correctamente.");
      } catch (error) {
        throw new Error(`❌ CP_CONTCLANEG_011 Paso 1 (scroll y clic en botón 'ID PLAN COMERCIAL'): ${error.message}`);
      }

      // === CP_CONTCLANEG_011 Paso 2: Seleccionar el primer registro del modal "ID PLAN COMERCIAL" ===
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

        console.log("✅ CP_CONTCLANEG_011 Paso 2: Primer registro del modal 'ID PLAN COMERCIAL' seleccionado correctamente.");
      } catch (error) {
        throw new Error(`❌ CP_CONTCLANEG_011 Paso 2 (selección primer registro modal 'ID PLAN COMERCIAL'): ${error.message}`);
      }



    } catch (error) {
      console.error("❌ Error en contenido clases de negocio:", error.message);
      const screenshot = await driver.takeScreenshot();
      const carpetaErrores = path.resolve(__dirname, '../errores');
      if (!fs.existsSync(carpetaErrores)) fs.mkdirSync(carpetaErrores);
      const filePath = path.join(carpetaErrores, `error_contenidoClases_${Date.now()}.png`);
      fs.writeFileSync(filePath, screenshot, 'base64');
      throw error;
    }
  }
}
