var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var nodemailer = require('nodemailer');
var configGmail = require('./configGmail');
var Routers = require('./Routers').router;

//On définit express dans notre constante "app"
var app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/', Routers);

var connection = mysql.createConnection({

  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'database_development_sequelize'

});

connection.connect();

app.set('view engine', 'ejs');


// show users
app.get('/admin', function(req, res, next){
  connection.query('SELECT * FROM users', function(err, rs){
    res.render('admin', { user : rs });
  })
})

// Delete a user
app.get('/delete', function(req, res){
  connection.query('DELETE FROM users WHERE id = ?', req.query.id, function(err, rs){
    res.redirect('/admin');
  })
})


// delete a user 
// app.delete('/admin/:id',function(req,res){
//   connection.query('DELETE FROM users WHERE id = ?', [req.params.id], function(error, data){
//     res.send('Deleted Successfully');
//   })
// })


// add a publication
app.post('/welcome', function(req, res){
   
  connection.query("INSERT INTO messages SET ?", req.body, function(err, data){
      if(err) throw err;

      console.log("1 publication inserted");
  });

});

// Newsletter
app.post('/newsletter', function(req, res, next) {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: configGmail.gmail.Gmail,
      pass: configGmail.gmail.GmailKey
    }
  });
  var mailbody = `
        <h3> Hi Guest !</h3>
        <p>It is a great pleasure to us to choose our application and put your trust in us</p>
        <p>now your mail is registered in our newsletter box</p>
        <p>be ready you will receive all our update, see you soon ;)</p>
        `
  var mailOptions = {
    from: "<noreply>",
    to: req.body.text ,
    subject: 'Welcome to Rocket',
    html: mailbody
};
  
transporter.sendMail(mailOptions, function(error, info){
if(error){
 return console.log(error);
}
console.log('Message sent: ' + info.response);
});
  res.redirect('/welcome');
  transporter.close();
});



app.listen(3000, function(){
  console.log('le serveur est on écoute sur le port 3000');
})