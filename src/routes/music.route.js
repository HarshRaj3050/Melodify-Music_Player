const express = require("express");
const musicController = require("../controllers/music.controller");
const multer = require("multer");

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const router = express.Router();

router.post("/create", upload.single("music"), musicController.createMusic);

module.exports = router;