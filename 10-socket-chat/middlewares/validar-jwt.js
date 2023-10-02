import { request, response } from 'express';
import jwt from 'jsonwebtoken';

import Usuario from '../models/usuario.js';

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header('x-token');
  try {
    if (!token) {
      return res.status(401).json({
        msg: 'No hay token en la petición',
      });
    }
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    // console.log(uid);
    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(401).json({
        msg: 'Token no válido - usuario no existe DB',
      });
    }

    if (!usuario.estado) {
      return res.status(401).json({
        msg: 'Token no válido - usuario con estado:false',
      });
    }

    req.usuario = usuario;
    // console.log(usuario);
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      msg: 'Token no válido',
    });
  }
};

export { validarJWT };
