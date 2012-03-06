var pd = require("pd")

var GetUser = {
    start: function () {
        this.data.find({ email: this.user.email }, this.createIfNeeded)
    },
    createIfNeeded: function (err, user) {
        if (err) return this.callback(err)
        if (user === null) {
            this.data.insert(user, this.get)
        }
        this.callback(null, user)
    }
}

module.exports = {
    setup: function () {
        this.data = this.dataSources.users
    },
    get: function (user, callback) {
        pd.bindAll({}, GetUser, {
            user: user,
            callback: callback
        }, this).start()
    }
}