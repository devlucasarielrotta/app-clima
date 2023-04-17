import colors from 'colors'
import {inquirerMenu, leerInput, listarLugares, pausa} from './helpers/inquirer.js';
import {Busquedas} from './models/busquedas.js';

const main = async () => {
  const busquedas = new Busquedas();

  let option = '';

  do {
    option = await inquirerMenu();
    switch (option) {
      case 1:
        const lugar = await leerInput('Ingrese la ciudad: ');
        if (lugar !== '') {
          const lugares = await busquedas.ciudad(lugar);

          const id = await listarLugares(lugares);
          if (id !== '0') {
            const {nombre, lng, lat} = lugares.find((lugar) => lugar.id === id);
            const {desc,min,max,temp} = await busquedas.climaLugar(lat,lng);
            
            busquedas.agregarHistorial(nombre);

            console.log('\n***Información de la ciudad***\n'.green);
            console.log('Ciudad: ', colors.green(nombre));
            console.log('Lat: ', lat);
            console.log('Lng: ', lng);
            console.log('Temperatura: ', colors.green(temp)) ;
            console.log('Mínima: ', min);
            console.log('Máxima: ', max);
            console.log('Clima actual: ', colors.green(desc))
            console.log('');
          }
        } else {
          console.log('No ingresaste ningun valor, volve a intentar por favor.');
        }

        await pausa();
        break;

      case 2:
       
       busquedas.historialCapitalizado.forEach((lugar,i) => {
        const idx = `${i + 1}.`.green;
        console.log(`${idx} ${lugar}`);
       });
        await pausa();
        break;
    }
  } while (option !== 0);
};

main();
