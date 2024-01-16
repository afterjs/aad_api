const express = require("express");
const controller = require("../controllers");
const router = express.Router();


router.post("/", controller.speciality.createSpeciality); //done
router.get("/", controller.speciality.getSpecialities); //done
router.delete("/:idEspecialidade", controller.speciality.deleteSpeciality) //done
router.put("/:idEspecialidade", controller.speciality.updateSpeciality) //done

module.exports = router;