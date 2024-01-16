const { validate } = require("../utils/validator");
const services = require("../services");

const createProject = async (req, res) => {
  const schema = {
    Nome: { type: "string", min: 5, max: 20 },
    Morada: { type: "string", min: 5, max: 50 },
    codigoPostal: { type: "string", min: 1, max: 20 },
    Localidade: { type: "string", min: 1, max: 50, optional: true },
    DataInicio: { type: "string" },
    DataFim: { type: "string" },
    Descricao: { type: "string", min: 5, max: 150 },
    idFuncionario: { type: "array", itemType: "number" },
  };

  const isValidated = validate(schema, req.body);

  if (isValidated != true) {
    return res.status(400).json(isValidated);
  }

  try {
    let result = await services.project.createProject(req.body);

    return res.status(200).json({
      message: "Project created successfully",
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
    } else if (err.message.includes(`User with idFuncionario`)) {
      return res.status(404).json({
        error: `User not found. ${err.message}. Cannont create project`,
      });
    } else {
      console.error("Error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

const deleteProject = async (req, res) => {
  const schema = {
    idProjeto: { type: "number" },
  };

  const isValidated = validate(schema, { idProjeto: parseInt(req.params.idProjeto) });

  if (isValidated != true) {
    return res.status(400).json(isValidated);
  }

  try {
    let data = await services.project.deleteProject(parseInt(req.params.idProjeto));
    return res.status(200).json(data);
  } catch (err) {
    if (err.number === 547) {
      return res.status(400).json({ error: "Cannot delete project with associated records." });
    } else if (err.message.includes("does not exist")) {
      return res.status(404).json({ error: err.message });
    } else {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

const getProjectAndResidentInformationByMinAge = async (req, res) => {
  const schema = {
    idProjeto: { type: "number" },
    minAge: { type: "number" },
  };

  const isValidated = validate(schema, { idProjeto: parseInt(req.params.idProjeto), minAge: parseInt(req.params.minAge) });

  if (isValidated != true) {
    return res.status(400).json(isValidated);
  }

  try {
    let result = await services.project.getProjectAndResidentInformationByMinAge(parseInt(req.params.idProjeto), parseInt(req.params.minAge));

    return res.status(200).json({ data: result });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getProjetAndEmployeesInformation = async (req, res) => {
  const schema = {
    idProjeto: { type: "number" },
  };

  const isValidated = validate(schema, { idProjeto: parseInt(req.params.idProjeto) });

  if (isValidated != true) {
    return res.status(400).json(isValidated);
  }

  try {
    let result = await services.project.getProjetAndEmployeesInformation(parseInt(req.params.idProjeto));

    return res.status(200).json({ data: result });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllProjects = async (req, res) => {
    try {
        let result = await services.project.getAllProjects();
        return res.status(200).json({ data: result });
        } catch (err) {
        return res.status(500).json({ error: "Internal Server Error", message: err.message });
    }
};

const updateProject = async (req, res) => {
  const schema = {
    Nome: { type: "string", min: 5, max: 20 },
    Morada: { type: "string", min: 5, max: 50 },
    codigoPostal: { type: "string", min: 1, max: 20 },
    Localidade: { type: "string", min: 1, max: 50, optional: true },
    DataInicio: { type: "string" },
    DataFim: { type: "string" },
    Descricao: { type: "string", min: 5, max: 150 },
  };

  const data = {
    idProjeto: parseInt(req.params.idProjeto),
    ...req.body,
  };

  const isValidated = validate(schema, data);

  if (isValidated != true) {
    return res.status(400).json(isValidated);
  }

  try {
    let result = await services.project.updateProject(data);

    return res.status(200).json({
      message: "Project updated successfully",
      data: result,
    });
  } catch (err) {
    console.log(err);
    if (err.message.includes("does not exist")) {
      return res.status(404).json({ error: err.message });
    }

    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  createProject,
  deleteProject,
  getProjectAndResidentInformationByMinAge,
  getProjetAndEmployeesInformation,
  updateProject,
  getAllProjects
};
