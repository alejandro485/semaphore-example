# Kuupanda Developer Backend Test

Aplicacion backend de ofertas por productos con autenticacion basica.

## Diseno

### Vista general

La estructura es similar a la ofrecida por NestJs, donde las funcionalidades se plasman en servicios cada uno con su responsabilidad, pero no se usaron modulos convencionales, en cambio los servicios se ubicaron en contenedores de [inversify](https://inversify.io/) para poder gestionar de forma sencilla las dependencias entre servicios. Con inversify se mantuvieron todos los servicios como singletons para asi no usar memoria por peticiones o invocaciones.

### Estructura

El archivo `main.ts` es el que inicia la ejecucion de la aplicacion y el backend en [Express](https://expressjs.com/), por defecto en el puerto 8080.

Las constantes principales para la aplicacion estan en el archivo `config.ts`: BIDS_LIMIT (numero maximo de ofertas por producto), MAX_CONCURRENT_ADDS (numero maximo de ) y TTL_TOKENS (tiempo de vida de las sesiones de autenticacion). 

Hay dos modulos principales, Auth y Bid:

1. **Auth**: encargado de las tareas de autenticacion y gestion de claves de sesiones

    * `token.service` almacena las sesiones en un diccionario en formato *sesion: usuario*, y controla su tiempo de vida con el uso de la funcion *timeOut*.
    * `login.service` genera los tokens por usuario a partir de un numero semi-aleatorio de JS y los retorna para su uso.
    * `validate-token.service` validador de tokens y usuarios asociados a ellos.

2. **Bid**: gestion de ofertas sobre productos
    * `bid-manager.service` almacena las diferentes ofertas por productos en un diccionario de identificadores de productos cuyos valores son las listas de ofertas con usuario y monto respectivamente. En la insercion de ofertas la lista se ordena y se acota al numero maximo de ofertas.
    * `bid-semaphore.service` encargado de controlar los accesos a la insercion de ofertas mediante encolando los intentos de insercion. Idea original del semaforo [aqui](https://medium.com/swlh/semaphores-in-javascript-e415b0d684bc)
    * `add-bid.service` adapta la entrada de la peticion a los datos para agregar la oferta
    * `get-bids.service` consulta las ofertas de un producto con la conversion especificada

Cada uno de estos modulos tiene su propio contenedor de inversify para el manejo de las dependencias, y estos modulos a su vez hacen parte de `app.container` que agrupa todas los servicios y modulos de la aplicacion.

Las rutas se crean en `app.controller` donde se consumen los servicios, y cada endpoint tiene un manejo basico de errores con un *try catch*. Para las peticion de adicion de oferta y consulta de top de ofertas existe un middleware en `session.middleware` para la validacion de la sesion de usuarios.

### Tests

No se incluyeron test para el proyecto.

## Ejecucion

### Despues de descargar el proyecto:

Instalacion de dependencias

    $ npm install

Compilacion del codigo

    $ npm run build

Ejecucion (escuchando el puerto 8080)

    $ npm start

