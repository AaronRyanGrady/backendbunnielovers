'use strict'

var mongoose = require('mongoose');
var app = require('./app');

var port= 3800;

//conexión a db
mongoose.Promise = global.Promise;
mongoose.set("strictQuery", false);
mongoose.connect('mongodb+srv://aryan:5kZEdO1D1ALFpqXD@cluster0.mkwrvnc.mongodb.net/apiconejos')

    .then(()=>{
        console.log('-+la conexion a la base de datos bunny_lovers se ha realizado correctamente');
        //crear servidor

        app.listen(port, ()=>{

            console.log('servidor corriendo en http://localhost:3800');




        });

    })

    .catch(err=>console.log(err));