import { By, until } from "selenium-webdriver";

// ============================================================
// Función: seleccionarClientePorIdOrden
// Descripción: Busca y selecciona un registro en el grid por ID de orden.
// Vistas que la utilizan:
// - Gestor de Órdenes
// ============================================================
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

// ============================================================
// Función: seleccionarClientePorIdOrden
// Descripción: Busca y selecciona un registro en el grid por ID DEAL.
// Vistas que la utilizan:
// - Gestor de clientes Servicios Domiciliarios
// ============================================================
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

// Otros helpers genericos que se podrían reutilizar, pendientes por implementar...

// // ============================================================
// // Funcion: Clic por XPath
// // ============================================================
// export async function clickXpath(driver, xpath, descripcion, timeout = 20000) {
//   const elem = await driver.wait(until.elementLocated(By.xpath(xpath)), timeout);
//   await driver.wait(until.elementIsVisible(elem), 5000);
//   await scrollToElement(driver, elem);
//   await safeClick(driver, elem);
//   await driver.sleep(1000);
//   console.log(`✅ ${descripcion} ejecutado correctamente.`);
// }

// // ============================================================
// // Funcion: Cerrar modal por XPath
// // ============================================================
// export async function cerrarModal(driver, xpath, descripcion, timeout = 15000) {
//   const btnCerrar = await driver.wait(until.elementLocated(By.xpath(xpath)), timeout);
//   await driver.wait(until.elementIsVisible(btnCerrar), 5000);
//   await scrollToElement(driver, btnCerrar);
//   await safeClick(driver, btnCerrar);

//   try {
//     await driver.wait(async () => !(await btnCerrar.isDisplayed().catch(() => false)), 8000);
//   } catch {
//     console.log(`⚠️ ${descripcion}: el modal puede no haberse ocultado completamente.`);
//   }

//   console.log(`✅ ${descripcion} completado.`);
// }

// // ============================================================
// // Funcion: Utilidad para hacer scroll a un elemento
// // ============================================================
// export async function scrollToElement(driver, element) {
//   try {
//     await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", element);
//     await driver.sleep(300);
//   } catch (e) {
//     console.log("⚠️ No se pudo hacer scroll al elemento:", e.message);
//   }
// }

// // ============================================================
// // Funcion: Clic seguro con fallback a JavaScript
// // ============================================================
// export async function safeClick(driver, element) {
//   try {
//     await element.click();
//   } catch {
//     await driver.executeScript("arguments[0].click();", element);
//   }
// }

