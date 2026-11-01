// Carga los datos iniciales que pide el caso de estudio:
// géneros (acción, aventura, ciencia ficción, drama, terror) y tipos (serie, película).
require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const { getConnection } = require('./db/db-connection');
const Genero = require('./models/Genero');
const Tipo = require('./models/Tipo');

const generos = [
  { nombre: 'Acción', descripcion: 'Películas y series con escenas de alto impacto' },
  { nombre: 'Aventura', descripcion: 'Historias de viajes, exploración y desafíos' },
  { nombre: 'Ciencia ficción', descripcion: 'Historias basadas en avances científicos o futuros posibles' },
  { nombre: 'Drama', descripcion: 'Historias centradas en conflictos emocionales' },
  { nombre: 'Terror', descripcion: 'Historias que buscan generar miedo o suspenso' },
];

const tipos = [
  { nombre: 'Película', descripcion: 'Producción audiovisual de una sola emisión' },
  { nombre: 'Serie', descripcion: 'Producción audiovisual dividida en temporadas y episodios' },
];

const seed = async () => {
  await getConnection();
  for (const g of generos) await Genero.updateOne({ nombre: g.nombre }, { $setOnInsert: g }, { upsert: true });
  for (const t of tipos) await Tipo.updateOne({ nombre: t.nombre }, { $setOnInsert: t }, { upsert: true });
  console.log(`Datos iniciales cargados: ${generos.length} géneros y ${tipos.length} tipos`);
  await mongoose.disconnect();
};

seed().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
