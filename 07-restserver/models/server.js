import express from 'express';
import cors from 'cors';
import { router } from '../routes/usuarios.js';
class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usuariosPath = '/api/usuarios';
    // Middlewares
    this.middlwares();
    // Rutas de mi aplicacion
    this.routes();
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
    this.app.use(this.usuariosPath, router);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on port ${this.port}`);
    });
  }
}

export { Server };
