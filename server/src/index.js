const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const {
    OFFER_SIGNAL,
    CONSOLE_FORMAT_CLIENT2SERVER,
    CONSOLE_FORMAT_SERVER2CLIENT,
} = require('../../common/src/constances/webRTCKeyConstances');

app.use(cors());
const PORT = process.env.PORT || 8080;
app.get('/', (req, res) => {
        res.send('Hello World');
});

io.on("connection", (socket) => {
    console.log(CONSOLE_FORMAT_CLIENT2SERVER, "a user connected", socket.id);

    socket.emit("me", socket.id);

    socket.on(OFFER_SIGNAL, ({ sourceSocketId, targetSocketId, data }) => {
        console.log(CONSOLE_FORMAT_CLIENT2SERVER, "receiveOfferSignal, sourceSocketId: ", sourceSocketId, " targetSocketId: ", targetSocketId);
        // console.log(CONSOLE_FORMAT_CLIENT2SERVER, "receiveOfferSignal, data: ", data);

        io.to(targetSocketId).emit(OFFER_SIGNAL, { sourceSocketId, data });
        console.log(CONSOLE_FORMAT_SERVER2CLIENT, "sendOfferSignal, sourceSocketId: ", sourceSocketId);
        // console.log(CONSOLE_FORMAT_SERVER2CLIENT, "sendOfferSignal, data: ", data);
    });
});
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
