var pd = require("pd")

var GetUser = {
    start: function () {
        this.collection.findOne({ 
            email: this.user.email 
        }, this.createIfNeeded)
    },
    createIfNeeded: function (err, user) {
        if (err) return this.callback(err)
        if (user === null) {
            this.collection.insert(this.user, (function (err, result) {
                this.callback(null, user)
            }).bind(this))
        } else {
            this.callback(null, user)    
        }
    }
}

module.exports = {
    setup: function () {
        this.collection = this.dataSources.user.mongo
    },
    get: function (user, callback) {
        pd.bindAll({}, GetUser, {
            user: user,
            callback: callback
        }, this).start()
    }
}