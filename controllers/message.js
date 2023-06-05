'use strict'

var moment= require('moment');
const mongoose = require('mongoose');
var mongoosePaginate= require('mongoose-paginate-v2');
mongoose.plugin(mongoosePaginate);

var User=require('../models/user');
var Follow =require('../models/follow');
const Message = require('../models/message');

function probando(req,res){
    res.status(200).send({message:'Hola que tal'});

}

/*function saveMessage(req,res){
    var params=req.body;

    if(!params.text || !params.receiver) return res.status(404).send({message:'env�a los datos necesarios'})
    var message=new Message();
    message.emitter=req.user.sub;
    message.receiver=params.receiver;
    message.text=params.text;
    message.create_at=moment().unix();

    message.save((err,messageStored)=>{

        if(err) return res.status(500).send({message:'error en la petici�n'})
        if(!messageStored) return res.status(500).send({message:'error al enviar el mensaje'})
    
          return  res.status(200).send({message: messageStored});

    });
}*/

//funcion saveMessage gt funcional
/*function saveMessage(req, res){
    var params = req.body;
  
    if (!params.text || !params.receiver) {
      return res.status(404).send({message: 'Env�a los datos necesarios'});
    }
  
    var message = new Message();
    message.emitter = req.params.id; // Usamos el id del usuario que env�a el mensaje
    message.receiver = params.receiver;
    message.text = params.text;
    message.create_at = moment().unix();
    message.viewed=false;
  
   
    message.save()
  .then((messageStored) => {
    if (!messageStored) {
      return res.status(500).send({message: 'Error al enviar el mensaje'});
    }

    return res.status(200).send({message: messageStored});
  })
  .catch((err) => {
    return res.status(500).send({message: 'Error en la petici�n'});
  });
  }*/

  /*function getReceivedMessages(req, res) {
    var page = 1;
    if (req.params.page) {
      page = req.params.page;
    }
  
    var itemsPerPage = 4;
  
    Message.find({ receiver: req.params.id })
      .populate('emitter', 'name surname image nick _id')
      .sort('-create_at')
      .paginate(page, itemsPerPage, (err, messages, total) => {
        if (err) {
          return res.status(500).send({ message: 'Error en la petici�n' });
        }
  
        if (!messages) {
          return res.status(404).send({ message: 'No hay mensajes' });
        }
  
        return res.status(200).send({
          total: total,
          pages: Math.ceil(total / itemsPerPage),
          messages
        });
      });
  }*/

 /* function getReceivedMessages(req, res) {
    const id = req.params.id;
    const page = req.query.page || 1;
    const itemsPerPage = 10;
  
    Message.paginate({ receiver: id }, { page: page, limit: itemsPerPage, sort: { create_at: 'desc' } })
      .then((messages) => {
        return res.status(200).send({ messages: messages });
      })
      .catch((err) => {
        return res.status(500).send({ message: 'Error en la petici�n' });
      });
  }*/

  //funcion saveMessage de vr
  /*function saveMessage(req,res){
    var params=req.body;

    if(!params.text || !params.receiver) return res.status(200).send({message:'env�a los datos necesarios'})
    var message=new Message();
    message.emitter=req.user.sub;
    message.receiver=params.receiver;
    message.text=params.text;
    message.create_at=moment().unix();

    message.save((err,messageStored)=>{

        if(err) return res.status(500).send({message:'error en la petici�n'})
        if(!messageStored) return res.status(500).send({message:'error al enviar el mensaje'})
    
          return  res.status(200).send({message: messageStored});

    });
}*/

async function saveMessage(req, res) {
  var params = req.body;

  if (!params.text || !params.receiver) {
    return res.status(200).send({ message: 'Envía los datos necesarios' });
  }

  var message = new Message();
  message.emitter = req.user.sub;
  message.receiver = params.receiver;
  message.text = params.text;
  message.create_at = moment().unix();

  try {
    const messageStored = await message.save();

    if (!messageStored) {
      return res.status(500).send({ message: 'Error al enviar el mensaje' });
    }

    return res.status(200).send({ message: messageStored });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: 'Error en la petición' });
  }
}

//getreceived sin organizar sub gt
  /*function getReceivedMessages(req, res) {
    const id = req.params.id;
    const page = req.query.page || 1;
    const itemsPerPage = 10;
  
    Message.paginate(
      { receiver: id },
      { page: page, limit: itemsPerPage, sort: { create_at: 'desc' }, select: 'text emitter receiver create_at', populate: { path: 'emitter', select: 'name surname  email image' } }
    )
      .then((messages) => {
        return res.status(200).send({ messages: messages });
      })
      .catch((err) => {
        return res.status(500).send({ message: 'Error en la petici�n' });
      });
  }*/


//funcion original getReceivedMessages de vr
 /* function getReceivedMessages2(req, res) {
    var userId = req.params.sub;
    var page = 1;
    if (req.params.page) {
      page = req.params.page;
    }
  
    var itemsPerPage = 4;
  
    Message.find({ receiver: userId }).populate('emitter').paginate(page, itemsPerPage, (err, messages, total) => {
        if (err) {
          return res.status(500).send({ message: 'Error en la petici�n' });
        }
  
        if (!messages) {
          return res.status(404).send({ message: 'No hay mensajes' });
        }
  
        return res.status(200).send({
          total: total,
          pages: Math.ceil(total / itemsPerPage),
          messages
        });
      });
  }*/
  async function getReceivedMessages2(req, res) {
    const userId = req.user.sub; // ID del usuario autenticado obtenido desde el token
    const page = parseInt(req.query.page) || 1; // N�mero de p�gina, se obtiene desde la consulta
  
    const limit = 10; // N�mero de mensajes por p�gina
    const skip = (page - 1) * limit; // Cantidad de mensajes para omitir seg�n la p�gina actual
  
    try {
      const totalMessages = await Message.countDocuments({ receiver: userId });
      const totalPages = Math.ceil(totalMessages / limit);
  
      const paginatedMessages = await Message.find({ receiver: userId })
        .populate('emitter')
        .populate('receiver')
        .sort({ create_at: 'desc' })
        .skip(skip)
        .limit(limit);
  
      return res.status(200).send({
        total: totalMessages,
        pages: totalPages,
        currentPage: page,
        messages: paginatedMessages
      });
    } catch (err) {
      return res.status(500).send({ message: 'Error en la petición' });
    }
  }
  
  
async function saveMessage(req, res) {
  var params = req.body;

  if (!params.text || !params.receiver) {
    return res.status(200).send({ message: 'Envía los datos necesarios' });
  }

  var message = new Message();
  message.emitter = req.user.sub;
  message.receiver = params.receiver;
  message.text = params.text;
  message.create_at = moment().unix();
 message.viewed ='false'; 

  try {
    const messageStored = await message.save();

    if (!messageStored) {
      return res.status(500).send({ message: 'Error al enviar el mensaje' });
    }

    return res.status(200).send({ message: messageStored });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: 'Error en la petición' });
  }
}
/*
function getUnviewedMessages(req, res) {
  var userId = req.user.sub;
  Message.count({receiver:userId, viewed:'false'}).exec((err,count)=>{
      if(err) return res.status(500).send({message:'Error en la petici�n'});
      return res.status(200).send({
          'unviewed': count
      });
  })


}*/
function getUnviewedMessages(req, res) {
  var userId = req.user.sub;
  Message.count({ receiver: userId, viewed: 'false' })
    .exec()
    .then((count) => {
      return res.status(200).send({
        unviewed: count,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: 'Error en la petición' });
    });
}



async function getReceivedMessages(req, res) {
  var userId = req.params.sub;
  var page = 1;
  if (req.params.page) {
    page = req.params.page;
  }

  var itemsPerPage = 4;
  var skip = (page - 1) * itemsPerPage;

  try {
    const messages = await Message.find({ receiver: userId })
      .populate('emitter','name surname image nick _id')
      .skip(skip)
      .limit(itemsPerPage);

    if (messages.length === 0) {
      return res.status(404).send({ message: 'No hay mensajes' });
    }

    const total = await Message.countDocuments({ receiver: userId });

    return res.status(200).send({
      total: total,
      pages: Math.ceil(total / itemsPerPage),
      messages
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: 'Error en la petición' });
  }
}
  //funcion gt getEmmitMessages antigua sin el sub
  function getEmmitMessages(req, res) {
    const id = req.params.id;
    const page = req.query.page || 1;
    const itemsPerPage = 10;
  
    Message.paginate(
      { emitter: id },
      { page: page, limit: itemsPerPage, sort: { create_at: 'desc' }, select: 'text emitter receiver create_at', populate: { path: 'emitter receiver', select: 'name surname  email image' } }
    )
      .then((messages) => {
        return res.status(200).send({ messages: messages });
      })
      .catch((err) => {
        return res.status(500).send({ message: 'Error en la petición' });
      });
  }
  function getEmmitMessages2(req, res) {
    var userId = req.user.sub;
    var page = 1;
    if (req.params.page) {
      page = req.params.page;
    }
  
    var itemsPerPage = 4;
  
    Message.find({ emitter: userId })
      .populate('emitter receiver', 'name surname image nick _id')
      .sort({ createdAt: 'desc' })
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .exec()
      .then((messages) => {
        if (messages.length === 0) {
          return res.status(404).send({ message: 'No hay mensajes' });
        }
  
        Message.countDocuments({ emitter: userId })
          .exec()
          .then((total) => {
            return res.status(200).send({
              total: total,
              pages: Math.ceil(total / itemsPerPage),
              messages
            });
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).send({ message: 'Error en la petición' });
          });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).send({ message: 'Error en la petición' });
      });
  }
  /*function getUnviewedMessages(req, res) {
    var userId = req.params.user;
    Message.count({receiver:userId, viewed:'false'}).exec((err,count)=>{
        if(err) return res.status(500).send({message:'Error en la petici�n'});
        return res.status(200).send({
            'unviewed': count
        });
    })


  }*/
//funcion gt emitemensaje no funciona
  /*async function getEmmitMessages(req, res) {
    var userId = req.params.sub;
    var page = 1;
    if (req.params.page) {
      page = req.params.page;
    }
  
    var itemsPerPage = 4;
    var skip = (page - 1) * itemsPerPage;
  
    try {
      const messages = await Message.find({ emitter: userId })
        .populate('emitter receiver','name surname image nick _id')
        .skip(skip)
        .limit(itemsPerPage);
  
      if (messages.length === 0) {
        return res.status(404).send({ message: 'No hay mensajes' });
      }
  
      const total = await Message.countDocuments({ receiver: userId });
  
      return res.status(200).send({
        total: total,
        pages: Math.ceil(total / itemsPerPage),
        messages
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: 'Error en la petici�n' });
    }
  }*/

  /*async function getEmmitMessages(req, res) {
    var userId = req.params.sub;
    var page = 1;
    if (req.params.page) {
      page = req.params.page;
    }
  
    var itemsPerPage = 4;
    var skip = (page - 1) * itemsPerPage;
  
    try {
      const messages = await Message.find({ emitter: userId })
        .populate('emitter receiver','name surname image nick _id')
        .skip(skip)
        .limit(itemsPerPage);
  
      if (messages.length === 0) {
        return res.status(404).send({ message: 'No hay mensajes' });
      }
  
      const total = await Message.countDocuments({ receiver: userId });
  
      return res.status(200).send({
        total: total,
        pages: Math.ceil(total / itemsPerPage),
        messages
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: 'Error en la petici�n' });
    }
  }
*/
  

//funcion univiewed gt funcional
  /*function getUnviewedMessages(req, res) {
    var userId = req.params.user;
    Message.count({receiver:userId, viewed:'false'}).exec()
      .then((count) => {
        return res.status(200).send({
            'unviewed': count
        });
      })
      .catch((err) => {
        return res.status(500).send({message:'Error en la petici�n'});
      });
}*/

/*function setViewedMessages(req,res){
    var userId=req.params.user;

    Message.update({receiver:userId, viewed:'false'},{viewed:'true'},{"multi":true},(err,messageUpdated)=>{

        if(err) return res.status(500).send({message:'Error en la petici�n'});
        return res.status(200).send({
          messages:messageUpdated
        })



    });  
        
}*/

//funcion setviewedMessages totalmente funcional sin sub gt

/*function setViewedMessages(req, res) {
    var userId = req.params.user;
  
    Message.updateMany({receiver: userId, viewed: 'false'}, {viewed: 'true'},{"multi":true})
      .then((messageUpdated) => {
        return res.status(200).send({messages: messageUpdated});
      })
      .catch((err) => {
        return res.status(500).send({message: 'Error en la petici�n'});
      });
  }*/


 //funcion original vr
  /*function setViewedMessages(req,res){
    var userId=req.user.sub;

    Message.update({receiver:userId, viewed:'false'},{viewed:'true'},{"multi":true},(err,messageUpdated)=>{

        if(err) return res.status(500).send({message:'Error en la petici�n'});
        return res.status(200).send({
          messages:messageUpdated
        })



    });  
        
}*/

function setViewedMessages(req, res) {
  var userId = req.user.sub;

  Message.updateMany({ receiver: userId, viewed: 'false' }, { viewed: 'true' })
    .exec()
    .then((messageUpdated) => {
      return res.status(200).send({
        messages: messageUpdated,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: 'Error en la petición' });
    });
}



module.exports ={

    probando,
    saveMessage,
    getReceivedMessages,
    getEmmitMessages,
    getUnviewedMessages,
    setViewedMessages,
    getEmmitMessages2,
    getReceivedMessages2
};