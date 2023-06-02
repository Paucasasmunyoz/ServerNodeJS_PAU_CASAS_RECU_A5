const express = require('express');
const cors = require('cors');
const app = express();
const fs1 = require('node:fs')
const mysql = require('mysql2');
const { getFirestore } = require('firebase-admin/firestore');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

app.use(cors());
app.use(express.json());
const port = 3080;

let connexio_BD;
let conexioMySQL;


fs1.readFile('connexioBD', 'utf8', function (err, data) {
    if (err) throw err;
    connexio_BD = data;
    console.log(connexio_BD)
    console.log('Connexió feta')
});



//Connexió MYSQL
const configObj = JSON.parse(fs1.readFileSync('ConnexioBD_MySQL', 'utf8'));

const connexioMySQL = mysql.createConnection({
    database : configObj.database,
    user : configObj.username,
    password : configObj.password,
    host : configObj.host,
});


connexioMySQL.connect((err) => {
    if (err) throw err;
    console.log('Connexió MySQL realitzada');
});


setTimeout(function () {
    connexio();
}, 2000);

function connexio() {
    var serviceAccount = require(connexio_BD);

    if (admin.apps.length === 0) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    }
}

app.put('/registre', cors(), async (req, res) => {
    const db = getFirestore();
    const usuari = {
        nom: req.body.nom,
        cognom: req.body.cognom,
        telefon: req.body.telefon,
        email: req.body.email,
        passw: req.body.passw,
    };

    const cityRef = db.collection('ProjecteLEA').doc(req.body.email);
    const doc = await cityRef.get();

    if (doc.exists) {
        console.log('Usuari ja existeix');
    } else {
        await db.collection('ProjecteLEA').doc(req.body.email).set(usuari);
        console.log(usuari);
    }
});

app.get('/email', cors(), async (req, res) => {
    const db = getFirestore();
    let correu = { email: req.query.email };
    console.log(correu);
    let resultat = false;
    const docs = db.collection('ProjecteLEA');
    const snapshot = await docs.where('email', '==', correu.email).get();
    snapshot.forEach((doc) => {
        resultat = true;
    });
    res.json(resultat);
});

app.get('/pass', cors(), async (req, res) => {
    const db = getFirestore();
    let correu = { passw: req.query.passw };
    let resultat = false;
    const docs = db.collection('ProjecteLEA');
    const snapshot = await docs.where('passw', '==', correu.passw).get();
    snapshot.forEach((doc) => {
        resultat = true;
    });
    res.json(resultat);
});

app.get('/usuarios', cors(), async (req, res) => {
    const db = getFirestore();
    const snapshot = await db.collection('ProjecteLEA').get();
    const usuarios = snapshot.docs.map((doc) => doc.data());
    res.json(usuarios);
});

async function sendEmail(name, email) {
    const data = JSON.stringify({
        Messages: [
            {
                From: { Email: 'pau.casas@institutvidreres.cat', Name: 'Pau' },
                To: [{ Email: email, Name: name }],
                Subject: 'Cambiar tu contraseña',
                TextPart:
                    'Hola buenas, \n' +
                    'Hemos recibido una solicitud de cambio de contraseña, en caso de ser tú quien ha solicitado esto, entra en el enlace que tienes a continuación. En caso contrario, alguien está intentando acceder a tu cuenta. \n' +
                    '\n' +
                    'http://localhost:4200/cambiar-contrasenya \n\n' +
                    '\n' +
                    'Atentamente: Pau Casas \n\n' +
                    '\n' +
                    'Tu Aplicación.',
            },
        ],
    });

    const config = {
        method: 'post',
        url: 'https://api.mailjet.com/v3.1/send',
        data: data,
        headers: { 'Content-Type': 'application/json' },
        auth: {
            username: '0909b31b6321a4f6a96c1ffaf6cff0bf',
            password: '6a777ad8f6123738fab170072ad26dff',
        },
    };

    return axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
}

app.post('/api/sendemail', function (req, res) {
    console.log('Correo Enviado');
    const { name, email } = req.body;
    sendEmail(name, email)
        .then(() => {
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log(error);
            res.sendStatus(500);
        });
});

app.post('/api/contrasenya', async (req, res) => {
    const { email, contra } = req.body;
    let documento = '';
    const db = getFirestore();
    const docs = db.collection('ProjecteLEA');
    const snapshot = await docs.where('email', '==', email).get();
    snapshot.forEach((doc) => {
        documento = doc.id;
    });
    const modify = await db
        .collection('ProjecteLEA')
        .doc(documento)
        .set({ passw: contra }, { merge: true });
    res.json(contra);
});

app.get('/api/nombre', async (req, res) => {
    const email = req.query.email;
    let documento = '';
    const db = getFirestore();
    const docs = db.collection('ProjecteLEA');
    const snapshot = await docs.where('email', '==', email).get();
    snapshot.forEach((doc) => {
        documento = doc.data();
    });
    res.json(documento);
});

app.get('/usuario/:email', cors(), async (req, res) => {
    const db = getFirestore();
    const email = req.params.email;
    const doc = await db.collection('ProjecteLEA').doc(email).get();
    if (doc.exists) {
        const usuario = doc.data();
        res.json(usuario);
    } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
    }
});

app.put('/usuarios/:email', cors(), async (req, res) => {
    const db = getFirestore();
    const email = req.params.email;
    const data = req.body;

    try {
        await db.collection('ProjecteLEA').doc(email).update(data);
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin123',
    database: 'botigaprjmarcpau'
});


app.post('/agregar-producto', (req, res) => {
    const producto = req.body;

    // Validar que el nombre no sea nulo o vacío
    if (!producto.nom || producto.nom.trim() === '') {
        return res.status(400).json({ message: 'El nombre del producto es obligatorio' });
    }

    const id = uuidv4();
    const sql = 'INSERT INTO productesafegits (nom, preu, imatge) VALUES (?, ?, ?)';
    const values = [producto.nom, producto.preu, producto.imatge];

    connection.query(sql, values, (error, result) => {
        if (error) {
            console.error('Error al agregar el producto:', error);
            return res.status(500).json({ message: 'Error al agregar el producto' });
        }

        res.status(201).json({ message: 'Producto agregado correctamente' });
    });
});







//Servidor escolta pel port
app.listen(port, () => {
    console.log('Server listening on the port: ' + port);
});


//logs del fitxer
app.post('/log/pro1',(req , res) =>{
    fs1.writeFileSync("logs",req.body.text,{flag:'a+'})
    console.log("Producte 1 afegit")
});

app.post('/log/pro2',(req , res) =>{
    fs1.writeFileSync("logs",req.body.text,{flag:'a+'})
    console.log("Producte 2 afegit")
});

app.post('/log/pro3',(req , res) =>{
    fs1.writeFileSync("logs",req.body.text,{flag:'a+'})
    console.log("Producte 3 afegit")
});

app.post('/log/pro4',(req , res) =>{
    fs1.writeFileSync("logs",req.body.text,{flag:'a+'})
    console.log("Producte 4 afegit")
});

app.post('/log/pro5',(req , res) =>{
    fs1.writeFileSync("logs",req.body.text,{flag:'a+'})
    console.log("Producte 5 afegit")
});

app.post('/log/pro6',(req , res) =>{
    fs1.writeFileSync("logs",req.body.text,{flag:'a+'})
    console.log("Producte 6 afegit")
});

app.post('/log/pro7',(req , res) =>{
    fs1.writeFileSync("logs",req.body.text,{flag:'a+'})
    console.log("Producte 7 afegit")
});

app.post('/log/pro8',(req , res) =>{
    fs1.writeFileSync("logs",req.body.text,{flag:'a+'})
    console.log("Producte 8 afegit")
});

app.post('/log/pro9',(req , res) =>{
    fs1.writeFileSync("logs",req.body.text,{flag:'a+'})
    console.log("Producte 9 afegit")
});

app.post('/log/pro10',(req , res) =>{
    fs1.writeFileSync("logs",req.body.text,{flag:'a+'})
    console.log("Producte 10 afegit")
});

app.post('/log/pagar/cistella',(req , res) =>{
    fs1.writeFileSync("logs",req.body.text,{flag:'a+'})
    console.log("Pagar cistella")
});

app.post('/log/registre',(req , res) =>{
    fs1.writeFileSync("logs",req.body.text,{flag:'a+'})
    console.log("Pagar cistella")
});

app.post('/log/inici/sessioCorrecte',(req , res) =>{
    fs1.writeFileSync("logs",req.body.text,{flag:'a+'})
    console.log("inici de sessio correcte")
});

app.post('/log/contacte',(req , res) =>{
    fs1.writeFileSync("logs",req.body.text,{flag:'a+'})
    console.log("consulta contacte")
});




//imatges
app.get('/imatges/creatinas',async (req, res)=>{
    res.sendFile(__dirname + "\\imatges\\creatinas.png")
})

app.get('/imatges/proteinaaa',async (req, res)=>{
    res.sendFile(__dirname + "\\imatges\\proteinaaa.png")
})

app.get('/imatges/pantalo',async (req, res)=>{
    res.sendFile(__dirname + "\\imatges\\pantalon.png")
})

app.get('/imatges/barrita',async (req, res)=>{
    res.sendFile(__dirname + "\\imatges\\barrita.png")
})

app.get('/imatges/tuper',async (req, res)=>{
    res.sendFile(__dirname + "\\imatges\\tuper.png")
})

app.get('/imatges/strap',async (req, res)=>{
    res.sendFile(__dirname + "\\imatges\\strapss.png")
})

app.get('/imatges/motxilla',async (req, res)=>{
    res.sendFile(__dirname + "\\imatges\\mochila.png.png")
})

app.get('/imatges/genollera',async (req, res)=>{
    res.sendFile(__dirname + "\\imatges\\rodilleras.png")
})

app.get('/imatges/top',async (req, res)=>{
    res.sendFile(__dirname + "\\imatges\\top.png")
})

app.get('/imatges/leggins',async (req, res)=>{
    res.sendFile(__dirname + "\\imatges\\leggins.png")
})

app.get('/imatges/login',async (req, res)=>{
    res.sendFile(__dirname + "\\imatges\\login.png")
})

app.get('/imatges/logout',async (req, res)=>{
    res.sendFile(__dirname + "\\imatges\\logout.png")
})

app.get('/imatges/prin',async (req, res)=>{
    res.sendFile(__dirname + "\\imatges\\imagen2.png")
})

app.get('/imatges/lproteina',async (req, res)=>{
    res.sendFile(__dirname + "\\imatges\\proteina.png")
})

app.get('/imatges/lcreatina',async (req, res)=>{
    res.sendFile(__dirname + "\\imatges\\creatina.png")
})

app.get('/imatges/lropa',async (req, res)=>{
    res.sendFile(__dirname + "\\imatges\\ropa.png")
})

app.get('/imatges/lvitaminas',async (req, res)=>{
    res.sendFile(__dirname + "\\imatges\\vitaminas.png")
})

app.get('/imatges/pagos',async (req, res)=>{
    res.sendFile(__dirname + "\\imatges\\pagos.png")
})

app.get('/imatges/pagos2',async (req, res)=>{
    res.sendFile(__dirname + "\\imatges\\pagos2.png")
})

app.get('/imatges/pagos3',async (req, res)=>{
    res.sendFile(__dirname + "\\imatges\\pagos3.png")
})

app.get('/imatges/pagos4',async (req, res)=>{
    res.sendFile(__dirname + "\\imatges\\pagos4.png")
})

app.get('/imatges/logo',async (req, res)=>{
    res.sendFile(__dirname + "\\imatges\\imagen.png")
})

app.get('/imatges/roids',async (req, res)=>{
    res.sendFile(__dirname + "\\imatges\\roids.png")
})

//

//FORMULARI
const uuid = require('uuid');
const bodyParser = require('body-parser');
app.post('/contacte',(req, res) => {

    const nombreArchivo = `${uuid.v4()}.txt`;
    var {nombre, correo, mensaje}=req.body;
    var text="nombre: "+ nombre +"\n"+"correo: "+correo+"\n"+"mensaje: "+mensaje;
    const escriure=fs1.createWriteStream(nombreArchivo)
    escriure.write(text)
    res.send('Archivo creado exitosamente');
})

app.get('/imatges/:nom',(req,res)=>{
    const nomImatge = req.params.nom;
    const rutaImatge = `${__dirname}/imatges/${nomImatge}`;
    const stream = fs1.createReadStream(rutaImatge);
    stream.pipe(res);
});


app.get('/productes', (req, res)=>{
    connexioMySQL.query('SELECT * FROM botigaprjmarcpau.productes', (error, results)=>{
        if (error) throw error;
        res.send(results);
        console.log(results)
    })
})

app.post('/afegir_prod_histo', (req, res)=>{
    const query = req.body.query;
    const values = req.body.values;
    connexioMySQL.query(query,values,(err, result)=>{
        if (err){
            res.status(500).send(`Error: ${err}`)
        }else{
            res.send(`Fet`)
        }
    })
})


const request = require('request')
const muscle = 'biceps';

request.get({
    url: 'https://api.api-ninjas.com/v1/exercises?muscle=' + muscle,
    headers: {
        'X-Api-Key': 'p54TSoh1BhHzyLd8ctAxBw==4TTGqeAHbHBRh2xo'
    },
}, function(error, response, body) {
    if (error) {
        console.error('Request failed:', error);
        return;
    }

    if (response.statusCode !== 200) {
        console.error('Error:', response.statusCode, body.toString('utf8'));
        return;
    }

    try {
        const exercises = JSON.parse(body);

        // Obtener solo los nombres de los ejercicios
        const exerciseNames = exercises.map(exercise => exercise.name);

        console.log('Nombres de ejercicios:', exerciseNames);
    } catch (error) {
        console.error('Error al analizar la respuesta JSON:', error);
    }
});

const muscle2 = 'triceps' ;

request.get({
    url: 'https://api.api-ninjas.com/v1/exercises?muscle=' + muscle2,
    headers: {
        'X-Api-Key': 'p54TSoh1BhHzyLd8ctAxBw==4TTGqeAHbHBRh2xo'
    },
}, function(error, response, body) {
    if (error) {
        console.error('Request failed:', error);
        return;
    }

    if (response.statusCode !== 200) {
        console.error('Error:', response.statusCode, body.toString('utf8'));
        return;
    }

    try {
        const exercises = JSON.parse(body);

        // Obtener solo los nombres de los ejercicios
        const exerciseNames = exercises.map(exercise => exercise.name);

        console.log('Nombres de ejercicios:', exerciseNames);
    } catch (error) {
        console.error('Error al analizar la respuesta JSON:', error);
    }
});








