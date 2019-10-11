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

app.get('/webhook', (req, res) => {
    
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
   
  if (token) {
  
    if (token === constant.VERIFY_TOKEN) {
      
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      res.sendStatus(403);      
    }
  }
});

app.listen(PORT, () => console.log('Express server is listening on port ' + PORT))