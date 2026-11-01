const { validationResult } = require('express-validator');

// Responde 400 si alguna de las validaciones de express-validator falló
const validarCampos = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      ok: false,
      msg: 'Error de validación',
      errores: errores.array().map((e) => ({ campo: e.path, msg: e.msg })),
    });
  }
  next();
};

module.exports = { validarCampos };
