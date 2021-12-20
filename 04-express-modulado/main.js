const express = require("express");

//Sin destructuring:
//const usuariosRouter = require("./router/usuarios.router");

//Con destructuring:
const { basePath: usuariosPath, router: usuariosRouter} = require("./router/usuarios.router");

const app = express();
const PORT = 3000;

//middleware par activar los bodys en formato JSON
app.use(express.json());

//middleware para saber parsear los arrays
app.use(express.urlencoded({ extended: false }));

//Aquí le decimos que para todo usuariosRouter utilice el path y el router especificados en usuarios.router:

//Sin destructuring
//app.use(usuariosRouter.basePath, usuariosRouter.router);

//Con destructuring
app.use (usuariosPath, usuariosRouter);


app.use("*", (req, res) => {
    res.send("Ruta no encontrada");  
  });

//Listener para el puerto que hemos especificado, en este caso solo ponemos un console log
app.listen(PORT, ()=> {
    console.log ("Se ha iniciado express de manera correcta");
})
