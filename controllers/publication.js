'use strict'
var path = require('path');
var fs= require('fs');
var path= require('path');
var moment= require('moment');

var mongoosePaginate= require('mongoose-paginate-v2');

const mongoose = require('mongoose');
mongoose.plugin(mongoosePaginate);

var Publication=require('../models/publication');
 var Follow=require('../models/follow');
const User = require('../models/user');


function probando(req,res){
    res.status(200).send({message:'Hola publicaciones'});

}
//funcion savepublication chatgpt usando el sub
async function savePublication(req, res) {
  try {
    var params = req.body;

    if (!params.text) {
      return res.status(200).send({ message: 'Debes enviar un texto' });
    }

    var publication = new Publication();
    publication.text = params.text;
    publication.file = 'null';
    publication.user = req.user.sub;
    publication.created_at = moment().unix();

    const publicationStored = await publication.save();
    if (!publicationStored) {
      return res.status(404).send({ message: 'La publicación no ha sido guardada' });
    }

    return res.status(200).send({ publication: publicationStored });
  } catch (err) {
    return res.status(500).send({ message: 'Error al guardar la publicación' });
  }
}

/*function savePublication(req,res){
    var params = req.body;
    

    if(!params.text) return res.status(200).send({message: 'Debes enviar un texto !!'});
    var publication = new Publication();
    publication.text = params.text;
    publication.file='null';
    publication.user= req.user.sub;
    publication.created_at= moment().unix();

    publication.save((err, publicationStored)=>{
      if(err) return res.status(err).send({message:'error saving publication' }); 
        
      if(!publicationStored) return res.status(404).send({message:'la publicación no ha sido guardada'});
        
      return res.status(200).send({publication: publicationStored});
    
    
   
    });
}*/

//funcion savepublication de chatgpt sin usar el sub

/*async function savePublication(req, res) {
    try {
      const { id, text, created_at, file } = req.body;
  
      if (!text) {
        return res.status(400).send({ message: 'Debes enviar un texto' });
      }
  
      const publication = new Publication({
        user: id,
        text,
        created_at,
        file,
      });
  
      const publicationStored = await publication.save();
      return res.status(200).send({ publication: publicationStored });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: 'Error al guardar la publicación' });
    }
  }*/

  //funcion victor robles udemy

  /*function getpublication(req,res){
    var page=1;
      if(req.params.page){
        page=req.params.page;

      }
      var itemsPerPage =4;

      Follow.find({user: req.user.sub}).populate('followed').exec((err,follows)=>{
        if(err) return res.status(500).send({message:'error devolver el follow'});

        var follows_clean =[];

        follows.forEeach((follow)=>{
          follows_clean.push(follow.followed);
        });
        Publication.find({user: {'&in':follows_clean}}).sort('-create_at').populate('user').paginate(page,itemsPerPage,(err,publications,total)=>{
          if(err) return res.status(500).send({message:'error devolver publicaciones'});
          if(!publications)return res.status(404).send({message:'no hay publicaciones'});
          return res.status(200).send({
            total_items: total,
            pages: Math.ceil(total/itemsPerPage),
            page:page,

            publications
          })
        });
      });



  }*/

  async function getPublications(req, res) {
    try {
      var page = 1;
      if (req.params.page) {
        page = req.params.page;
      }
      var itemsPerPage = 4;
  
      const follows = await Follow.find({ user: req.user.sub }).populate('followed').exec();
      if (!follows) {
        return res.status(500).send({ message: 'Error al devolver los follows' });
      }
  
      var follows_clean = follows.map((follow) => follow.followed);
      console.log(follows_clean);

      follows_clean.push(req.user.sub);//esto es nuevo se puede borrar si es necesario
  
      const publications = await Publication.find({ user: { $in: follows_clean } })
        .sort('-create_at')
        .populate('user')
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage)
        .exec();
  
      if (!publications || publications.length === 0) {
        return res.status(404).send({ message: 'No hay publicaciones' });
      }
  
      const total = await Publication.countDocuments({ user: { $in: follows_clean } }).exec();
  
      return res.status(200).send({
        total_items: total,
        pages: Math.ceil(total / itemsPerPage),
        page: page,
        items_per_page:itemsPerPage,
        publications,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: 'Error en la petición' });
    }
  }

/*
  async function getPublicationsUser(req, res) {
    try {
      var page = 1;
      if (req.params.page) {
        page = req.params.page;
      }
      var user=req.user.sub;
      if(req.params.user) {

        var user=req.params.user_id;

      }
      var itemsPerPage = 4;
  
      /*const follows = await Follow.find({ user: req.user.sub }).populate('followed').exec();
      if (!follows) {
        return res.status(500).send({ message: 'Error al devolver los follows' });
      }
  
      var follows_clean = follows.map((follow) => follow.followed);
      console.log(follows_clean);

      follows_clean.push(req.user.sub);//esto es nuevo se puede borrar si es necesario*/
  /*
      const publications = await Publication.find({ user:user })
        .sort('-create_at')
        .populate('user')
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage)
        .exec();
  
      if (!publications || publications.length === 0) {
        return res.status(404).send({ message: 'No hay publicaciones' });
      }
  
      const total = await Publication.countDocuments({ user: { $in: follows_clean } }).exec();
  
      return res.status(200).send({
        total_items: total,
        pages: Math.ceil(total / itemsPerPage),
        page: page,
        items_per_page:itemsPerPage,
        publications,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: 'Error en la petición' });
    }
  }*/


  //funcion getpublication vr

/*
  function getPublication(req,res){
     var publicationId= req.params.id;

     Publication.findById(publicationId,(err,publication) => {
      if(err) return res.status(500).send({message:'error devolver publicaciones'});
        if(!publication)return res.status(404).send({message:'no existe publicacion'});

        return res.status(200).send ({publication});
     })
  }*/

  async function getPublicationsUser(req, res) {
    try {
      var page = 1;
      if (req.params.page) {
        page = req.params.page;
      }
      var user = req.user.sub;
      if (req.params.user) {
        user = req.params.user;
      }
      var itemsPerPage = 4;
  
      const publications = await Publication.find({ user: user })
        .sort('-created_at')
        .populate('user')
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage)
        .exec();
  
      if (!publications || publications.length === 0) {
        return res.status(404).send({ message: 'No hay publicaciones' });
      }
  
      const total = await Publication.countDocuments({ user: user }).exec();
  
      return res.status(200).send({
        total_items: total,
        pages: Math.ceil(total / itemsPerPage),
        page: page,
        items_per_page: itemsPerPage,
        publications,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: 'Error en la petición' });
    }
  }
  


  //funcion getpublication gt
  function getPublication(req, res) {
    var publicationId = req.params.id;
  
    Publication.findById(publicationId)
      .exec()
      .then((publication) => {
        if (!publication) {
          return res.status(404).send({ message: 'No existe la publicación' });
        }
        return res.status(200).send({ publication });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).send({ message: 'Error al devolver la publicación' });
      });
  }


  //funcion deletePublication vr
 /* function deletePublication(req, res) {
    var publicationId = req.params.id;

    Publication.find({'user': req.user.sub,'_id':publicationId}).remove((err,publicationRemoved)=>{

      if(err) return res.status(500).send({message:'error al borrar la publicacion'});
      if(!publicationRemoved)return res.status(404).send({message:'no se ha borrado la publicacion'});

      return res.status(200).send({publication: publicationRemoved});

    });

  }*/

  function deletePublication(req, res) {
    var publicationId = req.params.id;
  
    Publication.deleteOne({ user: req.user.sub, _id: publicationId })
      .exec()
      .then((publicationRemoved) => {
        if (publicationRemoved.deletedCount === 0) {
          return res.status(404).send({ message: 'No se ha borrado la publicación' });
        }
        return res.status(200).send({ publication: publicationRemoved });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).send({ message: 'Error al borrar la publicación' });
      });
  }

//funcion uploadImage vr

  /*function uploadImage(req,res){

    var publicationId = req.params.id;

   
    if(req.files){
        var file_path=req.files.image.path;
        console.log(file_path);

        var file_split = file_path.split('\\');
        console.log(file_split);

        var file_name = file_split[2];
        console.log(file_name);

        var ext_split = file_name.split('\.');
        console.log(ext_split);

        var file_ext = ext_split[1];
        console.log(file_ext);*/ //primera parte

      /*if(userId != req.user.sub){
          removeFilesOfUploads(res,file_path,'No tienes permiso para actualizar datos'); 


      }*/
      
/*//segunda parte
      if(file_ext == 'png' || file_ext == 'jpg' || file_ext =='jpeg' || file_ext=='gif'){
        Publication.find({'user:req.user.sub,'_id':publicationId})
        //actualizar documento de la publicacion

        Publication.findByIdAndUpdate(publicationId,{file:file_name},{new:true},(err,publicationUpdated)=>{
          if(err) return res.status(500).send({message:'error en la peticion'});
        if(!publicationUpdated)return res.status(404).send({message:'no se ha podido actualizar el avatar'});
          return res.status(200).send({publication: publicationUpdated}); 
        })
      }
      else {
        removeFilesOfUploads(res,file_path,'extension no valida'); 
      }

    }
    else{

      return res.status(200).send({message: 'no se ha subido imagen '});

    }

  }

   function removeFilesOfUploads(res,file_path,message){
    fs.unlink(file_path,(err)=>{
      if (err) return res.status(200).send({message: message});
  });



  }
  */
 /* async function uploadImage(req, res) {
    var publicationId = req.params.id;
  
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
  
      
  
      if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
        
        try {
          // Actualizar documento de la publicación
          const publicationUpdated = await Publication.findOneAndUpdate(
            { _id: publicationId },
            { file: file_name },
            { new: true }
          );
  
          if (!publicationUpdated) {
            return res.status(404).send({ message: 'No se ha podido actualizar la publicación' });
          }
  
          return res.status(200).send({ publication: publicationUpdated });
        } catch (err) {
          console.log(err);
          return res.status(500).send({ message: 'Error en la petición' });
        }
      } else {
        removeFilesOfUploads(res, file_path, 'Extensión no válida');
      }
    } else {
      return res.status(200).send({ message: 'No se ha subido imagen' });
    }
  }*/
  
  function removeFilesOfUploads(res, file_path, message) {
    fs.unlink(file_path, (err) => {
      if (err) return res.status(200).send({ message: message });
      return res.status(200).send({ message: message });
    });
  }

  function getImageFile(req,res){
       var image_file = req.params.imageFile;
       var path_file = './uploads/publications/'+image_file;

       fs.exists(path_file,(exists)=>{
        if (exists){
          res.sendFile(path.resolve(path_file));

        }
        else{
          res.status(200).send({message: 'no existe la imagen'});
        }
       });
  }

  //funcion gt

  /*async function getpublication(req, res) {
    try {
      var page = 1;
      if (req.params.page) {
        page = req.params.page;
      }
      var itemsPerPage = 4;
  
      const follows = await Follow.find({ user: req.user.sub }).populate('followed').exec();
      if (!follows) {
        return res.status(500).send({ message: 'Error al devolver los follows' });
      }
  
      var follows_clean = follows.map((follow) => follow.followed);
      console.log(follows_clean);
      // Resto del código de la función
    } catch (err) {
      return res.status(500).send({ message: 'Error en la petición' });
    }
  }*/


  /*async function getAllFromFollowing(req, res, next) {
    try {
        const page = req.params.page ?? 1;
        const itemsPerPage = +req.query?.itemsPerPage ?? 5;

        let follows = await Follow.find({ user: req.user.sub }).sort('_id').populate({ path: 'followed' });
        follows = follows.map((follow) => follow.followed);
        follows.push(req.user.sub);

        Publication.find({ user: { $in: follows } })
            .sort({ createdAt: -1 })
            .populate('user')
            .paginate(page, itemsPerPage, async (err, publications, total) => {
                if (err) return next(err);
                if (!publications) throw new error.NotFoundError('Publications from following users not found');

                return res.status(200).send({ publications, itemsPerPage, total, pages: Math.ceil(total / itemsPerPage) });
            });
    } catch (err) {
        next(err);
    }
}*/
//uploadimage vr con la denegacion de permisos si no es el token

/*function uploadImage(req,res){

  var publicationId = req.params.id;

 
  if(req.files){
      var file_path=req.files.image.path;
      console.log(file_path);

      var file_split = file_path.split('\\');
      console.log(file_split);

      var file_name = file_split[2];
      console.log(file_name);

      var ext_split = file_name.split('\.');
      console.log(ext_split);

      var file_ext = ext_split[1];
      console.log(file_ext);

   
    

    if(file_ext == 'png' || file_ext == 'jpg' || file_ext =='jpeg' || file_ext=='gif'){

     Publication.findOne({'user':req.user.sub,'_id':publicationId}).exec((err,publication) =>{

      if(publication){
        Publication.findByIdAndUpdate(publicationId,{file:file_name},{new:true},(err,publicationUpdated)=>{
          if(err) return res.status(500).send({message:'error en la peticion'});
        if(!publicationUpdated)return res.status(404).send({message:'no se ha podido actualizar el avatar'});
          return res.status(200).send({publication: publicationUpdated}); 
        });
        

      }
      else {
        removeFilesOfUploads(res,file_path,'no tienes permiso para actualizar esta publicacion '); 
      }
     });

      
    }
    else {
      removeFilesOfUploads(res,file_path,'extension no valida'); 
    }

  }
  else{

    return res.status(200).send({message: 'no se ha subido imagen '});

  }

}*/

async function uploadImage(req, res) {
  var publicationId = req.params.id;

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

    if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
      try {
        const publication = await Publication.findOne({ user: req.user.sub, _id: publicationId }).exec();

        if (publication) {
          const publicationUpdated = await Publication.findByIdAndUpdate(
            publicationId,
            { file: file_name },
            { new: true }
          ).exec();

          if (!publicationUpdated) {
            return res.status(404).send({ message: 'No se ha podido actualizar la publicación' });
          }

          return res.status(200).send({ publication: publicationUpdated });
        } else {
          removeFilesOfUploads(res, file_path, 'No tienes permiso para actualizar esta publicación');
        }
      } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error en la petición' });
      }
    } else {
      removeFilesOfUploads(res, file_path, 'Extensión no válida');
    }
  } else {
    return res.status(200).send({ message: 'No se ha subido imagen' });
  }
}

module.exports ={

    probando,
    savePublication,
    getPublications,
    getPublication,
    deletePublication,
    uploadImage,
    getImageFile,
    getPublicationsUser

};