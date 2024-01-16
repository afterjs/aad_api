const database = require("../config/database");
var sql = require("mssql");

const createMaterial = async (data) => {
  try {
    const materialsResult = await database.pool.request()
    .input("Nome", sql.NVarChar, data.Nome).query("SELECT * FROM Materiais WHERE LOWER(Nome) = LOWER(@Nome) ");

    if (materialsResult.recordsets[0].length === 0) {
      const insertMaterialsResult = await database.pool.request()
      .input("Nome", sql.NVarChar, data.Nome)
      .input("Descricao", sql.NVarChar, data.Descricao)
      .input("Preco", sql.Float, data.Preco).query("INSERT Materiais(Nome, Descricao, Preco)  OUTPUT INSERTED.idMat, INSERTED.Nome, INSERTED.Descricao, INSERTED.Preco VALUES (@Nome, @Descricao, @Preco)");

      return insertMaterialsResult.recordsets[0][0];
    } else {
      throw new Error("Material with the same name already exists");
    }
  } catch (error) {
    throw error;
  }
};

const getMaterials = async () => {
  try {
    const materialsResult = await database.pool.request().query("SELECT * FROM Materiais");

    return materialsResult.recordsets[0];
  } catch (error) {
    throw error;
  }
};

const updateMaterial = async (data) => {
    try {
        const { idMat, Nome, Descricao, Preco } = data;
    
     const checkResult = await database.pool
          .request()
          .input("idMat", sql.Int, idMat)
          .query("SELECT COUNT(*) AS materialsCount FROM Materiais WHERE idMat = @idMat");
    
        const materialsCount = checkResult.recordsets[0][0].materialsCount;
    
        if (materialsCount === 0) {
          throw new Error(`Materials with idMat ${idMat} does not exist.`);
        }
          
        const updateResult = await database.pool
          .request()
          .input("idMat", sql.Int, idMat)
          .input("Nome", sql.NVarChar, Nome)
          .input("Descricao", sql.NVarChar, Descricao)
          .input("Preco", sql.Float, Preco)
          .query("UPDATE Materiais SET Nome = @Nome, Descricao = @Descricao, Preco = @Preco WHERE idMat = @idMat");
    
        return data;
      } catch (error) {
        throw error;
      }
}


module.exports = {
  createMaterial,
  getMaterials,
  updateMaterial
};
