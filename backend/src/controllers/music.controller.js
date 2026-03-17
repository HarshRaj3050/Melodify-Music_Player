const musicModel = require('../models/music.model');
const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { uploadFile } = require("../services/storage.service");
const albumModel = require('../models/album.model');

async function createMusic(req, res) {

    const { title } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: "Music file is required" });
    }

    const result = await uploadFile(file.buffer.toString('base64'));

    const music = await musicModel.create({
        uri: result.url,
        title,
        artist: req.user.id
    })

    res.status(201).json({
        message: "Music created successfully!",
        music: {
            id: music._id,
            uri: music.uri,
            title: music.title,
            artist: music.artist
        }
    });
}

async function createAlbum(req, res) {

    const { title, musics } = req.body;

    const album = await albumModel.create({
        title,
        musics: musics,
        artist: req.user.id,
    });


    res.status(201).json({
        message: "Album created successfully",
        album: {
            id: album._id,
            title: album.title,
            artist: album.artist,
            musics: album.musics
        }
    })
}

async function getAllMusic(req, res) {
    const page = parseInt(req.query.page) || 1;  // ?page=1
    const limit = 2;
    const skip = (page - 1) * limit;

    const musics = await musicModel.find().skip(skip).limit(limit).populate("artist", "username");

    const token = req.cookies.token;
    let username;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id);;
        username = user.username;

        res.status(200).json({
            message: "Musics feached successfully",
            musics: musics,
            username,
            page
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server error"
        });
    }
}

module.exports = { createMusic, createAlbum, getAllMusic }