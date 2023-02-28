const express = require('express')
const cors = require('cors')
const app = express();

app.use(cors());
app.use(express.json());
port = 3080;



 var admin = require("firebase-admin");

 var serviceAccount = require("./usuaris-7c36f-firebase-adminsdk-8kw70-5abce7ec5f.json");
 const {getFirestore} = require("firebase-admin/firestore");

 admin.initializeApp({
     credential: admin.credential.cert(serviceAccount)
 });

 const db = getFirestore();


 // Crear usuari i comprovar si existeix
app.put('/registre', cors(),async (req,res) =>{
    const usuari ={'nom': req.body.nom,
        'cognom': req.body.cognom,
        'telefon': req.body.telefon,
        'email': req.body.email,
        'passw': req.body.passw };

    const cityRef = db.collection('ProjecteLEA').doc(req.body.email);
    const doc =  await cityRef.get();

     if (doc.exists) {
          console.log('Usuari ja existeix');
     }
     else {
         await db.collection('ProjecteLEA').doc(req.body.email).set(usuari);
         console.log(usuari)
     }

});



// Comprovar si existeix l'email
app.get('/email',cors(), async (req,res)=>{
    let correu = {email: req.query.email}
    console.log(correu)
    let resultat = false;
    const docs = db.collection('ProjecteLEA')
    const snapshot = await docs.where('email', '==', correu.email).get()
    snapshot.forEach(doc =>{
        resultat = true
    })
    res.json(resultat)
});

// Comprovar la contrasenya
app.get('/pass', cors(),async (req,res)=>{
    let correu = {passw: req.query.passw}
    let resultat = false;
    const docs = db.collection('ProjecteLEA')
    const snapshot = await docs.where('passw', '==', correu.passw).get()
    snapshot.forEach(doc =>{
        resultat = true
    })
    res.json(resultat)
});


//Servidor escolta pel port
app.listen(port,() => {
    console.log('Server listening on the port: '+ port);
});












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



