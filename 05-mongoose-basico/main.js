//Evidentemente, lo primero es tunear el package.json, instalar mongoose, express y nodemon (npm install --save-dev nodemon)

//Requerimos el módulo db (que es el que realiza la conexión con mongoose)
//(no ponemos la extensión porque ya lo pilla solo)
require ("./db/db");
//Requerimos express y lo guardamos como variable
const express = require("express");
//Requerimos el router de usuarios
const usuariosRouter =require("./router/usuarios.router");
//Requerimos el router de empresas
const empresasRouter =require("./router/empresas.router");
//Definimos express como server
const server = express();
//Definimos el puerto que usamos en la conexión
const PORT = 3000;

// Middlewares para entender los json bodys
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

//Middleware de enrutado para /usuarios
server.use( "/usuarios", usuariosRouter);

// Middleware de enrutado para /empresas
server.use('/empresas', empresasRouter);

//Middleware de enrutado para rutas no existentes
server.use("*", (req, res) => {
    res.status(404).json("Not found");
})

// Manejador/Middleware de errores, siempre se define con los 4 parametros (err, req, res, next)
server.use((err, req, res, next) => {
    console.error('[ERROR] Ha ocurrido un error', err.status, err.message);
	return res.status(err.status || 500).json(err.message || 'Ha ocurrido un error en el servidor');
});

//Añadiendo un listener al puerto asignado, y ejecutamos un console log para confirmar
server.listen(PORT, ()=> {
    console.log (`Servidor arrancado en el puerto ${PORT}`)
})