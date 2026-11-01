const { Router } = require('express');
const { check, param } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { listarGeneros, obtenerGenero, crearGenero, actualizarGenero, eliminarGenero } = require('../controllers/genero.controller');

const router = Router();
const ESTADOS = ['Activo', 'Inactivo'];
const validarId = [param('id', 'El id no es un ObjectId válido').isMongoId(), validarCampos];

router.get('/', listarGeneros);
router.get('/:id', validarId, obtenerGenero);

router.post('/', [
  check('nombre', 'El nombre es obligatorio').trim().notEmpty(),
  check('estado', `El estado debe ser: ${ESTADOS.join(' o ')}`).optional().isIn(ESTADOS),
  check('descripcion', 'La descripción debe ser texto').optional().isString(),
  validarCampos,
], crearGenero);

router.put('/:id', [
  ...validarId,
  check('nombre', 'El nombre no puede estar vacío').optional().trim().notEmpty(),
  check('estado', `El estado debe ser: ${ESTADOS.join(' o ')}`).optional().isIn(ESTADOS),
  check('descripcion', 'La descripción debe ser texto').optional().isString(),
  validarCampos,
], actualizarGenero);

router.delete('/:id', validarId, eliminarGenero);

module.exports = router;
