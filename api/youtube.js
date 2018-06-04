const fs = require('fs')
const ytdl = require('ytdl-core')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffmpeg = require('fluent-ffmpeg')

module.exports = (app) => {
    app.get('/api/youtube', (req, res) => {
        //get url by user's request
        let url = req.param('url')
        let checkUrl = ytdl.validateURL(url)
        if (checkUrl) {
            //get stream download from ytbdl
            let inputStream = ytdl(url, { filter: (format) => format.container === 'mp4' })
            //.pipe(fs.createWriteStream('api/public/video.mp4'))
            //set enviroment's Path for ffmpeg
            ffmpeg.setFfmpegPath(ffmpegPath)
            ffmpeg({ source: inputStream })
                .inputFormat('mp4')
                .withAudioCodec('libmp3lame')
                .toFormat('mp3')
                .on('end', (stdout, stderr) => {
                    console.log('File has been converted succesfully!.')
                    let result = {
                        "messages": [
                            { "text": "Audio của bạn đây." },
                            {
                                "attachment": {
                                    "type": "audio",
                                    "payload": {
                                        "url": "https://bot-k23tpm6.herokuapp.com/assets/audio.mp3"
                                    }
                                }
                            }
                        ]
                    }
                    res.send(result)
                })
                .on('error', (err) => {
                    console.log('An error occurred: ' + err.message)
                })
                .save('api/public/audio.mp3')
        } else {
            let result = {
                "messages": [
                    { "text": "Url bạn nhập bị sai rồi." }
                ]
            }
            res.send(result)
        }
    })
}