import colors from 'colors';
import {
  confirmar,
  inquirerMenu,
  leerInput,
  listadoTareasBorrar,
  mostrarListadoChecklist,
  pausa,
} from './helpers/inquirer.js';
import { Tareas } from './models/tareas.js';
import { guardarDB, leerDB } from './helpers/guardarArchivo.js';

const main = async () => {
  let opt = '';
  const tareas = new Tareas();
  const tareasDB = leerDB();

  if (tareasDB) {
    // Establecer las tareas
    tareas.crearTareaFromArray(tareasDB);
  }

  do {
    opt = await inquirerMenu();
    switch (opt) {
      case '1':
        //1. Crear tarea
        const desc = await leerInput('Descripción:');
        tareas.crearTarea(desc);
        break;
      case '2':
        tareas.listadoCompleto();
        break;
      case '3':
        tareas.listarPendientesCompletadas(true);
        break;
      case '4':
        tareas.listarPendientesCompletadas(false);
        break;
      case '5':
        const ids = await mostrarListadoChecklist(tareas.listadoArr);
        tareas.toggleCompletadas(ids);
        break;
      case '6':
        const id = await listadoTareasBorrar(tareas.listadoArr);
        if (id !== '0') {
          const ok = await confirmar('¿Está seguro?');
          if (ok) {
            tareas.borrarTarea(id);
            console.log('Tarea borrada');
          }
        }
        break;
      default:
        break;
    }
    guardarDB(tareas.listadoArr);
    await pausa();
  } while (opt !== '0');
};

main();
