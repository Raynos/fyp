var store = require("../util/indexeddb")("user")

module.exports = {
    getUser: function (callback) {
        store.get("user", function (err, doc) {
            callback(err, doc)
        })
    },
    saveUser: function (user, callback) {
        store.put(user, "user", callback)
    }
}