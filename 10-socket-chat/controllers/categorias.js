import { request, response } from 'express';
import Categoria from '../models/categoria.js';

// obtenerCategorias - pagina - total - populate
const obtenerCategorias = async (req = request, res = response) => {
  const { limite = 5, desde = 1 } = req.query;
  const query = { estado: true };
  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query)
      .skip(Number(desde) - 1)
      .limit(Number(limite))
      .populate('usuario', 'nombre'),
  ]);
  res.json({
    total,
    categorias,
  });
};

// obtenerCategoria - populate {}
const obtenerCategoria = async (req = request, res = response) => {
  const { id } = req.params;
  const categoria = await Categoria.findById(id).populate('usuario', 'name');
  res.json(categoria);
};

const crearCategoria = async (req = request, res = response) => {
  const nombre = req.body.nombre.toUpperCase();
  const categoriaDB = await Categoria.findOne({ nombre });
  if (categoriaDB) {
    return res.status(400).json({
      mgs: `La categoria ${nombre}, ya existe`,
    });
  }
  // Generar la data a guardar
  const data = {
    nombre,
    usuario: req.usuario._id,
  };
  const categoria = new Categoria(data);
  // Guardar DB
  await categoria.save();
  res.status(201).json({
    categoria,
  });
};

// actualizarCategoria

const actualizarCategoria = async (req = request, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;
  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuario._id;

  const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

  return res.status(200).json(categoria);
};

// borrarCategoria - estado:false

const borrarCategoria = async (req = request, res = response) => {
  const { id } = req.params;
  const categoriaBorrada = await Categoria.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );
  res.json(categoriaBorrada);
};

export {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  borrarCategoria,
};
