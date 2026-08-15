import express from 'express';
import cookieParser from 'cookie-parser';
import dbConnector from './config/dbConnector.js';
import userRoutes from './routes/userRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import postRoutes from './routes/postRoutes.js';
import cors from 'cors'


const app = express();
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  "https://note-taking-client.vercel.app"
]

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/', (req, res) => {
    res.json({ message: 'The server is working' });
});

app.use('/api', userRoutes);
app.use('/api', noteRoutes);
app.use('/api', profileRoutes);
app.use('/api', postRoutes);

dbConnector();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`The server is working on port ${PORT}!`);
});