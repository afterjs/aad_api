const { validate } = require("../utils/validator");
const services = require("../services");

const createSpeciality = async (req, res) => {
  const schema = {
    Nome: { type: "string", min: 5, max: 20 },
    Descricao: { type: "string", min: 5, max: 50 },
  };

  const isValidated = validate(schema, req.body);

  if (isValidated != true) {
    return res.status(400).json(isValidated);
  }

  try {
    let result = await services.speciality.createSpeciality(req.body);

    return res.status(200).json({
      message: "Speciality created successfully",
      data: result,
    });
  } catch (err) {
    if (err.message === "Specialty with the same name already exists") {
      return res.status(400).json({
        message: "Specialty with the same name already exists",
      });
    }

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getSpecialities = async (req, res) => {
  try {
    let result = await services.speciality.getSpecialities();

    return res.status(200).json({ data: result });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteSpeciality = async (req, res) => {
  const schema = {
    idEspecialidade: { type: "number" },
  };

  const isValidated = validate(schema, { idEspecialidade: parseInt(req.params.idEspecialidade) });

  if (isValidated != true) {
    return res.status(400).json(isValidated);
  }

  try {
    let data = await services.speciality.deleteSpeciality(parseInt(req.params.idEspecialidade));
    return res.status(200).json(data);
  } catch (err) {
    if (err.number === 547) {
      return res.status(400).json({ error: "Cannot delete speciality with associated records." });
    } else if (err.message.includes("does not exist")) {
      return res.status(404).json({ error: err.message });
    } else {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

const updateSpeciality = async (req, res) => {
  const schema = {
    idEspecialidade: { type: "number" },
    Nome: { type: "string", min: 5, max: 20 },
    Descricao: { type: "string", min: 5, max: 50 },
  };

  const isValidated = validate(schema, { idEspecialidade: parseInt(req.params.idEspecialidade), ...req.body });

  if (isValidated != true) {
    return res.status(400).json(isValidated);
  }

  const data = {
    idEspecialidade: parseInt(req.params.idEspecialidade),
    ...req.body,
  };

  try {
    let result = await services.speciality.updateSpeciality(data);

    return res.status(200).json({
      message: "Speciality updated successfully",
      data: result,
    });
  } catch (err) {
    if (err.message.includes("does not exist")) {
      return res.status(404).json({ error: err.message });
    }

    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  createSpeciality,
  getSpecialities,
  deleteSpeciality,
  updateSpeciality,
};
