const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.route');
const musicRoutes = require('./routes/music.route');

const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://melodify-chi.vercel.app"
        ],
        credentials: true
    })
);


app.use("/api/auth", authRoutes);
app.use("/api/music", musicRoutes);
app.use("/", (req, res) => {})


module.exports = app