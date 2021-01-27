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
        connected: req.session.logIn === true,
        youAreRegistered: req.session.register === true,
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
                    {signed: true, maxAge: 60 * 1000});
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
        connected: req.session.logIn === true,
        youAreRegistered: req.session.register === true,
        path: '/Password',
    });
};

exports.logIn = (req, res, next) => {
    req.session.emaill =   req.body.mail;
    req.session.register = false;
    db.Contact.findOne({where: {email: req.body.mail}})
        .then(function(passwords) {
        if (passwords.password.toString() === req.body.passwords){
            req.session.logIn = true;
            var cookies = new Cookies(req, res, {keys: keys});
            cookies.set('username',req.body.mail,
                {signed: true, maxAge: Date.now() + 60*1000});
            req.session.firstName = passwords.firstName;
            req.session.lastName = passwords.lastName;
            console.log("anythink is  ok      ");
            res.redirect("/register/weather");
           }
           else{
            res.render('logIn' , {
                title: 'logIn' ,
                youAreRegistered: req.session.register === true,
                connected: req.session.logIn === true,
                invalidPassword: true,
                invalidEmail:false
            });
               console.log("anythink is  no ok      ");}
       }).catch((err) => {
        console.log('***There was an error getting a contact', JSON.stringify(err))
                res.render('logIn' , {
                    title: 'logIn' ,
                    connected: req.session.logIn === true,
                    invalidPassword: false,
                    youAreRegistered: req.session.register === true,
                    invalidEmail: true
                });

           });

};


exports.enterPassword = (req, res, next) => {
    var cookies = new Cookies(req, res, {keys: keys});

    var lastVisit = cookies.get('Registered', {signed: true});
    if (lastVisit) {
        req.session.password = req.body.passwords;
        res.redirect("/register/registering");
    } else
        res.redirect("/register");
};

exports.log = (req , res , next) => {
    res.render('logIn' , {
        title: 'logIn' ,
        youAreRegistered: req.session.register === true,
        connected: req.session.logIn === true,
        invalidPassword:false,
        invalidEmail:false
    });
};

exports.logout = (req , res , next) => {
    req.session.destroy(null);
    res.redirect("/register/login")
};
exports.weatherPage = (req , res , next) => {
    if(req.session.logIn === true) {
        res.render('weather', {
            title: 'weather',
            connected: req.session.logIn === true,
            youAreRegistered: req.session.register === true,
            Username: req.session.firstName+" "+req.session.lastName
        });
    }
    else
        res.redirect("/register/login");
};

exports.registering = (req , res , next) => {
    req.session.register =  true;
    const email = req.session.emaill
    const firstName = req.session.firstName
    const lastName = req.session.lastName
    const password = req.session.password
    return db.Contact.create({email ,firstName,lastName,password})
        .then((contact) =>  res.render('logIn', {
            title: 'log In ',
            path: '/logIn',
            connected: req.session.logIn === true,
            youAreRegistered: req.session.register === true,
            invalidPassword:req.session.invallablePassword === true,
            invalidEmail:req.session.invalidEmail === true
        }))
        .catch((err) => {
            console.log('***There was an error creating a contact', JSON.stringify(err));
            req.session.logIn = false;
            req.session.alreadyExist =  true;
            res.redirect("/register");
        })
};