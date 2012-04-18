var express = require("express")

module.exports = {
    start: function (server) {
        var app = this.app = express()
        server.on("request", app)
        this.configure.start(app)
        Object.keys(this.routes).forEach(startRoute, this)

        function startRoute(name) {
            this.routes[name].start(app)
        }
    }
}