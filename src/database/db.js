import oracledb from "oracledb";
import dotenv from "dotenv";

dotenv.config();

oracledb.initOracleClient();

export async function testConnection() {
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT_STRING,
    });
    console.log("Conexión exitosa a Oracle DB ✅");
    return connection;
  } catch (err) {
    console.error("Error de conexión ❌:", err.message);
    throw err;
  }
}

// 🔎 Ejemplo de consulta a tabla SCCUSTOMER
export async function getCustomers(limit = 5) {
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT_STRING,
    });

    const result = await connection.execute(
      `SELECT * FROM SCCUSTOMER FETCH FIRST :limit ROWS ONLY`,
      { limit },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return result.rows;
  } finally {
    if (connection) await connection.close();
  }
}

// ✅ Consulta genérica (ej: SELECT * FROM tabla WHERE campo=:valor)
// export async function getRecord(table, conditions = {}) {
//   const conn = await getConnection();
//   try {
//     const whereClauses = Object.keys(conditions)
//       .map((col, i) => `${col} = :param${i}`)
//       .join(" AND ");

//     const binds = {};
//     Object.keys(conditions).forEach((col, i) => {
//       binds[`param${i}`] = conditions[col];
//     });

//     const result = await conn.execute(
//       `SELECT * FROM ${table} ${whereClauses ? "WHERE " + whereClauses : ""}`,
//       binds,
//       { outFormat: oracledb.OUT_FORMAT_OBJECT }
//     );

//     return result.rows;
//   } finally {
//     await conn.close();
//   }
// }

// // ✅ Update genérico (ej: UPDATE tabla SET campo=:nuevo WHERE id=:id)
// export async function updateRecord(table, updates = {}, conditions = {}) {
//   const conn = await getConnection();
//   try {
//     const setClauses = Object.keys(updates)
//       .map((col, i) => `${col} = :u${i}`)
//       .join(", ");

//     const whereClauses = Object.keys(conditions)
//       .map((col, i) => `${col} = :c${i}`)
//       .join(" AND ");

//     const binds = {};
//     Object.keys(updates).forEach((col, i) => {
//       binds[`u${i}`] = updates[col];
//     });
//     Object.keys(conditions).forEach((col, i) => {
//       binds[`c${i}`] = conditions[col];
//     });

//     await conn.execute(
//       `UPDATE ${table} SET ${setClauses} WHERE ${whereClauses}`,
//       binds,
//       { autoCommit: true }
//     );

//     return true;
//   } finally {
//     await conn.close();
//   }
// }