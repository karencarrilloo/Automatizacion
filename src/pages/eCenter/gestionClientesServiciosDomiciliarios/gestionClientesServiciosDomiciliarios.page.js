import { By, until } from 'selenium-webdriver';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class GestionClientesServiciosPage {
  constructor(driver) {
    this.driver = driver;
  }

  /**
   * ===============================
   * CP_GESCLSERDOM_001 – Ingreso a vista
   * 3 pasos
   * ===============================
   */
  async ingresarVistaGestionClientes(caseName = 'CP_GESTION_001') {
    const driver = this.driver;

    try {
      // Paso 1: Módulo eCenter
      const eCenterBtn = await driver.wait(
        until.elementLocated(By.xpath("//div[@id='118' and contains(@class, 'item-module')]")),
        10000
      );
      await driver.executeScript("arguments[0].click();", eCenterBtn);
      await driver.sleep(1000);


      // Paso 2: Scroll contenedor de apps
      const scrollContainer = await driver.wait(
        until.elementLocated(By.css('.container-applications')),
        10000
      );
      await driver.executeScript(
        "arguments[0].scrollTop = arguments[0].scrollHeight;",
        scrollContainer
      );
      await driver.sleep(1000);


      // Paso 3: Clic en la aplicación de Gestión
      const gestionBtn = await driver.wait(
        until.elementLocated(
          By.xpath("//div[contains(@class,'legend-application') and " +
            "contains(text(),'Gestión sobre clientes y servicios domiciliarios')]")
        ),
        15000
      );
      await driver.executeScript("arguments[0].scrollIntoView({behavior:'smooth', block:'center'});", gestionBtn);
      await driver.wait(until.elementIsVisible(gestionBtn), 10000);
      await driver.wait(until.elementIsEnabled(gestionBtn), 10000);
      await driver.sleep(1000);
      await driver.executeScript("arguments[0].click();", gestionBtn);
      await driver.sleep(10000);


    } catch (error) {
      console.error(`❌ [CP_GESCLSERDOM_001] Error: ${error.message}`);

    }
  }

  /**
   * ==================================================
   * CP_GESCLSERDOM_002 – Filtro de búsqueda cliente por ID_DEAL
   * 5 pasos
   * ==================================================
   */
  async filtrarPorIdDeal(caseName = 'CP_GESCLSERDOM_002', idDeal = '28006512626') {
    const driver = this.driver;
    try {
      // === Paso 1: Abrir modal de filtros ===
      const padreXpath = '//*[@id="widget-button-btn-add-filter"]';
      const hijoXpath = './div';

      const divPadre = await driver.wait(until.elementLocated(By.xpath(padreXpath)), 10000);
      await driver.wait(until.elementIsVisible(divPadre), 5000);
      const divHijo = await divPadre.findElement(By.xpath(hijoXpath));
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", divHijo);
      await driver.executeScript("arguments[0].click();", divHijo);
      await driver.sleep(5000);

      const modalFiltros = await driver.wait(
        until.elementLocated(By.xpath('//*[starts-with(@id,"qb_")]')),
        15000
      );
      await driver.wait(until.elementIsVisible(modalFiltros), 5000);

      // === Paso 2: Desplegar select de filtros ===
      const grupoFiltro = await driver.wait(
        until.elementLocated(By.xpath('//*[starts-with(@id,"qb_") and contains(@id,"_rule_0")]')),
        10000
      );
      const contenedorFiltro = await grupoFiltro.findElement(By.css('.rule-filter-container'));
      const selectFiltro = await contenedorFiltro.findElement(By.css('select'));
      await driver.wait(until.elementIsVisible(selectFiltro), 5000);
      await driver.wait(until.elementIsEnabled(selectFiltro), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", selectFiltro);
      await selectFiltro.click();
      await driver.sleep(2000);
      console.log("✅ Select de filtros desplegado.");

      // === Paso 3: Seleccionar "ID_DEAL" ===
      const selectCampo = await grupoFiltro.findElement(By.css('select'));
      await driver.wait(until.elementIsVisible(selectCampo), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", selectCampo);
      await selectCampo.click();
      await driver.sleep(500);
      await selectCampo.sendKeys("ID_DEAL");
      await driver.sleep(2000);

      // === Paso 4: Diligenciar el campo de ID_DEAL ===
      const textareaCampo = await driver.wait(
        until.elementLocated(By.css('textarea.form-control')),
        10000
      );
      await driver.wait(until.elementIsVisible(textareaCampo), 5000);
      await textareaCampo.click();
      await driver.sleep(300);
      await textareaCampo.clear();
      await textareaCampo.sendKeys(idDeal);
      await driver.sleep(1500);

      // === Paso 5: Clic en "Aplicar filtros" ===
      const botonAplicarFiltro = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-button-btn-apply-filter-element"]/div')),
        10000
      );
      await driver.wait(until.elementIsVisible(botonAplicarFiltro), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", botonAplicarFiltro);
      await driver.sleep(500);
      await botonAplicarFiltro.click();
      await driver.sleep(3000);

    } catch (error) {
      await this._capturarError(error, caseName);
      throw error;
    }


  }
  // ==========================================
  // CP_GESCLSERDOM_003: Ver información técnica asociada
  // ==========================================
  async verInformacionTecnicaAsociada(
    caseName = 'CP_GESCLSERDOM_003',
    cliente = 'HAROLD AGUIRRE'     // Cambia el nombre si se requiere
  ) {
    const driver = this.driver;
    try {
      // === Paso 9: Seleccionar cliente por NOMBRE ===
      const gridTbodyXpath =
        '//div[contains(@id,"grid-table-crud-grid") and contains(@id,"CustomerManager")]//table/tbody';

      const cuerpoTabla = await driver.wait(
        until.elementLocated(By.xpath(gridTbodyXpath)),
        15000
      );
      await driver.wait(until.elementIsVisible(cuerpoTabla), 5000);

      const filas = await cuerpoTabla.findElements(By.xpath('./tr'));
      if (filas.length === 0) throw new Error('No se encontraron filas en la tabla.');

      let filaSeleccionada = null;
      for (const fila of filas) {
        try {
          const tdName = await fila.findElement(By.xpath('.//*[@id="nameCustomer"]'));
          const texto = (await tdName.getText()).trim();
          if (texto.toUpperCase() === cliente.toUpperCase()) {
            filaSeleccionada = fila;
            break;
          }
        } catch {
          continue;
        }
      }
      if (!filaSeleccionada) throw new Error(`No se encontró cliente "${cliente}"`);

      await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', filaSeleccionada);
      await driver.sleep(300);
      try {
        await filaSeleccionada.click();
      } catch {
        await driver.executeScript('arguments[0].click();', filaSeleccionada);
      }
      await driver.sleep(800);
      console.log(`✅ Cliente "${cliente}" seleccionado.`);

      // === Paso 10: Botón Opciones ===
      const btnOpciones = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="btn-options"]')),
        10000
      );
      await driver.wait(until.elementIsVisible(btnOpciones), 5000);
      await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', btnOpciones);
      await driver.sleep(300);
      await driver.executeScript('arguments[0].click();', btnOpciones);
      await driver.sleep(1000);
      console.log('✅ Botón Opciones presionado.');

      // === Paso 11: Opción "Ver información técnica asociada" ===
      const menuOpciones = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="container-general-crud"]/div[4]/div[2]/div[1]/div/div/div/ul')),
        10000
      );
      await driver.wait(until.elementIsVisible(menuOpciones), 5000);

      const opcionVerInfo = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="1090"]')),
        10000
      );
      await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', opcionVerInfo);
      await driver.sleep(300);
      await driver.executeScript('arguments[0].click();', opcionVerInfo);
      await driver.sleep(3000);
      console.log('✅ Opción "Ver información técnica asociada" seleccionada.');

      // === Paso 12: Cerrar modal ===
      const btnCerrarModal = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-button-cancel-confirm-selected"]/div')),
        10000
      );
      await driver.wait(until.elementIsVisible(btnCerrarModal), 5000);
      await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', btnCerrarModal);
      await driver.sleep(300);
      await driver.executeScript('arguments[0].click();', btnCerrarModal);
      await driver.sleep(2000);
      console.log('✅ Modal cerrado correctamente.');
    } catch (error) {
      // Reutiliza tu helper de captura de pantallas si ya existe
      if (this._capturarError) await this._capturarError(error, caseName);
      throw error;
    }
  }

  // =====================================================
  // CP_GESCLSERDOM_004: Reconfiguración del cliente
  // =====================================================
  async reconfigurarCliente(caseName = 'CP_GESCLSERDOM_004',
    cliente = 'HAROLD AGUIRRE',     // Cambia el nombre si se requiere
  ) {
    const driver = this.driver;
    try {
      // === Paso 1: Seleccionar cliente por NOMBRE ===
      const gridTbodyXpath =
        '//div[contains(@id,"grid-table-crud-grid") and contains(@id,"CustomerManager")]//table/tbody';

      const cuerpoTabla = await driver.wait(
        until.elementLocated(By.xpath(gridTbodyXpath)),
        15000
      );
      await driver.wait(until.elementIsVisible(cuerpoTabla), 5000);

      const filas = await cuerpoTabla.findElements(By.xpath('./tr'));
      if (filas.length === 0) throw new Error('No se encontraron filas en la tabla.');

      let filaSeleccionada = null;
      for (const fila of filas) {
        try {
          const tdName = await fila.findElement(By.xpath('.//*[@id="nameCustomer"]'));
          const texto = (await tdName.getText()).trim();
          if (texto.toUpperCase() === cliente.toUpperCase()) {
            filaSeleccionada = fila;
            break;
          }
        } catch {
          continue;
        }
      }
      if (!filaSeleccionada) throw new Error(`No se encontró cliente "${cliente}"`);

      await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', filaSeleccionada);
      await driver.sleep(300);
      try {
        await filaSeleccionada.click();
      } catch {
        await driver.executeScript('arguments[0].click();', filaSeleccionada);
      }
      await driver.sleep(800);
      console.log(`✅ Cliente "${cliente}" seleccionado.`);


      // === Paso 2: Botón Opciones ===
      const btnOpciones = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="btn-options"]')),
        10000
      );
      await driver.wait(until.elementIsVisible(btnOpciones), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", btnOpciones);
      await driver.sleep(300);
      await driver.executeScript("arguments[0].click();", btnOpciones);
      await driver.sleep(1000);
      console.log("✅ Paso 13: Botón 'Opciones' presionado.");

      // === Paso 3: Seleccionar opción "Reconfiguración" ===
      const menuOpciones = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="container-general-crud"]/div[4]/div[2]/div[1]/div/div/div/ul')),
        10000
      );
      await driver.wait(until.elementIsVisible(menuOpciones), 5000);

      const opcionReconfig = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="1089"]')),
        10000
      );
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", opcionReconfig);
      await driver.sleep(300);
      await driver.executeScript("arguments[0].click();", opcionReconfig);
      await driver.sleep(2000);
      console.log("✅ Paso 14: Opción 'Reconfiguración' seleccionada.");

      // === Paso 4: Clic en botón "Reconfigurar" ===
      const btnReconfigurar = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-button-btn-reconfig"]/div')),
        10000
      );
      await driver.wait(until.elementIsVisible(btnReconfigurar), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", btnReconfigurar);
      await driver.sleep(1000);
      await driver.executeScript("arguments[0].click();", btnReconfigurar);
      await driver.sleep(2000);
      console.log("✅ Paso 15: Botón 'Reconfigurar' presionado.");

      // === Paso 16: Confirmar con "Sí" en el modal ===
      const btnConfirmarSi = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="widget-button-btConfirmYes"]/div')),
        10000
      );
      await driver.wait(until.elementIsVisible(btnConfirmarSi), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", btnConfirmarSi);
      await driver.sleep(1000);
      await driver.executeScript("arguments[0].click();", btnConfirmarSi);
      await driver.sleep(3000);
      console.log("✅ Paso 16: Confirmación 'Sí' ejecutada.");

      // === Paso 17: Monitorear proceso de reconfiguración ===
      let reconfigExitosa = false;
      try {
        const contentProcessXpath =
          '//*[@id="widget-dialog-open-dialog-603238-5522-CustomerManager"]/div/div/div[2]/div/div/div/div';
        const checkOkXpath = `${contentProcessXpath}//span[contains(@class,"glyphicon-ok")]`;
        const btnSiguienteXpath = '//*[@id="widget-button-btn-next"]/div';
        const btnCerrarModalErrorXpath =
          '//div[starts-with(@id,"widget-dialog-open-dialog") and contains(@id,"CustomerManager")]//button';

        console.log("⏳ Esperando checks verdes...");
        await driver.wait(async () => {
          const checks = await driver.findElements(By.xpath(checkOkXpath));
          return checks.length >= 5;
        }, 60000, "❌ Los checks no se completaron en el tiempo esperado.");

        console.log("✅ Checks de reconfiguración completados.");

        const btnSiguiente = await driver.wait(
          until.elementLocated(By.xpath(btnSiguienteXpath)),
          30000
        );
        await driver.wait(until.elementIsVisible(btnSiguiente), 10000);
        await driver.wait(until.elementIsEnabled(btnSiguiente), 20000);
        await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", btnSiguiente);
        await driver.sleep(1000);
        await driver.executeScript("arguments[0].click();", btnSiguiente);
        console.log("✅ Paso 17: Botón 'Siguiente' presionado.");
        reconfigExitosa = true;
      } catch (e) {
        console.log("ℹ️ Reconfiguración no exitosa, revisando modal de error...");
        try {
          const btnCerrarModalError = await driver.wait(
            until.elementLocated(
              By.xpath('//div[starts-with(@id,"widget-dialog-open-dialog") and contains(@id,"CustomerManager")]//button')
            ),
            10000
          );
          await driver.wait(until.elementIsVisible(btnCerrarModalError), 5000);
          await driver.executeScript("arguments[0].click();", btnCerrarModalError);
          await driver.sleep(2000);
          console.log("⚠️ Reconfiguración fallida: modal cerrado.");
        } catch {
          console.log("⚠️ No apareció modal de error durante la reconfiguración.");
        }
      }

      // === Paso 18: Reutilizar datos WiFi (opcional) ===
      try {
        const btnConfigurarXpath = '//*[@id="widget-button-btn-config-wifi-data"]/div';
        const progressXpath = '//*[@class="progress-bar"]';

        console.log("⏳ Verificando 'Reutilizar datos WiFi'...");
        let btnConfigurar;
        try {
          btnConfigurar = await driver.wait(
            until.elementLocated(By.xpath(btnConfigurarXpath)),
            10000
          );
        } catch {
          console.log("ℹ️ Botón 'Configurar WiFi' no apareció, se omite.");
          this.reconfiguracionExitosa = reconfigExitosa;
          return;
        }

        await driver.wait(until.elementIsVisible(btnConfigurar), 5000);
        await driver.executeScript("arguments[0].click();", btnConfigurar);
        await driver.sleep(1000);
        console.log("✅ Botón 'Configurar WiFi' presionado.");

        try {
          const progress = await driver.wait(
            until.elementLocated(By.xpath(progressXpath)),
            10000
          );
          await driver.wait(until.elementIsVisible(progress), 5000);
          console.log("⏳ Esperando finalización de WiFi...");
          await driver.wait(until.stalenessOf(progress), 60000);
          console.log("✅ Configuración WiFi completada.");
        } catch {
          console.log("⚠️ No se detectó progress de WiFi, continuando...");
        }
      } catch (err) {
        throw new Error(`❌ Error en reutilizar datos WiFi: ${err.message}`);
      }

      this.reconfiguracionExitosa = reconfigExitosa;
    } catch (error) {
      if (this._capturarError) await this._capturarError(error, caseName);
      throw error;
    }
  }


}

