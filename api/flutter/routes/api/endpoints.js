const express = require('express');
const router = express.Router();
const Datastore = require('nedb');
const { parse } = require('../api');


// Index __________________________________________________________
router.get('/', (req, res) => {

    const route = req.baseUrl.slice(5);
    const db = new Datastore(`./database/${route}.db`);
    db.loadDatabase();

    db.find({}, function(err, docs){
        res.json(docs);
    });
});


// Show __________________________________________________________
router.get('/:id', (req, res) => {

    const route = req.baseUrl.slice(5);
    const db = new Datastore(`./database/${route}.db`);
    db.loadDatabase();

    db.findOne({ _id: req.params.id }, function(err, docs){
        if(docs) {
            res.json(docs);
        } else {
            res.status(400).json({ msg: `No ${route} with an id of ${req.params.id}` });
        }
    });
});


// Create __________________________________________________________
router.post('/', (req, res) => {

    const route = req.baseUrl.slice(5);
    console.log({req});
    let newEntry = parse(route, req, res);

    const db = new Datastore(`./database/${route}.db`);
    db.loadDatabase();

    // TODO: case-insensitive checking/storing
    db.findOne({ email: newEntry.email }, function(err, doc){
        if(doc) {
             res.status(400).json({ msg: `Email ${newEntry.email} already exists in database` })
        } else {
            db.insert(newEntry, function(err, newDoc){
                res.json({ msg: `${route} updated`, entry: newDoc});
            });
        }
    });
});


// Update __________________________________________________________
router.put('/:id', (req, res) => {

    const route = req.baseUrl.slice(5);
    const db = new Datastore(`./database/${route}.db`);
    console.log(db);
    db.loadDatabase();

    const updatedEntry = parse(route, req, res);
    db.update({ _id: req.params.id }, {$set: updatedEntry}, {}, function(err, numUpdated){
        if(numUpdated > 0){
            res.json({ msg: `${route} updated`, entry: updatedEntry});
        } else {
            res.status(400).json({ msg: `No ${route} with an id of ${req.params.id}` });
        }
    });
});


// Destroy __________________________________________________________
router.delete('/:id', (req, res) => {

    const route = req.baseUrl.slice(5);
    const db = new Datastore(`./database/${route}.db`);
    db.loadDatabase();

    db.remove({ _id: req.params.id }, {}, function(err, numRemoved){
        if(numRemoved >= 0) {
            res.json({ msg: `${route}: ${req.params.id} was removed` });
        } else {
            res.status(400).json({ msg: `No ${route} with an id of ${req.params.id}` });
        }
    });
});

module.exports = router;
