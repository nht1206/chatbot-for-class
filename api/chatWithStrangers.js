const Users = require('../models/users')
const helper = require('../helper')
module.exports = (app) => {
    app.get('/api/bot/join', async (req, res) => {
        let userID = req.param('userID')
        let gender = req.param('gender')
        try {
            let sender = await Users.findOne({ userID: userID })
            if (sender) {
                sender.online = true
                sender.save()
            } else {
                let newUser = new Users({
                    userID: userID,
                    strangersID: '',
                    online: true,
                    gender: gender
                })
                newUser.save()
            }
            if (sender.gender == 'female') {
                var partner = await Users.findOne({ strangersID: '', gender: 'male', online: true })
            } else {
                var partner = await Users.findOne({ strangersID: '', gender: 'female', online: true })
            }
            if (partner) {
                //sender = await helper.setStrangers(sender.userID, partner.userID)
                //partner = await helper.setStrangers(partner.userID, sender.userID)
                //sender.setStrangers(partner.userID)
                //partner.setStrangers(sender.userID)
                sender.strangersID = partner.userID
                partner.strangersID = sender.userID
                sender.save()
                partner.save()
                helper.sendMessage(sender.userID, '✅Bạn đả được kết nối thành công.')
                helper.sendMessage(partner.userID, '✅Bạn đả được kết nối thành công.')
                res.status(200).send('success')
            } else if (!sender.strangersID) {
                let json = {
                    "messages": [
                        {
                            "attachment": {
                                "type": "template",
                                "payload": {
                                    "template_type": "generic",
                                    "elements": [
                                        {
                                            "title": "🎉",
                                            "subtitle": "Đợi xíu mình đang kiếm người lạ cho bạn."
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                }
                res.send(json)
            } else {
                let json = {
                    "messages": [
                        {
                            "attachment": {
                                "type": "template",
                                "payload": {
                                    "template_type": "generic",
                                    "elements": [
                                        {
                                            "title": "🎉",
                                            "subtitle": "Bạn đả được kết nối!."
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                }
                res.send(json)
            }
        } catch (e) {
            console.log(e)
        }
    })
    app.get('/api/bot/chat', async (req, res) => {
        let userID = req.param('userID')
        let mess = req.param('mess')
        try {
            let user = await Users.findOne({ userID: userID })
            if (user.strangersID) {
                mess = await helper.checkMess(mess)
                helper.sendMessage(user.userID, mess)
                res.status(200).send('success')
            } else if (user.online) {
                let json = {
                    "messages": [
                        {
                            "attachment": {
                                "type": "template",
                                "payload": {
                                    "template_type": "generic",
                                    "elements": [
                                        {
                                            "title": "⛔️",
                                            "subtitle": "Bạn chưa được kết nối! Hãy gõ \'end\' để thoát."
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                }
                res.send(json)
            } else {
                let json = {
                    "messages": [
                        {
                            "attachment": {
                                "type": "template",
                                "payload": {
                                    "template_type": "generic",
                                    "elements": [
                                        {
                                            "title": "⛔️",
                                            "subtitle": "Bạn chưa tham gia chat! Hãy gõ \'Start\' bắt đầu cuộc trò chuyện."
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                }
                res.send(json)
            }
        } catch (e) {
            console.log(e)
        }
    })
    app.get('/api/bot/quit', async (req, res) => {
        let userID = req.param('userID')
        try {
            let sender = await Users.findOne({ userID: userID })
            if (sender) {
                let partner = await Users.findOne({ userID: sender.strangersID })
                if (!sender.online) {
                    let json = {
                        "messages": [
                            {
                                "attachment": {
                                    "type": "template",
                                    "payload": {
                                        "template_type": "generic",
                                        "elements": [
                                            {
                                                "title": "⛔️",
                                                "subtitle": "Bạn chưa tham gia chat! Hãy gõ \'Start\' bắt đầu cuộc trò chuyện."
                                            }
                                        ]
                                    }
                                }
                            }
                        ]
                    }
                    res.send(json)
                } else if (sender.strangersID) {
                    sender.offline()
                    partner.offline()
                    sender.save()
                    partner.save()
                    helper.sendMessage(sender.userID, "💔 Bạn đã dừng chát ! Để tiếp tục hãy gõ 'Start'")
                    helper.sendMessage(partner.userID, "💔 Người lạ đã rời chát ! Để tiếp tục hãy gõ 'Start'")
                    res.status(200).send('success')
                } else {
                    let json = {
                        "messages": [
                            {
                                "attachment": {
                                    "type": "template",
                                    "payload": {
                                        "template_type": "generic",
                                        "elements": [
                                            {
                                                "title": "📣",
                                                "subtitle": "Bạn đã hủy đợi kết nối ! Hãy gõ \'Start\' để quay lại hàng chờ"
                                            }
                                        ]
                                    }
                                }
                            }
                        ]
                    }
                    res.send(json)
                }
            } else {
                let json = {
                    "messages": [
                        {
                            "attachment": {
                                "type": "template",
                                "payload": {
                                    "template_type": "generic",
                                    "elements": [
                                        {
                                            "title": "⛔️",
                                            "subtitle": "Bạn chưa tham gia chat! Hãy gõ \'Start\' bắt đầu cuộc trò chuyện."
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                }
                res.send(json)
            }
        } catch (e) {
            console.log(e)
        }
    })
}