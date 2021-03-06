const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const enrutador = require('./enrutador');

module.exports = (req, res) => {

    const urlActual = req.url;
    const urlParseada = url.parse(urlActual, true);
    const ruta = urlParseada.pathname;

    // quitar slash
    const rutaLimpia = ruta.replace(/^\/+|\/+$/g, '');

    // obtener el metodo http
    const metodo = req.method.toLowerCase();

    // dar permisos de CORS
    res.setHeader("Access-Control-Allow-Origin", "*");  // clave-valor *=(a todos)
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, DELETE, POST");
    if(metodo === 'options') {
        res.writeHead(204);
        res.end();
        return;
    }

    // obtener variables del query url
    const { query = {} } = urlParseada;     // si es vacia no de error

    // obtener headers
    const { headers = {} } = req;

    // obtener payloads si hay
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', (data) => {      // cada vez que el evento 'data' ocurra en el request se
        buffer += decoder.write(data); // ejecutara este callback, y concatena los datos en
    });                                 // el buffer

    // este evento sucede cuando finaliza, es asincrono
    // por lo que las respuestas (res) deben estar dentro
    req.on('end', () => {      // cuando el request termina (evento end), termina de recibir datos
        buffer += decoder.end(); // y cierro el decoder

        if(headers["content-type"] === 'application/json') {
            buffer = JSON.parse(buffer);
        }
        
        // posee la ruta un indice ?
        if(rutaLimpia.indexOf('/') > -1) {
            var [rutaPrincipal, indice] = rutaLimpia.split('/');
        }

        // ordenar la data del request
        const data = {
            indice,
            ruta: rutaPrincipal || rutaLimpia,
            query,
            metodo,
            headers,
            payload: buffer,
        };

        console.log({ data });

        // elegir el manejador dependiendo de la ruta
        // y asignarle la funcion que el enrutador tiene
        let handler;
        if(data.ruta && enrutador[data.ruta] && enrutador[data.ruta][metodo]) {   // aca handler es function
            handler = enrutador[data.ruta][metodo];
        }
        else {
            handler = enrutador.noEncontrado;       // aca no es function
        }

        // ejecutar el handler para enviar la respuesta
        if(typeof handler === 'function') {
            handler(data, (statusCode = 200, mensaje) => {
                const respuesta = JSON.stringify(mensaje);
                res.setHeader("Content-Type","application/json");   //
                res.writeHead(statusCode);
                // linea donde realmente ya estamos respondiendo a la aplicación cliente
                res.end(respuesta);
            });
        }
    });
};

