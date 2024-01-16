const express = require("express");
const controller = require("../controllers");
const router = express.Router();


router.post("/", controller.project.createProject); //done
router.get("/projects", controller.project.getAllProjects); //done
router.delete("/:idProjeto", controller.project.deleteProject); //done
router.get("/:idProjeto/residents/:minAge", controller.project.getProjectAndResidentInformationByMinAge); //done 
router.get("/employees/:idProjeto", controller.project.getProjetAndEmployeesInformation); //done
router.put("/:idProjeto", controller.project.updateProject); // done

module.exports = router;