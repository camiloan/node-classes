import { Router } from 'express';
import {
  cargarArchivo,
  //actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary,
} from '../controllers/uploads.js';
import { check } from 'express-validator';
import { coleccionesPermitidas } from '../helpers/index.js';
import { validarArchivoSubir, validarCampos } from '../middlewares/index.js';

const router = Router();
router.post('/', validarArchivoSubir, cargarArchivo);

router.put(
  '/:coleccion/:id',
  [
    validarArchivoSubir,
    check('id', 'El id debe de ser de mongo').isMongoId(),
    check('coleccion').custom((c) =>
      coleccionesPermitidas(c, ['usuarios', 'productos'])
    ),
    validarCampos,
  ],
  actualizarImagenCloudinary
);

router.get('/:coleccion/:id', [
  check('id', 'El id debe ser de mongo').isMongoId(),
]);
router.get('/:coleccion/:id', [
  check('id', 'El id debe ser de mongo').isMongoId(),
  check('coleccion').custom((c) =>
    coleccionesPermitidas(c, ['usuarios', 'productos'])
  ),
  validarCampos,
  mostrarImagen,
]);

export { router };
