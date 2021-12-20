const fs = require ("fs");

fs.readFile ("usuarios.json", (error, datos) => {
    if (error){
        console.log ("Ha habido un error leyendo el fichero");
    }else{
        // const tipoDeDatos = typeof datos;
        // const usuariosParsed = JSON.parse(datos);
        // const tipoDeDatosParseados = typeof usuariosParsed;
        // console.log("Datos: ", datos.toString());
        // console.log ("Tipo de datos: ", tipoDeDatos);
        // console.log ("Datos parseados: ", usuariosParsed);
        // console.log ("Tipo de datos parseados: ", tipoDeDatosParseados)

        const usuarios = JSON.parse(datos);
        usuarios.forEach((usuario) => {
            console.log (`${usuario.nombre} ${usuario.apellido}`);
        }

        )
    }
}
);