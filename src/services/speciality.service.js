const database = require("../config/database");
var sql = require("mssql");

const createSpeciality = async (data) => {
  try {
    const specialtyResult = await database.pool.request().input("Nome", sql.NVarChar, data.Nome).query("SELECT * FROM Especialidade WHERE LOWER(Nome) = LOWER(@Nome) ");

    if (specialtyResult.recordsets[0].length === 0) {
      const insertSpecialtyResult = await database.pool.request().input("Nome", sql.NVarChar, data.Nome).input("Descricao", sql.NVarChar, data.Descricao).query("INSERT Especialidade(Nome, Descricao)  OUTPUT INSERTED.idEspecialidade, INSERTED.Nome, INSERTED.Descricao VALUES (@Nome, @Descricao)");

      return insertSpecialtyResult.recordsets[0][0];
    } else {
      throw new Error("Specialty with the same name already exists");
    }
  } catch (error) {
    throw error;
  }
};

const getSpecialities = async () => {
  try {
    const specialitiesResult = await database.pool.request().query("SELECT * FROM Especialidade");

    return specialitiesResult.recordsets[0];
  } catch (error) {
    throw error;
  }
};

const deleteSpeciality = async (idEspecialidade) => {
  try {
    const checkResult = await database.pool.request().input("idEspecialidade", sql.Int, idEspecialidade).query("SELECT COUNT(*) AS specialityCount FROM Especialidade WHERE idEspecialidade = @idEspecialidade");

    const specialityCount = checkResult.recordsets[0][0].specialityCount;

    if (specialityCount === 0) {
      throw new Error(`Speciality with idEspecialidade ${idEspecialidade} does not exist.`);
    }

    const deleteResult = await database.pool.request().input("idEspecialidade", sql.Int, idEspecialidade).query("DELETE FROM Especialidade WHERE idEspecialidade = @idEspecialidade");

    return deleteResult.rowsAffected[0];
  } catch (error) {
    throw error;
  }
};


const updateSpeciality = async (data) => {
    try {
      const { idEspecialidade, Nome, Descricao } = data;
  
   
      const checkResult = await database.pool
        .request()
        .input("idEspecialidade", sql.Int, idEspecialidade)
        .query("SELECT COUNT(*) AS specialityCount FROM Especialidade WHERE idEspecialidade = @idEspecialidade");
  
      const specialityCount = checkResult.recordsets[0][0].specialityCount;
  
      if (specialityCount === 0) {
        throw new Error(`Speciality with idEspecialidade ${idEspecialidade} does not exist.`);
      }

      const updateResult = await database.pool
        .request()
        .input("idEspecialidade", sql.Int, idEspecialidade)
        .input("Nome", sql.NVarChar(20), Nome)
        .input("Descricao", sql.NVarChar(20), Descricao)
        .query("UPDATE Especialidade SET Nome = @Nome, Descricao = @Descricao WHERE idEspecialidade = @idEspecialidade");
  
      return data;
    } catch (error) {
      throw error;
    }
  };

module.exports = {
  createSpeciality,
  getSpecialities,
  deleteSpeciality,
  updateSpeciality
};
