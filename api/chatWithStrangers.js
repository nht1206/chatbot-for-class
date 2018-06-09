module.exports = (app) => {
    app.get('/test', (req, res) => {
        //request.post('https://api.chatfuel.com/bots/5b116878e4b0be54cc171eea/users/100007104076512/send?chatfuel_token=75NBThzxDIscaXBwrbCVOkdFSFlC1Ud7Chtrh26uGFd3xZQLRzj3OD7BfCXg0dJ0&chatfuel_message_tag=SHIPPING_UPDATE&chatfuel_block_id=5b1c0b33e4b0206f53bd379b')
        //.form({
        //    test: 'haha'
        //})
        let userId = req.param('userId')
        let mess = req.param('mess')
        request({

            url: `https://api.chatfuel.com/bots/5b116878e4b0be54cc171eea/users/${userId}/send?chatfuel_token=75NBThzxDIscaXBwrbCVOkdFSFlC1Ud7Chtrh26uGFd3xZQLRzj3OD7BfCXg0dJ0&chatfuel_message_tag=SHIPPING_UPDATE&chatfuel_block_name=test`,
            method: 'POST',
            json: {test: mess}
          }, function(error, response, body){
            res.send(body)
          });
    })
}