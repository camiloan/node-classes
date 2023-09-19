import { Router } from 'express';
import { check } from 'express-validator';

import {
  esAdminRole,
  validarCampos,
  validarJWT,
} from '../middlewares/index.js';
import {
  actualizarCategoria,
  borrarCategoria,
  crearCategoria,
  obtenerCategoria,
  obtenerCategorias,
} from '../controllers/categorias.js';
import { existeCategoriaPorId } from '../helpers/db-validators.js';

const router = Router();

// Obtener todas las categorias - publico

router.get('/', obtenerCategorias);

// Obtener una categoria por id  - publico

router.get(
  '/:id',
  [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos,
  ],
  obtenerCategoria
);

// Crear categoria - privado -cualquier persona con un token válido

router.post(
  '/',
  [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    validarCampos,
  ],
  crearCategoria
);

// Actualizar categoria - privado - cualquiera con token válido

router.put(
  '/:id',
  [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos,
  ],
  actualizarCategoria
);

// Borrar una categoria - Admin

router.delete(
  '/:id',
  [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos,
  ],
  borrarCategoria
);

export { router };
