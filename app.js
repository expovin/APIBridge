var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');
var mongodb = require('./lib/mongodb')
var helper = require('./lib/helper')

var app = express();
const db = new mongodb();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.all(/.*/, function (req, res, next) {
  var treq = req.url.split("/");
  db.getRoute(treq[1])

  .then( result =>{
    if(result.length === 0){
      res.json({success:false, error:"No route found!"})
    } else {

      console.log("Found a Routes, looking for the correct path/method");
      console.log("path completo : "+req.url);
      var int1= req.url.indexOf("/",1);
      if(int1 === -1 )
          path="/"
      else {
        var lastCh=req.url.length-int1;
        var path = req.url.substr(-1*lastCh)
      }

      console.log("Path da cercare : "+path+" int1 : "+int1);
      console.log("Metodo da cercare : "+ req.method);

      var allowd = helper.isAllowedRoute(result[0], path, req.method)
      console.log(allowd)
      res.json(allowd);
    }


    
  })

  /*
  if(treq[1] === "devices"){
    console.log("Ridirezione internamente su "+'http://192.168.0.18:31080'+req.url)
    console.log(db.getName())

    var body = JSON.stringify(req.body)
    var options = {
      host : '192.168.0.18',
      port : '31080',
      path : req.url,
      method : req.method,
      headers: req.headers
    };
    console.log(options);

    var dataBack="";
    var innerReq = http.request(options, (innerRes) =>{      

      innerRes.on('data', function (chunk) {
        dataBack += chunk
      });      

      innerRes.on('end', ()=>{
        res.status(innerRes.statusCode).json(JSON.parse(dataBack))
      })

    })

    innerReq.on('error', function(e) {
      res.status(500).json(e)
    });

    innerReq.write(body);
    innerReq.end();    


    //res.redirect('http://192.168.0.18:31080'+req.url)
  } else {
    var result = db.getRoute(treq[1])
    .then( result =>{
      res.json(result);
    })
    
    
  }
    */
})



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});





// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
