var mongodb = require("mongodb"),
    db_string = "db",
    Db = mongodb.Db

var url = "mongodb://localhost:27017/" + db_string

if (process.env["MONGODB_HOST"]) {
    url = "mongodb://" + process.env["MONGODB_USER_PASSWORD"] + "@" +
        process.env["MONGODB_HOST"] + ":" +
        process.env["MONGODB_PORT"] + "/" + db_string
}

module.exports = createMongoCollection

function createMongoCollection(collectionName) {
    var memo,
        queues

    return getCollection

    function getCollection(callback) {
        if (memo) {
            return callback.apply(memo[1], memo)
        } else if (queues) {
            return queues.push(callback)
        }

        queues = [callback]

        Db.connect(url, openCollection)

        function openCollection(err, db) {
            if (err) {
                return getCollection(err)
            }
            db.collection(collectionName, getCollection)
        }

        function getCollection(err, collection) {
            memo = arguments
            var callbackList = queues
            queues = null
            for (var i = 0, len = callbackList.length; i < len; i++) {
                callbackList[i](err, collection)
            }
        }
    }
}