import { Router } from 'express';
import { check } from 'express-validator';
import { googleSignIn, login, renovarToken } from '../controllers/auth.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/index.js';

const router = Router();

router.post(
  '/login',
  [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos,
  ],
  login
);

router.post(
  '/google',
  [check('id_token', 'id_token es necesario').notEmpty(), validarCampos],
  googleSignIn
);

router.get('/', validarJWT, renovarToken);

export { router };
