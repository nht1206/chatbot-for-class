const translate = require('google-translate-api')
const request = require('request')
module.exports = (app) => {
    app.get('/api/translate/', (req, res) => {
        let text = req.param('text')
        let to = req.param('to')
        if (!to) {
            to = 'vi'
        }
        translate(text, { to : to}).then((data) => {
            if (data.from.text.value) {
                var result = {
                    "messages": [
                      {"text": data.text},
                      {"text": "Sai lỗi chính tả: " + data.from.text.value},
                      {
                        "attachment": {
                          "type": "audio",
                          "payload": {
                            "url": "https://translate.google.com.vn/translate_tts?ie=UTF-8&q="+ data.text.replace(/ /g, '%20') +"&tl="+ to +"&client=tw-ob"
                          }
                        }
                        }
                    ]
                }
            } else {
                var result = {
                    "messages": [
                        {"text": data.text},
                        {
                            "attachment": {
                              "type": "audio",
                              "payload": {
                                "url": "https://translate.google.com.vn/translate_tts?ie=UTF-8&q="+ data.text.replace(/ /g, '%20') +"&tl="+ to +"&client=tw-ob"
                              }
                            }
                        }
                    ]
                }
            }
            res.send(result)
        }).catch((err) => {
            console.log(err)
        })
    })
    app.get('/test', (req, res) => {
        //request.post('https://api.chatfuel.com/bots/5b116878e4b0be54cc171eea/users/100007104076512/send?chatfuel_token=75NBThzxDIscaXBwrbCVOkdFSFlC1Ud7Chtrh26uGFd3xZQLRzj3OD7BfCXg0dJ0&chatfuel_message_tag=SHIPPING_UPDATE&chatfuel_block_id=5b1c0b33e4b0206f53bd379b')
        //.form({
        //    test: 'haha'
        //})
        request.post({url:'https://api.chatfuel.com/bots/5b116878e4b0be54cc171eea/users/100007104076512/send?chatfuel_token=75NBThzxDIscaXBwrbCVOkdFSFlC1Ud7Chtrh26uGFd3xZQLRzj3OD7BfCXg0dJ0&chatfuel_message_tag=SHIPPING_UPDATE&chatfuel_block_id=5b1c0b33e4b0206f53bd379b', form: {
            test: 'haha'
            }
        }, function(err,httpResponse,body){ 
            res.send(body)
        })
    })
}