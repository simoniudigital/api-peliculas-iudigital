// Ruta no encontrada
const notFound = (req, res) => {
  res.status(404).json({ ok: false, msg: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
};

// Manejador central de errores (Express 5 captura los errores de las funciones async)
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err.code === 11000) {
    const campo = Object.keys(err.keyValue || {})[0];
    return res.status(409).json({ ok: false, msg: `Ya existe un registro con ${campo}: '${err.keyValue[campo]}'` });
  }
  if (err.name === 'ValidationError') {
    const errores = Object.values(err.errors).map((e) => ({ campo: e.path, msg: e.message }));
    return res.status(400).json({ ok: false, msg: 'Error de validación', errores });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ ok: false, msg: `Valor inválido para ${err.path}: '${err.value}'` });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ ok: false, msg: 'El cuerpo de la petición no es un JSON válido' });
  }
  console.error(err);
  res.status(500).json({ ok: false, msg: 'Error interno del servidor' });
};

module.exports = { notFound, errorHandler };
