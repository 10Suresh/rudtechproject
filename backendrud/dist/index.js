"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const encryption_1 = require("./utils/encryption");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: { origin: '*' }
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => console.log(' MongoDB connected'))
    .catch((err) => console.error(' MongoDB connection error:', err));
app.get('/', (_req, res) => {
    res.send('API running 🚀');
});
app.use('/api/auth', authRoutes_1.default);
// app.use('/api/redistest', router); // 
app.use('/api/users', userRoutes_1.default);
// ✅ Socket.io middleware to verify JWT
io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token)
        return next(new Error('No token provided'));
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        socket.data.token = token;
        socket.data.user = decoded;
        next();
    }
    catch (err) {
        next(new Error('Invalid token'));
    }
});
io.on('connection', (socket) => {
    console.log(' Client connected:', socket.id);
    socket.on('transaction', (encryptedData) => {
        try {
            const decrypted = (0, encryption_1.decrypt)(encryptedData);
            console.log('Decrypted payload:', decrypted);
            const response = {
                status: 'success',
                message: 'Data received securely',
                receivedData: decrypted
            };
            socket.emit('transaction_ack', (0, encryption_1.encrypt)(response));
        }
        catch (err) {
            console.error('Transaction error:', err);
            socket.emit('transaction_ack', (0, encryption_1.encrypt)({
                status: 'error',
                message: 'Server error during processing.'
            }));
        }
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
