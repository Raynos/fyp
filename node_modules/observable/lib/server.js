var EventEmitter = require("eventemitter-light"),
    uuid = require("node-uuid"),
    observable = require("./observable").bind(null, synchronizeState),
    dnode = require("dnode"),
    extend = require("pd").extend,
    remotes = {}

var Methods = {

}

function synchronizeState(observable, callback) {
    callback && callback()
}

module.exports = factory

function factory(httpServer, auth) {
    if (typeof httpServer === "string") {
        return observable(httpServer)
    }
    dnode(function (remote, conn) {
        console.log(remote)
        extend(this, Methods).constructor(conn, auth)

        conn.on("end", function () {
            // cleanup
        })
    }).listen(httpServer)
    return observable
}

function auth(callback) {
    return function (options) {
        if (!this.auth) {
            return callback.apply(this, arguments)
        }
        var args = options.args,
            _arguments = arguments,
            self = this,
            cb = args[args.length - 1]

        if (typeof cb !== "function") {
            cb = function () {}
        }

        var ret = this.auth(options.auth, options, handleAuth)

        if (ret !== undefined) {
            handleAuth(ret)
        }

        function handleAuth(ret) {
            if (ret === false) {
                cb(new Error("Permission Denied"))
            } else if (ret === true) {
                callback.apply(self, _arguments)
            }    
        }
    }
}