import inquirer from 'inquirer';
import colors from 'colors';

const preguntas = [
  {
    type: 'list',
    name: 'opcion',
    message: 'Eliga su opción',
    choices: [
      {
        value: 1,
        name: `${'1'.green}. Buscar Ciudad`,
      },
      {
        value: 2,
        name: `${'2'.green}. Historial`,
      },
      {
        value: 0,
        name: `${'0'.green}. Salir`,
      },
    ],
  },
];

const inquirerMenu = async () => {
    console.clear();
    console.log('\n=========================='.green);
    console.log('    Seleccione una opción    '.brightWhite);
    console.log('==========================\n'.green);
    
    const {opcion} = await inquirer.prompt(preguntas)
    
    return opcion;
}

const leerInput = async ( message ) => {
  const opciones = [
    {
      type:'input',
      name:'ciudad',
      message
    }
  ]
  const {ciudad} = await inquirer.prompt(opciones);

  return ciudad;
}

const listarLugares = async (lugares = []) => {
  const opciones = lugares.map((lugar,i) => {
    const idx = `${i+1}.`.green
    return {

      value: lugar.id,
      name: `${idx} ${lugar.nombre}`
    }
  })

  opciones.unshift({
    value:'0',
    name: '0'.green + ' Cancelar'
  })
  
  const preguntas = [
    {
      type:'list',
      name: 'id',
      message: 'Selecione el lugar: ',
      choices: opciones
    }
  ]
  const { id } = await inquirer.prompt(preguntas);
  return id;
}

const pausa = async () => {
  const continuar = [
    {
      type:'input',
      name: 'pause',
      message: `Presione ${'Enter'.brightWhite} para continuar...`
    }
  ]
  const {pause} = await inquirer.prompt(continuar);

  return pause;
}


export {
    inquirerMenu,
    listarLugares,
    leerInput,
    pausa
};
