var dnode = require("dnode"),
    pd = require("pd"),
    cached,
    callbackList = []

dnode.connect(function (remote) {
    cached = remote
    callbackList.forEach(function (cb) {   
        cb(remote)
    })
})

module.exports = function (uri, callback) {
    getRemote(function (remote) {
        remote.proxyGetLinks(uri, callback)
    })
}

function getRemote(callback) {
    if (cached) {
        return callback(cached)
    } else {
        callbackList.push(callback)
    }
}