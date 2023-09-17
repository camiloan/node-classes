import express from 'express';
import cors from 'cors';
import { router as routerUser } from '../routes/usuarios.js';
import { router as routerAuth} from '../routes/auth.js';
import { dbConnection } from '../database/config.js';
class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.usuariosPath = '/api/usuarios';
    this.authPath = '/api/auth';

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
    this.app.use(this.usuariosPath, routerUser);
    this.app.use(this.authPath, routerAuth);

  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on port ${this.port}.`);
    });
  }
}

export { Server };
