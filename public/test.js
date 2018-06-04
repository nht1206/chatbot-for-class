const ffmpeg = require('fluent-ffmpeg')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
ffmpeg.setFfmpegPath(ffmpegPath)
ffmpeg({ source: 's/video.mp4' })
.withAudioCodec('libmp3lame')
.toFormat('mp3')
.save('audio.mp3')
