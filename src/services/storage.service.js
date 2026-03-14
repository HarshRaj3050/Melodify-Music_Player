const { ImageKit } = require("@imagekit/nodejs");
const { Folders } = require("@imagekit/nodejs/resources.js");

const client = new ImageKit({
  privateKey: process.env['IMAGEKIT_PRIVATE_KEY'], 
});

async function uploadFile(file){
    const result = await client.files.upload({
        file,
        fileName: "music_" + Date.now(),
        folder: "Melodify-MusicPlayer/music"
    })

    return result
}

module.exports = { uploadFile };