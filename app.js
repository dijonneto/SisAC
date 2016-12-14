var express = require('express')
var Datastore = require('nedb')
var bodyParser = require('body-parser')

// App initialization
var app = express()
app.use(bodyParser.json())  // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }))  // support encoded bodies

// Database initialization
var db = new Datastore()

// Exposing methods
app.get('/', function (req, res) {
    res.send('Bem-vindo(a) ao Sistema de Agenda de Compromissos!')
})

//------------------------
// Exposing methods of API
//------------------------

app.get('/compromissos', (req, res) => {
    // Find all documents in the collection
    console.log("Find all")
    db.find({}, function (err, docs) {
        res.send(docs)
    })
})

app.post('/compromissos', (req, res) => {
    var doc = req.body
    console.log("Insert")
    db.insert(doc, function (err, newDoc) {
        // newDoc is the newly inserted document, including its _id
        res.send(newDoc)
    })
})

app.get('/compromissos/id/:id', (req, res) => {
    console.log("Find one id")
    var req_id = req.params.id
    console.log("ID: " + req_id)
    db.findOne({ _id: req_id }, function (err, doc) {
        if (err) {
            console.log("Error")
        } else {
            res.send(doc)
        }
    })
})

app.get('/compromissos/descricao/:desc', (req, res) => {
    console.log("Find one descricao")
    var req_desc = req.params.desc
    console.log("Descricao: " + req_desc)
    db.find({ descricao: req_desc }, function (err, docs) {
        if (err) {
            console.log("Error")
        } else {
            res.send(docs)
        }
    })
})

app.put('/compromissos/:id', (req, res) => {
    console.log("Update")
    var idOldDoc = req.params.id
    var newDoc = req.body
    console.log("ID: " + idOldDoc)
    db.update({ _id: idOldDoc }, newDoc, { returnUpdatedDocs: true }, function (err, numAffected, affectedDocuments) {
        if (err) {
            console.log("Error")
        } else {
            // affectedDocuments is the updated document, including its _id
            res.send(affectedDocuments)
        }
    })
})

app.delete('/compromissos/:id', (req, res) => {
    console.log("Delete")
    var req_id = req.params.id
    console.log("ID: " + req_id)
    // Remove one document from the collection
    db.remove({ _id: req_id }, {}, function (err, numRemoved) {
        // numRemoved = 1
        res.send(req_id)
    })
})
//------------------------

// Handling server error (500)
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send("Something broke!")
})

// Handling file not found error (404)
app.use((req, res, next) => {
    res.status(404).send("Sorry can\'t find that!")
})

var port = 80
// Exposing service on port 80
app.listen(port, () => {
    console.log("Server running at http://localhost:" + port + "/")
})