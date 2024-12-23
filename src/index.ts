import express from 'express';
import userRoutes from './routes/userRoutes';
import bookRoutes from './routes/bookRoutes';

import cors from 'cors';


const app = express();
const port = 3000;

app.use(cors({
    origin: ['http://localhost:4200', 'https://localhost:4200'],
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/users', userRoutes);
app.use('/books', bookRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});