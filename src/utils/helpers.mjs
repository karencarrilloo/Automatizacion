// src/utils/helpers.mjs
import { By, until } from "selenium-webdriver";

/**
 * Selecciona un cliente por ID ORDEN //gestorOrdenes
 */
export async function seleccionarClientePorIdOrden(driver, idBuscar) {
  const posiblesGrids = [
    '//div[contains(@id,"grid-table-crud-grid") and contains(@id,"CustomerManager")]//table/tbody',
    '//div[contains(@id,"grid-table-crud-grid") and contains(@id,"orderViewerGestor")]//table/tbody',
  ];

  let cuerpoTabla = null;
  for (const gridXpath of posiblesGrids) {
    try {
      cuerpoTabla = await driver.wait(until.elementLocated(By.xpath(gridXpath)), 5000);
      if (cuerpoTabla) {
        console.log(`📋 Grid encontrado: ${gridXpath}`);
        break;
      }
    } catch {
      continue;
    }
  }

  if (!cuerpoTabla)
    throw new Error("❌ No se encontró un grid compatible en la vista actual.");

  await driver.wait(until.elementIsVisible(cuerpoTabla), 5000);
  const filas = await cuerpoTabla.findElements(By.xpath("./tr"));

  if (filas.length === 0)
    throw new Error("❌ No se encontraron filas en la tabla.");

  let filaSeleccionada = null;

  for (const fila of filas) {
    const textoFila = (await fila.getText()).trim();
    if (textoFila.includes(idBuscar)) {
      filaSeleccionada = fila;
      break;
    }
  }

  if (!filaSeleccionada)
    throw new Error(`❌ No se encontró cliente con ID ORDEN "${idBuscar}"`);

  await scrollToElement(driver, filaSeleccionada);
  await safeClick(driver, filaSeleccionada);

  await driver.sleep(800);
  console.log(`✅ Cliente con ID ORDEN "${idBuscar}" seleccionado correctamente.`);
}

/**
 * Selecciona un cliente por ID_DEAL //gestionClietesServiciosDomiciliarios
 */

export async function seleccionarClientePorIdDeal(driver, idBuscar) {
  const posiblesGrids = [
    '//div[contains(@id,"grid-table-crud-grid") and contains(@id,"CustomerManager")]//table/tbody',
    '//div[contains(@id,"grid-table-crud-grid") and contains(@id,"orderViewerGestor")]//table/tbody',
  ];

  let cuerpoTabla = null;
  for (const gridXpath of posiblesGrids) {
    try {
      cuerpoTabla = await driver.wait(until.elementLocated(By.xpath(gridXpath)), 5000);
      if (cuerpoTabla) {
        console.log(`📋 Grid encontrado: ${gridXpath}`);
        break;
      }
    } catch {
      continue;
    }
  }

  if (!cuerpoTabla)
    throw new Error("❌ No se encontró un grid compatible en la vista actual.");

  await driver.wait(until.elementIsVisible(cuerpoTabla), 5000);
  const filas = await cuerpoTabla.findElements(By.xpath("./tr"));

  if (filas.length === 0)
    throw new Error("❌ No se encontraron filas en la tabla.");

  let filaSeleccionada = null;

  for (const fila of filas) {
    const textoFila = (await fila.getText()).trim();
    if (textoFila.includes(idBuscar)) {
      filaSeleccionada = fila;
      break;
    }
  }

  if (!filaSeleccionada)
    throw new Error(`❌ No se encontró cliente con ID_DEAL "${idBuscar}"`);

  await scrollToElement(driver, filaSeleccionada);
  await safeClick(driver, filaSeleccionada);

  await driver.sleep(800);
  console.log(`✅ Cliente con ID_DEAL "${idBuscar}" seleccionado correctamente.`);
}

// Otros helpers que se podrían reutilizar...
/**
//  * Espera un elemento de forma segura (visible y habilitado) 
//  */
// export async function esperarElemento(driver, locator, timeout = 15000) {
//   const element = await driver.wait(until.elementLocated(locator), timeout);
//   await driver.wait(until.elementIsVisible(element), timeout / 2);
//   await driver.wait(until.elementIsEnabled(element), timeout / 2);
//   return element;
// }

// /**
//  * Realiza un clic seguro con fallback a JavaScript 
//  */
// export async function safeClick(driver, element) {
//   try {
//     await element.click();
//   } catch {
//     await driver.executeScript("arguments[0].click();", element);
//   }
// }

// /**
//  * Realiza scroll al elemento centrado en pantalla 
//  */
// export async function scrollToElement(driver, element) {
//   await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", element);
//   await driver.sleep(300);
// }

