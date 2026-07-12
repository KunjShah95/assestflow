const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const env = require('./config/env');
const routes = require('./routes');

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }), routes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(env.PORT, () => {
  console.log(`AssetFlow OS backend running on port ${env.PORT}`);
});
