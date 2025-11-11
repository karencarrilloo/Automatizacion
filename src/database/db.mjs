import { expect } from "chai";
import { testConnection, getCustomers} from "./db.js";

describe("Conexión a la bd de dev celsia", function () {
  this.timeout(20000);

  it("Conexion a la BD", async () => {
    const conn = await testConnection();
    expect(conn).to.not.be.null;
    await conn.close();
  });

  it("Mostrar registros de la tabla SCCUSTOMER", async () => {
    const customers = await getCustomers(1);
    console.log("Clientes:", customers);

    expect(customers).to.be.an("array");
    expect(customers.length).to.be.greaterThan(0);
  });

});