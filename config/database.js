//config/database.js
let userDB = ''
let passDB = ''
const urlConnect = `mongodb://${userDB}:${passDB}@ds153890.mlab.com:53890/chat_bot`
let getUrl = () => {
    return urlConnect
}
module.exports = {
    getUrl: getUrl
}
