import express from 'express';
import cookieParser from 'cookie-parser';
import dbConnector from './config/dbConnector.js';
import userRoutes from './routes/userRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import postRoutes from './routes/postRoutes.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.json({ message: 'The server is working' });
});

app.use('/api', userRoutes);
app.use('/api', noteRoutes);
app.use('/api', profileRoutes);
app.use('/api', postRoutes);

dbConnector();

app.listen(3000, () => {
    console.log('The server is working!');
});