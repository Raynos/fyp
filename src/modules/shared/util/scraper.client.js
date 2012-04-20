var dnode = require("dnode"),
    pd = require("pd"),
    cached,
    callbackList = []

var getRemote = pd.memoize(dnode.connect, dnode)
getRemote()

module.exports = function (uri, callback) {
    getRemote(function (remote) {
        remote.proxyGetLinks(uri, callback)
    })
}

