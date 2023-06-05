'use strict'
var express = require('express');

var bodyParser = require('body-parser');

var app = express();
//cargar rutas

var user_routes= require('./routes/user');
var message_routes= require('./routes/message');
var publication_routes= require('./routes/publication');
var follow_routes= require('./routes/follow');




  




//middlewares

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

//cors

/*app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 
    next();
});*/

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization,Access-Control-Allow-Headers');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      // Only allow certain headers
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      // Set the response status code
      res.status(200).json({});
    } else {
      // Move on to the next middleware
      next();
    }
  });


//rutas
app.use('/api',user_routes);
app.use('/api',message_routes);
app.use('/api',publication_routes);
app.use('/api',follow_routes);

//exportar



module.exports = app;
