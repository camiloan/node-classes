import { request, response } from 'express';
import { Categoria, Producto } from '../models/index.js';
import { body } from 'express-validator';

const obtenerProductos = async (req = request, res = response) => {
  const { limite = 5, desde = 1 } = req.body;
  const query = { estado: true };
  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .skip(Number(desde) - 1)
      .limit(Number(limite))
      .populate('usuario', 'nombre')
      .populate('categoria', 'nombre'),
  ]);
  res.json({
    total,
    productos,
  });
};

const obtenerProducto = async (req = request, res = response) => {
  const { id } = req.params;
  const producto = await Producto.findById(id)
    .populate('usuario', 'nombre')
    .populate('categoria', 'nombre');
  res.json(producto);
};

const crearProducto = async (req = request, res = response) => {
  const { estado, usuario, ...body } = req.body;

  const productoDB = await Producto.findOne({
    nombre: body.nombre.toUpperCase(),
  });

  if (productoDB) {
    return res.status(400).json({
      mgs: `La producto ${nombre.toUpperCase()}  ya existe`,
    });
  }

  const data = {
    ...body,
    nombre: body.nombre.toUpperCase(),
    usuario: req.usuario._id,
  };

  const producto = new Producto(data);
  await producto.save();
  res.status(201).json({
    producto,
  });
};

const actualizarProducto = async (req, res) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;
  if (data.nombre) {
    data.nombre = data.nombre.toUpperCase();
  }
  data.usuario = req.usuario._id;
  const producto = await Producto.findByIdAndUpdate(id, data, { new: true });
  res.json(producto);
};

const borrarProducto = async (req, res) => {
  const { id } = req.params;
  const productoBorrado = await Producto.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );
  res.json(productoBorrado);
};

export {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  borrarProducto,
};
