const express = require("express");
const controller = require("../controllers");
const router = express.Router();


router.post("/", controller.material.createMaterial); //done
router.get("/", controller.material.getMaterials); //done
router.put("/:idMat", controller.material.updateMaterial); //done


module.exports = router;