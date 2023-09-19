import express from 'express';
import cors from 'cors';
import { router as routerUser } from '../routes/usuarios.js';
import { router as routerAuth } from '../routes/auth.js';
import { router as routerCategory } from '../routes/categorias.js';
import { router as routerProduct } from '../routes/productos.js';
import { router as routerSearch } from '../routes/buscar.js';

import { dbConnection } from '../database/config.js';
class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;

    this.paths = {
      auth: '/api/auth',
      categorias: '/api/categorias',
      usuarios: '/api/usuarios',
      productos: '/api/productos',
      buscar: '/api/buscar',
    };

    // Conectar a base de datos
    this.conectarDB();

    // Middlewares
    this.middlwares();
    // Rutas de mi aplicacion
    this.routes();
  }

  async conectarDB() {
    await dbConnection();
  }

  middlwares() {
    // CORS
    this.app.use(cors());
    // Lectura y parseo del body
    this.app.use(express.json());
    // Directorio Público
    this.app.use(express.static('public'));
  }

  routes() {
    this.app.use(this.paths.auth, routerAuth);
    this.app.use(this.paths.usuarios, routerUser);
    this.app.use(this.paths.categorias, routerCategory);
    this.app.use(this.paths.productos, routerProduct);
    this.app.use(this.paths.buscar, routerSearch);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on port ${this.port}.`);
    });
  }
}

export { Server };
