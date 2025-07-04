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

      // === Paso 3: Clic en "Contenido clases de negocio" ===
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

      // === Paso 4: Clic en el botón de la tabla para desplegar la lista de clases de negocio ===
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

      // === Paso 5: Seleccionar la entidad con ID 31 ===

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

      // === Paso 6: Clic en el botón "Seleccionar" ===

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

      // === Paso 7: Clic en el botón "+" (Nuevo registro) ===

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

      // === Paso 8: Clic en el botón del campo "Fabricante" ===

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

      // === Paso 9: Seleccionar fila del fabricante con ID "1"(HUAWEI) ===

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

      // === Paso 10: Clic en el botón "Seleccionar" tras elegir fabricante ===

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

      // === Paso 11: Diligenciar el campo "Nombre" con "TEST CREAR" ===

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

      // === Paso 12: Diligenciar el campo "Cantidad de slots" con número aleatorio ===

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

      // === Paso 13: Clic en el botón del campo "Tipo" ===

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

      // === Paso 14: Seleccionar tipo con ID 21 dentro del modal ===

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

      // === Paso 15: Clic en el botón "Seleccionar" del modal de tipo ===

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


      // === Paso 16: Diligenciar el campo "Descripción" ===

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

      // === Paso 17: Diligenciar campo "Ícono" ===

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

      // === Paso 18: Clic en el botón del campo "Localidad" ===

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

      // === Paso 19: Clic en botón "Seleccionar" del modal de Localidad ===

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

      // === Paso 20: Clic en el botón "Guardar" ===

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

      // === Paso 21: Clic en la barra de búsqueda ===

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
        throw new Error("❌ Error en el paso 33 al hacer clic en la barra de búsqueda: " + error.message);
      }

      // === Paso 22: Digitar "TEST CREAR" en la barra de búsqueda y presionar Enter ===
      try {
        const inputBusqueda = await driver.wait(
          until.elementLocated(By.xpath('//*[@id="crud-search-bar"]')),
          10000
        );

        await driver.wait(until.elementIsVisible(inputBusqueda), 10000);

        // Limpiar texto previo si lo hay
        await inputBusqueda.clear();

        // Ingresar la palabra TEST y presionar Enter
        await inputBusqueda.sendKeys('TEST CREAR', Key.ENTER);

        console.log('✅ Se digitó "TEST CREAR" en la barra de búsqueda y se presionó Enter.');
        await driver.sleep(3000); // Espera que cargue el resultado

      } catch (error) {
        throw new Error('❌ Error en el paso 34 al escribir en la barra de búsqueda: ' + error.message);
      }


      // === Paso 23: Seleccionar registro con el campo "Identificador" mayor y validar campo "Nombre" ===

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
        console.error(`❌ Error en paso 23: ${error.message}`);
        throw error;
      }

      // === Paso 24: Clic en botón Editar ===

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
        console.error(`❌ Error en paso 22 (clic en botón Editar): ${error.message}`);
        throw error;
      }

      // === Paso 25: Clic en el botón del campo "Fabricante" (modo edición) ===

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
        console.error(`❌ Error en paso 23 (clic botón Fabricante edición): ${error.message}`);
        throw error;
      }


      // === Paso 26: Seleccionar fila del fabricante con ID "2" (FIBERHOME) ===

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
        throw new Error("❌ La fila con ID '2' no fue marcada como activa.");
      }

      // console.log("✅ Fila 'FIBERHOME' seleccionada correctamente.");

      // === Paso 27: Clic en el botón "Seleccionar" del modal Fabricante ===

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
        throw new Error("❌ Error al hacer clic en el botón 'Seleccionar' del modal Fabricante: " + error.message);
      }

      // === Paso 28: Limpiar y diligenciar el campo "Nombre" con "TEST EDITAR" ===

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
        throw new Error("❌ Error en el paso 26 al diligenciar el campo 'Nombre': " + error.message);
      }

      // === Paso 29: Limpiar y diligenciar el campo "Cantidad de slots" con valor aleatorio entre 51 y 100 ===

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
        throw new Error("❌ Error en el paso 27 al diligenciar el campo 'Cantidad de slots': " + error.message);
      }

      // === Paso 30: Dar clic en el botón del campo "Tipo" ===

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
        throw new Error("❌ Error en el paso 28 al hacer clic en el botón del campo 'Tipo': " + error.message);
      }

      // === Paso 31: Seleccionar fila con ID 1 (ELEMENTO PRIMARIO - ACCESO) ===

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
        throw new Error("❌ Error en el paso 29 al seleccionar fila con ID 1: " + error.message);
      }

      // === Paso 32: Clic en el botón "Seleccionar" del modal de Tipo ===

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
        throw new Error("❌ Error en el paso 30 al hacer clic en el botón 'Seleccionar': " + error.message);
      }

      // === Paso 33: Limpiar y diligenciar el campo "Descripción" con "TEST EDITAR" ===

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
        throw new Error("❌ Error en el paso 31 al diligenciar el campo 'Descripción': " + error.message);
      }

      // === Paso 34: Clic en el botón "Guardar" en el formulario de edición ===

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
        throw new Error("❌ Error en el paso 32 al hacer clic en el botón 'Guardar': " + error.message);
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
