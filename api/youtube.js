const fs = require('fs')
const ytdl = require('ytdl-core')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffmpeg = require('fluent-ffmpeg')

module.exports = (app) => {
    app.get('/api/youtube/', (req, res) => {
        let url = req.param('url')
        ytdl(url, { filter: (format) => format.container === 'mp4' })
        .pipe(fs.createWriteStream('api/public/video.mp4'))
        ffmpeg.setFfmpegPath(ffmpegPath)
    })
}