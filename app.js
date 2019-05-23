const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const hbs = require('express-handlebars');
// const sse = require('./sse');

const admin = require('firebase-admin')
const serviceAccount = require('./ServiceAccountKey.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore();
const increment = admin.firestore.FieldValue.increment(1);
const Ref = db.collection('votes').doc('food')

app.set('view engine', 'hbs')
app.engine( 'hbs', hbs( {
    extname: 'hbs',
    defaultView: 'default',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
}))
app.use(express.urlencoded())
app.use(express.static('public'))

// app.use(sse)

app.get('/', function(req, res, next) {
res.render('home', {
    layout: 'default',
    template: 'home-template'
  });
});

// app.get('/stream', function (req, res) {
//   res.sseSetup()
//   res.sseSend()
// })

app.get('/results', function(req, res, next) {

  let getDoc = Ref.get()
    .then(doc => {
      if (!doc.exists) {
        console.log("no such document")
      } else {
        let data = doc.data()
        return data
      }
    })
    .then(data => {
      res.render('results', {
        layout: 'default',
        template: 'home-template',
        data: data
      })
    })

  });

app.post('/results', (req, res) => {
  if (req.body.food === undefined) {
    res.render('home', {
      layout: 'default',
      template: 'home-template',
      err: "*Je hebt geen stemveld aangewezen. Selecteer je voorkeur en druk op submit"
    })
    } else {
    let vote = req.body.food

    let getDoc = Ref.get()
      .then(doc => {
        if (!doc.exists) {
          console.log("no such document")
        } else {
          Ref.update({ [vote]: increment })
        }
        return doc
      })
      .then(doc => {
        let data = doc.data()
        return data
      })
      .then(data => {
        res.render('results', {
          layout: 'default',
          template: 'home-template',
          vote: vote,
          data: data
        })
      })
      .catch(err => {
        console.log('error getting document', err)
      })
  }
})


let observer = db.collection('votes').doc('food').onSnapshot(res => {
  // console.log(res)
  let data = {
    shoarma: res._fieldsProto.shoarma,
    boerenkool: res._fieldsProto.boerenkool,
    spaghetti: res._fieldsProto.spaghetti,
    friet: res._fieldsProto.friet
  }
  console.log(data.shoarma)
  app.emit('message', {
    title: 'New message!',
    data
  });

  console.log(`Received doc snapshot: ${res}`);
}, err => {
  console.log(`Encountered error: ${err}`);
});

app.get('/eventstream', (req, res, next) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  app.on('message', data => {
    res.write(`event: message\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  });
});

app.listen(process.env.PORT || 3000, _ => {
  console.log("listening on port 3000")
})