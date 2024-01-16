CREATE TABLE Funcionarios (
  idFuncionario integer IDENTITY(1,1), 
  Nome          varchar(100) NOT NULL, 
  Telefone      integer NOT NULL, 
  Morada        varchar(100) NOT NULL, 
  CodigoPostal  integer NOT NULL, 
  Especialidade integer NOT NULL, 
  Departamento  integer NOT NULL, 
  PRIMARY KEY (idFuncionario));
CREATE TABLE CodigoPostal (
  codigoPostal integer , 
  Localidade   varchar(100) NOT NULL, 
  PRIMARY KEY (codigoPostal));
CREATE TABLE Especialidade (
  idEspecialidade integer IDENTITY(1,1), 
  Nome            varchar(100) NOT NULL, 
  Descricao       varchar(100) NOT NULL, 
  PRIMARY KEY (idEspecialidade));
CREATE TABLE Departamento (
  idDepartamento integer IDENTITY(1,1), 
  Nome           varchar(100) NOT NULL, 
  Descricao      varchar(100) NOT NULL, 
  PRIMARY KEY (idDepartamento));
CREATE TABLE Instituto (
  idInstituto  integer IDENTITY(1,1), 
  Nome         varchar(100) NOT NULL, 
  Descricao    varchar(100) NOT NULL, 
  Responsavel  varchar(100) NOT NULL, 
  Morada       varchar(100) NOT NULL, 
  CodigoPostal integer NOT NULL, 
  PRIMARY KEY (idInstituto));
CREATE TABLE Contato (
  IdTipo      integer NOT NULL, 
  idInstituto integer NOT NULL, 
  Contato     varchar(100) NOT NULL);
CREATE TABLE TipoContato (
  idTipo    integer IDENTITY(1,1), 
  Nome      varchar(100) NOT NULL, 
  Descricao varchar(100) NOT NULL, 
  PRIMARY KEY (idTipo));
CREATE TABLE Projeto (
  idProjeto    integer IDENTITY(1,1), 
  Nome         varchar(100) NOT NULL, 
  Morada       varchar(100) NOT NULL, 
  CodigoPostal integer NOT NULL, 
  DataInicio   date NOT NULL, 
  DataFim      date NOT NULL, 
  Descricao    varchar(100) NOT NULL, 
  PRIMARY KEY (idProjeto));
CREATE TABLE ProjetoFuncionario (
  IdFuncionario integer NOT NULL, 
  IdProjeto     integer NOT NULL);
CREATE TABLE Materiais (
  idMat     integer IDENTITY(1,1), 
  Nome      varchar(100) NOT NULL, 
  Descricao varchar(100) NOT NULL, 
  Preco     varchar(100) NOT NULL, 
  PRIMARY KEY (idMat));
CREATE TABLE ProjetoMateriais (
  idProjeto     integer NOT NULL, 
  idMaterial    integer NOT NULL, 
  faseProjetoid integer NOT NULL, 
  Quantidade    integer);
CREATE TABLE ProjetoInstituto (
  idProjeto   integer NOT NULL, 
  idInstituto integer NOT NULL);
CREATE TABLE Residentes (
  idResidente integer IDENTITY(1,1), 
  Nome        varchar(100) NOT NULL, 
  Curso       varchar(100) NOT NULL, 
  Idade       integer NOT NULL, 
  Quarto      integer NOT NULL, 
  idProjeto   integer NOT NULL, 
  PRIMARY KEY (idResidente));
CREATE TABLE Orcamento (
  idOrcamento    integer IDENTITY(1,1), 
  idProjeto      integer NOT NULL, 
  faseProjetoid  integer NOT NULL, 
  ValorMonetario integer NOT NULL, 
  data           date, 
  PRIMARY KEY (idOrcamento));
CREATE TABLE Investidores (
  idInvestidor integer IDENTITY(1,1), 
  Nome         varchar(100) NOT NULL, 
  CodigoPostal integer NOT NULL, 
  Morada       varchar(100) NOT NULL, 
  Contato      integer NOT NULL, 
  PRIMARY KEY (idInvestidor));
CREATE TABLE Doacao (
  idDoacao       integer IDENTITY(1,1), 
  idProjeto      integer NOT NULL, 
  idInvestidor   integer NOT NULL, 
  ValorMonetario integer NOT NULL, 
  Data           date NOT NULL, 
  DataEmissao    date NOT NULL, 
  PRIMARY KEY (idDoacao));
CREATE TABLE faseProjeto (
  id               integer IDENTITY(1,1), 
  ProjetoidProjeto integer NOT NULL, 
  descricao        varchar(100), 
  data             date, 
  especialidade    varchar(10), 
  PRIMARY KEY (id));
ALTER TABLE ProjetoFuncionario ADD CONSTRAINT FKProjetoFun744740 FOREIGN KEY (IdProjeto) REFERENCES Projeto (idProjeto);
ALTER TABLE ProjetoFuncionario ADD CONSTRAINT FKProjetoFun632117 FOREIGN KEY (IdFuncionario) REFERENCES Funcionarios (idFuncionario);
ALTER TABLE Funcionarios ADD CONSTRAINT FKFuncionari8234 FOREIGN KEY (Departamento) REFERENCES Departamento (idDepartamento);
ALTER TABLE Funcionarios ADD CONSTRAINT FKFuncionari44964 FOREIGN KEY (Especialidade) REFERENCES Especialidade (idEspecialidade);
ALTER TABLE Residentes ADD CONSTRAINT FKResidentes137679 FOREIGN KEY (idProjeto) REFERENCES Projeto (idProjeto);
ALTER TABLE Orcamento ADD CONSTRAINT FKOrcamento275982 FOREIGN KEY (idProjeto) REFERENCES Projeto (idProjeto);
ALTER TABLE Contato ADD CONSTRAINT FKContato537778 FOREIGN KEY (idInstituto) REFERENCES Instituto (idInstituto);
ALTER TABLE Contato ADD CONSTRAINT FKContato176154 FOREIGN KEY (IdTipo) REFERENCES TipoContato (idTipo);
ALTER TABLE Projeto ADD CONSTRAINT FKProjeto807108 FOREIGN KEY (CodigoPostal) REFERENCES CodigoPostal (codigoPostal);
ALTER TABLE Instituto ADD CONSTRAINT FKInstituto499291 FOREIGN KEY (CodigoPostal) REFERENCES CodigoPostal (codigoPostal);
ALTER TABLE Funcionarios ADD CONSTRAINT FKFuncionari222452 FOREIGN KEY (CodigoPostal) REFERENCES CodigoPostal (codigoPostal);
ALTER TABLE Investidores ADD CONSTRAINT FKInvestidor492947 FOREIGN KEY (CodigoPostal) REFERENCES CodigoPostal (codigoPostal);
ALTER TABLE ProjetoMateriais ADD CONSTRAINT FKProjetoMat204018 FOREIGN KEY (idMaterial) REFERENCES Materiais (idMat);
ALTER TABLE ProjetoMateriais ADD CONSTRAINT FKProjetoMat301578 FOREIGN KEY (idProjeto) REFERENCES Projeto (idProjeto);
ALTER TABLE ProjetoInstituto ADD CONSTRAINT FKProjetoIns858705 FOREIGN KEY (idInstituto) REFERENCES Instituto (idInstituto);
ALTER TABLE ProjetoInstituto ADD CONSTRAINT FKProjetoIns751934 FOREIGN KEY (idProjeto) REFERENCES Projeto (idProjeto);
ALTER TABLE Doacao ADD CONSTRAINT FKDoacao744834 FOREIGN KEY (idProjeto) REFERENCES Projeto (idProjeto);
ALTER TABLE Doacao ADD CONSTRAINT FKDoacao696951 FOREIGN KEY (idInvestidor) REFERENCES Investidores (idInvestidor);
ALTER TABLE faseProjeto ADD CONSTRAINT FKfaseProjet875553 FOREIGN KEY (ProjetoidProjeto) REFERENCES Projeto (idProjeto);
ALTER TABLE ProjetoMateriais ADD CONSTRAINT FKProjetoMat212 FOREIGN KEY (faseProjetoid) REFERENCES faseProjeto (id);
ALTER TABLE Orcamento ADD CONSTRAINT FKOrcamento996974 FOREIGN KEY (faseProjetoid) REFERENCES faseProjeto (id);



CREATE PROCEDURE DeleteProjet
    @idProjeto INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRANSACTION;

    BEGIN TRY
        DELETE FROM ProjetoFuncionario
        WHERE idProjeto = @idProjeto;

        DELETE FROM Projeto
        WHERE idProjeto = @idProjeto;

        COMMIT;
    END TRY
    BEGIN CATCH
        ROLLBACK;
    END CATCH
END;