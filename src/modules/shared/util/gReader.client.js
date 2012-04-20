var dnode = require("dnode"),
    uuid = require("node-uuid"),
    extend = require("pd").extend,
    ee = require("eventemitter-light"),
    cached,
    callbackList = []

dnode.connect(function (remote) {
    console.log("woop remote gReader", remote)
    cached = remote
    callbackList.forEach(function (cb) {
        cb(remote)
    })
})

var Reader = {
    login: function () {
        var args = arguments
        this._getReader(function (reader) {
            console.log("logging in ", args)
            reader.login.apply(reader, args)
        })
    },
    getItems: function () {
        var args = arguments
        this._getReader(function (reader) {
            reader.getItems.apply(reader, args)
        })
    },
    _getReader: function (callback) {
        var self = this
        if (self._reader) {
            callback(self._reader)
        }
        getRemote(function (remote) {
            remote.makeReader(function (reader) {
                self._reader = reader
                callback(reader)
            })
        })
    }
}

module.exports = makeReader

function makeReader() {
    return Object.create(Reader)
}

function getRemote(cb) {
    if (cached) {
        cb(cached)
    } else {
        callbackList.push(cb)
    }
}