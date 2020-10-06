const express = require('express');
const router = express.Router();

const arrObj =[];//Global array
  User = (function()// הגדרת מחלקה
 {
  const user_obj = function (userName,userUrl)// בנאי
  {
   this.userName = userName;
   this.userUrl=userUrl;
  }
  user_obj.prototype.getUserName = function ()//שם המשתמש
  {
   return this.userName;
  }
  user_obj.prototype.getUserUrl = function ()//url name
  {
   return this.userUrl;
  }
  return user_obj;
 })();
 // we return the object containing the 'public' functions
//--------------------save--------------------------------
// func that handle the save user that check if user exist
// if not , saves the user on arrObj and return the
// name and url of  user
router.post('/save/:user', function(req, res)
{
 for(let i=0;i<arrObj.length; i++)
  if(req.params.user === arrObj[i].getUserName())
   return res.json({key: 'USER_EXIST', value: "User exist"});
 const obj = new User(req.params.user,  req.body.url);
 arrObj.push(obj);
 res.json({key: obj.getUserName(), value: obj.getUserUrl()});
});
//----------------delete----------------------------------
// func that handle the delete user that check if need to remove user
// if so deletes and return the size of array
router.post('/delete/:user', function(req, res)
{
 for(let i=0;i<arrObj.length;i++)
  if(req.params.user === arrObj[i].getUserName())
  {
   arrObj.splice(i, 1);
   return res.json({key: arrObj.length ,value:arrObj});
  }
 res.json({key:-1,value:""})
});

module.exports = router;
