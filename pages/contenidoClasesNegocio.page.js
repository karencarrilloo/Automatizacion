import { By, until } from 'selenium-webdriver';
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

      console.log('✅ Fila con ID 31 seleccionada correctamente.');
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
      console.log('✅ Se hizo clic en el botón "Seleccionar".');
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

      console.log('✅ Se hizo clic en el botón "+" correctamente.');
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

      console.log('✅ Se hizo clic en el botón del campo "Fabricante".');
      



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
