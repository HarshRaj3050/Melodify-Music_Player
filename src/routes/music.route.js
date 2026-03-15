const express = require("express");
const musicController = require("../controllers/music.controller");
const multer = require("multer");
const authMiddleware = require('../middleware/auth.middleware');

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const router = express.Router();

router.post("/create", authMiddleware.authArtist, upload.single("music"), musicController.createMusic);
router.post("/album", authMiddleware.authArtist, musicController.createAlbum);

router.get('/', musicController.getAllMusic);

module.exports = router;