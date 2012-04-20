var dnode = require("dnode"),
    uuid = require("node-uuid"),
    observable = require("./observable").bind(null, synchronizeState),
    cached,
    callbackList = []

var Methods = {
    constructor: function (conn) {
        this.conn = conn
        return this
    }
}

dnode(function (remote, conn) {
    extend(this, Methods).constructor(conn)
    cached = remote
    callbackList.forEach(function (cb) {
        cb(remote)
    })
})

module.exports = function (name, auth) {
    var o = observable(name)
    getRemote(function (remote) {
        remote.fetchState(o._id)
    })
    o._auth = auth
    return o
}

function synchronizeState(observable, callback) {
    callback && callback()
}

function getRemote(cb) {
    if (cached) {
        cb(cached)
    } else {
        callbackList.push(cb)
    }
}