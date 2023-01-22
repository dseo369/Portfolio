/**************************
 * project: TL;DR
 * file: server.js
 * authors: James Carmona, Andrew Dang, Daniel Seo, Samuel White
 * final revision: 12/10/21
**************************/

const fs = require('fs');
var express = require('express');
var xpbrs = require('express-handlebars');
var path = require('path');
var handlebars = require('handlebars')
const { response } = require('express');
var postData = require('./userData.json');
var app = express();
var port = process.env.PORT || 3000;
//var userData = require('./userData.json');
app.engine('handlebars', xpbrs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function (req, res, next){
    res.status(200).render('index', {
        posts: postData
    });
});

/* eventually id like this to be a url the user can do to view all posts from a certain user.
app.get('/usersposts/:n, function (req, res, next){ not sure if this is correct to indicate string
    var n = req.params.n;
    if(user string is found in userData.json){
       res.status(200).render('index', {
           user: userData[n],
           posts: postData
    });
    } else {
        next();
    }
 }); */

app.get('/save*', function(req, res){
    var content = req.url.slice(5,15)
    console.log(content);
    console.log("savingdata")
    newpost ={
        name: "unknown",
        date: "unknown",
        postContent:content

    }
    fs.appendFile('userData.json', content, err => {
        if (err) {
          console.error(err)
          return
        }
        //done!
      })
    res.redirect('/');
});

app.use(express.static('public'));

app.get('*', function(req, res){
    console.log("ERROR 404")
    res.status(404).render('404');
});

app.listen(port, function(){
    console.log("LOCALHOST:",port , " IS NOW ACTIVE")
});


// app.get('/', function(req, res){
//     console.log("INDEX HTML HAS BEEN REQUESTED")
//     res.status(200).sendFile(__dirname + '/public/index.html')
// });