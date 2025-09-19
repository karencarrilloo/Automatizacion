import { Builder } from "selenium-webdriver";
import { expect } from "chai";
import CustomerPage from "../pages/customer.page.js";
import { getRecord } from "../database/db.js";

describe("Validación UI vs BD - Actualización de cliente", function () {
  this.timeout(40000);
  let driver, customerPage;

  const CUSTOMER_ID = "C001";
  const NEW_STATUS = "ACTIVE";

  before(async () => {
    driver = await new Builder().forBrowser("chrome").build();
    customerPage = new CustomerPage(driver);
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it("Debería reflejar en la BD la actualización hecha en UI", async () => {
    // Paso 1: Navegar a la vista de clientes
    await customerPage.open();

    // Paso 2: Actualizar estado en UI
    await customerPage.updateCustomerStatus(CUSTOMER_ID, NEW_STATUS);

    // Paso 3: Validar en BD usando función genérica
    const customer = await getRecord("SCCUSTOMER", { ID: CUSTOMER_ID });
    console.log("Cliente en BD:", customer[0]);

    expect(customer[0].STATUS).to.equal(NEW_STATUS);
  });
});
