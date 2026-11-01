const { Router } = require('express');
const { check, param, query } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { listarMedias, obtenerMedia, crearMedia, actualizarMedia, eliminarMedia } = require('../controllers/media.controller');

const router = Router();
const validarId = [param('id', 'El id no es un ObjectId válido').isMongoId(), validarCampos];
const anioMax = new Date().getFullYear() + 5;

router.get('/', [
  query(['tipo', 'genero', 'director', 'productora'], 'El filtro debe ser un ObjectId válido').optional().isMongoId(),
  validarCampos,
], listarMedias);
router.get('/:id', validarId, obtenerMedia);

router.post('/', [
  check('serial', 'El serial es obligatorio').trim().notEmpty(),
  check('titulo', 'El título es obligatorio').trim().notEmpty(),
  check('sinopsis', 'La sinopsis debe ser texto').optional().isString(),
  check('url', 'La URL de la película es obligatoria y debe ser válida').trim().isURL(),
  check('imagenPortada', 'La imagen de portada debe ser una URL válida').optional({ values: 'falsy' }).isURL(),
  check('anioEstreno', `El año de estreno debe ser un número entre 1888 y ${anioMax}`).isInt({ min: 1888, max: anioMax }).toInt(),
  check('genero', 'El género es obligatorio y debe ser un ObjectId válido').isMongoId(),
  check('director', 'El director es obligatorio y debe ser un ObjectId válido').isMongoId(),
  check('productora', 'La productora es obligatoria y debe ser un ObjectId válido').isMongoId(),
  check('tipo', 'El tipo es obligatorio y debe ser un ObjectId válido').isMongoId(),
  validarCampos,
], crearMedia);

router.put('/:id', [
  ...validarId,
  check('serial', 'El serial no puede estar vacío').optional().trim().notEmpty(),
  check('titulo', 'El título no puede estar vacío').optional().trim().notEmpty(),
  check('sinopsis', 'La sinopsis debe ser texto').optional().isString(),
  check('url', 'La URL debe ser válida').optional().trim().isURL(),
  check('imagenPortada', 'La imagen de portada debe ser una URL válida').optional({ values: 'falsy' }).isURL(),
  check('anioEstreno', `El año de estreno debe ser un número entre 1888 y ${anioMax}`).optional().isInt({ min: 1888, max: anioMax }).toInt(),
  check(['genero', 'director', 'productora', 'tipo'], 'Debe ser un ObjectId válido').optional().isMongoId(),
  validarCampos,
], actualizarMedia);

router.delete('/:id', validarId, eliminarMedia);

module.exports = router;
