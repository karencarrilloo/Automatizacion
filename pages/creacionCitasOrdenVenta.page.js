import { By, until } from 'selenium-webdriver';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class CreacionCitasOrdenVentaPage {
  constructor(driver) {
    this.driver = driver;
  }

  async ejecutarCreacionOrden() {
    try {
      const driver = this.driver;

      // === Paso 7: Clic en módulo eWorkForce ===
      const eWorkForceBtn = await driver.wait(
        until.elementLocated(By.xpath("//div[@id='23' and contains(@class, 'item-module')]")),
        10000
      );
      await driver.executeScript("arguments[0].click();", eWorkForceBtn);
      await driver.sleep(1000);

      // === Paso 8: Scroll al contenedor ===
      const scrollContainer = await driver.wait(
        until.elementLocated(By.css('.container-applications')),
        10000
      );
      await driver.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight;", scrollContainer);
      await driver.sleep(1000);

      // === Paso 9: Clic en "Creación de citas" ===
      const creacionCitasBtn = await driver.wait(
        until.elementLocated(By.css('div.application-item[title="Creación de citas"]')),
        10000
      );
      await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", creacionCitasBtn);
      await driver.wait(until.elementIsVisible(creacionCitasBtn), 10000);
      await driver.wait(until.elementIsEnabled(creacionCitasBtn), 10000);
      await driver.sleep(1000);
      await driver.executeScript("arguments[0].click();", creacionCitasBtn);
      await driver.sleep(5000);

      // === Paso 10: Clic en "Crear orden para agendamiento" ===
      // Espera hasta que aparezca el botón con el texto deseado
      const btnCrearOrden = await driver.wait(
        until.elementLocated(By.xpath("//div[contains(text(), 'Crear orden para agendamiento') and contains(@class, 'btn-primary')]")),
        20000
      );

      // Asegura que sea visible antes de interactuar
      await driver.wait(until.elementIsVisible(btnCrearOrden), 10000);
      await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", btnCrearOrden);
      await driver.sleep(1000); // Por si hay animaciones

      // Hace clic en el botón "Crear orden para agendamiento"
      await driver.executeScript("arguments[0].click();", btnCrearOrden);
      await driver.sleep(5000); // Espera carga siguiente

      // === Paso 11: "Clic en botón del campo "Departamento" ===
      // Espera hasta que se localice el botón desplegable del campo "Departamento"
      const botonDepartamento = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-picklist-leProvince"]/div[1]/span[2]/button')),
        10000
      );

      // Hace scroll para asegurar que el botón está en pantalla
      await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", botonDepartamento);
      await driver.sleep(1000);

      // Verifica visibilidad y habilitación del botón
      const visible = await botonDepartamento.isDisplayed();
      const habilitado = await botonDepartamento.isEnabled();

      // Si no está visible o habilitado, lanza error
      if (!visible || !habilitado) {
        throw new Error("❌ El botón 'Departamento' no está visible o habilitado");
      }

      // Hace clic en el botón de "Departamento"
      await driver.executeScript("arguments[0].click();", botonDepartamento);
      await driver.sleep(3000); // Espera para carga de opciones

      // Paso 12: Seleccionar "VALLE DEL CAUCA" de la tabla

      // Obtiene todas las filas (<tr>) del cuerpo de la tabla (#grid-table-crud-grid-leProvince)
      const rows = await driver.findElements(By.css('#grid-table-crud-grid-leProvince tbody tr'));

      // Variable para llevar control si se encontró la fila
      let found = false;

      // Recorre cada fila encontrada
      for (const row of rows) {
        // Dentro de cada fila, obtiene todas las celdas (<td>)
        const cells = await row.findElements(By.css('td'));

        // Recorre cada celda dentro de la fila
        for (const cell of cells) {
          // Obtiene el texto visible de la celda
          const text = await cell.getText();

          // Compara el texto con "VALLE DEL CAUCA" (ignorando espacios y mayúsculas/minúsculas)
          if (text.trim().toUpperCase() === "VALLE DEL CAUCA") {
            // Si encuentra la coincidencia, hace clic en toda la fila
            await row.click();

            // Marca como encontrado para salir del bucle principal
            found = true;
            break;
          }
        }

        // Si ya encontró la fila, sale del bucle externo
        if (found) break;
      }

      // Si no encontró ninguna fila con "VALLE DEL CAUCA", lanza un error
      if (!found) {
        throw new Error('❌ No se encontró la fila con "VALLE DEL CAUCA"');
      }

      await driver.sleep(3000);

      // Paso 13: Hacer clic en el botón "Seleccionar"
      // Localizamos el botón "Seleccionar"
      let botonSeleccionar = await driver.wait(
        until.elementLocated(By.css('#widget-button-btSelect-leProvince .btn.btn-primary')),
        10000
      );

      // Esperamos a que el botón esté habilitado (es decir, que NO tenga el atributo 'disabled')
      await driver.wait(async () => {
        const disabled = await botonSeleccionar.getAttribute('disabled');
        return disabled === null;
      }, 10000);

      // Hacemos clic cuando esté habilitado
      await botonSeleccionar.click();
      await driver.sleep(3000);

      // === Paso 14: "Clic en botón del campo 'TIPO DE ORDEN'" ===

      const botonTipoOrden = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-picklist-workSpecificationIdCreateOrder"]/div[1]/span[2]/button')),
        10000
      );

      // Hace scroll para asegurar visibilidad
      await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", botonTipoOrden);
      await driver.sleep(1000);


      // Verifica visibilidad y habilitación del botón
      const visibleTipoOrden = await botonTipoOrden.isDisplayed();
      const habilitadoTipoOrden = await botonTipoOrden.isEnabled();

      if (!visibleTipoOrden || !habilitadoTipoOrden) {
        throw new Error("❌ El botón 'TIPO DE ORDEN' no está visible o habilitado");
      }

      // Hace clic en el botón "TIPO DE ORDEN"
      await driver.executeScript("arguments[0].click();", botonTipoOrden);
      await driver.sleep(3000); // Espera para carga de opciones


      //****SE PAUSA EL DESARROLLO DEBIDO A QUE LA ORDEN DE VENTA NO SE VA HACER POR WEB****

      // Paso 15: Seleccionar "ORDEN - VENTA E INSTALACION" haciendo scroll dentro del tbody

      // // Obtener el cuerpo de la tabla del modal
      // const tablaSelector = await driver.findElement(By.css('#grid-table-crud-grid-workSpecificationIdCreateOrder tbody'));

      // // Obtener todas las filas visibles
      // const rowsOrder = await tablaSelector.findElements(By.css('tr'));

      // let foundOrder = false;

      // // Recorrer cada fila y sus celdas para buscar coincidencia parcial
      // for (const row of rowsOrder) {
      //   const cells = await row.findElements(By.css('td'));

      //   for (const cell of cells) {
      //     const text = await cell.getText();

      //     // Comparación parcial y en mayúsculas: buscamos "VENTA E INSTALACION"
      //     if (text.toUpperCase().includes('VENTA E INSTALACION')) {
      //       // Asegurar visibilidad de la celda con scroll
      //       await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", cell);
      //       await driver.sleep(500); // Espera breve por scroll

      //       // Clic directamente en la celda para seleccionar la fila
      //       await driver.executeScript("arguments[0].click();", cell);
      //       foundOrder = true;
      //       break;
      //     }
      //   }

      //   if (foundOrder) break;
      // }

      // // Validación por si no encuentra el tipo de orden
      // if (!foundOrder) {
      //   throw new Error('❌ No se encontró ninguna opción que contenga "VENTA E INSTALACION".');
      // }

      // // Esperar y dar clic en el botón SELECCIONAR del modal
      // const botonSeleccionarOrder = await driver.wait(
      //   until.elementLocated(By.css('#widget-button-btSelect-workSpecificationIdCreateOrder .btn.btn-primary')),
      //   10000
      // );

      // // Esperar que esté habilitado antes de hacer clic
      // await driver.wait(async () => {
      //   const disabled = await botonSeleccionarOrder.getAttribute('disabled');
      //   return disabled === null;
      // }, 10000);

      // // Clic final en el botón "SELECCIONAR"
      // await driver.executeScript("arguments[0].click();", botonSeleccionarOrder);
      // await driver.sleep(2000); // Espera para asegurar la acción



      // // === Paso 16: Clic en botón del campo "Municipio" ===

      // // Espera hasta que se localice el botón desplegable del campo "Municipio"
      // const botonMunicipio = await driver.wait(
      //   until.elementLocated(By.xpath('//*[@id="widget-picklist-leMunicipality"]/div[1]/span[1]/button')),
      //   10000
      // );

      // // Hace scroll para asegurar que el botón esté visible en pantalla
      // await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", botonMunicipio);
      // await driver.sleep(1000); // Pequeña espera para permitir que el scroll se complete

      // // Verifica visibilidad y habilitación del botón
      // const visibleMunicipio = await botonMunicipio.isDisplayed();
      // const habilitadoMunicipio = await botonMunicipio.isEnabled();

      // // Si no está visible o habilitado, lanza error
      // if (!visibleMunicipio || !habilitadoMunicipio) {
      //   throw new Error("❌ El botón 'Municipio' no está visible o habilitado");
      // }

      // // Hace clic en el botón de "Municipio"
      // await driver.executeScript("arguments[0].click();", botonMunicipio);
      // await driver.sleep(3000); // Espera para que carguen las opciones



      // // === Paso 17: Buscar y seleccionar "PALMIRA" ===

      // // Espera el contenedor scrollable del listado de municipios
      // const contenedorMunicipios = await driver.wait(
      //   until.elementLocated(By.xpath('//*[@id="widget-dialog-dialog-picklist-leMunicipality"]/div/div/div[2]/div')),
      //   10000
      // );

      // // Encuentra todas las filas de la tabla de municipios
      // const filasMunicipio = await driver.findElements(By.css('#grid-table-crud-grid-leMunicipality tbody tr'));

      // let municipioEncontrado = false;

      // for (const fila of filasMunicipio) {
      //   const celdas = await fila.findElements(By.css('td'));

      //   for (const celda of celdas) {
      //     const texto = await celda.getText();

      //     if (texto.trim().toUpperCase() === "PALMIRA") {
      //       // Hace scroll dentro del contenedor específico
      //       await driver.executeScript("arguments[0].scrollTop = arguments[1].offsetTop;", contenedorMunicipios, fila);
      //       await driver.sleep(500); // espera para que el scroll se vea
      //       await fila.click(); // hace clic en la fila
      //       municipioEncontrado = true;
      //       break;
      //     }
      //   }

      //   if (municipioEncontrado) break;
      // }

      // // Si no se encontró, lanza error
      // if (!municipioEncontrado) {
      //   throw new Error('❌ No se encontró la fila con "PALMIRA" en la lista de municipios');
      // }

      // await driver.sleep(3000); // Espera a que se habilite el botón "Seleccionar"

      // // Clic en el botón "Seleccionar"
      // const botonSeleccionarMunicipio = await driver.wait(
      //   until.elementLocated(By.css('#widget-button-btSelect-leMunicipality .btn.btn-primary')),
      //   10000
      // );

      // // Espera que el botón esté habilitado
      // await driver.wait(async () => {
      //   const disabled = await botonSeleccionarMunicipio.getAttribute('disabled');
      //   return disabled === null;
      // }, 10000);

      // // Hace clic en el botón "Seleccionar"
      // await botonSeleccionarMunicipio.click();
      // await driver.sleep(3000);


      // // === Paso 18: Digitar sobre el campo DIRECCIÓN con texto aleatorio ===
      // function generarDireccionAleatoria() {
      //   const prefijos = ['Calle', 'Carrera', 'Avenida', 'Transversal', 'Diagonal'];
      //   const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      //   const aleatorio = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

      //   const prefijo = prefijos[Math.floor(Math.random() * prefijos.length)];
      //   const numeroPrincipal = aleatorio(1, 99);
      //   const letra = letras.charAt(Math.floor(Math.random() * letras.length));
      //   const numeroSecundario = aleatorio(1, 99);
      //   const complemento = `#${aleatorio(1, 99)}-${aleatorio(1, 99)}`;

      //   const direccion = `${prefijo} ${numeroPrincipal}${letra} ${numeroSecundario} ${complemento}`;

      //   return direccion.substring(0, 30); // Asegura máximo 30 caracteres
      // }

      // // Esperar y localizar el campo de dirección (puedes ajustar el selector si cambia)
      // const campoDireccion = await driver.wait(
      //   until.elementLocated(By.css('input[placeholder="Dirección"]')),
      //   10000
      // );


      // // Limpiar el campo en caso de que tenga texto
      // await campoDireccion.clear();

      // // Generar una dirección aleatoria
      // const direccionAleatoria = generarDireccionAleatoria();

      // // Escribir la dirección
      // await campoDireccion.sendKeys(direccionAleatoria);

      // // Pausa opcional para visualización
      // await driver.sleep(2000);


      // // === Paso 19: Seleccionar tipo de documento ===
      // const selectElement = await driver.findElement(By.id("input-select-typeDocument"));
      // await selectElement.sendKeys("C.C");
      // await driver.sleep(1000);

      // // === Paso 20: Digitar en el campo "Número de documento" ===

      // // Esperar el campo por su ID y localizarlo
      // const campoNumeroDocumento = await driver.wait(
      //   until.elementLocated(By.id('textfield-idClient')),
      //   10000
      // );

      // // Limpiar el campo si tiene algún valor previo
      // await campoNumeroDocumento.clear();

      // // Función auxiliar para generar un número aleatorio con longitud entre 7 y 12
      // function generarNumeroDocumentoAleatorio() {
      //   const longitud = Math.floor(Math.random() * (10 - 7 + 1)) + 7; // entre 7 y 12
      //   let numero = '';
      //   for (let i = 0; i < longitud; i++) {
      //     numero += Math.floor(Math.random() * 10); // Dígito entre 0 y 9
      //   }
      //   return numero;
      // }

      // // Generar número aleatorio
      // const numeroDocumento = generarNumeroDocumentoAleatorio();

      // // Ingresar el número en el campo
      // await campoNumeroDocumento.sendKeys(numeroDocumento);

      // // Pausa para visualización (opcional)
      // await driver.sleep(2000);

      // // === Paso 21: Digitar Primer Nombre (obligatorio) ===

      // const campoPrimerNombre = await driver.wait(
      //   until.elementLocated(By.id('textfield-nameClient')),
      //   10000
      // );
      // await campoPrimerNombre.clear();

      // // Listas separadas por género
      // const nombresFemeninos = ['Laura', 'Ana', 'Camila', 'Valentina', 'Daniela', 'Gabriela', 'María', 'Sara', 'Juliana'];
      // const nombresMasculinos = ['Carlos', 'Juan', 'Andrés', 'Felipe', 'Esteban', 'Nicolás', 'Alejandro', 'Mateo', 'Santiago'];

      // // Escoger género al azar
      // const esGeneroFemenino = Math.random() < 0.5;
      // const listaNombres = esGeneroFemenino ? nombresFemeninos : nombresMasculinos;

      // // Generar primer nombre (obligatorio, nunca vacío)
      // const primerNombre = listaNombres[Math.floor(Math.random() * listaNombres.length)];
      // await campoPrimerNombre.sendKeys(primerNombre);

      // // === Paso 22: Digitar Segundo Nombre (opcional del mismo género) ===

      // const campoSegundoNombre = await driver.wait(
      //   until.elementLocated(By.id('textfield-nameClientSecond')),
      //   10000
      // );
      // await campoSegundoNombre.clear();

      // // 50% de probabilidad de escribir segundo nombre (puede quedar vacío)
      // const incluirSegundoNombre = Math.random() < 0.5;

      // if (incluirSegundoNombre) {
      //   let segundoNombre;
      //   do {
      //     segundoNombre = listaNombres[Math.floor(Math.random() * listaNombres.length)];
      //   } while (segundoNombre === primerNombre); // Evitar duplicado
      //   await campoSegundoNombre.sendKeys(segundoNombre);
      // }
      // await driver.sleep(2000);

      // // === Paso 23: Digitar Primer Apellido (obligatorio) ===

      // const campoPrimerApellido = await driver.wait(
      //   until.elementLocated(By.id('textfield-lastnameClient')),
      //   10000
      // );
      // await campoPrimerApellido.clear();

      // // Lista de apellidos comunes
      // const apellidos = ['Gómez', 'Pérez', 'Rodríguez', 'Martínez', 'López', 'García', 'Torres', 'Ramírez', 'Hernández', 'Moreno'];

      // // Seleccionar un apellido aleatorio
      // const primerApellido = apellidos[Math.floor(Math.random() * apellidos.length)];

      // // Escribir el apellido en el campo
      // await campoPrimerApellido.sendKeys(primerApellido);

      // await driver.sleep(6000);

      // // === Paso 24: Digitar Segundo Apellido (opcional) ===

      // const campoSegundoApellido = await driver.wait(
      //   until.elementLocated(By.id('textfield-lastnameClientSecond')),
      //   10000
      // );
      // await campoSegundoApellido.clear();

      // // Lista distinta de apellidos comunes para segundo apellido
      // const apellidosOpcionales = ['Castro', 'Vargas', 'Ríos', 'Silva', 'Delgado', 'Campos', 'Mendoza', 'Cardona', 'Reyes', 'Navarro'];

      // // 50% de probabilidad de dejarlo vacío (opcional)
      // let segundoApellido = '';
      // if (Math.random() > 0.5) {
      //   segundoApellido = apellidosOpcionales[Math.floor(Math.random() * apellidosOpcionales.length)];
      // }

      // // Digitar si aplica
      // if (segundoApellido !== '') {
      //   await campoSegundoApellido.sendKeys(segundoApellido);
      // }


      // // === Paso 25: Digitar en el campo "Telefono" ===
      // // Esperar el campo por su telefono y localizarlo
      // const campoNumeroTelefono = await driver.wait(
      //   until.elementLocated(By.id('textfield-phoneClient')),
      //   10000
      // );

      // // Limpiar el campo si tiene algún valor previo
      // await campoNumeroTelefono.clear();

      // // Función auxiliar para generar un número aleatorio con longitud entre 7 y 12
      // function generarNumeroTelefonoAleatorio() {
      //   const longitud = Math.floor(Math.random() * (10 - 7 + 1)) + 7; // entre 7 y 12
      //   let numeroTelefono = '';
      //   for (let i = 0; i < longitud; i++) {
      //     numeroTelefono += Math.floor(Math.random() *
      //       10); // Dígito entre 0 y 9
      //   }
      //   return numeroTelefono;
      // }

      // // Generar número aleatorio
      // const campoTelefono = generarNumeroTelefonoAleatorio();

      // // Ingresar el número en el campo
      // await campoNumeroTelefono.sendKeys(campoTelefono);

      // // Pausa para visualización (opcional)
      // await driver.sleep(2000);

      // // === Paso 26: Digitar Correo Electrónico ===

      // const campoCorreo = await driver.wait(
      //   until.elementLocated(By.id('textfield-emailClient')),
      //   10000
      // );
      // await campoCorreo.clear();

      // // Generador de correos válidos
      // const dominios = ['gmail.com', 'hotmail.com', 'iptotal.com', 'yahoo.com'];
      // const usuarioCorreo = generarNombreUsuarioCorreo();
      // const dominioCorreo = dominios[Math.floor(Math.random() * dominios.length)];
      // const correo = `${usuarioCorreo}@${dominioCorreo}`;

      // // Función generadora del nombre del usuario del correo
      // function generarNombreUsuarioCorreo() {
      //   const letras = 'abcdefghijklmnopqrstuvwxyz';
      //   let nombre = '';
      //   for (let i = 0; i < 6; i++) {
      //     nombre += letras.charAt(Math.floor(Math.random() * letras.length));
      //   }
      //   const numero = Math.floor(Math.random() * 999);
      //   return nombre + numero;
      // }

      // // Digitar el correo generado
      // await campoCorreo.sendKeys(correo);

      // // === Paso 27: Seleccionar estado de la suscripcion de whatsapp ===
      // const selectEstadoSuscripcion = await driver.findElement(By.id("input-select-subscriptionWhatsapp"));
      // await selectEstadoSuscripcion.sendKeys("SUSCRITO");
      // await driver.sleep(1000); // Espera para asegurar que la selección se aplique

      // // === Paso 28: Seleccionar aceptación de tratamiento de datos personales === 
      // const selectAcceptanceProcessingData = await driver.findElement(By.id("input-select-acceptanceProcessingData"));
      // await selectAcceptanceProcessingData.sendKeys("NO");
      // await driver.sleep(1000); // Espera para asegurar que la selección se aplique

      // // === Paso 29: Clic en el botón "Crear" ===
      // const contenedorBoton = await driver.wait(
      //   until.elementLocated(By.id("widget-button-btnCreateOrderToAppointment")),
      //   10000
      // );
      // // Forzamos el clic con JavaScript sobre el botón hijo
      // const botonCrear = await contenedorBoton.findElement(By.css("div.btn.btn-primary"));
      // await driver.executeScript("arguments[0].click();", botonCrear);
      // await driver.sleep(1000); // Espera tras el clic para ver el efecto


      // // === Paso 30: Confirmar informacion ===
      // // Espera hasta que el contenedor del botón "Sí" esté presente
      // const botonConfirmar = await driver.wait(
      //   until.elementLocated(By.xpath("//div[contains(text(),'Sí') and contains(@class, 'btn-default')]")),
      //   10000
      // );
      // // Hace clic en el botón "Sí" usando JavaScript
      // await driver.executeScript("arguments[0].click();", botonConfirmar);

      // // Espera 2 segundos por la transición posterior a la confirmación
      // await driver.sleep(5000); // Esperar transición


      // return driver; // Devuelve el driver para continuar desde gestionOrdenVenta.js

    } catch (error) {
      console.error("❌ No se pudo completar la creación de la orden:", error.message);
      const screenshot = await this.driver.takeScreenshot();
      const carpetaErrores = path.resolve(__dirname, '../errores');
      if (!fs.existsSync(carpetaErrores)) {
        fs.mkdirSync(carpetaErrores);
      }
      const archivoSalida = path.join(carpetaErrores, `error_creacionOrden_${Date.now()}.png`);
      fs.writeFileSync(archivoSalida, screenshot, 'base64');
      throw error;
    }
  }
}