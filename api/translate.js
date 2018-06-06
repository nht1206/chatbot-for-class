const translate = require('google-translate-api')
module.exports = (app) => {
    app.get('/api/translate/', (req, res) => {
        let text = req.param('text')
        let to = req.param('to')
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
}