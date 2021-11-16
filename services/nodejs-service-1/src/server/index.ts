import { reviveDates, initLogging } from '@vestico/service-utils';

initLogging();

import express from 'express';
import { ErrorReporting } from '@google-cloud/error-reporting';
import compression from 'compression';
import { getWorld } from '../api/helloWorld';
import { text, json, urlencoded } from 'body-parser';

const errors = new ErrorReporting();

const app = express();
const DEFAULT_PORT = 3011;
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : DEFAULT_PORT;

const isProduction = process.env.NODE_ENV === 'production';
if (!isProduction) {
  console.info('Development mode enabled: Using cors');
  // eslint-disable-next-line global-require
  // const cors = require('cors');
  // app.use(cors());
}

app.use(compression());

// configure the app to use bodyParser()
app.use(
  urlencoded({
    extended: true,
  })
);

app.use(text());
app.use(json({ reviver: reviveDates }));

app.get('/hello', (req, res, next) => {
  getWorld(req, res).catch((e) => next(e));
});

// Note that express error handling middleware should be attached after all
// the other routes and use() calls. See the Express.js docs.
app.use(errors.express);

app.listen(PORT, () => {
  console.info(`⚡️[server]: Server is running at https://localhost:${PORT}`);

  if (process.env.COLD_START_TEST === 'true') {
    process.exit(0);
  }
});
