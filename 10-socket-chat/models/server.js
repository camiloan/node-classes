import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { createServer } from 'http';
import { Server as ServerIo } from 'socket.io';
import { dbConnection } from '../database/config.js';

import {
  routerAuth,
  routerCategory,
  routerProduct,
  routerSearch,
  routerUpload,
  routerUser,
} from '../routes/index.js';
import { socketController } from '../sockets/controller.js';

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.server = createServer(this.app);
    this.io = new ServerIo(this.server);

    this.paths = {
      auth: '/api/auth',
      categorias: '/api/categorias',
      usuarios: '/api/usuarios',
      productos: '/api/productos',
      buscar: '/api/buscar',
      uploads: '/api/uploads',
    };

    // Conectar a base de datos
    this.conectarDB();

    // Middlewares
    this.middlwares();
    // Rutas de mi aplicacion
    this.routes();

    // Sockets
    this.sockets();
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
    // Carga de Archivos
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp/',
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.paths.auth, routerAuth);
    this.app.use(this.paths.usuarios, routerUser);
    this.app.use(this.paths.categorias, routerCategory);
    this.app.use(this.paths.productos, routerProduct);
    this.app.use(this.paths.buscar, routerSearch);
    this.app.use(this.paths.uploads, routerUpload);
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log(`App listening on port ${this.port}.`);
    });
  }

  sockets() {
    this.io.on('connection', (socket => socketController(socket, this.io)));
  }
}

export default Server;
