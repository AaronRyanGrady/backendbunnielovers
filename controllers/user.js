'use strict'

var bcrypt = require('bcrypt');
const multer = require('multer');
const fs = require('fs');
var path= require('path');
const mongoose = require('mongoose');
var mongoosePaginate= require('mongoose-paginate-v2');
mongoose.plugin(mongoosePaginate);
var User = require('../models/user');
var Follow = require('../models/follow');
var Publication = require('../models/publication');
var jwt = require('../services/jwt');
const user = require('../models/user');

mongoosePaginate.paginate.options = {
  sort: '_id',
};

//metodos de prueba
function home(req,res){
    res.status(200).send({message:'hola mundo desde server js'});
};
function pruebas(req,res){
    res.status(200).send({message:'acción de pruebas'});
};




async function saveUser(req, res) {
    const { name, surname, nick, email, password } = req.body;
  
    if (!name || !surname || !nick || !email || !password) {
      return res.status(400).send({ message: 'Por favor, ingresa todos los datos requeridos.' });
    }
  
    // Verificar si ya existe un usuario con el mismo nick o email
    const existingUser = await User.findOne({ $or: [{ nick }, { email }] });
    if (existingUser) {
      return res.status(409).send({ message: 'Ya existe un usuario con este nick o email.' });
    }
  
    const user = new User({
      name,
      surname,
      nick,
      email,
      password,
      role: 'ROLE_USER',
      image: null
    });
  
    try {
      const hash = await bcrypt.hash(password, 10);
      user.password = hash;
      const userStored = await user.save();
      if (userStored) {
        return res.status(200).send({ user: userStored });
      }
      return res.status(404).send({ message: 'No se pudo registrar el usuario.' });
    } catch (err) {
      return res.status(500).send({ message: 'Hubo un error al guardar el usuario.' });
    }
  }

  function loginUser(req, res) {
    var params = req.body;
    var email = params.email;

    var password =params.password;

    /*User.findOne({email: email},(err,user)=>{
      if(err) return res.status(500).send({message:'error en la petición'});
      
      if (user){
        bcrypt.compare(password,user.password,(err,check)=>{
            if(check){
                //devolver datos de usuario
                return res.status(200).send({ user})
            }

            else {
                return res.status(404).send({message: 'el usuario no se ha podido identificar'});

            }


        });}
        else {
            return res.status(404).send({message: 'el usuario no se ha podido identificar'});
            
        }


    });*/
    User.findOne({ email: email })
  .then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, (err, check) => {
        if (check) {
          
          if(params.gettoken){

            return res.status(200).send({
                
                token: jwt.createToken(user)
            });
            //devolver token

            //generar token



          }
          else{
            //devolver datos de usuario
            user.password=undefined;
          return res.status(200).send({ user });
            
          }
          
        } else {
          return res
            .status(404)
            .send({ message: "el usuario no se ha podido identificar" });
        }
      });
    } else {
      return res
        .status(404)
        .send({ message: "el usuario no se ha podido identificar" });
    }
  })
  .catch((err) => {
    return res.status(500).send({ message: "error en la petición" });
  });

      }
//función buena antes de la modificacion con follows
      //function getUser(req, res) {
        //var userId=req.params.id;
      
        /*User.findById(userId,(err,user)=>{
          if(err) return res.status(500).send({message: 'error en la petición'});
      
          if(!user) return res.status(404).send({message: 'el usuario no existe'});
      
          return res.status(200).send({user})
        });
      }*//*User.findById(userId)
        .then((user) => {
          if (!user) {
            return res.status(404).send({ message: "el usuario no existe" });
          }
          return res.status(200).send({ user });
        })
        .catch((err) => {
          return res.status(500).send({ message: "error en la petición" });
        });
      }*/


      //función modificada con los follows
      //function getUser(req, res) {
        //var userId=req.params.id;
      
        /*User.findById(userId,(err,user)=>{
          if(err) return res.status(500).send({message: 'error en la petición'});
      
          if(!user) return res.status(404).send({message: 'el usuario no existe'});
      
          return res.status(200).send({user})
        });
      }*//*User.findById(userId)
        .then((user) => {
          if (!user) {
            return res.status(404).send({ message: "el usuario no existe" });
          }
          Follow.findOne({'user':req.user.sub, 'followed':userId}).exec((err,follow) => {
            if(err) return res.status(500).send({message: 'error al comprobar el follow'});
            return res.status(200).send({ user ,follow});
          })
          
        })
        .catch((err) => {
          return res.status(500).send({ message: "error en la petición" });
        });
      }*/
      //funcion implementada con mostrando que usuarios me están siguiendo
     /* function getUser(req, res) {
        var userId = req.params.id;
      
        User.findById(userId)
          .then((user) => {
            if (!user) {
              return res.status(404).send({ message: "El usuario no existe" });
            }
      
            Follow.findOne({ 'user': req.user.sub, 'followed': userId })
              .then((follow) => {
                return res.status(200).send({ user, follow });
              })
              .catch((err) => {
                return res.status(500).send({ message: "Error al comprobar el follow" });
              });
          })
          .catch((err) => {
            return res.status(500).send({ message: "Error en la petición" });
          });
      }*/
     
      //funcion no funcional del udemy
     /*function getUser(req, res) {
      var userId = req.params.id;
    
      User.findById(userId,(err, user) => {
        if(err) return res.status(500).send({message: 'error en la petición'});
      
        if(!user) return res.status(404).send({message: 'el usuario no existe'});
        followThisUser(req.user.sub,userId).then((value)=>{
          return res.status(200).send({user,value});
        })

      })
    }*/
    function getUser(req, res) {
      var userId = req.params.id;
    
      User.findById(userId)
        .then(user => {
          if (!user) {
            return res.status(404).send({ message: 'el usuario no existe' });
          }
          followThisUser(req.user.sub, userId)
            .then(value => {
              return res.status(200).send({ 
                user,
                following: value.following,
                followed: value.followed
               });
            })
            .catch(err => {
              return res.status(500).send({ message: 'error en la petición' });
            });
        })
        .catch(err => {
          return res.status(500).send({ message: 'error en la petición' });
        });
    }

    //función de udemy mal implementada

    /*async function followThisUser(identity_user_id,user_id) {

      var following =await Follow.findOne({ 'user': identity_user_id, 'followed': user_id }).exec((err,follow)=>{
        if (err)return handleError(err);
       
        return follow;
        
      });

      var followed =await Follow.findOne({ 'user': user_id, 'followed': identity_user_id }).exec((err,follow)=>{
        if (err)return handleError(err);
       
        return follow;
        
      });

      return {
        following: following,
        followed:followed
      }
     
       
    


    }*/

    async function followThisUser(identity_user_id, user_id) {
      var following = await Follow.findOne({ 'user': identity_user_id, 'followed': user_id }).exec();
      var followed = await Follow.findOne({ 'user': user_id, 'followed': identity_user_id }).exec();
    
      return {
        following: following,
        followed: followed
      };
    }

    async function followUserIds(user_id) {
      try {
        const following = await Follow.find({ 'user': user_id }).select({ '_id': 0, '__v': 0, 'user': 0 }).exec();
        const follows_clean = following.map((follow) => follow.followed);
    
        const followed = await Follow.find({ 'followed': user_id }).select({ '_id': 0, '__v': 0, 'followed': 0 }).exec();
        const follows_clean2 = followed.map((follow) => follow.user);
    
        return {
          following: follows_clean,
          followed: follows_clean2
        };
      } catch (err) {
        throw new Error('Error en la obtención de los usuarios seguidos');
      }
    }
    //funcion udemy sin modificar follow -funcion funcional organizada por chatgpt
    /*async function getUsers(req, res) {
      try {
        const identity_user_id = req.user.sub;
        const page = req.params.page || 1;
        const itemsPerPage = 5;
    
        const result = await User.paginate({}, { page, limit: itemsPerPage });
        if (!result.docs.length) {
          return res.status(404).send({ message: 'No hay usuarios disponibles' });
        }
    
        return res.status(200).send({
          users: result.docs,
          total: result.totalDocs,
          pages: result.totalPages,
        });
      } catch (err) {
        return res.status(500).send({ message: 'Error en la petición' });
      }
    }*/
    //función get users actualizada con follows pero con el codigo de udemy
      /*function getUsers(req,res){
        var identity_user_id = req.user.sub;
        var page= 1;
        if(req.params.page){
            page = req.params.page;

        }
        var itemsPerPage=5;

        User.find().sort('_id').paginate(page,itemsPerPage,(err,users,total)=>{
            if(err) return res.status(500).send({message:'error en la petición'});
            if(!users) return res.status(404).send({message: 'no hay usuarios disponibles'});
            followUserIds(identity_user_id).then((value)=>{


              return res.status(200).send({ 
                users,
                users_following:value.following,
                users_follow_me:value.followed,

                total,
                pages: Math.ceil(total/itemsPerPage)
    

            })
            

        });
        
        });

      }*/

      //funcion getusers modificada con chatgpt y actualizada con follows

      /*function getUsers(req, res) {
        var identity_user_id = req.user.sub;
        var page = 1;
      
        if (req.params.page) {
          page = req.params.page;
        }
      
        var itemsPerPage = 5;
      
        User.paginate({}, { page: page, limit: itemsPerPage, sort: '_id' })
          .then((result) => {
            var users = result.docs;
            var total = result.totalPages;
      
            followUserIds(identity_user_id)
              .then((value) => {
                return res.status(200).send({
                  users,
                  users_following: value.following,
                  users_follow_me: value.followed,
                  total,
                  pages: result.totalPages
                });
              })
              .catch((err) => {
                return res.status(500).send({ message: 'Error en la petición' });
              });
          })
          .catch((err) => {
            return res.status(500).send({ message: 'Error en la petición' });
          });
      }*/
        //no funcionan todavía
      /*function updateUser(req,res){
        var userId = req.params.id;
        var update= req.body;

        //borrar propiedad password

        delete update.password;

        if(userId != req.user.sub){
            return res.status(500).send({message:"no tienes permiso para actualizar"}); 

        }
        User.findByIdAndUpdate(userId,update,{new:true}, (err,userUpdate)=>{

            if(err) return res.status(500).send({message:'error en la petición'});
            if(!userUpdated) return res.status(404).send({message: 'no se ha podido actualizar el usuario'});

            return res.status(200).send({user: userUpdated});

        });

      }*/

      async function getUsers(req, res) {
        try {
          const identity_user_id = req.user.sub;
          const page = req.params.page || 1;
          const itemsPerPage = 5;
      
          const result = await User.paginate({}, { page, limit: itemsPerPage, sort: '_id' });
          const users = result.docs;
          const total = result.totalPages;
      
          const value = await followUserIds(identity_user_id);
          
          return res.status(200).send({
            users,
            users_following: value.following,
            users_follow_me: value.followed,
            total,
            pages: result.totalPages
          });
        } catch (err) {
          return res.status(500).send({ message: 'Error en la petición' });
        }
      }
 //getcounters y getcountfollow funciones desactualizadas de victor robles
       /* function getCounters(req, res) {

          var userId= req.user.sub;

          if(req.params.id){
            userId = req.params.id;
            
          }
          getCountFollow(req.params.id).then((value)=>{
            return res.status(200).send(value);
          });


        }
        async function getCountFollow(user_id){
          var following = await Follow.count({'user':user_id}).exec((err,count) => {
            if (err) return handleError(err);
            return count;
          });

          var followed = await Follow.count({'followed':user_id}).exec((err,count) => {
            if (err) return handleError(err);
            return count;
          });

          return{
            following: following,
            followed: followed
          }

        }*/

        async function getCounters(req, res) {
          try {
            var userId = req.user.sub;
        
            if (req.params.id) {
              userId = req.params.id;
            }
        
            const value = await getCountFollow(userId);
            return res.status(200).send(value);
          } catch (err) {
            return res.status(500).send({ message: 'Error en la petición' });
          }
        }
        
        async function getCountFollow(user_id) {
          try {
            const following = await Follow.countDocuments({ 'user': user_id }).exec();
            const followed = await Follow.countDocuments({ 'followed': user_id }).exec();
            const publications = await Publication.countDocuments({'user': user_id}).exec();
            return {
              following,
              followed,
              publications
            };
          } catch (err) {
            throw new Error('Error en la obtención de los contadores');
          }
        }
      
//funcion uploadImage gt
    /*  function uploadImage(req,res){

        var userId = req.params.id;

        if(userId != req.user.sub){
            return res.status(500).send({message:"no tienes permiso para actualizar"}); 

        }
        if(req.files){
            var file_path=req.files.image.path;
            console.log(file_path);
            var file_split = file_path.split('\\')

        }

      }*/

      //funcion uploadImage vr con la otra función

      
      async function uploadImage(req, res) {
        var userId = req.params.id;
      
        if (req.files) {
          var file_path = req.files.image.path;
          console.log(file_path);
      
          var file_split = file_path.split('\\');
          console.log(file_split);
      
          var file_name = file_split[2];
          console.log(file_name);
      
          var ext_split = file_name.split('\.');
          console.log(ext_split);
      
          var file_ext = ext_split[1];
          console.log(file_ext);
      
          if (userId != req.user.sub) {
             return removeFilesOfUploads(res, file_path, 'No tienes permiso para actualizar datos');
          }
      
          if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            try {
              const userUpdated = await User.findByIdAndUpdate(userId, { image: file_name }, { new: true });
      
              if (!userUpdated) {
                return res.status(404).send({ message: 'No se ha podido actualizar el avatar' });
              }
      
              return res.status(200).send({ user: userUpdated });
            } catch (err) {
              console.log(err);
              return res.status(500).send({ message: 'Error en la petición' });
            }
          } else {
             return removeFilesOfUploads(res, file_path, 'Extensión no válida');
          }
        } else {
          return res.status(200).send({ message: 'No se ha subido imagen' });
        }
      }
      
      function removeFilesOfUploads(res, file_path, message) {
        fs.unlink(file_path, (err) => {
          if (err) return res.status(200).send({ message: message });
        });
      }

      function getImageFile(req,res){
        var image_file = req.params.imageFile;
        var path_file = './uploads/users/'+image_file;
 
        fs.exists(path_file,(exists)=>{
         if (exists){
           res.sendFile(path.resolve(path_file));
 
         }
         else{
           res.status(200).send({message: 'no existe la imagen'});
         }
        });
   }
 
    
//funccion de getimageFiLE vr
/*

function getImageFile(req,res){
       var image_file = req.params.imageFile;
       var path_file = './uploads/users/'+image_file;

       fs.exists(path_file,(exists)=>{
        if (exists){
          res.sendFile(path.resolve(path_file));

        }
        else{
          res.status(200).send({message: 'no existe la imagen'});
        }
       });
  }
*/ 
      /*function getUserImage(req, res) {
        const userId = req.params.id;
      
        User.findById(userId)
          .then((user) => {
            if (!user) {
              return res.status(404).send({ message: "el usuario no existe" });
            }
      
            // Si la imagen se envía como un archivo adjunto en la petición, se guarda en la carpeta 'uploads' y se añade su ruta al objeto 'user'
            if (req.file) {
              user.imagePath = req.file.path;
            }
      
            return res.status(200).send({ user });
          })
          .catch((err) => {
            return res.status(500).send({ message: "error en la petición" });
          });
      }*/
      /*function getUsers(req, res) {
        User.find({})
          .then((users) => {
            if (!users || users.length === 0) {
              return res.status(404).send({ message: "no se encontraron usuarios" });
            }
            return res.status(200).send({ users });
          })
          .catch((err) => {
            return res.status(500).send({ message: "error en la petición" });
          });
      }*/

      //funcion getusers echa por chat gpt totalmente funcional
     /* function getUsers(req, res) {
        User.find({})
          .then((users) => {
            if (!users || users.length === 0) {
              return res.status(404).send({ message: "no se encontraron usuarios" });
            }
            return res.status(200).send({ users });
          })
          .catch((err) => {
            return res.status(500).send({ message: "error en la petición" });
          });
      }*/



      function updateUser(req, res) {
        const userId = req.params.id;
        const { name, surname, nick, email, role } = req.body;
      
        // Crea un objeto con los datos a actualizar
        const update = {};
        if (name) update.name = name;
        if (surname) update.surname = surname;
        if (nick) update.nick = nick;
        if (email) update.email = email;
        if (role) update.role = role;
      
        User.findByIdAndUpdate(userId, update, { new: true })
          .then((userUpdated) => {
            if (!userUpdated) {
              return res.status(404).send({ message: "no se ha podido actualizar el usuario" });
            }
      
            return res.status(200).send({ user: userUpdated });
          })
          .catch((err) => {
            return res.status(500).send({ message: "error en la petición" });
          });
      }
      
      function getUserImage(req, res) {
        const userId = req.params.id;
      
        User.findById(userId)
          .then((user) => {
            if (!user) {
              return res.status(404).send({ message: "el usuario no existe" });
            }
      
            // Si la imagen se envía como un archivo adjunto en la petición, se guarda en la carpeta 'uploads' y se actualiza la propiedad 'image' del objeto 'user'
            if (req.file) {
              const imagePath = req.file.path;
              const imageBuffer = fs.readFileSync(imagePath); // Lee el archivo como un buffer
              const imageType = req.file.mimetype.split('/')[1]; // Obtiene la extensión del archivo
              const imageName = `${userId}.${imageType}`; // Define el nombre del archivo
              const imagePathWithImageName = `uploads/${imageName}`; // Define la ruta completa del archivo con el nombre
      
              fs.writeFileSync(imagePathWithImageName, imageBuffer); // Guarda el archivo en la carpeta 'uploads'
              user.image = imagePathWithImageName; // Actualiza la propiedad 'image' del objeto 'user' con la ruta del archivo
            }
      
            return user.save(); // Guarda el objeto 'user' actualizado en la base de datos
          })
          .then((savedUser) => {
            return res.status(200).send({ user: savedUser });
          })
          .catch((err) => {
            return res.status(500).send({ message: "error en la petición" });
          });
      }

      function updateUserImage(req, res) {
        const userId = req.params.id;
      
        User.findById(userId)
          .then((user) => {
            if (!user) {
              return res.status(404).send({ message: "el usuario no existe" });
            }
      
            // Si la imagen se envía como un archivo adjunto en la petición, se guarda en la carpeta 'uploads' y se actualiza la propiedad 'image' del objeto 'user'
            if (req.file) {
              const imagePath = req.file.path;
              const imageBuffer = fs.readFileSync(imagePath); // Lee el archivo como un buffer
              const imageType = req.file.mimetype.split('/')[1]; // Obtiene la extensión del archivo
              const imageName = `${userId}.${imageType}`; // Define el nombre del archivo
              const imagePathWithImageName = `uploads/${imageName}`; // Define la ruta completa del archivo con el nombre
      
              fs.writeFileSync(imagePathWithImageName, imageBuffer); // Guarda el archivo en la carpeta 'uploads'
              user.image = imagePathWithImageName; // Actualiza la propiedad 'image' del objeto 'user' con la ruta del archivo
            }
      
            return user.save(); // Guarda el objeto 'user' actualizado en la base de datos
          })
          .then((savedUser) => {
            return res.status(200).send({ user: savedUser });
          })
          .catch((err) => {
            return res.status(500).send({ message: "error en la petición" });
          });
      }

      function getUserImageUrl(req, res) {
        const userId = req.params.id;
      
        User.findById(userId)
          .then((user) => {
            if (!user) {
              return res.status(404).send({ message: "el usuario no existe" });
            }
      
            // Si el usuario no tiene una imagen, se retorna un error
            if (!user.image) {
              return res.status(404).send({ message: "el usuario no tiene una imagen" });
            }
      
            // Se retorna la URL de la imagen
            return res.status(200).send({ imageUrl: `http://localhost:3800/api/${user.image}` });
          })
          .catch((err) => {
            return res.status(500).send({ message: "error en la petición" });
          });
      }
    
module.exports ={
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    getCounters,
    updateUser,
    uploadImage,
    getImageFile,
    getUserImage,
    updateUserImage,
    getUserImageUrl,
    followThisUser
}