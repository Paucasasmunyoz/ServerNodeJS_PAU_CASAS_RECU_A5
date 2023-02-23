const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mypassword',
    database: 'mydatabase'
});

connection.connect((error) => {
    if (error) {
        console.error('Error al conectarse a la base de datos: ', error);
    } else {
        console.log('Conexión exitosa a la base de datos!');
    }
});

const email = 'johndoe@example.com';
const password = 'mysecretpassword';

const query = connection.query('SELECT * FROM users WHERE email = ?', email, (error, results, fields) => {
    if (error) {
        console.error('Error al buscar el usuario: ', error);
    } else if (results.length === 0) {
        console.log('El usuario no existe');
    } else {
        const user = results[0];
        if (user.password !== password) {
            console.log('La contraseña es incorrecta');
        } else {
            console.log('El usuario está identificado');
        }
    }
});

connection.end();
