import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { router } from './routes/index.js';

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }), router);

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || err.statusCode || 500;
  const error = err.error || err.message || 'Internal server error';
  const details = err.details || undefined;
  res.status(status).json({ error, ...(details && { details }) });
});

app.listen(env.PORT, () => {
  console.log(`AssetFlow OS backend running on port ${env.PORT}`);
});
