// Importamos la librería node-telegram-bot-api 
const TelegramBot = require('node-telegram-bot-api');
const { I18n } = require('i18n');
const path = require('path');
const fse = require('fs-extra');
const Dices = require('./lib/dices');
const dices = new Dices();

const i18n = new I18n({
  locales: ['en', 'es'],
  directory: path.join(__dirname, 'locales'),
  defaultLocale: 'en',
});

const confFile = './config/default.json'

var config = require('./config/default.json');

// Creamos una constante que guarda el Token de nuestro Bot de Telegram que previamente hemos creado desde el bot @BotFather. Por seguridad la meteremos en una variable de entorno
const token = process.env.DICEBOT_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

const regex_standard = /\/([\d]+)d([\d]+)(\+[\d]+)?/;
const regex_ryf = /\/ryf(6?)(\+|\-?)/;

/**
 * Esta función es para cuando se hace una tira estándar de dados (X dados de Y caras)
 */
bot.onText(regex_standard, (msg) => {
  const result = dices.dice_standard(msg.text)
  let text = __(
    msg.chat.id,
    `${msg.from.first_name}: ha tirado ${result.tiradas} dado(s) de ${result.caras} caras (${result.dados})`
  );

  if (result.aSumar) text += ` y se le ha sumado ${result.aSumar} al resultado = ${result.sumTiradas}`;
  if (result.aRestar) text += ` y se le ha restado ${result.aRestar} al resultado = ${result.sumTiradas}`;
  bot.sendMessage(msg.chat.id, text);
});

/**
 * Esta es cuando se van a lanzar dados para el sistema de Rápido y Fácil (3 dados de 10 y se coge el valor medio)
 */
bot.onText(regex_ryf, (msg) => {
  const result = dices.dice_ryf(msg.text);
  const text = `${msg.from.first_name} : ${result.dado1} ${result.dado2} ${result.dado3} => ${result.resultado}`
  bot.sendMessage(msg.chat.id, text);
});

/**
 * Lanza una tirada para el sistema FATE (4 dados de 6 caras, pero con símbolos +, - o nada)
 */
bot.onText(/\/fate/, (msg) => {
  const result = dices.fate();
  const text = __(msg.chat.id, `${msg.from.first_name} saco ${result.tirada} : ${result.resultado}`);
  bot.sendMessage(msg.chat.id, text);
});

/**
 * Esta función se llama cada vez que haya un error.
 */
bot.on('polling_error', (error) => {
  console.dir(error);  // => 'EFATAL'
});

/**
 * Muestra la ayuda
 */
 bot.onText(/\/help/, (msg) => {
  const ayuda = `
  *RolePlayDiceBot*
    
  Un bot de Telegram para hacer tiradas de dados para diversos sistemas de rol

  *Comandos disponibles*
    
    \\- Tirada clásica: /XdY \\(por ejemplo: /1d20, /2d6, /2d10, etc\\)\\. Es posible añadir una suma o resta a la tirada añadiendo \\+ ó \\- y el valor a sumar o restar, por ejemplo /1d20\\+5
    \\- /ryf: Tirada para el sistema Rápido y Fácil \\(tira 3 dados de 10 caras y coge el dado medio\\)\\. Este comando tiene variaciones:
      \\- /rfy\\+: En este caso se obtiene el dado alto
      \\- /ryf\\-: En este caso el dado menor
      \\- /ryf6: En este caso es para la variante de Rápido y Fácil con dados de 6 caras\\. Admite también los símbolos \\+ y \\-
    \\- /d100: Lanza un dado de 100 caras o porcentual
    \\- /fate: Lanza una tirada para el sistema FATE \\(4 dados con 2 caras en blanco, 2 con el símbolo \\- y 2 con el símbolo \\+\\)
  `
  bot.sendMessage(msg.chat.id, ayuda, {parse_mode : 'MarkdownV2'});
});

bot.onText(/\/config/, (msg) => {
  const opts = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: __(msg.chat.id, 'Set language'),
            callback_data: 'set_lang'
          }
        ]
      ]
    }
  };
  bot.sendMessage(msg.chat.id, __(msg.chat.id, 'Configure bot'), opts);
});

// Handle callback queries
bot.on('callback_query', (callbackQuery) => {
  const action = callbackQuery.data;
  const msg = callbackQuery.message;
  const chat_id = msg.chat.id
  const opts = {
    chat_id: chat_id,
    message_id: msg.message_id,
  };
  let text;
  
  if (action === 'edit') {
    text = 'Edited Text';
  } else if (action == 'set_lang') {
    text = __(chat_id, 'Configure language');
    setLang(chat_id);
  } else if (action.startsWith('lang_')) {
    let lang = action.replace('lang_', '');
    if (chat_id in config) config[chat_id].lang = lang;
    else config[chat_id] = { lang: lang };
    saveConf();
    text = __(chat_id, 'Language saved');
  }

  bot.editMessageText(text, opts);
});

function setLang(chat) {
  const opts = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'English',
            callback_data: 'lang_en'
          },
          {
            text: 'Español',
            callback_data: 'lang_es'
          }
        ]
      ]
    }
  };
  bot.sendMessage(chat, __(chat, 'Set language'), opts);
}

function getChatLang(chat_id)
{
  if (chat_id in config) return config[chat_id].lang;
  else {
    config[chat_id] = {}
    config[chat_id].lang = 'en';
    saveConf();
    return 'en';
  }
}

function saveConf() {
  fse.writeJson(confFile, config, (error) => {
    if (error) {
      console.log('An error has occurred on save config');
      return;
    }
  });
}

function __(chat_id, text, replace={}) {
  const locale = getChatLang(chat_id)
  return i18n.__({
    phrase: text,
    locale: locale,
  }, replace);
}
