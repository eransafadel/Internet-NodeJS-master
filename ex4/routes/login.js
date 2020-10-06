const express = require('express');
const router = express.Router();
//---------------global members---------------------------------------------------
const NAME = "admin";
const PASSWORD = "1234";
//---------------functions api----------------------------------------------------

//function that check if user logged and return to client true or false respectively
router.post('/session',function (req,res,next)
{
    if( req.session.userLogin === true)
        return res.json({session: "true"});
    return  res.json({session: "false"});

});

//Checks if the form has a correct name and password, then passes it to the next page,
// otherwise - stays on the current page
router.post('/login', function (req, res, next)
{
    if(req.body.name) // if you login
    {
        if (req.body.name === NAME && req.body.pass === PASSWORD)
        {
            req.session.userLogin = true;
            res.render('home', {name: req.body.name, password: req.body.pass});// if is ok
        }
        else
        {
            req.session.userLogin = false;
            res.render('login', {msg: 'wrong credentials'});// if not
        }

    }
    else// if you logout
        next();
});

//the function updates the session and returns the user to the login screen
router.post('/login',function (req,res,next)
{
    req.session.userLogin=false;
    res.render('login', {msg: 'Please login'});
});
//A function that checks the user status by session and updates the screen accordingly
router.get('/login', function(req, res)
{
    if(req.body.name)
        return;

    if (req.session.userLogin && req.session.userLogin === true)
       return res.render('home', {name: req.body.name, password: req.body.pass});// if is ok

    return res.render('login', {msg: 'Please login'});

});














module.exports = router;
