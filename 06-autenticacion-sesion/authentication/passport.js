//Requerimos passport, la librería que vamos a usar para mantener la información de sesión
const passport = require('passport');
//Requerimos passport local
const passportLocal = require('passport-local');
//Para poder encriptar las contraseñas primero debemos instalar bcrypt, y lo requerimos
const bcrypt = require('bcrypt');

const Usuario = require('../models/Usuario');
//Definimos la estrategia de passport local como una const
const LocalStrategy = passportLocal.Strategy;
//Definimos los "saltos" que va a hacer el encriptado, las vueltas que va a pegar encriptando
const saltos = 10;

//PARA REGISTRO:
passport.use(
    'register',
    new LocalStrategy(
        {
            //Referenciamos las estrategias de passport a nuestras definiciones del modelo "Usuario"
            usernameField: 'email',
            passwordField: 'password',
            //con esto le decimos que reciba las peticiones que le vamos a ir haciendo
            passReqToCallback: true,
        },
        
        async (req, email, password, done) => {
            try {
                // 1. Buscar si existe un usuario registrado con el email
                const usuarioExistente = await Usuario.findOne({ email });
                if (usuarioExistente) {
                    const error = new Error('Usuario ya registrado');
                    return done(error);
                }

                // 2. Si el usuario no existe, vamos a encriptar la contraseña
                const passwordEncriptada = await bcrypt.hash(password, saltos); //tb existe hashSync pero no lo
                //usamos porque estamos uando async await

                // 3. Creamos el usuario que escribiremos en DB (Mongo)
                const nuevoUsuario = new Usuario({ email, password: passwordEncriptada });
                const usuarioGuardado = await nuevoUsuario.save();

                // 4. Indicar que ya se ha hecho
                usuarioGuardado.password = undefined; // No vamos a mandar la contraseña encriptada fuera del servidor
                done(null, usuarioGuardado); //mandamos null en vez de undefined xq el error puede existir 
                //pero no esta definido
                //Si le metemos argumentos a un done el primer argumento siempre es el del error, 
                //el segundo es la información de que ha ido bien
            } catch(error) {
                done(error);
            }
        }
    )
);


//PARA LOGIN:
passport.use(
    'login',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        },
        async (req, email, password, done) => {
            try {
                // 1. Buscar si existe el usuario registrado
                const usuario = await Usuario.findOne({ email });

                // 2. Si el usuario no existe, lanzamos un error
                if (!usuario) {
                    const error = new Error('Usuario no registrado');
                    return done(error);
                }

                // 3. Si el usuario SI existe, comprobamos que la contraseña sea correcta
                const esValidaContrasena = await bcrypt.compare(password, usuario.password);
                if (!esValidaContrasena) {
                    const error = new Error('Contraseña incorrecta');
                    return done(error);
                }

                // 4. Si es correcta la contraseña, proceder a iniciar sesión
                usuario.password = undefined;
                return done(null, usuario);
            } catch(error) {
                done(error);
            }
        }
    )
);
//Serializamos el usuario para que pueda viajar en las peticiones como si fuera una cookie
passport.serializeUser((user, done) => {
    return done(null, user._id);
});

passport.deserializeUser((usuarioId, done) => {
    Usuario.findById(usuarioId)
        .then((usuarioExistente) => {
            done(null, usuarioExistente);
        })
        .catch((error) => {
            done(error)
        });
});
