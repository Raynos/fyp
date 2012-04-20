var dnode = require("dnode"),
    pd = require("pd"),
    cached,
    callbackList = []

var getRemote = pd.memoize(dnode.connect, dnode)
getRemote()

/*dnode.connect(function (remote) {
    cached = remote
    callbackList.forEach(function (cb) {
        cb(remote)
    })
})

function getRemote(cb) {
    if (cached) {
        cb(cached)
    } else {
        callbackList.push(cb)
    }
}*/

module.exports = function (uri, callback) {
    getRemote(function (remote) {
        console.log("woop remote scraper", remote)
        remote.proxyGetLinks(uri, callback)
    })
}

