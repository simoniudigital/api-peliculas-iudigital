const { Router } = require('express');
const { check, param } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { listarDirectores, obtenerDirector, crearDirector, actualizarDirector, eliminarDirector } = require('../controllers/director.controller');

const router = Router();
const ESTADOS = ['Activo', 'Inactivo'];
const validarId = [param('id', 'El id no es un ObjectId válido').isMongoId(), validarCampos];

router.get('/', listarDirectores);
router.get('/:id', validarId, obtenerDirector);

router.post('/', [
  check('nombres', 'Los nombres son obligatorios').trim().notEmpty(),
  check('estado', `El estado debe ser: ${ESTADOS.join(' o ')}`).optional().isIn(ESTADOS),
  validarCampos,
], crearDirector);

router.put('/:id', [
  ...validarId,
  check('nombres', 'Los nombres no pueden estar vacíos').optional().trim().notEmpty(),
  check('estado', `El estado debe ser: ${ESTADOS.join(' o ')}`).optional().isIn(ESTADOS),
  validarCampos,
], actualizarDirector);

router.delete('/:id', validarId, eliminarDirector);

module.exports = router;
