/**
 *  _listado:
 *          {'9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d':{ id:12, desc:hola, completadoEN:92231} },
 *          {'9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d':{ id:12, desc:hola, completadoEN:92231} },
 *          {'9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d':{ id:12, desc:hola, completadoEN:92231} },
 *
 */

import { Tarea } from './tarea.js';

class Tareas {
  _listado = {};
  get listadoArr() {
    const listado = [];
    Object.keys(this._listado).forEach((key) => {
      const tarea = this._listado[key];
      listado.push(tarea);
    });
    return listado;
  }

  constructor() {
    this._listado = {};
  }

  borrarTarea(id = '') {
    if (this._listado[id]) {
      delete this._listado[id];
    }
  }

  crearTareaFromArray(tareas = []) {
    tareas.forEach((tarea) => {
      this._listado[tarea.id] = tarea;
    });
  }

  crearTarea(desc = '') {
    const tarea = new Tarea(desc);
    this._listado[tarea.id] = tarea;
  }

  listadoCompleto() {
    console.log();
    let i = 0;
    Object.keys(this._listado).forEach((key) => {
      i++;
      console.log(
        `${i.toString().green}. ${this._listado[key].desc} :: ${
          this._listado[key].completadoEn ? 'Completada'.green : 'Pendiente'.red
        }`
      );
    });
  }

  listarPendientesCompletadas(completadas = true) {
    console.log();
    let i = 0;
    Object.keys(this._listado).forEach((key) => {
      if (this._listado[key].completadoEn && completadas) {
        i++;
        console.log(
          `${i.toString().green}. ${this._listado[key].desc} :: ${
            this._listado[key].completadoEn.green
          }`
        );
      } else if (!this._listado[key].completadoEn && !completadas) {
        i++;
        console.log(
          `${i.toString().green}. ${this._listado[key].desc} :: ${
            this._listado[key].completadoEn
              ? 'Completada'.green
              : 'Pendiente'.red
          }`
        );
      }
    });
  }

  toggleCompletadas(ids = []) {
    ids.forEach((id) => {
      const tarea = this._listado[id];
      if (!tarea.completadoEn) {
        tarea.completadoEn = new Date().toISOString();
      }
    });

    this.listadoArr.forEach((tarea) => {
      if (!ids.includes(tarea.id)) {
        this._listado[tarea.id].completadoEn = null;
      }
    });
  }
}

export { Tareas };
