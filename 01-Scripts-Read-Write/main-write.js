const fs = require ("fs");

const coche = {
    marca: "Ferrari",
    modelo: "Testarossa",
    potencia: 350
}

fs.writeFile("./coches.json", 
JSON.stringify(coche),
(error) => {
    if (error) {
        console.error ("Ha habido un error escribiendo el fichero");
    }else{
        console.log ("Fichero escrito correctamente");
    }
    
}
);

