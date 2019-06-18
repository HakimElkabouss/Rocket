var express = require('express');
var bodyParser = require('body-parser');
var apiRouter = require('./apiRouter').router;

var app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function(req, res){
  res.setHeader('Content-Type','text/html')
  res.render('index.ejs');
})
app.get('/users/register', function(req, res){
  res.setHeader('Content-Type','text/html')
  res.render('register.ejs');
})
app.get('/users/login', function(req, res){
  res.setHeader('Content-Type','text/html')
  res.render('login.ejs');
})



app.use('/', apiRouter);


app.listen(3000, function(){
  console.log('le serveur est on écoute sur le port 3000');
})