const Media = require('../models/Media');
const Genero = require('../models/Genero');
const Director = require('../models/Director');
const Productora = require('../models/Productora');
const Tipo = require('../models/Tipo');

const POPULATE = [
  { path: 'genero', select: 'nombre estado' },
  { path: 'director', select: 'nombres estado' },
  { path: 'productora', select: 'nombre estado' },
  { path: 'tipo', select: 'nombre' },
];

// Reglas del caso de estudio: solo se pueden asignar géneros, directores y productoras ACTIVOS
// y tipos existentes. Solo se validan las referencias que vienen en el cuerpo.
const validarReferencias = async ({ genero, director, productora, tipo }) => {
  const errores = [];
  if (genero !== undefined) {
    const g = await Genero.findById(genero);
    if (!g) errores.push({ campo: 'genero', msg: 'El género no existe' });
    else if (g.estado !== 'Activo') errores.push({ campo: 'genero', msg: 'El género está inactivo' });
  }
  if (director !== undefined) {
    const d = await Director.findById(director);
    if (!d) errores.push({ campo: 'director', msg: 'El director no existe' });
    else if (d.estado !== 'Activo') errores.push({ campo: 'director', msg: 'El director está inactivo' });
  }
  if (productora !== undefined) {
    const p = await Productora.findById(productora);
    if (!p) errores.push({ campo: 'productora', msg: 'La productora no existe' });
    else if (p.estado !== 'Activo') errores.push({ campo: 'productora', msg: 'La productora está inactiva' });
  }
  if (tipo !== undefined) {
    const t = await Tipo.findById(tipo);
    if (!t) errores.push({ campo: 'tipo', msg: 'El tipo no existe' });
  }
  return errores;
};

// GET /api/medias?tipo=<id>&genero=<id>&titulo=texto
const listarMedias = async (req, res) => {
  const { tipo, genero, director, productora, titulo } = req.query;
  const filtro = {};
  if (tipo) filtro.tipo = tipo;
  if (genero) filtro.genero = genero;
  if (director) filtro.director = director;
  if (productora) filtro.productora = productora;
  if (titulo) filtro.titulo = { $regex: titulo, $options: 'i' };

  const medias = await Media.find(filtro).populate(POPULATE).sort({ fechaCreacion: -1 });
  res.json({ ok: true, total: medias.length, medias });
};

// GET /api/medias/:id
const obtenerMedia = async (req, res) => {
  const media = await Media.findById(req.params.id).populate(POPULATE);
  if (!media) return res.status(404).json({ ok: false, msg: 'Media no encontrada' });
  res.json({ ok: true, media });
};

// POST /api/medias
const crearMedia = async (req, res) => {
  const { serial, titulo, sinopsis, url, imagenPortada, anioEstreno, genero, director, productora, tipo } = req.body;

  const errores = await validarReferencias({ genero, director, productora, tipo });
  if (errores.length) return res.status(400).json({ ok: false, msg: 'Error de validación', errores });

  const media = await Media.create({ serial, titulo, sinopsis, url, imagenPortada, anioEstreno, genero, director, productora, tipo });
  await media.populate(POPULATE);
  res.status(201).json({ ok: true, msg: 'Media creada', media });
};

// PUT /api/medias/:id
const actualizarMedia = async (req, res) => {
  const { serial, titulo, sinopsis, url, imagenPortada, anioEstreno, genero, director, productora, tipo } = req.body;

  const existe = await Media.exists({ _id: req.params.id });
  if (!existe) return res.status(404).json({ ok: false, msg: 'Media no encontrada' });

  const errores = await validarReferencias({ genero, director, productora, tipo });
  if (errores.length) return res.status(400).json({ ok: false, msg: 'Error de validación', errores });

  const media = await Media.findByIdAndUpdate(
    req.params.id,
    { serial, titulo, sinopsis, url, imagenPortada, anioEstreno, genero, director, productora, tipo },
    { returnDocument: 'after', runValidators: true }
  ).populate(POPULATE);
  res.json({ ok: true, msg: 'Media actualizada', media });
};

// DELETE /api/medias/:id
const eliminarMedia = async (req, res) => {
  const media = await Media.findByIdAndDelete(req.params.id);
  if (!media) return res.status(404).json({ ok: false, msg: 'Media no encontrada' });
  res.json({ ok: true, msg: 'Media eliminada', media });
};

module.exports = { listarMedias, obtenerMedia, crearMedia, actualizarMedia, eliminarMedia };
