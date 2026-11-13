// Carga los datos iniciales que pide el caso de estudio:
// géneros (acción, aventura, ciencia ficción, drama, terror) y tipos (serie, película).
require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const { getConnection } = require('./db/db-connection');
const Genero = require('./models/Genero');
const Tipo = require('./models/Tipo');

const { generos, tipos } = require('./datos-iniciales');

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
