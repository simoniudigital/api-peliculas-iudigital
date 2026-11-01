const { Router } = require('express');
const { check, param } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { listarTipos, obtenerTipo, crearTipo, actualizarTipo, eliminarTipo } = require('../controllers/tipo.controller');

const router = Router();
const validarId = [param('id', 'El id no es un ObjectId válido').isMongoId(), validarCampos];

router.get('/', listarTipos);
router.get('/:id', validarId, obtenerTipo);

router.post('/', [
  check('nombre', 'El nombre es obligatorio').trim().notEmpty(),
  check('descripcion', 'La descripción debe ser texto').optional().isString(),
  validarCampos,
], crearTipo);

router.put('/:id', [
  ...validarId,
  check('nombre', 'El nombre no puede estar vacío').optional().trim().notEmpty(),
  check('descripcion', 'La descripción debe ser texto').optional().isString(),
  validarCampos,
], actualizarTipo);

router.delete('/:id', validarId, eliminarTipo);

module.exports = router;
