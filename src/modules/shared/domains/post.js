var pd = require("pd"),
    after = require("after"),
    uuid = require("node-uuid")

var GetPosts = {
    start: function () {
        console.log("searching for posts", this.user)
        var cursor = this.collection.find({
            "user.email": this.user.email
        })
        console.log("toArray", cursor)
        cursor.toArray(this.checkForResults)    
    },
    checkForResults: error(function (err, results) {
        console.log("checkForResults", arguments)
        if (results.length !== 0) {
            return this.callback(null, results)
        }
        this.getResults()
    }),
    getResults: function () {
        console.log("getResults")
        this.reader.login(this.user.email, this.user.password,
            this.readPosts, this.callback)
    },
    readPosts: function () {
        console.log("readPosts")
        this.reader.getItems("", this.transformData, {
            n: 1000
        })
    },
    transformData: function (data) {
        console.log("transforming data")
        data = after.map(data, this.transformGoogleData, this.storeThem)
    },
    storeThem: error(function (err, data) {
        this.data = data
        console.log("storing data", err, data)

        this.collection.insert(data, {
            safe: true
        }, this.constructRelatedLinks)
    }),
    transformGoogleData: function (data, callback) {
        var uri = data.alternate[0].href
        this.findLinksInPage(uri, function (err, uris) {
            if (err) {
                return callback(err)
            }
            console.log("transforming")
            callback(null, {
                googleId: data.id,
                id: uuid(),
                title: data.title,
                publishedTime: data.published,
                summary: (data.summary || data.content).content,
                uri: data.alternate[0].href,
                backLinks: [],
                forwardLinks: [],
                user: this.user,
                uris: uris
            })
        })
    },
    constructRelatedLinks: function (err, success) {
        after.forEach(this.data, function (item, callback) {
            
        }, this, this.finish)
    },
    finish: function () {
        this.callback(null, this.data)
    }
}

module.exports = {
    setup: function () {
        this.scraper = this.dataSources.scraper.scraper
        this.collection = this.dataSources.post.mongo
        this.reader = this.dataSources.gReader.reader
    },
    findLinksInPage: function (uri, callback) {
        this.scraper(uri, callback)
    },
    getPosts: function (user, callback) {
        pd.bindAll({}, GetPosts, {
            user: user,
            callback: callback
        }, this).start()
    }
}

function error(cb) {
    return proxy

    function proxy(err) {
        if (err) {
            console.log("error occured", err)
            console.dir(err)
            return this.callback(err)
        }
        return cb.apply(this, arguments)
    }
}