const database = require("../config/database");
var sql = require("mssql");

const createEmployee = async (data) => {
  let result;
  try {
    result = await database.pool.request().input("codigoPostal", sql.NVarChar, data.codigoPostal).query("SELECT * FROM CodigoPostal WHERE codigoPostal = @codigoPostal");
  } catch (error) {
    throw error;
  }

  if (result.recordsets[0].length >= 1) {
    const insertResult = await database.pool.request().input("codigoPostal", sql.NVarChar, data.codigoPostal).input("Nome", sql.NVarChar, data.Nome).input("Telefone", sql.Int, data.Telefone).input("Morada", sql.NVarChar, data.Morada).input("idEspecialidade", sql.Int, data.idEspecialidade).input("idDepartamento", sql.Int, data.idDepartamento).query(`INSERT Funcionarios(Nome, Telefone, Morada, CodigoPostal, idEspecialidade, idDepartamento) 
    OUTPUT INSERTED.idFuncionario, INSERTED.Nome, INSERTED.Telefone, INSERTED.Morada, INSERTED.CodigoPostal, INSERTED.idEspecialidade, INSERTED.idDepartamento
    VALUES(@Nome, @Telefone, @Morada, @CodigoPostal, @idEspecialidade, @idDepartamento)`);

    return insertResult.recordsets[0][0];
  } else {
    const transaction = new sql.Transaction(database.pool);

    try {
      await transaction.begin();
      await transaction.request().input("codigoPostal", sql.NVarChar, data.codigoPostal).input("Localidade", sql.NVarChar, data.Localidade).query(`INSERT CodigoPostal(codigoPostal, Localidade) 
        VALUES (@codigoPostal, @Localidade)`);

      const insertResult = await transaction.request().input("codigoPostal", sql.NVarChar, data.codigoPostal).input("Nome", sql.NVarChar, data.Nome).input("Telefone", sql.Int, data.Telefone).input("Morada", sql.NVarChar, data.Morada).input("idEspecialidade", sql.Int, data.idEspecialidade).input("idDepartamento", sql.Int, data.idDepartamento).query(`INSERT Funcionarios(Nome, Telefone, Morada, CodigoPostal, idEspecialidade, idDepartamento) 
        OUTPUT INSERTED.idFuncionario, INSERTED.Nome, INSERTED.Telefone, INSERTED.Morada, INSERTED.CodigoPostal, INSERTED.idEspecialidade, INSERTED.idDepartamento
        VALUES(@Nome, @Telefone, @Morada, @codigoPostal, @idEspecialidade, @idDepartamento)`);

      await transaction.commit();
      return insertResult.recordsets[0][0];
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};

module.exports = {
  createEmployee,
};
