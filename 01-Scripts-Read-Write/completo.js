const fs = require("fs");
const { callbackify } = require("util");

const archivo = "./usuarios.json";

function anadirUsuario (nombre, apellido, edad, callback){

//Leer usuarios y parsearlos a array de objetos
fs.readFile (archivo, (errorDeLectura, datos) => {
    if (errorDeLectura){
        console.error ("Ha habido un error leyendo el archivo");
        return;
    }

    const usuarios = JSON.parse(datos);

    //Añadiendo un nuevo usuario al array de objetos del JSON de usuarios, NOTA: hacemos lo del id para coger
    //el último de la lista y añadirle uno, pero más adelante usaremos id únicos
    usuarios.push({"id": usuarios[usuarios.length -1].id +1, nombre, apellido, edad})

    //Escribiendo el array nuevo en el mismo fichero
    fs.writeFile(archivo, JSON.stringify(usuarios), (errorDeEscritura) => {
        if (errorDeEscritura) {
            console.error ("Ha habido un error escribiendo el archivo")
            return;
        }

        console.log ("Usuario añadido con éxito al fichero");
        callback();
    }
    )
}

)

}


//Toma callback hell pa tu cuerpo, con esto añadimos a estos 3 usuarios de una.
//NOTA: en el último usamos el retorno undefined porque tiene que retornar algo, si no da error (aunque los añade)
anadirUsuario("Paco", "Pil", 54, ()=>
    anadirUsuario("Benito", "Camela", 69, ()=>
        anadirUsuario("Elena", "Nito del Bosque", 50, () => undefined)
    )
)

