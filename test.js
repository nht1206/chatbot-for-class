const Users = require('./models/users')
let newUser = new Users({
    userId: '11',
    strangersID: '',
    status: false,
    rela: false,
    gender: 'male'
})
newUser.save()