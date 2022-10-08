'use strict';

class Dices {

  constructor() {
    this.regex_standard = /\/([\d]+)d([\d]+)(\+|\-[\d]+)?/;
    this.regex_ryf = /\/ryf(6?)(\+|\-?)/;
  }

  /**
   * Lanza un dado de las caras indicadas y devuelve un número aleatorio.
   * @param {int} caras El número de caras del dado
   * @returns {int} El resultado de la tirada.
   */
  tirarDado(caras) {
    return Math.floor(Math.random() * caras)+1;
  }

  /**
   * Esta función es para cuando se hace una tira estándar de dados (X dados de Y caras)
   */
  dice_standard = (msg) => {
    const dices = msg.match(this.regex_standard);
    const tiradas = parseInt(dices[1]);
    const caras = parseInt(dices[2]);
    const opciones = msg.match(this.regex_standard);

    let result = {
      tiradas: tiradas,
      caras: caras,
      dados: '',
      sumTiradas: 0
    }

    if (typeof opciones[3] === 'undefined') {
      for (let i = 0; i < tiradas; i++) {
        result.dados += this.tirarDado(caras) + ' ';
      }
    } else {
      for (let i = 0; i < tiradas; i++) {
        let tirada = this.tirarDado(caras);
        result.sumTiradas += tirada;
        result.dados += tirada + ' ';
      }
      console.log();
      const simbol = opciones[3][0];
      let aSumar = opciones[3].replace('+', '');
      result.sumTiradas += parseInt(aSumar);
      if (simbol == '+') result.aSumar = aSumar;
      if (simbol == '-') result.aRestar = aSumar.replace('-', '');
    }
    result.dados = result.dados.trim();
    return result;
  }

  /**
   * Esta es cuando se van a lanzar dados para el sistema de Rápido y Fácil (3 dados de 10 y se coge el valor medio)
   */
  dice_ryf = (msg) => {
    let tiradas = [];
    const opciones = msg.match(this.regex_ryf)
    let caras = 10;
    let resultado = null;

    if (opciones[1] == 6) caras = 6

    for (let i = 0; i < 3; i++) {
      tiradas.push(this.tirarDado(caras));
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
    
    return {
      dado1: tiradas[0],
      dado2: tiradas[1],
      dado3: tiradas[2],
      resultado: resultado
    }
  }

  /**
   * Lanza una tirada para el sistema FATE (4 dados de 6 caras, pero con símbolos +, - o nada)
   */
  fate = () => {
    let tiradas = [];
    let resultado = 0;

    for (let i = 0; i < 4; i++) {
      let tirada = this.tirarDado(6);

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
    return {
      tirada: tirada,
      resultado: resultado
    }
  }
}

module.exports = Dices;
