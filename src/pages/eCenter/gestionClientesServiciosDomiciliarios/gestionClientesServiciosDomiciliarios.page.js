import { By, until } from 'selenium-webdriver';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

export default class GestionClientesServiciosPage {
  constructor(driver) {
    this.driver = driver;
  }

  /**
   * ===============================
   * CP_GESTION_001 – Ingreso a vista
   * ===============================
   * Pasos:
   *   1. Clic en módulo eCenter
   *   2. Scroll en contenedor de aplicaciones
   *   3. Clic en “Gestión sobre clientes y servicios domiciliarios”
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
      console.error(`❌ [CP_GESTION_001] Error: ${error.message}`);
      
      }
  }

  /**
   * ==================================================
   * CP_GESCLSERDOM_002 – Filtro de búsqueda por ID_DEAL
   * ==================================================
   */
  async filtrarPorIdDeal(caseName = 'CP_GESCLSERDOM_002', idDeal = '28006512626') {
    const driver = this.driver;
    try {
      // === Paso 4: Abrir modal de filtros ===
      const padreXpath = '//*[@id="widget-button-btn-add-filter"]';
      const hijoXpath  = './div';

      const divPadre = await driver.wait(until.elementLocated(By.xpath(padreXpath)), 10000);
      await driver.wait(until.elementIsVisible(divPadre), 5000);
      const divHijo  = await divPadre.findElement(By.xpath(hijoXpath));
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", divHijo);
      await driver.executeScript("arguments[0].click();", divHijo);
      await driver.sleep(5000);

      const modalFiltros = await driver.wait(
        until.elementLocated(By.xpath('//*[starts-with(@id,"qb_")]')),
        15000
      );
      await driver.wait(until.elementIsVisible(modalFiltros), 5000);

      // === Paso 5: Desplegar select de filtros ===
      const grupoFiltro = await driver.wait(
        until.elementLocated(By.xpath('//*[starts-with(@id,"qb_") and contains(@id,"_rule_0")]')),
        10000
      );
      const contenedorFiltro = await grupoFiltro.findElement(By.css('.rule-filter-container'));
      const selectFiltro     = await contenedorFiltro.findElement(By.css('select'));
      await driver.wait(until.elementIsVisible(selectFiltro), 5000);
      await driver.wait(until.elementIsEnabled(selectFiltro), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", selectFiltro);
      await selectFiltro.click();
      await driver.sleep(2000);
      console.log("✅ Select de filtros desplegado.");

      // === Paso 6: Seleccionar "ID_DEAL" ===
      const selectCampo = await grupoFiltro.findElement(By.css('select'));
      await driver.wait(until.elementIsVisible(selectCampo), 5000);
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", selectCampo);
      await selectCampo.click();
      await driver.sleep(500);
      await selectCampo.sendKeys("ID_DEAL");
      await driver.sleep(2000);

      // === Paso 7: Diligenciar el campo de ID_DEAL ===
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

      // === Paso 8: Clic en "Aplicar filtros" ===
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
  }

