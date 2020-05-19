// Importamos la librería node-telegram-bot-api 
const TelegramBot = require('node-telegram-bot-api');

// Creamos una constante que guarda el Token de nuestro Bot de Telegram que previamente hemos creado desde el bot @BotFather
const token = 'tu-token';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

const dice_standard = /\/([\d]+)d([\d]+)/;
const dice_ryf = /\/ryf(6?)(\+|\-?)/;

/**
 * Lanza un dado de las caras indicadas y devuelve un número aleatorio.
 * @param {int} caras El número de caras del dado
 * @returns {int} El resultado de la tirada.
 */
function tirarDado(caras) {
  return Math.floor(Math.random() * caras)+1;
}

/**
 * Esta función es para cuando se hace una tira estándar de dados (X dados de Y caras)
 */
bot.onText(dice_standard, (msg) => {
  const dices = msg.text.match(dice_standard);
  const tiradas = parseInt(dices[1]);
  const caras = parseInt(dices[2]);
  let result = `${msg.from.first_name}: `;

  for (i=0; i < tiradas; i++) {
    result += tirarDado(caras) + ' ';
  }
  bot.sendMessage(msg.chat.id, result);
});

/**
 * Esta es cuando se van a lanzar dados para el sistema de Rápido y Fácil (3 dados de 10 y se coge el valor medio)
 */
bot.onText(dice_ryf, (msg) => {
  let tiradas = [];
  const opciones = msg.text.match(dice_ryf)
  let caras = 10;
  let resultado = null;
  if (opciones[1] == 6) caras = 6
  let result = `${msg.from.first_name}: `;

  for (i=0; i < 3; i++) {
    tiradas.push(tirarDado(caras));
  }

  if (!opciones[2]) {
    // Si no se le esta pasando como opcional un + o - se obtiene el dado medio.
    resultado = tiradas[0]+tiradas[1]+tiradas[2] - Math.min(tiradas[0], tiradas[1], tiradas[2]) - Math.max(tiradas[0], tiradas[1], tiradas[2]);
  } else if (opciones[2] == '+') {
    // En este caso se devuelve el dado mayor
    resultado = Math.max(...tiradas);
  } else if (opciones[2] == '-') {
    // Y en este el menor
    resultado = Math.min(...tiradas);
  }
  
  bot.sendMessage(msg.chat.id, `${msg.from.first_name}: ${tiradas[0]} ${tiradas[1]} ${tiradas[2]} => ${resultado}`);
});

/**
 * Lanza 1 dado de 100 caras, también llamada porcentual
 */
bot.onText(/\/d100/, (msg) => {
  resultado = tirarDado(100);
  bot.sendMessage(msg.chat.id, `${msg.from.first_name} lanzo 1d100: ${resultado}`);
});


/**
 * Lanza una tirada para el sistema FATE (4 dados de 6 caras, pero con símbolos +, - o nada)
 */
bot.onText(/\/fate/, (msg) => {
  let tiradas = [];
  let resultado = 0;

  for (i=0; i<4; i++) {
    let tirada = tirarDado(6);
    if (tirada == 1 || tirada == 2) {
      tiradas.push('-');
      resultado -= 1;
    } else if (tirada == 3 || tirada == 4) {
      tiradas.push('0');
      resultado += 0;
    } else {
      tiradas.push('+');
      resultado += 1;
    }
  }
  let tirada = tiradas.join(', ');
  bot.sendMessage(msg.chat.id, `${msg.from.first_name} saco ${tirada} : ${resultado}`);
});

/**
 * Esta función se llama cada vez que haya un error.
 */
bot.on('polling_error', (error) => {
  console.dir(error);  // => 'EFATAL'
});