const Genero = require('../models/Genero');
const Media = require('../models/Media');

// GET /api/generos?estado=Activo
const listarGeneros = async (req, res) => {
  const filtro = req.query.estado ? { estado: req.query.estado } : {};
  const generos = await Genero.find(filtro).sort({ nombre: 1 });
  res.json({ ok: true, total: generos.length, generos });
};

// GET /api/generos/:id
const obtenerGenero = async (req, res) => {
  const genero = await Genero.findById(req.params.id);
  if (!genero) return res.status(404).json({ ok: false, msg: 'Género no encontrado' });
  res.json({ ok: true, genero });
};

// POST /api/generos
const crearGenero = async (req, res) => {
  const { nombre, estado, descripcion } = req.body;
  const genero = await Genero.create({ nombre, estado, descripcion });
  res.status(201).json({ ok: true, msg: 'Género creado', genero });
};

// PUT /api/generos/:id
const actualizarGenero = async (req, res) => {
  const { nombre, estado, descripcion } = req.body;
  const genero = await Genero.findByIdAndUpdate(
    req.params.id,
    { nombre, estado, descripcion },
    { returnDocument: 'after', runValidators: true }
  );
  if (!genero) return res.status(404).json({ ok: false, msg: 'Género no encontrado' });
  res.json({ ok: true, msg: 'Género actualizado', genero });
};

// DELETE /api/generos/:id
const eliminarGenero = async (req, res) => {
  const enUso = await Media.exists({ genero: req.params.id });
  if (enUso) {
    return res.status(409).json({ ok: false, msg: 'No se puede eliminar: el género está asignado a una o más medias. Puede inactivarlo.' });
  }
  const genero = await Genero.findByIdAndDelete(req.params.id);
  if (!genero) return res.status(404).json({ ok: false, msg: 'Género no encontrado' });
  res.json({ ok: true, msg: 'Género eliminado', genero });
};

module.exports = { listarGeneros, obtenerGenero, crearGenero, actualizarGenero, eliminarGenero };
