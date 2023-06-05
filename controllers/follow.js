'use strict'
//var path = require('path');
//var fs= require('fs');
//var moment= require('moment');

var mongoosePaginate= require('mongoose-paginate-v2');

//const mongoose = require('mongoose');
//mongoose.plugin(mongoosePaginate);

//var Publication=require('../models/publication');

var User = require('../models/user');
var Follow=require('../models/follow');



function prueba(req,res){
    res.status(200).send({message:'Hola follows'});

}

/*function saveFollow(req,res){

    var params =req.body;

   var follow = new Follow();

   follow.user = req.user.sub;
   follow.followed= params.followed;

   follow.save((err,followStored) => {
    if(err) return res.status(500).send({message:'error al guardar el follow'});

    if(!followStored) return res.status(404).send({message:'el seguimiento no se ha guardado'});
    return res.status(200).send({followStored});

   });



}*/

async function saveFollow(req, res) {
    try {
      var params = req.body;
      var follow = new Follow();
      follow.user = req.user.sub;
      follow.followed = params.followed;
  
      const followStored = await follow.save();
      if (!followStored) {
        return res.status(404).send({ message: 'El seguimiento no se ha guardado' });
      }
      return res.status(200).send({ followStored });
      
    } catch (error) {
      return res.status(500).send({ message: 'Error al guardar el follow' });
    }
  }

  /*function deleteFollow(req,res){
    var userId=req.user.sub;
    var followId=req.params.id;

    Follow.find({'user':userId, 'followed':followId}).remove(err => {
        if (err) return res.status(500).send({ message:'error al dejar de seguir'});
        return res.status(200).send({ message: 'El follow se ha eliminado !!'});
    })
  
    }*/

    async function deleteFollow(req, res) {
        var userId = req.user.sub;
        var followId = req.params.id;
      
        try {
          await Follow.deleteOne({ 'user': userId, 'followed': followId });
          return res.status(200).send({ message: 'El follow se ha eliminado' });
        } catch (error) {
          return res.status(500).send({ message: 'Error al dejar de seguir' });
        }
      }

     /* function getFollowingUsers(req,res){
        var userId=req.user.sub;

        if(req.params.id){
            userId = req.params.id;

        }

        var page=1;
        if(req.params.page){
            page =req.params.page;

        }

        var itemsPerPage= 4;
        Follow.find({ 'user': userId}).populate({path:'followed'}).paginate(page,itemsPerPage,(err,follows,total)=>{
                if(err) return res.status(500).send({ message: 'Error en el servidor'});
                if(!follows) return res.status(404).send({ message: 'no estas siguiendo a ningun usuario'});
                
            return res.status(200).send({ 
                total:total,
                pages: Math.ceil(total/itemPerpage),
                follows:follows
        });

    });
      }*/

      async function getFollowingUsers(req, res) {
        var userId = req.user.sub;
      
        if (req.params.id && req.params.page) {
          userId = req.params.id;
        }
      
        var page = 1;
        if (req.params.page) {
          page = req.params.page;
        }
        else{
            page= req.params.id;
        }
      
        var itemsPerPage = 4;
        
        try {
          const total = await Follow.countDocuments({ 'user': userId });
          const follows = await Follow.find({ 'user': userId })
            .populate('followed')
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage);
      
          if (!follows || follows.length === 0) {
            return res.status(404).send({ message: 'No estás siguiendo a ningún usuario' });
          }
          const value = await followUserIds(req.user.sub);//la inclui de user controller
          return res.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsPerPage),
            follows: follows,

            users_following: value.following,
            users_follow_me: value.followed
          });
        } catch (error) {
          return res.status(500).send({ message: 'Error en el servidor' });
        }
      }

      async function getFollowedUsers(req, res) {
        var userId = req.user.sub;
      
        if (req.params.id && req.params.page) {
          userId = req.params.id;
        }
      
        var page = 1;
        if (req.params.page) {
          page = req.params.page;
        }
        else{
            page= req.params.id;
        }
      
        var itemsPerPage = 4;
        
        try {
          const total = await Follow.countDocuments({ 'followed': userId });
          const follows = await Follow.find({ 'followed': userId })
            .populate('user')
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage);
      
          if (!follows || follows.length === 0) {
            return res.status(404).send({ message: 'No estás siguiendo a ningún usuario' });
          }
          const value = await followUserIds(req.user.sub);//la inclui de user controller
          return res.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsPerPage),
            follows: follows,
          
            users_following: value.following,
            users_follow_me: value.followed
          });
        } catch (error) {
          return res.status(500).send({ message: 'Error en el servidor' });
        }
      }


     /* function getFollowingUsers(req,res){
        var userId=req.user.sub;

        if(req.params.id){
            userId = req.params.id;

        }

        var page=1;
        if(req.params.page){
            page =req.params.page;

        }

        var itemsPerPage= 4;
        Follow.find({ 'followed': userId}).populate({path:'followed'}).paginate(page,itemsPerPage,(err,follows,total)=>{
                if(err) return res.status(500).send({ message: 'Error en el servidor'});
                if(!follows) return res.status(404).send({ message: 'no estas siguiendo a ningun usuario'});
                
            return res.status(200).send({ 
                total:total,
                pages: Math.ceil(total/itemPerpage),
                follows:follows
        });

    });
      }*/

      //devolver listado de usuarios
/*function getMyFollows(req, res){
  var userId=req.user.sub;
  
  if(req.params.followed){

  }
  var find= Follow.find({user: userId});

  if(req.params.followed){
    find= Follow.find({followed: userId});

  }
  find.populate('user followed').exec((err,follows)=>{
    if(err) return res.status(err).send({message:'error en el servidor' }); 
        
      if(!follows) return res.status(404).send({message:'no sigues a ningun usuario'});
        
      return res.status(200).send({follows});
    
  })


}*/
//devolver usuarios que me siguen
/*function getFollowBakcs(req, res){

  var userId=req.user.sub;
 

  Follow.find({user: userId}).populate('user followed').exec((err,follows)=>{
    if(err) return res.status(err).send({message:'error en el servidor' }); 
        
      if(!follows) return res.status(404).send({message:'no sigues a ningun usuario'});
        
      return res.status(200).send({follows});
    
  })



}*/

function getMyFollows(req, res) {
  var userId = req.user.sub;

  if (req.params.followed) {

  }
  var find = Follow.find({ user: userId });

  if (req.params.followed) {
    find = Follow.find({ followed: userId });

  }
  
  find.populate('user followed')
    .then(follows => {
      if (!follows) {
        return res.status(404).send({ message: 'no sigues a ningun usuario' });
      }
      return res.status(200).send({ follows });
    })
    .catch(err => {
      return res.status(500).send({ message: 'error en el servidor' });
    });
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

module.exports ={

    prueba,
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUsers,
    getMyFollows
};