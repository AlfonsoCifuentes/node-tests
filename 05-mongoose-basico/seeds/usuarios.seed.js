//Este archivo actúa como semilla, es decir, se ejecutará una sola vez e introducirá
//unos primeros datos en nuestra base de datos, para que ésta esté ya poblada con algo

//Requerimos mongoose y lo guardamos como variable
const mongoose = require("mongoose");
//Requerimos nuestro modelo de usuario previamente creado, y lo almacenamos como variable
const Usuario = require("../models/Usuario");
//Requerimos nuestra conexión a la base de datos previamente creada, y lo almacenamos también como variable
const dbConnection = require("../db/db");
//Array de objetos de usuarios
const usuarios = [
  {
    nombre: "Alfonso",
    apellido: "Cifuentes",
    edad: 38,
    // password: "qwerty",
    // email: "acifuentes@gmail.com",
  },
  {
    nombre: "Perico",
    apellido: "Palotes",
    edad: 50,
    // password: "asdfg",
    // email: "ppalotes@gmail.com",
  },
  {
    nombre: "Peter",
    apellido: "Griffin",
    edad: 42,
    // password: "12345",
    // email: "pgriffin@gmail.com",
  },
  {
    nombre: "Paco",
    apellido: "Pil",
    edad: 50,
    // password: "6789",
    // email: "pacopil@gmail.com",
  },
];
//mapeamos el array de objetos usuarios para crear los nuevos usuarios usando nuestro modelo "Usuario"
//y los almacenamos todos en una variable:
const usuariosDocuments = usuarios.map((usuario) => new Usuario(usuario));

//Empezamos con nuestras llamadas asíncronas, comenzando con la conexión a la base de datos:
dbConnection
  //1. Eliminar el contenido de esta colección en Mongo, para quitarnos de problemas, como por ejemplo que estuviera
  //corrupta después de andar haciendo muchas pruebas
  .then(async () => {
    const allUsuarios = await Usuario.find(); //Desde el model "Usuario" hacemos una búsqueda de todos los usuarios que están
    if (allUsuarios.length > 0) {
      await Usuario.collection.drop(); //Si hay algo (.length > 0 ), dropeamos todo, lo tiramos, a la mierda con ello
    }
  })

  .catch((error) =>
    console.error("Error eliminando colección de usuarios:", error)
  )

  //2. Añadir los usuarios de la semilla a la colección

  .then(async () => {
    //Insertamos nuestro documento con todos los usuarios de golpe que habíamos mapeado antes, con un await e insertMany
    await Usuario.insertMany(usuariosDocuments);
  })

  .catch((error) => console.error("Error al insertar en Usuario:", error))

  //3. Desconexión, haya ido bien o mal
  .finally(() => mongoose.disconnect());
