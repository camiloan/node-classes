import { Router } from 'express';
import { check } from 'express-validator';
import {
  usuariosDelete,
  usuariosGet,
  usuariosPatch,
  usuariosPost,
  usuariosPut,
} from '../controllers/usuarios.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import {
  emailExiste,
  esRoleValido,
  existeUsuarioPorId,
} from '../helpers/db-validators.js';

const router = Router();

router.get('/', usuariosGet);

router.put(
  '/:id',
  [
    check('id', 'No es un ID válido').isMongoId(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRoleValido),
    validarCampos,
  ],
  usuariosPut
);

router.post(
  '/',
  [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser más de 6 letras').isLength({
      min: 6,
    }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(emailExiste),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(esRoleValido),
    validarCampos,
  ],
  usuariosPost
);

router.delete(
  '/:id',
  [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos,
  ],
  usuariosDelete
);

router.patch('/', usuariosPatch);

export { router };
