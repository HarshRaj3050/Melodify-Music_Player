const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.route');
const musicRoutes = require('./routes/music.route');

const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());


app.use("/api/auth", authRoutes);
app.use("/api/music", musicRoutes);
app.use("/", (req, res)=>{res.send("api is running")})


module.exports = app