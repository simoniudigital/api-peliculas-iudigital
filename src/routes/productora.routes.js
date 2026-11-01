const { Router } = require('express');
const { check, param } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { listarProductoras, obtenerProductora, crearProductora, actualizarProductora, eliminarProductora } = require('../controllers/productora.controller');

const router = Router();
const ESTADOS = ['Activo', 'Inactivo'];
const validarId = [param('id', 'El id no es un ObjectId válido').isMongoId(), validarCampos];

router.get('/', listarProductoras);
router.get('/:id', validarId, obtenerProductora);

router.post('/', [
  check('nombre', 'El nombre de la productora es obligatorio').trim().notEmpty(),
  check('estado', `El estado debe ser: ${ESTADOS.join(' o ')}`).optional().isIn(ESTADOS),
  check('slogan', 'El slogan debe ser texto').optional().isString(),
  check('descripcion', 'La descripción debe ser texto').optional().isString(),
  validarCampos,
], crearProductora);

router.put('/:id', [
  ...validarId,
  check('nombre', 'El nombre no puede estar vacío').optional().trim().notEmpty(),
  check('estado', `El estado debe ser: ${ESTADOS.join(' o ')}`).optional().isIn(ESTADOS),
  check('slogan', 'El slogan debe ser texto').optional().isString(),
  check('descripcion', 'La descripción debe ser texto').optional().isString(),
  validarCampos,
], actualizarProductora);

router.delete('/:id', validarId, eliminarProductora);

module.exports = router;
