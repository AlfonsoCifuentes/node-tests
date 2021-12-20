//Este fichero es nuestro modelo de datos, como la plantilla para el dato "usuario" en este caso
//Requerimos mongoose
const mongoose = require ("mongoose");
//Guardamos el esquema de mongoose como variable
const Schema = mongoose.Schema;
//Definimos la plantilla del esquema de mongoose
const usuarioSchema = new Schema(
    {
        nombre:     {type: String, required: true },
        apellido:   {type: String,},
        edad:       {type: Number, required: true },
        //email:      {type: String, required: true},
        //password: {type: String, required: true}
    },
    {
        // timestamps sirve para guardar las fechas de creación y actualización de los documentos
        timestamps: true
    }
);
//Guardamos el modelo de usuario como variable (Usuario)
const Usuario = mongoose.model ("Usuario", usuarioSchema);
//Exportamos el modelo de usuario que hemos almacenado en variable:
module.exports = Usuario;