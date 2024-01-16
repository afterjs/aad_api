const { validate } = require("../utils/validator");
const services = require("../services");

const createEmployee = async (req, res) => {
  const schema = {
    Nome: { type: "string", min: 5, max: 20 },
    Telefone: { type: "number", length: 15 },
    Morada: { type: "string", min: 5, max: 20 },
    idEspecialidade: { type: "number" },
    idDepartamento: { type: "number" },
    codigoPostal: { type: "string", min: 5, max: 20 },
    Localidade: { type: "string", min: 5, max: 30 },
  };

  const isValidated = validate(schema, req.body);

  if (isValidated != true) {
    return res.status(400).json(isValidated);
  }

  try {
    let result = await services.employee.createEmployee(req.body);

    return res.status(200).json({
      message: "Employee created successfully",
      data: result,
    });
  } catch (err) {
    if (err.code === "EREQUEST" && err.number === 547) {
      const matches = err.message.match(/FOREIGN KEY constraint "(.*?)"/);
      const foreignKeyName = matches ? matches[1] : "unknown";

      return res.status(400).json({
        error: `Foreign key constraint violation. The referenced record does not exist. Violated constraint: ${foreignKeyName}`,
        message: err.message,
      });
    } else {
      console.error("Error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};


module.exports = {
  createEmployee
};
