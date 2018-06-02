const fs = require('fs')
const ytdl = require('ytdl-core')
module.exports = (app) => {
    app.get('/api/youtube/', (req, res) => {
        /*let url = req.param('url')
        let isValiUrl = dytdl.validateURL(url)
        if (isValiUrl) {
            ytdl(url, { filter: (format) => format.container === 'mp4' })
                .pipe(fs.createWriteStream('public/video.mp4'))
            var result = {
                "messages": [
                  {
                    "attachment": {
                      "type": "video",
                      "payload": {
                        "url": "https://bot-tpm6.herokuapp.com/videos/video.mp4"
                      }
                    }
                  }
                ]
              }
            res.send(result)*/
            var result = {
                "messages": [
                  {
                    "attachment": {
                      "type": "video",
                      "payload": {
                        "url": "https://bot-tpm6.herokuapp.com/videos/video.mp4"
                      }
                    }
                  }
                ]
              }
            res.send(result)
        })
}