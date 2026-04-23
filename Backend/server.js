const http = require('http');
const app = require('./src/app');
const { connectDb } = require('./src/config/db');

const PORT = process.env.PORT;

async function start() {
  await connectDb();

  const server = http.createServer(app);
  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on port ${PORT}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

