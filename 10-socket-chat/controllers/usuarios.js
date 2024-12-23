import { request, response } from 'express';
import bcryptjs from 'bcryptjs';
import Usuario from '../models/usuario.js';

const usuariosGet = async (req = request, res = response) => {
  // const { q, nombre = 'No name', apikey, page = 1, limit } = req.query;
  const { limite = 5, desde = 1 } = req.query;
  const query = { estado: true };

  /*  const usuarios = await Usuario.find(query)
    .skip(Number(desde) - 1)
    .limit(Number(limite));

  const total = await Usuario.countDocuments(query); */

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query)
      .skip(Number(desde) - 1)
      .limit(Number(limite)),
  ]);

  res.json({
    total,
    usuarios,
  });
};

const usuariosPost = async (req, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  // Encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  // Guardar en DB
  await usuario.save();

  res.json({
    usuario,
  });
};

const usuariosPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;
  // TODO: validar contra base de datos
  if (password) {
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true });

  res.json({
    msg: 'put API - controlador',
    id,
    usuario,
  });
};

const usuariosPatch = (req, res = response) => {
  res.json({
    ok: true,
    msg: 'patch API - controlador',
  });
};

const usuariosDelete = async (req, res = response) => {
  const { id } = req.params;
  const usuarioAutenticado = req.usuario;
  // Fisicamente lo borramos
  // const usuario = await Usuario.findByIdAndDelete(id);
  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
  res.json({ usuario, usuarioAutenticado });
};

export {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete,
};
