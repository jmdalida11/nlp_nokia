const express = require('express')
const bodyParser = require('body-parser')
const constant = require('./constant')

const app = express()

let PORT = process.env.PORT || 5000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

//const verifyWebhook = require('./verify-webhook')
//app.get('/', verifyWebhook);

app.get('/', function(req, res){
    res.send("Hi")
})

app.get('/webhook/', function(req, res){
    if (req.query['hub.verify_token'] === constant.VERIFY_TOKEN) {
        req.send(req.query['hub.challenge'])
    }
    res.send("Wrong token")
})

app.listen(PORT, () => console.log('Express server is listening on port ' + PORT))