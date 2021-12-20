//Requerimos express y fs para su uso
const express = require ("express");

//Requerimos el modelo "Usuario":

const Usuario = require("../models/Usuario");

//Declaramos un router y una ruta base
const router = express.Router();

//GET todos los usuarios

router.get ("/", (req, res) => {
    //Obtenemos todos los usuarios con el Usuario.find:
    Usuario.find()
        //Entonces damos un response con los usuarios en json
        .then((usuarios) => {
            return res.json(usuarios);
        })
        //Y si no funciona, capturamos el error en un catch:
        .catch ((error) => {
            //Error en consola para dev
            console.error ("Error en GET /", error);
            //Error que recibirá el cliente
            return res.status(500).json("Ha ocurrido un error en el servidor");
        })
});

//GET usuario indicado por id
router.get ("/:id", (req, res) => {
    //requerimos el parámetro id y lo almacenamos en una variable
    const id = req.params.id;
    //Encontrando a un usuario en nuestro modelo por id:
    Usuario.findById(id)
        //Entonces mandamos la respuesta con el usuario pedido en json
        .then (usuario =>{
            //Si no hay usuario, damos este error
            if (!usuario) {
                return res.status(404).json("Usuario no encontrado");
            }
            //Si sí que lo hay, mandamos respuesta con el usuario en json
            return res.json(usuario)
        })
        //Si no funciona, capturamos el error con un catch y especificamos el tipo de error
        .catch (error => {
            //Error en consola para dev
            console.error (`Error en GET /${id}`, error);
            //Error que recibirá el cliente
            return res.status(500).json("Ha ocurrido un error en el servidor");
        })

});

//GET de usuarios que tengan una edad especifica
router.get("/edad/:edad", (req, res) => {
    const edadSolicitada = req.params.edad;
    return  Usuario.find({edad: edadSolicitada}) //ponemos la edadSolicitada entre llaves para que busque la edad solicitada como un objeto
    //Entonces damos un response con los usuarios en json
    .then((usuarios) => {
        return res.json(usuarios);
    })
    //Y si no funciona, capturamos el error en un catch:
    .catch ((error) => {
        //Error en consola para dev
        console.error (`Error en GET /edad/${edad}`, error);
        //Error que recibirá el cliente
        return res.status(500).json("Ha ocurrido un error en el servidor");
    })
    
})

//GET de usuarios que tengan MENOS de una edad especifica
router.get("/menosque/:edad", (req, res) => {
    const edadSolicitada = req.params.edad;
    return  Usuario.find({edad: {$lt: edadSolicitada}}) //ponemos la edadSolicitada entre llaves para que busque la edad solicitada como un objeto
    //El comando $lt significa less than, también hay otros como $lte, $gt, $gte (los que llevan e es e de equal)
    //Entonces damos un response con los usuarios en json
    .then((usuarios) => {
        return res.json(usuarios);
    })
    //Y si no funciona, capturamos el error en un catch:
    .catch ((error) => {
        //Error en consola para dev
        console.error (`Error en GET /edad/${edad}`, error);
        //Error que recibirá el cliente
        return res.status(500).json("Ha ocurrido un error en el servidor");
    })
    
})


// POST para crear usuario
// /usuarios/create -> antipatrón, la acción la debe definir el verbo (POST)
// /usuarios -> patrón correcto
router.post('/', (req, res, next) => {
    const nuevoUsuario = new Usuario({
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        edad: req.body.edad,
    });

    nuevoUsuario.save()
        .then(() => {
            return res.status(201).json(nuevoUsuario);
        }).catch((error) => {
            next(error);
        });
});

// PUT de un usuario -> Editar a un usuario
router.put('/:id', (req, res, next) => {
    const usuarioId = req.params.id;
    const nuevoUsuario = new Usuario(req.body); // { nombre: req.body.nombre, edad: req.body.edad, ... }
    nuevoUsuario._id = usuarioId;
    Usuario.findByIdAndUpdate(usuarioId, nuevoUsuario, { new: true })
        .then(usuarioActualizado => {
            res.status(200).json(usuarioActualizado);
        })
        .catch(error => {
            next(error);
        });
});

// DELETE de un usuario
router.delete('/:id', (req, res, next) => {
    const usuarioId = req.params.id;
    Usuario.findByIdAndDelete(usuarioId)
        .then(() => {
            return res.status(200).json(`Usuario con id ${usuarioId} eliminado`);
        })
        .catch(error => {
            next(error);
        });
});

//Exportamos el módulo router
module.exports = router;















/* 




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


    Usuario.find()

    
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
module.exports= router;







 */