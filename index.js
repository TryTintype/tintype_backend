const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

const usersRoute = require("./routes/usersRoute")
const messagesRoutes = require("./routes/messagesRoute")

require("dotenv").config()

const socket = require("socket.io")

const port = process.env.PORT || 3000

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}));

app.use("/api", usersRoute)
app.use("/api/message", messagesRoutes)

const uri = process.env.MONGO_URL;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('db connected successfully')).catch((error) => console.log(error.message))

app.get("/", (req, res,) => {
    res.status(200).json({message: "Hello World"})
})


const server = app.listen(port, () => {
    console.log(`server is listening on ${port}`)
})

const io = socket(server, {
    cors: {
        origin: `http://localhost:${port}`,
        credentials: true
    }
})

global.onlineUsers = new Map()

io.on("connection", (socket) => {
    global.ChatSocket = socket;

    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id)
    })

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to)

        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-receive", data.msg)
        }
    })
})

module.exports = app
