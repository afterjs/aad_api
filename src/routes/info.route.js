const express = require("express");
const controller = require("../controllers");
const router = express.Router();


router.get("/", controller.info.getApiInfo); //done
router.get("/version", controller.info.getApiVersion); //done
router.get("/status", controller.info.isApiAlive); //done



module.exports = router;