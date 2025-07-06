import express from 'express';
import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless'; // ✅ Add this line
import rateLimiter from './middleware/rateLimiter.js';
import { initDB } from './config/db.js';
import transactionsRoute from './routes/transactionsRoute.js';

dotenv.config();

const sql = neon(process.env.DATABASE_URL); // ✅ Now this works
const app = express();


app.use(rateLimiter);
app.use(express.json());
app.use("/api/transactions", transactionsRoute);

const PORT = process.env.PORT || 5001;
initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is up and running on PORT:", PORT);
  });
});

