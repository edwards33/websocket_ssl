const Hexnut = require('hexnut')
const handle = require('hexnut-handle')

var fs = require('fs')
var https = require('https')

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

var server = https.createServer({
  key: fs.readFileSync('./ssl/server.key'),
  cert: fs.readFileSync('./ssl/server.cert')
}, app)
.listen(port, function () {
  console.log(`Example app listening on port ${port}! Go to https://localhost:${port}/`)
})

const wsApp = new Hexnut({ 
  server, 
  verifyClient: function(info, callback){
    console.log(`Is this connection authorized or encrypted? ${info.secure}`)
    callback(true)
  }
})

wsApp.use(handle.connect(ctx => {
    ctx.messageCount = 0
    ctx.send('You connected!')
}))

wsApp.use(handle.message(ctx => {
    ctx.messageCount += 1
    ctx.send(`You send a message: ${ctx.message}`)
    ctx.send(`It was message number: ${ctx.messageCount}`)
}))

console.log('before start')

wsApp.start()
