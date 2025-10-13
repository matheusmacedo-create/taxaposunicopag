require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const consultaRouter = require('./routes/consulta');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(morgan('combined'));

const windowMin = parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES || '1', 10);
const maxReq = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '60', 10);

const limiter = rateLimit({
  windowMs: windowMin * 60 * 1000,
  max: maxReq,
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'DeskData proxy API' });
});

// rota principal
app.use('/api/consulta', consultaRouter);

// fallback
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});