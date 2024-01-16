const database = require("../config/database");
var sql = require("mssql");

const createProject = async (data) => {
  let result;
  try {
    result = await database.pool.request().input("codigoPostal", sql.NVarChar, data.codigoPostal).query("SELECT * FROM CodigoPostal WHERE codigoPostal = @codigoPostal");
  } catch (error) {
    throw error;
  }

  if (result.recordsets[0].length >= 1) {
    const insertResult = await database.pool
      .request()
      .input("Nome", sql.NVarChar, data.Nome)
      .input("Morada", sql.NVarChar, data.Morada)
      .input("CodigoPostal", sql.NVarChar, data.codigoPostal)
      .input("DataInicio", sql.Date, data.DataInicio)
      .input("DataFim", sql.Date, data.DataFim)
      .input("Descricao", sql.NVarChar, data.Descricao)
      .query(`INSERT Projeto(Nome, Morada, CodigoPostal, DataInicio, DataFim, Descricao) OUTPUT INSERTED.idProjeto, INSERTED.Nome, INSERTED.Morada, INSERTED.CodigoPostal, INSERTED.DataInicio, INSERTED.DataFim, INSERTED.Descricao VALUES (@Nome, @Morada, @CodigoPostal, @DataInicio, @DataFim, @Descricao)`);

    return insertResult.recordsets[0][0];
  } else {
    const transaction = new sql.Transaction(database.pool);

    try {
      await transaction.begin();

      await transaction.request().input("codigoPostal", sql.NVarChar, data.codigoPostal).input("Localidade", sql.NVarChar, data.Localidade).query(`INSERT CodigoPostal(codigoPostal, Localidade) 
        VALUES (@codigoPostal, @Localidade)`);

      const insertResult = await transaction
        .request()
        .input("Nome", sql.NVarChar, data.Nome)
        .input("Morada", sql.NVarChar, data.Morada)
        .input("CodigoPostal", sql.NVarChar, data.codigoPostal)
        .input("DataInicio", sql.Date, data.DataInicio)
        .input("DataFim", sql.Date, data.DataFim)
        .input("Descricao", sql.NVarChar, data.Descricao)
        .query(`INSERT Projeto(Nome, Morada, CodigoPostal, DataInicio, DataFim, Descricao) OUTPUT INSERTED.idProjeto, INSERTED.Nome, INSERTED.Morada, INSERTED.CodigoPostal, INSERTED.DataInicio, INSERTED.DataFim, INSERTED.Descricao VALUES (@Nome, @Morada, @CodigoPostal, @DataInicio, @DataFim, @Descricao)`);

      for (const employeeId of data.idFuncionario) {
        const userExistsResult = await database.pool.request().input("idFuncionario", sql.Int, employeeId).query("SELECT COUNT(*) AS userCount FROM Funcionarios WHERE idFuncionario = @idFuncionario");

        const userCount = userExistsResult.recordsets[0][0].userCount;

        if (userCount === 0) {
          throw new Error(`User with idFuncionario ${employeeId} does not exist.`);
        }

        await transaction.request().input("idProjeto", sql.Int, insertResult.recordsets[0][0].idProjeto).input("idFuncionario", sql.Int, employeeId).query(`INSERT ProjetoFuncionario(idFuncionario, idProjeto) VALUES (@idFuncionario, @idProjeto)`);
      }


      await transaction.commit();
      return insertResult.recordsets[0][0];
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};

const deleteProject = async (idProjeto) => {
  try {
    const checkResult = await database.pool.request().input("idProjeto", sql.Int, idProjeto).query("SELECT COUNT(*) AS ProjectCount FROM Projeto WHERE idProjeto = @idProjeto");

    const Project = checkResult.recordsets[0][0].ProjectCount;

    if (Project === 0) {
      throw new Error(`Project with idProjeto ${idProjeto} does not exist.`);
    }

    const deleteResult = await database.pool.request().input("idProjeto", sql.Int, idProjeto).query("exec DeleteProject @idProjeto");

    return { message: "Project deleted" };
  } catch (error) {
    throw error;
  }
};

const getProjectAndResidentInformationByMinAge = async (idProjeto, minAge) => {
  try {
    const result = await database.pool.request().input("idProjeto", sql.Int, idProjeto).input("minAge", sql.Int, minAge).query(`SELECT 
    Projeto.Nome AS NomeProjeto,
    Projeto.Morada AS MoradaProjeto,
    CodigoPostal.Localidade AS LocalidadeProjeto,
    CodigoPostal.codigoPostal AS CodigoPostalProjeto,
    Projeto.DataInicio AS DataInicioProjeto, 
    Projeto.DataFim AS DataFimProjeto, 
    Projeto.Descricao AS DescricaoProjeto,
    CodigoPostal.Localidade AS ProjetoCodigoPostal,
    Residentes.idResidente AS ResidenteID,
    Residentes.Nome AS NomeResidente,
    Residentes.Curso AS CursoResidente,
    Residentes.idade AS IdadeResidente,
    Residentes.Quarto AS QuartoResidente
    FROM 
        Projeto
    LEFT JOIN 
        Residentes ON Projeto.idProjeto = Residentes.idProjeto
    LEFT JOIN 
        CodigoPostal ON Projeto.CodigoPostal = CodigoPostal.codigoPostal
    WHERE 
        Projeto.idProjeto =@idProjeto and Residentes.idade >= @minAge;`);

    return result.recordsets[0];
  } catch (error) {
    throw error;
  }
};

const getProjetAndEmployeesInformation = async (idProjeto) => {
  try {
    const result = await database.pool.request().input("idProjeto", sql.Int, idProjeto).query(`SELECT
        Projeto.idProjeto AS IdProjeto,
        Projeto.Nome AS NomeProjeto,
        Projeto.CodigoPostal AS CodigoPostalProjeto,
        Funcionarios.CodigoPostal AS CodigoPostalFuncionario,
        Departamento.idDepartamento AS IdDepartamento,
        Departamento.Nome AS NomeDepartamento,
        Funcionarios.idFuncionario AS IdFuncionario,
        Funcionarios.Nome AS NomeFuncionario,
        Especialidade.idEspecialidade AS idEspecialidade,
        Especialidade.Nome AS NomeEspecialidade
    FROM
        Projeto
    JOIN
        ProjetoFuncionario ON Projeto.idProjeto = ProjetoFuncionario.IdProjeto
    JOIN
        Funcionarios ON ProjetoFuncionario.IdFuncionario = Funcionarios.idFuncionario
    JOIN
        Especialidade ON Funcionarios.idEspecialidade = Especialidade.idEspecialidade
    JOIN
        CodigoPostal AS CPProjeto ON Projeto.CodigoPostal = CPProjeto.codigoPostal
    JOIN
        CodigoPostal AS CPFuncionario ON Funcionarios.CodigoPostal = CPFuncionario.codigoPostal
    JOIN
        Departamento ON Funcionarios.idDepartamento = Departamento.idDepartamento;`);
    return result.recordsets[0];
  } catch (error) {
    throw error;
  }
};

const updateProject = async (data) => {
  try {
    const checkResult = await database.pool.request().input("idProjeto", sql.Int, data.idProjeto).query("SELECT COUNT(*) AS projectCount FROM Projeto WHERE idProjeto = @idProjeto");

    const specialityCount = checkResult.recordsets[0][0].projectCount;

    if (specialityCount === 0) {
      throw new Error(`Project with idProjeto ${data.idProjeto} does not exist.`);
    }

    let result;
    try {
      result = await database.pool.request().input("codigoPostal", sql.NVarChar, data.codigoPostal).query("SELECT * FROM CodigoPostal WHERE codigoPostal = @codigoPostal");
    } catch (error) {
      throw error;
    }

    if (result.recordsets[0].length >= 1) {
      await database.pool.request().input("idProjeto", sql.Int, data.idProjeto).input("Nome", sql.NVarChar, data.Nome).input("Morada", sql.NVarChar, data.Morada).input("CodigoPostal", sql.NVarChar, data.codigoPostal).input("DataInicio", sql.Date, data.DataInicio).input("DataFim", sql.Date, data.DataFim).input("Descricao", sql.NVarChar, data.Descricao).query(`UPDATE Projeto SET Nome = @Nome, Morada = @Morada, CodigoPostal = @CodigoPostal, DataInicio = @DataInicio, DataFim = @DataFim, Descricao = @Descricao WHERE idProjeto = @idProjeto`);

      return data;
    } else {
      const transaction = new sql.Transaction(database.pool);

      try {
        await transaction.begin();

        await transaction.request().input("codigoPostal", sql.NVarChar, data.codigoPostal).input("Localidade", sql.NVarChar, data.Localidade).query(`INSERT CodigoPostal(codigoPostal, Localidade) 
              VALUES (@codigoPostal, @Localidade)`);

        await transaction.request().input("idProjeto", sql.Int, data.idProjeto).input("Nome", sql.NVarChar, data.Nome).input("Morada", sql.NVarChar, data.Morada).input("CodigoPostal", sql.NVarChar, data.codigoPostal).input("DataInicio", sql.Date, data.DataInicio).input("DataFim", sql.Date, data.DataFim).input("Descricao", sql.NVarChar, data.Descricao).query(`UPDATE Projeto SET Nome = @Nome, Morada = @Morada, CodigoPostal = @CodigoPostal, DataInicio = @DataInicio, DataFim = @DataFim, Descricao = @Descricao WHERE idProjeto = @idProjeto`);

        await transaction.commit();
        return data;
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    }

    return data;
  } catch (error) {
    throw error;
  }
};

const getAllProjects = async () => {
    let result;
    try {
      result = await database.pool.request().
      query("SELECT Projeto.*, CodigoPostal.Localidade FROM Projeto JOIN CodigoPostal ON Projeto.CodigoPostal=CodigoPostal.codigoPostal");
        return result.recordsets;
    } catch (error) {
      throw error;
    }
}
module.exports = {
  createProject,
  deleteProject,
  getProjectAndResidentInformationByMinAge,
  getProjetAndEmployeesInformation,
  updateProject,
  getAllProjects
};
