const Director = require('../models/Director');
const Media = require('../models/Media');

// GET /api/directores?estado=Activo
const listarDirectores = async (req, res) => {
  const filtro = req.query.estado ? { estado: req.query.estado } : {};
  const directores = await Director.find(filtro).sort({ nombres: 1 });
  res.json({ ok: true, total: directores.length, directores });
};

// GET /api/directores/:id
const obtenerDirector = async (req, res) => {
  const director = await Director.findById(req.params.id);
  if (!director) return res.status(404).json({ ok: false, msg: 'Director no encontrado' });
  res.json({ ok: true, director });
};

// POST /api/directores
const crearDirector = async (req, res) => {
  const { nombres, estado } = req.body;
  const director = await Director.create({ nombres, estado });
  res.status(201).json({ ok: true, msg: 'Director creado', director });
};

// PUT /api/directores/:id
const actualizarDirector = async (req, res) => {
  const { nombres, estado } = req.body;
  const director = await Director.findByIdAndUpdate(
    req.params.id,
    { nombres, estado },
    { returnDocument: 'after', runValidators: true }
  );
  if (!director) return res.status(404).json({ ok: false, msg: 'Director no encontrado' });
  res.json({ ok: true, msg: 'Director actualizado', director });
};

// DELETE /api/directores/:id
const eliminarDirector = async (req, res) => {
  const enUso = await Media.exists({ director: req.params.id });
  if (enUso) {
    return res.status(409).json({ ok: false, msg: 'No se puede eliminar: el director está asignado a una o más medias. Puede inactivarlo.' });
  }
  const director = await Director.findByIdAndDelete(req.params.id);
  if (!director) return res.status(404).json({ ok: false, msg: 'Director no encontrado' });
  res.json({ ok: true, msg: 'Director eliminado', director });
};

module.exports = { listarDirectores, obtenerDirector, crearDirector, actualizarDirector, eliminarDirector };
