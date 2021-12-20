const express = require('express');
const passport = require('passport');

const { isAuthenticated } = require('../middlewares/auth.middleware');
const { logger } = require('../middlewares/logger.middleware');

const router = express.Router();

// POST para registro
router.post('/register', (req, res, next) => {
    passport.authenticate('register', (error, usuario) => {
        if (error) {
            return next(error);
        }
        req.logIn(usuario, (error) => {
            if (error) {
                return next(error);
            }
            return res.status(201).json(usuario);
        });
    })(req); //este req es una clausura, se le aplica todo el bloque de código anterior
});

// POST para login
router.post('/login', [logger], (req, res, next) => {
    passport.authenticate('login', (error, usuario) => {
        if (error) {
            return next(error);
        }
        req.logIn(usuario, (error) => {
            if (error) {
                return next(error);
            }
            return res.status(200).json(usuario);
        });
    })(req);
});

// POST para logout
router.post('/logout' /*, [isAuthenticated]  */  ,(req, res, next) => {
    if (req.user) {
        // Cerramos sesion de la petición
        req.logout();

        // Destruimos la sesión de la petición
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            return res.status(200).json('Cerrada la sesión del usuario');
        });
    } else {
        res.sendStatus(304);
    }
});

module.exports = router;
