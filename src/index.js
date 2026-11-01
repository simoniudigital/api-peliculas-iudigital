require('dotenv').config({ quiet: true });
const app = require('./app');
const { getConnection } = require('./db/db-connection');

const PORT = process.env.PORT || 4000;

const main = async () => {
  await getConnection();
  app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
