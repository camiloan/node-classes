import { response } from 'express';
import { isValidObjectId } from 'mongoose';
import { Categoria, Producto, Usuario } from '../models/index.js';

const coleccionesPermitidas = ['usuarios', 'categorias', 'productos', 'roles'];

const buscarUsuarios = async (termino = '', res = response) => {
  const esMongoId = isValidObjectId(termino); // TRUE
  if (esMongoId) {
    const usuario = await Usuario.findById(termino);
    return res.json({ results: usuario ? [usuario] : [] });
  }
  const regex = new RegExp(termino, 'i');
  const usuarios = await Usuario.find({
    $or: [{ nombre: regex }, { correo: regex }],
    $and: [{ estado: true }],
  });

  res.json({
    results: usuarios,
  });
};

const buscarCategorias = async (termino = '', res = response) => {
  const esMongoId = isValidObjectId(termino); // TRUE

  if (esMongoId) {
    const categoria = await Categoria.findById(termino);
    return res.json({ results: categoria ? [categoria] : [] });
  }
  const regex = new RegExp(termino, 'i');
  const categorias = await Categoria.find({
    $and: [{ nombre: regex }, { estado: true }],
  });
  res.json({
    results: categorias,
  });
};

const buscarProductos = async (termino = '', res = response) => {
  const esMongoId = isValidObjectId(termino);
  if (esMongoId) {
    const producto = await Producto.findById(termino).populate(
      'categoria',
      'nombre'
    );
    return res.json({ results: producto ? [producto] : [] });
  }

  const regex = new RegExp(termino, 'i');
  const productos = await Producto.find({
    $and: [{ nombre: regex }, { estado: true }],
  }).populate('categoria', 'nombre');

  res.json({ results: productos });
};

const buscar = (req, res) => {
  const { coleccion, termino } = req.params;
  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`,
    });
  }

  switch (coleccion) {
    case 'usuarios':
      buscarUsuarios(termino, res);
      break;
    case 'categorias':
      buscarCategorias(termino, res);
      break;
    case 'productos':
      buscarProductos(termino, res);
      break;
    default:
      console.log('Hola Default');
      res.status(500).json({
        msg: 'Se le olvido hacer esta búsqueda',
      });
      break;
  }

  /*res.json({
    coleccion,
    termino,
  });*/
};

export { buscar };
