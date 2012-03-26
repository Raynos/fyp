var Posts = require("mongo-col")("Posts"),
    pd = require("pd"),
    after = require("after"),
    jsdom = require("jsdom"),
    Reader = require("../lib/g-reader")

var GetPosts = {
    start: function () {
        Posts.find({
            "user.email": this.user.email
        }).toArray(this.checkForResults)
    },
    checkForResults: function (err, results) {
        if (results.length !== 0) {
            this.callback(null, results)
        } else {
            this.getResults()
        }
    },
    getResults: function () {
        var reader = this.reader = Reader()
        reader.login(this.user.email, this.user.password, 
            this.readPosts, this.callback)
    },
    readPosts: function () {
        var reader = this.reader
        reader.getItems("", this.storeData, {
            n: 1000
        })
    },
    storeData: function (data) {
        console.log("loaded data")
        after.forEach(data, function (item, callback) {
            var post = {
                item: item,
                uri: item.alternate[0].href,
                user: this.user
            }

            console.log("uri of item", item.alternate[0].href)

            Posts.update({
                uri: post.uri,
                "user.email": this.user.email
            }, {
                $set: post
            }, {
                upsert: true
            }, function () {
                callback()
            })
        }, this, (function () {
            this.buildRelated(data)
        }).bind(this))
    },
    buildRelated: function (data) {
        var user = this.user
        after.forEach(data, function (item, callback) {
            console.log("building related")
            buildRelated(item, function (uris) {
                Posts.find({
                    "item.alternate.0.href": {
                        $in: uris
                    }
                }).toArray(function (err, results) {
                    results.filter(function (thing) {
                        return thing.uri !== item.alternate[0].href
                    })

                    console.log("updating")

                    Posts.update({
                        "uri": item.alternate[0].href,
                        "user.email": user.email
                    }, {
                        $set: {
                            related: results
                        }
                    }, {
                        upsert: true
                    }, function () {
                        callback()
                    })
                })
            })
        }, this.start)
    }
}

function buildRelated(item, cb) {
    var uri = item.alternate[0].href

    console.log("jsdomming")

    jsdom.env(uri, function(errors, window) {
        if (errors) {
            return buildRelated(item, cb)
        }
        var links = [].slice.call(window.document.links)
        var uris = links.map(function (item) {
            return item.href
        })
        cb(uris)
    })
}

module.exports = {
    getAll: function (user, callback) {
        pd.bindAll({}, GetPosts, {
            user: user,
            callback: callback
        }).start()
    }
}