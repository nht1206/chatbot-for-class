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
            const inputStream = ytdl(url, { filter: (format) => format.container === 'mp4' })
            const audioName = new Date().getTime() + '.mp3'
            const output = 'api/public/' + audioName
            const outputStream = fs.createWriteStream(output)
            //.pipe(fs.createWriteStream('api/public/video.mp4'))
            //set enviroment's Path for ffmpeg
            ffmpeg.setFfmpegPath(ffmpegPath)
            ffmpeg({ source: inputStream })
                .inputFormat('mp4')
                .withAudioCodec('libmp3lame')
                .toFormat('mp3')
                .on('end', (stdout, stderr) => {
                    const dropboxUploadStream = dropbox({
                        resource: 'files/upload',
                        parameters: {
                            path: '/bot/' + audioName
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
                    console.log('File has been converted succesfully!.')
                    fs.createReadStream('api/public/' + audioName).pipe(dropboxUploadStream)
                })
                .on('error', (err) => {
                    console.log('An error occurred: ' + err.message)
                })
                .stream(outputStream, { end : true})
        } else {
            let data = {
                "messages": [
                    { "text": "Url bạn nhập bị sai rồi." }
                ]
            }
            res.send(data)
        }
    })
}