// Arranca la API con una base de datos MongoDB en memoria (no requiere instalar MongoDB).
// Útil para demostraciones y pruebas rápidas: los datos se pierden al detener el servidor.
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('./app');
const { getConnection } = require('./db/db-connection');
const Genero = require('./models/Genero');
const Tipo = require('./models/Tipo');

const PORT = process.env.PORT || 4000;

const main = async () => {
  const mongo = await MongoMemoryServer.create();
  await getConnection(mongo.getUri() + 'peliculas_iudigital');

  await Genero.insertMany(['Acción', 'Aventura', 'Ciencia ficción', 'Drama', 'Terror'].map((nombre) => ({ nombre })));
  await Tipo.insertMany([{ nombre: 'Película' }, { nombre: 'Serie' }]);
  console.log('Datos iniciales cargados: 5 géneros y 2 tipos');

  app.listen(PORT, () => console.log(`Servidor (BD en memoria) escuchando en http://localhost:${PORT}`));
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
