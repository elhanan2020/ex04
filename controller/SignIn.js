
var Cookies = require('cookies')

const  express =require("express");
const db = require('../models');
const app = express();

const cookiesparser = require("cookie-parser");
app.use(cookiesparser());
var keys = ['keyboard cat']

exports.getHisData = (req, res, next) => {
    res.render('index', {
        title: 'SignUp ',
        path: '/register',
        isWasaProblem:req.session.alreadyExist === true
    });
};


exports.chechTheMail = (req, res, next) => {
        db.Contact.findOne({where: {email: req.body.mail}}).then(function(maill) {
            if (!maill) {
                req.session.alreadyExist =  false;
                req.session.firstName =  req.body.firstName;
                req.session.emaill =   req.body.mail;
                req.session.lastName  =  req.body.Secondname;

                var cookies = new Cookies(req, res, {keys: keys});
                cookies.set('Registered',"cookies",
                    {signed: true, maxAge: 20 * 1000});
                res.redirect('/register/password');
            } else {
                req.session.alreadyExist =  true;
                res.redirect('/register');
            }
        })
};
exports.getaPassword = (req, res, next) => {
    res.render('password', {
        title: 'Password ',
        path: '/Password',
    });
};

exports.logIn = (req, res, next) => {
    db.Contact.findOne({where: {email: req.body.mail}})
        .then(function(passwords) {
            console.log(typeof passwords.password.toString(),typeof req.body.passwords);

        if (passwords.password.toString() === req.body.passwords){
            req.session.logIn = true;
            req.session.firstName = passwords.firstName;
            req.session.lastName = passwords.lastName;
            console.log("anythink is  ok      ");
            res.redirect("/register/weather");
           }
           else{
               req.session.invallablePassword = true;
               res.redirect("/register/login");
               console.log("anythink is  no ok      ");}
       }).catch((err) => {
                req.session.invalidEmail = true;
                res.redirect("/register/login");
                console.log('***There was an error getting a contact', JSON.stringify(err))
           });

};


exports.enterPassword = (req, res, next) => {
    var cookies = new Cookies(req, res, {keys: keys});
    var lastVisit = cookies.get('Registered', {signed: true});
    if (lastVisit) {
        registered = true;
        res.redirect("/registering");
    } else
        res.redirect("/register");
};

exports.log = (req , res , next) => {
    res.render('logIn' , {
        title: 'logIn' ,
        invalidPassword:req.session.invallablePassword === true,
        invalidEmail:req.session.invalidEmail === true
    });
    req.session.invalidEmail = false;
    req.session.invallablePassword = false ;
};
exports.weatherPage = (req , res , next) => {
    if(req.session.logIn === true) {
        res.render('weather', {
            title: 'weather',
            Username: req.session.firstName+" "+req.session.lastName
        });
    }
    else
        res.redirect("/register/login");
};