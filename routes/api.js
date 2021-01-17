var express = require('express');
var router = express.Router();

const db = require('../models'); //contain the Contact model, which is accessible via db.Contact


router.get('/contacts', (req, res) => {
    const { email,firstName, lastName, password } = req.body
    return db.Contact.create({ email ,firstName, lastName, password })
        .then((contact) => res.send(contact))
        .catch((err) => {
            console.log('***There was an error creating a contact', JSON.stringify(contact))
            return res.status(400).send(err)
        })
});
router.post('/position', (req, res,next) => {
    // to extract the resource info (for example "name") sent by the client, use
/*    const {city} = req.body;*/
    console.log( "jerusalem");
    //console.log( req.body.city);
next();
    // Create the resource and return for example the resource object
    //resource = {city,latitude,longitude}; // we return a fixed value for demonstration purpose
    //res.send(resource);
});

module.exports = router;