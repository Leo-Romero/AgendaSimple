const recursos = require('./recursos');
const usuarios = require('./rutas/usuarios');

module.exports = {
    ruta: (data, callback) => {
        callback(200, {mensaje: 'esta es /ruta'});
    },
    usuarios: usuarios(recursos.usuarios), 
    noEncontrado: (data, callback) => {
        callback(404, {mensaje: 'no encontrado'});
    }
}