const express = require('express')
const bodyParser = require('body-parser')
const constant = require('./constant')
const request = require('request')

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
		res.send("wrong token");     
    }
  }
});

app.post('/webhook/', (req, res) => {
	let messaging_events = req.body.entry[0].messaging
	for (let i=0; i<messaging_events.length; i++)
	{
		let ev = messaging_events[i]
		let sender = ev.sender.id
		if (ev.message && ev.message.text){
			let text = ev.message.text
            sendMessage(sender, "Text echo : " + text)
		}
	}
    res.sendStatus(200)
})

function sendMessage(sender, text){
	let messageData = {text: text}
    let url = "https://graph.facebook.com/v4.0/me/messages" 
	request({
        url : url,
        qs : {access_token:constant.FB_TOKEN},
        method: "POST",
        json: {
            recipient: {id: sender},
            message: messageData
        }
	}, (err, res, body) => {
        if(err)
            console.log("sending error")
        else if(res.body.error)
            console.log("response body error")
    })
}

app.listen(PORT, () => console.log('Express server is listening on port ' + PORT))