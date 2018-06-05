const fs = require('fs')
const ytdl = require('ytdl-core')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffmpeg = require('fluent-ffmpeg')
const dropboxV2Api = require('dropbox-v2-api')


const dropbox = dropboxV2Api.authenticate({
    token: 'R004Ca7izrAAAAAAAAAAJIGI26bVfUwfEVlLdkGJZrhvuCECv2zS1YFZOeUvuLo-'
})

module.exports = (app) => {
    app.get('/api/ytbdl', (req, res) => {
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
                    let data = {
                        "messages": [
                            { "text": "Chuyển thành mp3 thành công.!" }
                        ]
                    }
                    res.send(data)
                })
                .on('error', (err) => {
                    console.log('An error occurred: ' + err.message)
                })
                .save('api/public/audio.mp3')
        } else {
            let data = {
                "messages": [
                    { "text": "Url bạn nhập bị sai rồi." }
                ]
            }
            res.send(data)
        }
    })
    app.get('/api/drbUpload', (req, res) => {
        const dropboxUploadStream = dropbox({
            resource: 'files/upload',
            parameters: {
                path: '/bot/audio.mp3'
            }
        }, (err, result, response) => {
            //upload completed
            let data = {
                "messages": [
                    { "text": "Upload thành công." }
                ]
            }
            res.send(data)
        })
        fs.createReadStream('api/public/audio.mp3').pipe(dropboxUploadStream)
    })
}