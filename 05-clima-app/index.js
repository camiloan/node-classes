import { inquirerMenu, leerInput, pausa } from './helpers/inquirer.js';

const main = async () => {
  let opt = '';
  do {
    opt = await inquirerMenu();
    console.log({ opt });
    switch (opt) {
      case '1':
        break;
      case '2':
        break;
      default:
        break;
    }
    if (opt !== 0) await pausa();
  } while (opt !== '0');
};

main();
