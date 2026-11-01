const Tipo = require('../models/Tipo');
const Media = require('../models/Media');

// GET /api/tipos
const listarTipos = async (req, res) => {
  const tipos = await Tipo.find().sort({ nombre: 1 });
  res.json({ ok: true, total: tipos.length, tipos });
};

// GET /api/tipos/:id
const obtenerTipo = async (req, res) => {
  const tipo = await Tipo.findById(req.params.id);
  if (!tipo) return res.status(404).json({ ok: false, msg: 'Tipo no encontrado' });
  res.json({ ok: true, tipo });
};

// POST /api/tipos
const crearTipo = async (req, res) => {
  const { nombre, descripcion } = req.body;
  const tipo = await Tipo.create({ nombre, descripcion });
  res.status(201).json({ ok: true, msg: 'Tipo creado', tipo });
};

// PUT /api/tipos/:id
const actualizarTipo = async (req, res) => {
  const { nombre, descripcion } = req.body;
  const tipo = await Tipo.findByIdAndUpdate(
    req.params.id,
    { nombre, descripcion },
    { returnDocument: 'after', runValidators: true }
  );
  if (!tipo) return res.status(404).json({ ok: false, msg: 'Tipo no encontrado' });
  res.json({ ok: true, msg: 'Tipo actualizado', tipo });
};

// DELETE /api/tipos/:id
const eliminarTipo = async (req, res) => {
  const enUso = await Media.exists({ tipo: req.params.id });
  if (enUso) {
    return res.status(409).json({ ok: false, msg: 'No se puede eliminar: el tipo está asignado a una o más medias.' });
  }
  const tipo = await Tipo.findByIdAndDelete(req.params.id);
  if (!tipo) return res.status(404).json({ ok: false, msg: 'Tipo no encontrado' });
  res.json({ ok: true, msg: 'Tipo eliminado', tipo });
};

module.exports = { listarTipos, obtenerTipo, crearTipo, actualizarTipo, eliminarTipo };
