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
