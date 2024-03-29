# @RolePlayDiceBot

Bot para Telegram que permite realizar tiradas de dados de diversos sistemas de rol, incluyendo los dados especiales para [Rápido y Fácil](http://www.rapidoyfacil.es/).

![Captura del bot en acción](screenshoot.jpg)

> Nota: Este bot aun esta en desarrollo por lo que muchas funcionalidades podrían no estar todavía disponibles en la versión estable y/o el bot oficial (no disponible de momento).

### Requisitos:

Node.js y su gestor de paquetes npm

### Uso:

Primero necesitas crear un nuevo bot para obtener el token. [Esta guía](https://tecnonucleous.com/2020/02/13/como-generar-el-token-de-nuestro-bot-con-botfather/) te indica los pasos a seguir.

Una vez obtenido el token deberás de guardarlo en una variable de entorno, **DICEBOT_TOKEN**, o cambia la linea que guarda la constante con el token poniendo directamente el token:

```js
const token = 'tu-token';
```

> Si el código del bot va a ser visible, te recomiendo por seguridad que no edites dicha linea

### Comandos disponibles

* Tirada clásica: /XdY (por ejemplo: /1d20, /2d6, /2d10, etc). Es posible añadir una suma a la tirada añadiendo el símbolo + y el valor a sumar, por ejemplo /1d20+5
* /ryf: Tirada para el sistema Rápido y Fácil (tira 3 dados de 10 caras y coge el dado medio). Este comando tiene variaciones:
  * /rfy+: En este caso se obtiene el dado alto.
  * /ryf-: En este caso el dado menor.
* /ryf6: En este caso es para la variante de Rápido y Fácil con dados de 6 caras. Admite también los símbolos + y -
* /d100: Lanza un dado de 100 caras o porcentual.
* /fate: Lanza una tirada para el sistema FATE (4 dados con 2 caras en blanco, 2 con el símbolo - y 2 con el símbolo +)