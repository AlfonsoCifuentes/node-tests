//Requerimos express y fs para su uso
const express = require ("express");
const fs = require("fs");
//Declaramos un router y una ruta base
const router = express.Router();
const basePath = "/usuarios";
//Con require le decimos que resuelva la ubicación del archivo desde la carpeta raíz del proyecto
const filename = require.resolve("./usuarios.json");

//Encontrando un usuario específico
router.get ("/:userId", (req, res) => {

    //Usando el request para acceder a un usuario específico:
    //params coge el trozo variable de nuestra ruta, en este caso userId
    //Además decimos que usuarioId sea número
    const usuarioId = Number(req.params.userId);

    //Error a lanzar si el usuario que se pide no es un número (isNaN)
    if (Number.isNaN(usuarioId)){
        res.sendStatus(400);
        return;
    }
    
    fs.readFile(filename, (error, data) => {
        if (error){
            //Responder con que ha habido un error
            res.status(500).send("Ha ocurrido un error interno del servidor (500), por favor inténtelo más tarde");
            return;
        }

        //Si no hay error, parseamos los datos del JSON y enviamos la respuesta con send
        const usuarios = JSON.parse(data);
        const usuario = usuarios.find(
            //así pasamos el id del usuario a número y hacemos comparación estricta
            usuarioEnBaseDeDatos => usuarioEnBaseDeDatos.id === Number(usuarioId) 
            );
        if (!usuario) {
            res.status(404).send("Usuario no encontrado");
            return;
        }

        res.send(usuario);
    })


    
    //response (nótese el acento grave para templatestrings)
    //res.send (`Not implemented: GetUser -> ${usuarioId}`);
});

//Obteniendo todos los usuarios
router.get ("/", (req, res) => {


    fs.readFile(filename, (error, data) => {
        if (error){
            //Responder con que ha habido un error
            res.status(500).send("Ha ocurrido un error interno del servidor (500), por favor inténtelo más tarde");
            return;
        }

        //Si no hay error, parseamos los datos del JSON y enviamos la respuesta con send
        const usuarios = JSON.parse(data);
        res.send(usuarios);
    })

    
});

//Añadir un usuario
router.post ("/", (req, res) => {
 
    const { nombre, apellido, edad } = req.body; //requerimos el body PARSEADO (es necesario) porque en este caso enviaremos el body desde postman

    //Creamos un array vacio para meter en él los campos que faltan
    let camposQueFaltan =[];
    //Añadimos cada campo que falta al array
    if (!nombre){
        camposQueFaltan.push("nombre");
    }
    if (!apellido){
        camposQueFaltan.push("apellido");
    }if (!edad){
        camposQueFaltan.push("edad");
    }

    if (camposQueFaltan.length > 0){

        //mapeamos el array para definir el campo que falta, y unimos cada respuesta (.join) con un salto de linea /n
        res.status(400).send(camposQueFaltan.map(campo => `${campo} es obligatorio`).join('\n'));
        return;
    }

    fs.readFile(filename, (error, data) => {
        if (error){
            console.error ("Error al leer archivo", error);
            //Responder con que ha habido un error
            res.status(500).send("Ha ocurrido un error interno del servidor (500), por favor inténtelo más tarde");
            return;
        }

        //Si no hay error, parseamos los datos del JSON y enviamos la respuesta con send
        const usuarios = JSON.parse(data);
        //Cogemos el último usuario del JSON de usuarios
        const ultimoUsuario = usuarios[usuarios.length - 1];

        //Escribimos el nuevo usuario sumándole uno al id del último
        const usuarioAEscribir = {
            id: ultimoUsuario.id + 1,
            nombre,
            apellido,
            edad,
        };

        
        const usuarioConNuevoUsuario = usuarios.concat(usuarioAEscribir); //se podría hacer un push pero es destructivo

        //Escribiendo el fichero con las modificaciones, con el usuario añadido
        fs.writeFile(
            filename,
            JSON.stringify(usuarioConNuevoUsuario),
            (error) => {
                if (error) {
                    console.error ("Error al escribir archivo", error);
                    res.status(500).send("Ha ocurrido un error, inténtelo más tarde");
                    return;
                }

                res.status(201).json(usuarioAEscribir);
            }
            );

    }); 
   
});

//Modificar un usuario
router.put('/:id', (req, res) => {
    const usuarioId = Number(req.params.id);
    if (Number.isNaN(usuarioId)) {
        res.sendStatus(400);
        return;
    }
    const {nombre, apellido, edad} = req.body;
    fs.readFile(filename, (error, data) => {
        if (error) {
            console.error('ERROR AL LEER ARCHIVO', error);
            // Responder con que ha sucedido un error
            res.status(500).send('Ha ocurrido un error, intentelo más tarde');
            return;
        }
        const usuarios = JSON.parse(data);
        const usuario = usuarios.find((usuarioEnDB) => usuarioEnDB.id === usuarioId);

        if (!usuario) {
            res.status(404).send('Usuario no encontrado');
            return;
        }

        usuario.nombre = nombre || usuario.nombre;
        usuario.apellido = apellido || usuario.apellido;
        usuario.edad = edad ?? usuario.edad;

        fs.writeFile(
            filename,
            JSON.stringify(usuarios),
            (error) => {
                if (error) {
                    console.error('Error al escribir archivo', error);
                    res.status(500).send('Ha ocurrido un error, intentelo más tarde');
                    return;
                }
                res.status(200).json(usuario);
            }
        );
    });
});

//Eliminando un usuario
router.delete ("/:id", (req, res) => {
    const usuarioId = Number(req.params.id);
    if (Number.isNaN(usuarioId)){
        res.sendStatus(400);
        return;
    }

    fs.readFile(filename, (error, data) => {
        if (error){
            console.error ("Error al leer archivo", error);
            //Responder con que ha habido un error
            res.status(500).send("Ha ocurrido un error interno del servidor (500), por favor inténtelo más tarde");
            return;
        }

        //Si no hay error, parseamos los datos del JSON y enviamos la respuesta con send
        const usuarios = JSON.parse(data);

        //Filtramos todos los usuarios cuyo id no sea el que pedimos
        const usuariosSinElUsuarioEliminado = usuarios.filter(
            (usuario) => usuario.id !== usuarioId
        ); //Con esto dejamos el array como estaba, pero sin el usuario que pedimos, osea, lo quitamos

        //Escribiendo el fichero con las modificaciones, con el usuario eliminado
        fs.writeFile(
            filename,
            JSON.stringify(usuariosSinElUsuarioEliminado),
            (error) => {
                if (error) {
                    console.error ("Error al escribir archivo", error);
                    res.status(500).send("Ha ocurrido un error, inténtelo más tarde");
                    return;
                }

                res.sendStatus(200);
            }
            );

    })
    
});

//Añadiendo use para el resto de métodos
router.use ("*", (req, res) => {
    res.status(405).send("Metodo no encontrado");
});

//Aquí exportamos el módulo router para poder usarlo en el main
//module.exports = router; //Con esto exportaríamos sólo el modulo router, pero vamos a exportar tb el basePath
module.exports= {
    router,
    basePath
}