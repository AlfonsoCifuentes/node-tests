const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;
const routerUsuario = express.Router();



//Usuarios 1 (hay que ir de lo específico a lo general)
routerUsuario.get ("/:id", (req, res) => {
    res.send("Funcionalidad no implementada: Obtener 1 solo usuario");
 
 });



//Usuarios 
routerUsuario.get ("/", (req, res) => {
    const usuarios = [
      { id: 1, nombre: "Alfonso", apellido: "Cifuentes", edad: 38 },
      { id: 2, nombre: "Trent", apellido: "Reznor", edad: 45 },
    ];
  
    res  //Con express podemos usar res y luego .setHeader .send como si fueran thens
    //NOTA: no debe ponerse punto y coma hasta el último then
    .setHeader ("Content-Type", "application/json") //Aunque express lo pilla solo, es mejor explicitarlo
    .send(usuarios);
  });

routerUsuario.post ("/", (req,res) => {
    res.send ("Funcionalidad no implementada: CrearUsuario");
});

routerUsuario.put ("/", (req,res) => {
    res.send ("Funcionalidad no implementada: EditarUsuario");
});

routerUsuario.delete ("/", (req,res) => {
    res.send ("Funcionalidad no implementada: BorrarUsuario");
});




//Aquí le decimos que para todo routerUsuario utilice el siguiente path:
app.use("/usuarios", routerUsuario);




//Aquí le decimos que en el raíz diga hello world. Tanto aquí como en el anterior, usamos use en vez de
//elementos del CRUD como get, post, put, o delete para permitir cualquier tipo de petición
app.use("/", (req, res) => {  //También podríamos usar un asterisco en vez de una barra, así todo lo que no entre
    res.send("Hello World");  //   en el router de usuarios, entraría por aquí.
  });


//Listener para el puerto que hemos especificado, en este caso solo ponemos un console log
app.listen(PORT, ()=> {
    console.log ("Se ha iniciado express de manera correcta");
})

