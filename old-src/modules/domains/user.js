var pd = require("pd"),
    Users = require("mongo-col")("Users")

var GetUser = {
    start: function () {
        Users.findOne({ email: this.user.email }, this.createIfNeeded)
    },
    createIfNeeded: function (err, user) {
        if (err) return this.callback(err)
        if (user === null) {
            Users.insert(this.user, (function (err, result) {
                this.callback(null, user)
            }).bind(this))
        } else {
            this.callback(null, user)    
        }
    }
}

module.exports = {
    get: function (user, callback) {
        pd.bindAll({}, GetUser, {
            user: user,
            callback: callback
        }, this).start()
    }
}