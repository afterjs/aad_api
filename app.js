const express = require("express");
const app = express();
const config = require("./src/config/");
const db = require("./src/config/database");
const route = require("./src/routes");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./src/documentation/swagger.json");
const cors = require('cors')

app.use(cors())
app.use(express.json());


app.use(`${config.envConfig.app.pathPrefix}/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(`${config.envConfig.app.pathPrefix}/info`, route.info);
app.use(`${config.envConfig.app.pathPrefix}/employee`, route.employee);
app.use(`${config.envConfig.app.pathPrefix}/speciality`, route.speciality);
app.use(`${config.envConfig.app.pathPrefix}/material`, route.material);
app.use(`${config.envConfig.app.pathPrefix}/project`, route.project)


app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      let formattedError = {
        message: "JSON syntax error",
        info: {
          status: err.statusCode,
          message: "You have an invalid JSON format in your body",
          json_data_error: err.body,
        },
      };
      return res.status(err.statusCode).json(formattedError);
    }
    next();
  });
  
  app.use((req, res) => {
    res.status(404).json({
      error: {
        name: "Route not found",
        statusCode: 404,
        documentation: `http://${config.envConfig.app.hostname}:${config.envConfig.app.port}${config.envConfig.app.pathPrefix}/documentation/`,
      },
      message: "This route does not exist",
    });
  });

db.connect()
  .then(() => {
    app.listen(config.envConfig.app.port, () => console.log(`Server running on port http://${config.envConfig.app.hostname}:${config.envConfig.app.port}`));
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error.message);
    process.exit(1); 
});
