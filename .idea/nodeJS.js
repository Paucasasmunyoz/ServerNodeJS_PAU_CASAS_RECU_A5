const express = require('express')
const cors = require('cors')
const app = express();
const fs1 = require('node:fs')
const stream = require('stream')


app.use(cors());
app.use(express.json());
port = 3080;

let connexio_BD;


fs1.readFile('connexioBD', 'utf8', function (err, data) {
    if (err) throw err;
    connexio_BD = data;
    console.log(connexio_BD)
    console.log('Connexió feta')
});



const {getFirestore} = require("firebase-admin/firestore");
var admin = require("firebase-admin");

setTimeout(function (){connexio()}, 2000);

function connexio(){
    var serviceAccount = require(connexio_BD);

    if (admin.apps.length === 0) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }
}



    app.put('/registre', cors(), async (req, res) => {
        const db = getFirestore();
        const usuari = {
            'nom': req.body.nom,
            'cognom': req.body.cognom,
            'telefon': req.body.telefon,
            'email': req.body.email,
            'passw': req.body.passw
        };

        const cityRef = db.collection('ProjecteLEA').doc(req.body.email);
        const doc = await cityRef.get();

        if (doc.exists) {
            console.log('Usuari ja existeix');
        } else {
            await db.collection('ProjecteLEA').doc(req.body.email).set(usuari);
            console.log(usuari)
        }
    });


// Comprovar si existeix l'email
    app.get('/email', cors(), async (req, res) => {
        const db = getFirestore();
        let correu = {email: req.query.email}
        console.log(correu)
        let resultat = false;
        const docs = db.collection('ProjecteLEA')
        const snapshot = await docs.where('email', '==', correu.email).get()
        snapshot.forEach(doc => {
            resultat = true
        })
        res.json(resultat)
    });

// Comprovar la contrasenya
    app.get('/pass', cors(), async (req, res) => {
        const db = getFirestore();
        let correu = {passw: req.query.passw}
        let resultat = false;
        const docs = db.collection('ProjecteLEA')
        const snapshot = await docs.where('passw', '==', correu.passw).get()
        snapshot.forEach(doc => {
            resultat = true
        })
        res.json(resultat)
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



//modifcar dades
// app.put('/registre', cors(),(req,res) => {
//     const usuari = {
//         'nom': req.body.nom,
//         'cognom': req.body.cognom,
//         'telefon': req.body.telefon,
//         'email': req.body.email,
//         'passw': req.body.passw
//     };
//     db.collection('ProjecteLEA').doc(req.body.email).set(usuari);
//     console.log(usuari)
// });



