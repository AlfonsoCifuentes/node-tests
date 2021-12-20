//Este fichero se dedica únicamente a crear la conexión con Mongoose

//Requerimos mongoose para su uso:
const mongoose = require("mongoose");

//Definimos la URL de nuestra base de datos, el puerto 27017 es el puerto que usa mongo por defecto:
const DB_URL = "mongodb://localhost:27017/mongoose-basico";


//Esta función conecta nuestro servidor a la base de datos mediante mongoose
const dbConnection = mongoose.connect (DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//Exportamos nuestra función de conexión a la base de datos que hemos guardado como variable
module.exports = dbConnection;