const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    function(username, password, done) {
        // Aquí deberías verificar las credenciales del usuario en una base de datos u otro sistema de almacenamiento
        if (username === 'usuario' && password === 'password') {
            return done(null, { username: username });
        } else {
            return done(null, false);
        }
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.username);
});

passport.deserializeUser(function(id, done) {
    done(null, { username: id });
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/perfil',
    failureRedirect: '/login'
}));

app.get('/login', function(req, res) {
    res.send(`
    <form method="post" action="/login">
      <input type="text" name="username">
      <input type="password" name="password">
      <button type="submit">Iniciar sesión</button>
    </form>
  `);
});

app.get('/perfil', function(req, res) {
    if (req.isAuthenticated()) {
        res.send(`Bienvenido ${req.user.username}`);
    } else {
        res.redirect('/login');
    }
});

// Iniciar el servidor
app.listen(3000, function() {
    console.log('Servidor iniciado en el puerto 3000');
});
