require("dotenv").config();

module.exports = {
    app: {
      port: process.env.API_PORT || 8080,
      version:process.env.API_VERSION,
      hostname: process.env.HOSTNAME || 'localhost',
      pathPrefix: process.env.PATH_PREFIX
    },
    mssql: {
        server: process.env.MSSQL_SERVER,
        port: process.env.MSSQL_PORT,
        user: process.env.MSSQL_USER,
        password: process.env.MSSQL_PASSWORD,
        database: process.env.MSSQL_DATABASE
    }
};
