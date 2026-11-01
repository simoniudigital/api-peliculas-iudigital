// Prueba de extremo a extremo de la API usando una base de datos MongoDB en memoria.
// Ejecutar con: npm test
const assert = require('node:assert/strict');
const { test, before, after } = require('node:test');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

process.env.NODE_ENV = 'test';
const app = require('../src/app');

let mongo, server, base;
const ids = {};

const api = async (method, path, body) => {
  const res = await fetch(base + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, body: await res.json() };
};

before(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  await mongoose.connection.syncIndexes();
  server = app.listen(0);
  base = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  server.close();
  await mongoose.disconnect();
  await mongo.stop();
});

test('Género: crear, listar, obtener, actualizar y validar', async () => {
  let r = await api('POST', '/api/generos', { nombre: 'Acción', descripcion: 'Alto impacto' });
  assert.equal(r.status, 201);
  assert.equal(r.body.genero.estado, 'Activo');
  assert.ok(r.body.genero.fechaCreacion && r.body.genero.fechaActualizacion);
  ids.genero = r.body.genero._id;

  r = await api('POST', '/api/generos', { nombre: 'Acción' });
  assert.equal(r.status, 409, 'nombre duplicado');

  r = await api('POST', '/api/generos', { estado: 'Otro' });
  assert.equal(r.status, 400);

  r = await api('PUT', `/api/generos/${ids.genero}`, { descripcion: 'Escenas de alto impacto' });
  assert.equal(r.status, 200);
  assert.equal(r.body.genero.nombre, 'Acción', 'PUT parcial conserva los demás campos');
  assert.equal(r.body.genero.descripcion, 'Escenas de alto impacto');

  r = await api('GET', '/api/generos?estado=Activo');
  assert.equal(r.body.total, 1);
  r = await api('GET', `/api/generos/${ids.genero}`);
  assert.equal(r.status, 200);
  r = await api('GET', '/api/generos/123');
  assert.equal(r.status, 400);
  r = await api('GET', `/api/generos/${new mongoose.Types.ObjectId()}`);
  assert.equal(r.status, 404);
});

test('Director, Productora y Tipo: crear y actualizar', async () => {
  let r = await api('POST', '/api/directores', { nombres: 'Christopher Nolan' });
  assert.equal(r.status, 201);
  ids.director = r.body.director._id;
  r = await api('PUT', `/api/directores/${ids.director}`, { nombres: 'Christopher Edward Nolan' });
  assert.equal(r.body.director.nombres, 'Christopher Edward Nolan');

  r = await api('POST', '/api/productoras', { nombre: 'Warner Bros', slogan: 'The stuff that dreams are made of', descripcion: 'Estudio estadounidense' });
  assert.equal(r.status, 201);
  ids.productora = r.body.productora._id;
  r = await api('PUT', `/api/productoras/${ids.productora}`, { slogan: 'Nuevo slogan' });
  assert.equal(r.body.productora.slogan, 'Nuevo slogan');

  r = await api('POST', '/api/tipos', { nombre: 'Película', descripcion: 'Una sola emisión' });
  assert.equal(r.status, 201);
  ids.tipo = r.body.tipo._id;
  r = await api('PUT', `/api/tipos/${ids.tipo}`, { descripcion: 'Producción de una sola emisión' });
  assert.equal(r.body.tipo.descripcion, 'Producción de una sola emisión');
});

test('Media: CRUD completo con reglas del caso de estudio', async () => {
  const pelicula = {
    serial: 'PEL-001', titulo: 'Oppenheimer', sinopsis: 'Biografía de J. Robert Oppenheimer',
    url: 'https://peliculas.iudigital.edu.co/oppenheimer', imagenPortada: 'https://picsum.photos/300/450',
    anioEstreno: 2023, genero: ids.genero, director: ids.director, productora: ids.productora, tipo: ids.tipo,
  };
  let r = await api('POST', '/api/medias', pelicula);
  assert.equal(r.status, 201, JSON.stringify(r.body));
  assert.equal(r.body.media.genero.nombre, 'Acción', 'devuelve referencias pobladas');
  ids.media = r.body.media._id;

  r = await api('POST', '/api/medias', { ...pelicula, url: 'https://otra.com/x' });
  assert.equal(r.status, 409, 'serial único');
  r = await api('POST', '/api/medias', { ...pelicula, serial: 'PEL-002' });
  assert.equal(r.status, 409, 'url única');
  r = await api('POST', '/api/medias', { titulo: 'Sin datos' });
  assert.equal(r.status, 400);

  // Solo se permiten géneros/directores/productoras activos
  await api('PUT', `/api/directores/${ids.director}`, { estado: 'Inactivo' });
  r = await api('POST', '/api/medias', { ...pelicula, serial: 'PEL-003', url: 'https://x.com/3' });
  assert.equal(r.status, 400);
  assert.equal(r.body.errores[0].campo, 'director');
  await api('PUT', `/api/directores/${ids.director}`, { estado: 'Activo' });

  r = await api('PUT', `/api/medias/${ids.media}`, { titulo: 'Oppenheimer (2023)', anioEstreno: 2023 });
  assert.equal(r.status, 200);
  assert.equal(r.body.media.titulo, 'Oppenheimer (2023)');
  assert.equal(r.body.media.serial, 'PEL-001');

  r = await api('GET', `/api/medias?titulo=oppen&tipo=${ids.tipo}`);
  assert.equal(r.body.total, 1);

  // No se pueden borrar catálogos en uso
  r = await api('DELETE', `/api/generos/${ids.genero}`);
  assert.equal(r.status, 409);

  r = await api('DELETE', `/api/medias/${ids.media}`);
  assert.equal(r.status, 200);
  r = await api('GET', `/api/medias/${ids.media}`);
  assert.equal(r.status, 404);

  r = await api('DELETE', `/api/generos/${ids.genero}`);
  assert.equal(r.status, 200);
});
