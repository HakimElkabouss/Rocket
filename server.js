var express = require('express');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var configGmail = require('./configGmail');
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
app.get('/welcome', function(req,res){
  res.render('welcome.ejs');
})


app.post('/newsletter', function(req, res, next) {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: configGmail.gmail.Gmail,
      pass: configGmail.gmail.GmailKey
    }
  });
  
  var mailOptions = {
    from: "Rocket",
    to: req.body.text ,
    subject: 'Welcome to Rocket',
    text: "It is a great pleasure to us to choose our application and put your trust in us, now your mail is registered in our newsletter box, be ready you will receive all our update, see you soon ;)"
};
  
transporter.sendMail(mailOptions, function(error, info){
if(error){
 return console.log(error);
}
console.log('Message sent: ' + info.response);
});

  transporter.close();
});




app.use('/', apiRouter);


app.listen(3000, function(){
  console.log('le serveur est on écoute sur le port 3000');
})