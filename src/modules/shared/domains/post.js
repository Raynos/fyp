var pd = require("pd"),
    after = require("after"),
    uuid = require("node-uuid"),
    observable = require("observable/lib/observable")

var GetPosts = {
    start: function () {
        console.log("searching for posts", this.user)
        var cursor = this.collection.find({
            "user.email": this.user.email
        })
        cursor.toArray(this.checkForResults)    
    },
    checkForResults: error(function (err, results) {
        console.log("checkForResults", arguments)
        if (results.length !== 0) {
            /*this.data = results
            this.constructRelatedLinks()*/
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
        this.set("greader-max", 1000)
        this.set("greader-progress", 0)
        this.reader.getItems("", this.transformData, {
            n: 1000
        })
    },
    transformData: function (data) {
        console.log("transforming data")
        data = after.map(data, this.transformGoogleData, this.storeThem)
    },
    storeThem: error(function (err, data) {
        this.data = data = data.filter(function (item) {
            return item !== null
        })
        console.log("storing data", err, data)

        this.collection.insert(data, {
            safe: true
        }, this.constructRelatedLinks)
    }),
    transformGoogleData: function (data, callback) {
        var uri = data.alternate[0].href,
            self = this

        this.findLinksInPage(uri, function (err, uris) {
            if (err) {
                return callback(err)
            } else if (uris === null) {
                updateProgress()
                return callback(null, null)
            }
            updateProgress()
            
            callback(null, {
                googleId: data.id,
                id: uuid(),
                title: data.title,
                publishedTime: data.published,
                summary: (data.summary || data.content || {}).content,
                uri: data.alternate[0].href,
                backLinks: [],
                forwardLinks: [],
                user: self.user,
                uris: uris
            })

            function updateProgress() {
                var counter = self.get("greader-progress")
                counter++
                self.set("greader-progress", counter)    
            }
        })
    },
    constructRelatedLinks: error(function (err, success) {
        console.log("constructing relations")
        var self = this
        // for each post in g reader
        this.set("linking-progress", 0)
        this.set("linking-max", this.data.length)
        after.forEach(this.data, function (item, callback) {
            process.nextTick(function () {
                createForwardAndBackwardLinks(item, callback)
            })
        }, this, this.finish)

        function createForwardAndBackwardLinks(item, callback) {
            var collection = self.collection
            //console.log("looping over links in", item)
            var linkingMax = self.get("linking-max")
            linkingMax += item.uris.length
            self.set("linking-max", linkingMax)
            // for each link in post
            after.forEach(item.uris, function (uri, key, callback) {
                process.nextTick(function () {
                    insertForwardLinks(uri, key, callback)
                })
            }, self, insertBackwardLinks)

            function insertForwardLinks(uri, key, callback) {
                // find all posts of that link
                // and insert the item.link into the forwardLinks
                collection.update({
                    uri: uri
                }, {
                    $addToSet: {
                        forwardLinks: item.uri
                    }
                }, {
                    multi: true,
                    safe: true
                // inner loop done
                }, function (err) {
                    var linkingProgress = self.get("linking-progress")
                    linkingProgress++
                    self.set("linking-progress", linkingProgress)
                    callback(err)
                })
            }

            function insertBackwardLinks() {
                //console.log("done updating ever uri in items.uri", item)
                // find all documents which contain me in forwardLinks
                collection.find({
                    forwardLinks: item.uri
                }).toArray(updateItemWithBackwardLinks)

                function updateItemWithBackwardLinks(err, array) {
                    //console.log("found all forwardLinks, now updating")
                    // map the documents to their links
                    array = array.map(extractUri)

                    // add all those links into my backLinks

                    collection.update({
                        uri: item.uri
                    }, {
                        $addToSet: {
                            backLinks: { 
                                $each: array 
                            }
                        }
                    }, {
                        multi: true,
                        safe: true
                    // outer loop done
                    }, function (err) {
                        var linkingProgress = self.get("linking-progress")
                        linkingProgress++
                        self.set("linking-progress", linkingProgress)
                        callback(err)
                    })
                }
            }
        // all data is done
        }

        function extractUri(item) {
            return item.uri
        }
    }),
    finish: error(function (err) {
        console.log("finished like a boss")
        this.callback(null, this.data)
    })
}

module.exports = pd.extend({}, observable(), {
    setup: function () {
        this.scraper = this.dataSources.scraper.scraper
        this.collection = this.dataSources.post.mongo
        this.reader = this.dataSources.gReader.reader
    },
    findLinksInPage: function (uri, callback) {
        this.scraper(uri, callback)
    },
    getPosts: function (user, callback) {
        var getposts = pd.bindAll({}, this, GetPosts, observable(), {
            user: user,
            callback: callback
        })
        getposts.start()
        this.push(getposts)
    }
})

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