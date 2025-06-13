
import express, { Request, Response } from 'express';
import http from 'http';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import authRoutes from './routes/authRoutes';
import userRouter from './routes/userRoutes';
import { encrypt, decrypt } from './utils/encryption';
import rateLimiterMiddleware from './middleware/rateLimiter';
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log(' MongoDB connected'))
  .catch((err) => console.error(' MongoDB connection error:', err));

app.get('/', (_req: Request, res: Response) => {
  res.send('API running 🚀');
});
app.use('/api/auth', authRoutes);

app.use(rateLimiterMiddleware);
app.use('/api/users', userRouter);
app.get('/api/test-limit', rateLimiterMiddleware, (req: Request, res: Response) => {
  res.json({ status: 'success', message: 'Request passed through rate limiter.' });
});
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('No token provided'));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    socket.data.token = token;
    socket.data.user = decoded;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  console.log(' Client connected:', socket.id);

  socket.on('transaction', (encryptedData: string) => {
    try {
      const decrypted = decrypt(encryptedData);
      console.log('Decrypted payload:', decrypted);

      const response = {
        status: 'success',
        message: 'Data received securely',
        receivedData: decrypted
      };

      socket.emit('transaction_ack', encrypt(response));
    } catch (err) {
      console.error('Transaction error:', err);
      socket.emit('transaction_ack', encrypt({
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
