import { Router } from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js';
import {
  actualizarProducto,
  borrarProducto,
  crearProducto,
  obtenerProducto,
  obtenerProductos,
} from '../controllers/productos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import {
  existeCategoriaPorId,
  existeProductoPorId,
} from '../helpers/db-validators.js';
import { esAdminRole } from '../middlewares/validar-roles.js';

const router = Router();

/**
 * Obtener todos los productos - publico
 */

router.get('/', obtenerProductos);

/**
 * Obtener un producto por id - publico
 */

router.get(
  '/:id',
  [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos,
  ],
  obtenerProducto
);

/**
 * Crear producto - privado - cualquier person con un token valido
 */

router.post(
  '/',
  [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('categoria', 'La categoria es obligatorio').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos,
  ],
  crearProducto
);

/**
 * Actualizar producto - privado - cualquiera con token válido
 */

router.put(
  '/:id',
  [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('categoria', 'La categoria es obligatorio').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    check('id').custom(existeProductoPorId),
    validarCampos,
  ],
  actualizarProducto
);

/**
 * Borrar producto - estado: false - ADMIN_ROLE
 */

router.delete(
  '/:id',
  [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos,
  ],
  borrarProducto
);

export { router };
