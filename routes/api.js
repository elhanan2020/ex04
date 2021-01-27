var express = require('express');
var router = express.Router();
var Cookies = require('cookies')
var keys = ['keyboard cat']
const db = require('../models'); //contain the Contact model, which is accessible via db.Contact



router.get('/city', (req, res) => {
    if(req.session.logIn === true) {
        return db.Weather.findAll({where: {email: req.session.emaill},attributes:['city']})
            .then((contacts) => res.send(contacts))
            .catch((err) => {
                console.log('There was an error querying contacts', JSON.stringify(err))
                err.error = 1; // some error code for client side
                return res.send(err)
            });
    }
    else
        return res.status(404).send("you are not connected");
});

router.post('/getPosition/:city', (req, res) => {
    if(req.session.logIn === true) {
        return db.Weather.findOne({where: {email: req.session.emaill,city:req.params.city},attributes:['latitude','longitude']})
            .then((contacts) =>
            { res.send([contacts.latitude,contacts.longitude])})
            .catch((err) => {
                console.log('There was an error querying contacts', JSON.stringify(err))
                err.error = 1; // some error code for client side
                return res.send(err)
            });
    }
    else
        res.sendStatus(404).send("it was a error")
});



router.post('/position', (req, res) => {
    if(req.session.logIn === true) {
        const { city, latitude, longitude } = req.body;
       return db.Weather.create({email:req.session.emaill ,city, latitude,longitude })
            .then((contact) => res.send(contact))
            .catch((err) => {
                return res.status(401).send("it was a error");
            });
   }
    else
        res.sendStatus(404).send("it was a error")
});


router.delete('/deleteAllCity', (req, res) => {
    if(req.session.logIn === true) {
        return db.Weather.destroy({where: {email:req.session.emaill}})
            .then((contact) => {
                res.sendStatus(200).send(contact)})
            .catch((err) => {
                console.log('***There was an error creating a contact', JSON.stringify(err))
                return res.sendStatus(401).send("it was a error")
            })
    }
    else
        res.sendStatus(404).send("it was a error")
});

router.delete('/deleteCity/:id', (req, res) => {
    if(req.session.logIn === true) {
           return db.Weather.destroy({where: {email:req.session.emaill,city:req.params.id}})
                .then((contact) => {
                    res.sendStatus(200).send(contact)})
                .catch((err) => {
                    console.log('***There was an error creating a contact', JSON.stringify(err))
                    return res.sendStatus(401).send("it was a error")
                })
    }
    else
        res.sendStatus(404).send("it was a error")
});
module.exports = router;