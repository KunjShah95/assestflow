import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { router } from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';
import { notFoundHandler } from './middleware/notFound.middleware.js';

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }), router);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.PORT, (err) => {
  if (err) {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${env.PORT} is already in use. Kill the existing process with: kill $(lsof -ti :${env.PORT})`);
    } else {
      console.error('Failed to start server:', err.message);
    }
    process.exit(1);
    return;
  }
  console.log(`AssetFlow OS backend running on port ${env.PORT}`);
});
