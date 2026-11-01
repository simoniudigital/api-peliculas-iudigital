const Productora = require('../models/Productora');
const Media = require('../models/Media');

// GET /api/productoras?estado=Activo
const listarProductoras = async (req, res) => {
  const filtro = req.query.estado ? { estado: req.query.estado } : {};
  const productoras = await Productora.find(filtro).sort({ nombre: 1 });
  res.json({ ok: true, total: productoras.length, productoras });
};

// GET /api/productoras/:id
const obtenerProductora = async (req, res) => {
  const productora = await Productora.findById(req.params.id);
  if (!productora) return res.status(404).json({ ok: false, msg: 'Productora no encontrada' });
  res.json({ ok: true, productora });
};

// POST /api/productoras
const crearProductora = async (req, res) => {
  const { nombre, estado, slogan, descripcion } = req.body;
  const productora = await Productora.create({ nombre, estado, slogan, descripcion });
  res.status(201).json({ ok: true, msg: 'Productora creada', productora });
};

// PUT /api/productoras/:id
const actualizarProductora = async (req, res) => {
  const { nombre, estado, slogan, descripcion } = req.body;
  const productora = await Productora.findByIdAndUpdate(
    req.params.id,
    { nombre, estado, slogan, descripcion },
    { returnDocument: 'after', runValidators: true }
  );
  if (!productora) return res.status(404).json({ ok: false, msg: 'Productora no encontrada' });
  res.json({ ok: true, msg: 'Productora actualizada', productora });
};

// DELETE /api/productoras/:id
const eliminarProductora = async (req, res) => {
  const enUso = await Media.exists({ productora: req.params.id });
  if (enUso) {
    return res.status(409).json({ ok: false, msg: 'No se puede eliminar: la productora está asignada a una o más medias. Puede inactivarla.' });
  }
  const productora = await Productora.findByIdAndDelete(req.params.id);
  if (!productora) return res.status(404).json({ ok: false, msg: 'Productora no encontrada' });
  res.json({ ok: true, msg: 'Productora eliminada', productora });
};

module.exports = { listarProductoras, obtenerProductora, crearProductora, actualizarProductora, eliminarProductora };
