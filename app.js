//app.js
const express = require('express')
const translate = require('google-translate-api')
const cookie = require('cookie-parser')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const app = express()
let port = process.env.PORT || 3000


app.use(morgan('dev'))
app.use(cookie())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

app.get('/api/translate/', (req, res) => {
    let text = req.param('text')
    let to = req.param('to')
    translate(text, { to : to}).then((data) => {
        if (data.from.text.value) {
            var result = {
                "messages": [
                  {"text": data.text},
                  {"text": "Sai lỗi chính tả: " + data.from.text.value}
                ]
            }
        } else {
            var result = {
                "messages": [
                    {"text": data.text}
                ]
            }
        }
        res.send(result)
    }).catch((err) => {
        console.log(err)
    })
})

app.listen(port, () => {
    console.log('Server listening on port: ', port)
})