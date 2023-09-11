import {
  inquirerMenu,
  leerInput,
  listarLugares,
  pausa,
} from './helpers/inquirer.js';
import { Busquedas } from './models/busquedas.js';
import 'dotenv/config';

const main = async () => {
  const busquedas = new Busquedas();
  let opt = '';
  do {
    opt = await inquirerMenu();
    switch (opt) {
      case '1':
        // Mostrar mensaje
        const termino = await leerInput('Ciudad: ');
        // Buscar los lugares
        const lugares = await busquedas.ciudad(termino);
        if (!lugares.length) {
          console.clear();
          console.log('Error de comunicacion con la api, vuelve a intentarlo');
        } else {
          // Seleccionar el lugar
          const id = await listarLugares(lugares);
          const lugarSel = await lugares.find((l) => l.id === id);
          // Guardar en DB
          if (id === '0') continue;
          busquedas.agregarHistorial(lugarSel.nombre);

          // Datos clima
          const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);
          // Mostrar resultados
          console.clear();
          console.log('\nInformación de la ciudad\n'.green);
          console.log('Ciudad:', lugarSel.nombre);
          console.log('Lat:', lugarSel.lat);
          console.log('Lng:', lugarSel.lng);
          console.log('Temperatura:', clima.temp);
          console.log('Maxima:', clima.max);
          console.log('Minima:', clima.min);
          console.log('Como esta el día?', clima.desc.green);
        }

        break;
      case '2':
        busquedas.historialCapitalizado.forEach((lugar, i) => {
          const idx = `${i + 1}.`.green;
          console.log(`${idx} ${lugar}`);
        });
        break;
      default:
        break;
    }
    if (opt !== 0) await pausa();
  } while (opt !== '0');
};

main();
