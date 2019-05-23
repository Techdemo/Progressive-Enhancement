const functions = require('firebase-functions');
const express = require('express')
const hbs = require('express-handlebars');
const app = express();

app.set('view engine', 'hbs')
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultView: 'default',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
}))
app.use(express.urlencoded())
app.use(express.static('public'))



app.get('/', function (req, res, next) {
    res.render('home', {
        layout: 'default',
        template: 'home-template'
    });
});

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.app = functions.https.onRequest(app)
