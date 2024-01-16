const express = require("express");
const controller = require("../controllers");
const router = express.Router();


router.post("/", controller.employee.createEmployee); //done

module.exports = router;