
const { PORT } = require(`./config/variables.js`);

const mongoDB = require("./config/mongoose");
const mongoose = require("mongoose");
const socketIO = require('socket.io');

mongoose.connect(mongoDB.URL, mongoDB.options);

const mainRouter = require("./routes/index");

const express = require("express");
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors());
app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.use(mainRouter);

const server = require("http").createServer(app);
server.listen(PORT, function () { console.log("Server at port " + PORT); });

const io = socketIO(server, {
    cors: {
        origin: 'http://localhost:3000', // Frontend origin
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true
    }
});

// Socket.io connection
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
