const sql = require("mssql");
const envConfig = require("./envConfig");

const pool = new sql.ConnectionPool({
  user: envConfig.mssql.user,
  password: envConfig.mssql.password,
  server: envConfig.mssql.server,
  database: envConfig.mssql.database,
  port: parseInt(envConfig.mssql.port),
  options: {
    encrypt: false,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
});


async function connect() {
  try {
    await pool.connect();
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    throw error;
  }
}

async function disconnect() {
  try {
    await pool.close();
    console.log("Disconnected from the database");
  } catch (error) {
    console.error("Error disconnecting from the database:", error.message);
    throw error;
  }
}

module.exports = {
  pool,
  connect,
  disconnect,
};
