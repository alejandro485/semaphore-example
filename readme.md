# Semaforo de concurrencia para

Aplicacion backend de ofertas por productos con autenticacion basica.

## Diseno

### Vista general

La estructura es similar a la ofrecida por [NestJs](https://nestjs.com/), donde las funcionalidades se plasman en servicios cada una con su responsabilidad, pero no se usaron modulos como clases, en cambio los servicios se ubicaron en contenedores de [inversify](https://inversify.io/) para poder gestionar de forma sencilla las dependencias entre servicios. Con inversify se mantuvieron todos los servicios como singletons para asi no usar memoria por peticion(es) o invocacion(es).

Para la realizacion de las pruebas sobre el proyecto se uso [jest](https://jestjs.io/), junto a sus dependencias para typescript, y supertest para probar las peticiones http.

### Estructura

El archivo `main.ts` es el que inicia la ejecucion de la aplicacion y el backend en [Express](https://expressjs.com/), por defecto en el puerto 8080.

Las constantes principales para la aplicacion estan en el archivo `config.ts`:
* BIDS_LIMIT: numero maximo de ofertas por producto
* MAX_CONCURRENT_ADDS: numero maximo de inserciones concurrentemente mediante del semaforo
* TTL_TOKENS: tiempo de vida de las sesiones de autenticacion 

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

En el proyecto se realizaron 2 tipos de test: uno sobre cada servicio, unitarios, y otro sobre las peticiones http, generando asi dos grupos de tests que se realizaran por separado.

Mas adelante se especifica como ejecutar cada grupo de tests.

### Test en servicios

Para cada servicio, en su propia carpeta, se adjunto un archivo de test que contiene las pruebas al comportamiento del mismo. En los casos donde el servicio a probar tiene dependencias estas se crean en para los casos de prueba, exceptuando el servicio `add-bid` donde se uso el contenedor principal de la aplicacion ya que sus dependencias son muy extensas.

Para los servicios `bid-semaphore` y `get-bids` se escribieron pocas pruebas debido a la dificultad de probar su comportamiento: en el caso de `bid-semaphore` el control de la concurrencia y al encolamiento de intentos, y para `get-bids` por lo heterogenea que puede llegar ser su estructura, ademas de que muchas de sus validaciones son compartidas con el servicio `bid-manager`.

### Test en peticiones

Para las pruebas de las peticiones, se escribieron y se guardaron el carpeta **test**, alli por cada ruta del proyecto se creo un archivo de pruebas asociado a la misma, y donde solo se evaluan peticiones http. Para las rutas de '/:item/bid' y '/:item/topBidList' se invocaron la ruta de login '/:user/login' para poder realizar su flujo como es debido.

A este nivel las rutas '/:item/topBidList' y '/:item/bid' arrastran los mismo problemas al momento de escribir los tests que los servicios `get-bids` y `bid-semaphore` respectivamente.

## Ejecucion

### Despues de descargar el proyecto:

Instalacion de dependencias

    $ npm install

Compilacion del codigo

    $ npm run build

Ejecucion (escuchando el puerto 8080)

    $ npm start

Ejecucion de tests sobre servicios

    $ npm run test

Ejecucion de tests sobre peticiones

    $ npm run test:http
