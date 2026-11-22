require('dotenv').config({ quiet: true });
const app = require('./app');
const { getConnection } = require('./db/db-connection');
const Genero = require('./models/Genero');
const Tipo = require('./models/Tipo');
const { generos, tipos } = require('./datos-iniciales');

const PORT = process.env.PORT || 4000;

// En una base de datos nueva (por ejemplo, al desplegar en la nube) carga los géneros y tipos
// iniciales del caso de estudio. Si ya hay datos no hace nada.
const cargarDatosIniciales = async () => {
  if ((await Genero.estimatedDocumentCount()) === 0) {
    await Genero.insertMany(generos);
    console.log(`Géneros iniciales cargados: ${generos.length}`);
  }
  if ((await Tipo.estimatedDocumentCount()) === 0) {
    await Tipo.insertMany(tipos);
    console.log(`Tipos iniciales cargados: ${tipos.length}`);
  }
};

const main = async () => {
  await getConnection();
  await cargarDatosIniciales();
  app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
