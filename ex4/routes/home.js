const express = require('express');
const router = express.Router();
const db = require ('../models'); //get db


//--------------------save--------------------------------
// func that handle the save user that check if user exist
// if not , saves the user on arrObj and return the
// name and url of  user
router.post('/save/:user', function(req, res)//set
{
  db.DataBase_Github.findOne({where: {name: req.params.user}}).
    then(obj =>
  {
      if (!obj)
      { //if user no find in db
      db.DataBase_Github.create({name: req.params.user, url: req.body.url})//push
          .then(obj => {
            console.log("create " + obj.name);
            res.json({key:"true"});
          });
      }
      else
      {
        res.json({key:"false"});
      }
  })
});
//----------------delete----------------------------------
// func that handle the delete user that check if need to remove user
// if so deletes and return the size of array
router.post('/delete/:user', function(req, res)
{
  db.DataBase_Github.destroy({where:{name: req.params.user}}).then(obj =>
  {
    if(obj) // אם האויבקט נהרס
    {
      res.json({key:"true"});
    }
    else
    {
      res.json({key:"false"});
    }
  })
});

//function that return all data base and sent to client
router.get('/db' , function (req, res)
{
  db.DataBase_Github.findAll()
      .then (list =>
      {
   return res.send(list);
  })
});







module.exports = router;

