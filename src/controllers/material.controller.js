const { validate } = require("../utils/validator");
const services = require("../services");

const createMaterial = async (req, res) => {
  const schema = {
    Nome: { type: "string", min: 5, max: 20 },
    Descricao: { type: "string", min: 5, max: 20 },
    Preco: { type: "number" },
  };

  const isValidated = validate(schema, req.body);

  if (isValidated != true) {
    return res.status(400).json(isValidated);
  }

  try {
    let result = await services.material.createMaterial(req.body);

    return res.status(200).json({
      message: "Material created successfully",
      data: result,
    });
  } catch (err) {
    if (err.message === "Material with the same name already exists") {
      return res.status(400).json({
        message: "Material with the same name already exists",
      });
    }

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getMaterials = async (req, res) => {
  try {
    let result = await services.material.getMaterials();

    return res.status(200).json({ data: result });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateMaterial = async (req, res) => {
  const schema = {
    idMat: { type: "number" },
    Nome: { type: "string", min: 5, max: 20 },
    Descricao: { type: "string", min: 5, max: 20 },
    Preco: { type: "number" },
  };

  const data = {
    idMat: parseInt(req.params.idMat),
    ...req.body,
  };

  const isValidated = validate(schema, data);

  if (isValidated != true) {
    return res.status(400).json(isValidated);
  }

  try {
    let result = await services.material.updateMaterial(data);

    return res.status(200).json({
      message: "Material updated successfully",
      data: result,
    });
  } catch (err) {
    console.log(err)
    if (err.message.includes("does not exist")) {
      return res.status(404).json({ error: err.message });
    }

    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  createMaterial,
  getMaterials,
  updateMaterial,
};
